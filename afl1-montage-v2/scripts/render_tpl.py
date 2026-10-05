import subprocess, numpy as np, os
from nl_lines import NL
os.makedirs('tpl',exist_ok=True)
head=open('en-castoro.ass').read().split('[Events]')[0]
for i,t in enumerate(NL):
    ass=head+'[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\nDialogue: 0,0:00:00.00,0:00:01.00,Lyric,,0,0,0,,{\\fsp-3}%s\n'%t
    open('tpl/t.ass','w').write(ass)
    subprocess.run(['ffmpeg','-v','error','-y','-f','lavfi','-i','color=black:s=1920x1080:d=0.1','-vf','ass=tpl/t.ass,format=gray','-frames:v','1','-f','rawvideo',f'tpl/{i}.gray'],check=True)
print('ok',len(NL))
