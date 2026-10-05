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
De Nederlandse ondertitels zitten in het beeld gebrand. Ze worden van 4,93 tot 40,70 s afgedekt met een zachte vervaging (`masker-ondertitels.png`), daarna komen de Engelse regels uit `ondertitels-EN.ass` erop. De tijden volgen het lied: het lied start op 4,49 s in v2.

```
ffmpeg -i afl1-montage-final-v2-web.mp4 -loop 1 -i masker-ondertitels.png -filter_complex "\
[0:v]split[a][b];[b]gblur=sigma=30,eq=brightness=-0.05:saturation=0.9[bl];\
[1:v]format=gray[m];[bl][m]alphamerge[blm];\
[a][blm]overlay=shortest=1:enable='between(t,4.93,40.70)',ass=ondertitels-EN.ass,format=yuv420p[v]" \
-map "[v]" -map 0:a ... afl1-montage-final-v2-EN.mp4
```

Beide bestanden staan op de BasePage, two-pass gecodeerd op 2200 kbit/s (rond 13 MB).
