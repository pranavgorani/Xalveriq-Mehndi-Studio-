let revision=0;
function board(items,caption){
 const container=byId('board');container.replaceChildren();const p=document.createElement('p');p.textContent=caption;container.append(p);
 items.forEach(s=>{const fig=document.createElement('figure'),img=new Image(),cap=document.createElement('figcaption');fig.className='boardcard';img.src=s.image;img.alt=s.title+' design reference';cap.textContent=s.title;fig.append(img,cap);container.append(fig)});
}
styles.forEach((s,i)=>{const b=document.createElement('button');b.type='button';b.textContent=['Paisley & lace','Flowers & vines','Fine lines & dots'][i];b.setAttribute('aria-pressed','false');b.onclick=()=>{revision++;byId('inspiration').value='';byId('moodKeys').querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));board([s],'Reference for '+b.textContent.toLowerCase())};byId('moodKeys').append(b)});
async function palette(src){
 const img=new Image();img.src=src;await img.decode();const canvas=document.createElement('canvas');canvas.width=canvas.height=40;const ctx=canvas.getContext('2d');ctx.drawImage(img,0,0,40,40);const data=ctx.getImageData(0,0,40,40).data,bins=Array(64).fill(0);
 for(let i=0;i<data.length;i+=4)bins[(data[i]>>6)*16+(data[i+1]>>6)*4+(data[i+2]>>6)]++;
 return bins;
}
byId('inspiration').onchange=async e=>{
 const file=e.target.files[0],r=++revision;if(!file)return;
 byId('moodKeys').querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed','false'));
 if(file.size>15000000){board([],'Choose an image smaller than 15 MB.');return}
 const url=URL.createObjectURL(file);try{const target=await palette(url),scores=await Promise.all(styles.map(async s=>{const bins=await palette(s.image);return {s,score:bins.reduce((a,v,i)=>a+Math.abs(v-target[i]),0)}}));if(r===revision)board(scores.sort((a,b)=>a.score-b.score).slice(0,2).map(x=>x.s),'Closest colour palettes, best match first.')}catch{if(r===revision)board([],'This photo could not be read. Try a JPG, PNG or WebP image.')}finally{URL.revokeObjectURL(url)}
};
