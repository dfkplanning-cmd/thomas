import numpy as np, cv2, subprocess, sys
from nl_lines import NL
W,H=1920,1080; Y0,Y1,X0,X1=920,1080,360,1560
r=np.load('detect.npy')
lab={}
for f,s,i,dy,dx in r:
    if s>0.3: lab[int(f)]=[int(i),int(dy),int(dx)]
def hp(a): a=a.astype(np.float32); return a-cv2.GaussianBlur(a,(0,0),5)
TPL=[np.fromfile(f'tpl/{i}.gray',np.uint8).reshape(H,W) for i in range(len(NL))]
K=cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(7,7))
KN=cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(11,11))
K2=cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(5,5))
def relocate(gray,i):
    g=TPL[i]; ys,xs=np.where(g>30); y0,y1,x0,x1=ys.min()-3,ys.max()+4,xs.min()-3,xs.max()+4
    R=hp(gray[Y0:Y1,X0:X1]); m=cv2.matchTemplate(R,hp(g[y0:y1,x0:x1]),cv2.TM_CCOEFF_NORMED)
    ey,ex=y0-Y0,x0-X0; sub=m[ey-12:ey+13,ex-12:ex+13]; _,_,_,loc=cv2.minMaxLoc(sub)
    return loc[1]-12, loc[0]-12
def mask_for(i,dy,dx):
    g=np.roll(np.roll(TPL[i],dy,0),dx,1)
    return cv2.dilate((g>16).astype(np.uint8)*255,K)
def process(frame_rgb,f):
    ms=[]
    for ff in (f-1,f,f+1):
        if ff in lab: ms.append(tuple(lab[ff]))
    if not ms: return frame_rgb
    gray=cv2.cvtColor(frame_rgb,cv2.COLOR_RGB2GRAY)
    m=np.zeros((H,W),np.uint8)
    near=np.zeros((H,W),np.uint8)
    for i,dy,dx in set(ms):
        if i==7 and f/30>32:  # één euro, (met komma)
            i=16; dy,dx=relocate(gray,16)
        g=np.roll(np.roll(TPL[i],dy,0),dx,1)
        m|=mask_for(i,dy,dx)
        if i in (0,1,2,6): near|=cv2.dilate((g>16).astype(np.uint8)*255,KN)
    gf=gray.astype(np.float32)
    bright=((frame_rgb.min(2)>185)&((gf-cv2.GaussianBlur(gf,(0,0),6))>18)).astype(np.uint8)*255
    m=cv2.dilate(m|(near&bright),K2)
    band=frame_rgb[Y0:Y1].copy()
    mb=m[Y0:Y1]
    out=cv2.inpaint(band,mb,6,cv2.INPAINT_TELEA)
    soft=cv2.GaussianBlur(out,(0,0),2.5)
    a=cv2.GaussianBlur(mb.astype(np.float32)/255,(0,0),2)[...,None]
    out=(out*(1-a)+soft*a).astype(np.uint8)
    frame_rgb=frame_rgb.copy(); frame_rgb[Y0:Y1]=out
    return frame_rgb
if __name__=='__main__':
    src,dst=sys.argv[1],sys.argv[2]
    dec=subprocess.Popen(['ffmpeg','-v','error','-i',src,'-f','rawvideo','-pix_fmt','rgb24','-'],stdout=subprocess.PIPE)
    enc=subprocess.Popen(['ffmpeg','-v','error','-y','-f','rawvideo','-pix_fmt','rgb24','-s','1920x1080','-r','30','-i','-','-i',src,
        '-map','0:v','-map','1:a','-c:v','libx264','-crf','14','-preset','medium','-pix_fmt','yuv420p','-c:a','copy',dst],stdin=subprocess.PIPE)
    f=0
    while True:
        b=dec.stdout.read(W*H*3)
        if len(b)<W*H*3: break
        fr=np.frombuffer(b,np.uint8).reshape(H,W,3)
        enc.stdin.write(process(fr,f).tobytes()); f+=1
    enc.stdin.close(); enc.wait(); print('frames',f)
