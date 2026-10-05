import numpy as np, cv2, subprocess
from nl_lines import NL
W,H=1920,1080; Y0,Y1,X0,X1=920,1080,360,1560
def hp(a): a=a.astype(np.float32); return a-cv2.GaussianBlur(a,(0,0),5)
T=[]
for i in range(len(NL)):
    g=np.fromfile(f'tpl/{i}.gray',np.uint8).reshape(H,W)
    ys,xs=np.where(g>30); y0,y1,x0,x1=ys.min()-3,ys.max()+4,xs.min()-3,xs.max()+4
    T.append(dict(full=g,box=(y0,y1,x0,x1),hp=hp(g[y0:y1,x0:x1])))
p=subprocess.Popen(['ffmpeg','-v','error','-i','afl1-montage-final-web-v2.mp4','-f','rawvideo','-pix_fmt','gray','-'],stdout=subprocess.PIPE)
res=[]
f=0
while True:
    b=p.stdout.read(W*H)
    if len(b)<W*H: break
    t=f/30
    if 4.6<=t<=40.9:
        R=hp(np.frombuffer(b,np.uint8).reshape(H,W)[Y0:Y1,X0:X1])
        best=(-1,None,None)
        for i,tp in enumerate(T):
            y0,y1,x0,x1=tp['box']
            m=cv2.matchTemplate(R,tp['hp'],cv2.TM_CCOEFF_NORMED)
            # restrict to +-12px around expected location
            ey,ex=y0-Y0,x0-X0
            sub=m[max(0,ey-12):ey+13, max(0,ex-12):ex+13]
            _,mx,_,loc=cv2.minMaxLoc(sub)
            if mx>best[0]: best=(mx,i,(loc[1]+max(0,ey-12)-ey, loc[0]+max(0,ex-12)-ex))
        res.append((f,best[0],best[1],best[2][0],best[2][1]))
    f+=1
np.save('detect.npy',np.array(res,dtype=float))
for r in res[::15]: print(f'{r[0]/30:6.2f} {r[1]:.2f} {NL[r[2]]:30s} dy{r[3]} dx{r[4]}')
