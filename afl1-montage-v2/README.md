# Aflevering 1 · montage v2 en Engelse versie

## Wat er mis was
In `afl1-montage-final-web.mp4` speelde van 1,0 tot 2,0 s een losse kopie van de eerste seconde intro-audio (geroezemoes en het begin van "Met trots presenteren wij…"). Op 2,0 s begon diezelfde audio opnieuw. Het beeld daaronder was de eerste halve seconde van de intro, uitgerekt tot 1,5 s.

## Fix (v2)
Die seconde is eruit. Het beeld van 1,0 tot 2,5 s is drie keer versneld tot een fade-in van 0,5 s. Vanaf 2,0 s (audio) en 2,5 s (beeld) is alles ongewijzigd, alleen 1 s eerder. Lengte: 43,3 s.

```
ffmpeg -i afl1-montage-final-web.mp4 -filter_complex "\
[0:v]trim=0:1,setpts=PTS-STARTPTS[va];\
[0:v]trim=1:2.5,setpts=PTS-STARTPTS,select='not(mod(n\,3))',setpts=N/30/TB[vb];\
[0:v]trim=start=2.5,setpts=PTS-STARTPTS[vc];\
[va][vb][vc]concat=n=3:v=1:a=0,fps=30,format=yuv420p[v];\
[0:a]atrim=0:1,asetpts=PTS-STARTPTS[aa];\
[0:a]atrim=start=2,asetpts=PTS-STARTPTS,afade=t=in:d=0.12[ab];\
[aa][ab]concat=n=2:v=0:a=1[a]" -map "[v]" -map "[a]" ... afl1-montage-final-v2-web.mp4
```

## Engelse versie
De Nederlandse ondertitels zitten in het beeld gebrand. Ze worden niet meer afgedekt met een vervaagde strook, maar per frame weggewerkt:

1. `scripts/render_tpl.py` maakt elke Nederlandse regel (`scripts/nl_lines.py`) na in Castoro, precies zoals in de montage.
2. `scripts/detect.py` zoekt per frame welke regel in beeld staat en op welke positie (template matching).
3. `scripts/clean.py` maakt van die regel een masker en vult alleen die letterpixels op met de omgeving (OpenCV inpaint). Bij de vier regels die net iets anders vallen (goedenavond dames, goedenavond heer, blijf maar rustig staan, meneer wat wilt u) telt het masker ook de lichte pixels vlak rond de letters mee.

Daarna gaan de Engelse regels uit `ondertitels-EN.ass` erop:

```
python3 scripts/clean.py afl1-montage-final-v2-web.mp4 nl_clean.mp4
ffmpeg -i nl_clean.mp4 -vf "ass=ondertitels-EN.ass,format=yuv420p" ... afl1-montage-final-v2-EN.mp4
```

De tijden van de Engelse regels volgen het lied: het lied start op 4,49 s in v2.

Stijl: dezelfde als de Nederlandse ondertitels, Castoro vet in crème (#FFF8F2), zonder rand of schaduw. In de editor is dat 36 pt met letterafstand −1,14; op het 1080p-beeld komt dat neer op 108 px met `\fsp-3` (nagemeten door de tekst over de Nederlandse ondertitel te leggen). Castoro moet geïnstalleerd zijn (Google Fonts).

Beide bestanden staan op de BasePage, two-pass gecodeerd op 2200 kbit/s (rond 13 MB).
