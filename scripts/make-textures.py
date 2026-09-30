from pathlib import Path
from PIL import Image, ImageFilter
import numpy as np

out=Path(__file__).resolve().parent.parent/'public'/'textures';out.mkdir(parents=True,exist_ok=True)
w,h=1920,1080
rng=np.random.default_rng(20260930)
y,x=np.mgrid[0:h,0:w];xx=x/w;yy=y/h

def noise(scale):
 a=rng.uniform(0,255,(max(2,h//scale),max(2,w//scale))).astype('uint8')
 return np.asarray(Image.fromarray(a).resize((w,h),Image.Resampling.BICUBIC),dtype=float)/255-.5

cloud=noise(360)*.52+noise(160)*.24+noise(55)*.12+noise(14)*.045
grain=rng.normal(0,.008,(h,w))
edge=((xx-.48)**2/0.55+(yy-.44)**2/0.72)
for name,base in [('paper',(235,226,202)),('mist',(209,219,219))]:
 a=cloud+grain-edge*.12
 rgb=np.clip(np.array(base)[None,None,:]+a[:,:,None]*85,0,255).astype('uint8')
 Image.fromarray(rgb).save(out/f'{name}.jpg',quality=95)

for layer in range(3):
 basey=.52+layer*.105
 heights=np.full(w,basey)
 for freq,amp in [(3,.067),(8,.033),(24,.017),(67,.011),(137,.008),(411,.003)]:
  phase=rng.random()*6.28
  heights+=np.sin(np.arange(w)/w*freq*6.28+phase)*amp
 # Irregular toothlike ridges give the distant hills an ink-brush silhouette.
 heights+=rng.normal(0,.0035,w)
 dist=yy-heights[None,:]
 alpha=np.clip(dist*35+0.2,0,1)*np.clip(1-dist*2.7,0,1)
 alpha*=np.clip(.65+noise(44)*.35+noise(12)*.2,0,1)
 alpha*=.31+layer*.055
 rgba=np.empty((h,w,4),dtype='uint8');rgba[:,:,:3]=(72+layer*6,79+layer*6,78+layer*6)
 rgba[:,:,3]=(alpha*255).astype('uint8')
 Image.fromarray(rgba).filter(ImageFilter.GaussianBlur([10,7,4][layer])).save(out/f'ink-{layer}.png')

fibers=np.sin(yy*270+noise(230)*4+noise(65)*.8)
bands=np.sin(yy*74+xx*3+noise(220)*3)*.5+fibers*.16
light=(.35+noise(170)*.3+bands*.18-edge*.18)
rgb=np.stack([40+light*82,22+light*49,14+light*29],axis=2)
rgb+=rng.normal(0,1.1,(h,w,1))
Image.fromarray(np.clip(rgb,0,255).astype('uint8')).save(out/'bamboo.jpg',quality=95)
print('Generated paper, mist, 3 ink layers and bamboo textures.')
