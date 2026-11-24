// Run with Node 22+ and Chrome installed. Set CHROME_PATH to use another Chromium executable.
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const {spawn} = require('node:child_process');
const assert = require('node:assert/strict');
const pause = ms => new Promise(r=>setTimeout(r,ms));
async function waitFor(check) {
  for(let i=0;i<100;i++) {const result=await check();if(result)return result;await pause(80);}
  throw Error('Timed out waiting for '+check);
}
async function run() {
  let serverProcess;
  try {
    await fetch('http://127.0.0.1:4173');
  } catch {
    serverProcess = spawn(process.execPath, [path.join(__dirname, 'serve.cjs')], {stdio:'ignore'});
    await pause(300);
  }
  const profile=await fs.mkdtemp(path.join(os.tmpdir(),'xalveriq-qa-'));
  const downloads=path.join(profile,'briefs');
  await fs.mkdir(downloads);
  const chrome=spawn(process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',
    ['--headless=new','--no-sandbox','--disable-gpu','--disable-background-networking','--no-first-run','--no-default-browser-check','--remote-debugging-port=0','--user-data-dir='+profile,'about:blank'],{windowsHide:true,stdio:'ignore'});
  let ws;
  try {
    const port=await waitFor(async()=>{try{return (await fs.readFile(path.join(profile,'DevToolsActivePort'),'utf8')).split('\n')[0];}catch{return false;}});
    const targets=async()=>await (await fetch('http://127.0.0.1:'+port+'/json/list')).json();
    const page=(await targets()).find(t=>t.type==='page');
    ws=new WebSocket(page.webSocketDebuggerUrl);
    await new Promise(resolve=>ws.onopen=resolve);
    let id=0;const calls=new Map(),errors=[],requests=[],downloadEvents=[];
    ws.onmessage=({data})=>{
      const m=JSON.parse(data);
      if(calls.has(m.id)){const [ok,fail]=calls.get(m.id);calls.delete(m.id);m.error?fail(Error(m.error.message)):ok(m.result);}
      if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails);
      if(m.method==='Network.requestWillBeSent')requests.push(m.params.request.url);
      if(m.method==='Page.downloadWillBegin')downloadEvents.push(m.params.suggestedFilename);
    };
    const send=(method,params={})=>new Promise((res,rej)=>{calls.set(++id,[res,rej]);ws.send(JSON.stringify({id,method,params}));});
    const js=async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true,userGesture:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result.value;};
    const key=async(name,code)=>{
      await send('Input.dispatchKeyEvent',{type:'keyDown',key:name,code:name,windowsVirtualKeyCode:code,text:name==='Enter'?'\r':''});
      await send('Input.dispatchKeyEvent',{type:'keyUp',key:name,code:name,windowsVirtualKeyCode:code});
    };
    for(const name of ['Page','Network','Runtime','DOM'])await send(name+'.enable');
    await send('Page.setDownloadBehavior',{behavior:'allow',downloadPath:downloads});
    for(const width of [390,1440]){
      await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:false});
      await send('Page.navigate',{url:'http://127.0.0.1:4173'});
      await waitFor(()=>js("document.querySelectorAll('.card').length===3"));
      const check=async(expr,msg)=>assert(await js(expr),msg+' at '+width);
      const click=sel=>js('document.querySelector('+JSON.stringify(sel)+').click()');
      const fill=(id,v)=>js('byId('+JSON.stringify(id)+').value='+JSON.stringify(v)+';byId('+JSON.stringify(id)+').dispatchEvent(new Event("input",{bubbles:true}))');
      const submit=id=>js('byId('+JSON.stringify(id)+').requestSubmit()');
      const noOverflow=()=>check('document.documentElement.scrollWidth<=innerWidth','Horizontal overflow');
      await noOverflow();
      if(width===390){
        await js("document.querySelector('.menu').focus()");await key('Enter',13);await key('Tab',9);
        await check("document.activeElement.closest('nav')!==null",'Keyboard menu');
        await key('Escape',27);await check("document.activeElement.matches('.menu')",'Menu focus restoration');
      }
      await js("document.querySelectorAll('.card')[1].focus()");await key('Enter',13);
      await check("details.open && styleName.textContent==='Arabic Florals'",'Gallery detail');
      await key('Escape',27);await check("!details.open && document.activeElement.matches('.card')",'Dialog focus restoration');
      await key('Enter',13);await key('Tab',9);await key('Enter',13);
      await check("!details.open && preferences.value.includes('Arabic Florals') && bookingStyle.value==='arabic'",'Keyboard gallery handoff');
      await fill('preferences','a celebration');await submit('form');
      await check("result.textContent.includes('add a visual detail')",'Unknown style');
      const note='airy floral vines for my engagement';
      await fill('preferences',note);await submit('form');
      await check("result.textContent.includes('Arabic Florals') && occasion.value==='Engagement'",'Natural-language match');
      await click('#result button');
      const file=path.join(downloads,'Xalveriq-artist-brief.txt');
      await waitFor(async()=>{try{return (await fs.readFile(file,'utf8')).includes(note);}catch{return false;}});
      await fs.unlink(file);
      await click('#result button:last-child');
      await check("coverage.value==='half' && bookingOccasion.value==='engagement' && bookingStyle.value==='arabic'",'Estimate handoff');
      await fill('bookingDate','2000-01-01');await check("bookingDate.validity.rangeUnderflow",'Past date rejected');
      await fill('bookingDate',await js('bookingDate.min'));
      for (const n of ['0','51']){await fill('people',n);await submit('bookingForm');await check("!people.validity.valid && quote.hidden",'Guest count bounds');}
      await fill('people','2');await fill('travel','1500');
      await js("document.querySelector('#bookingForm button').focus()");await key('Enter',13);
      await check("amount.textContent==='₹5,625' && !quote.hidden",'Acceptance total');await noOverflow();
      await fill('client','QA Visitor');await fill('phone','9000000000');await submit('enquiry');
      await fill('message',await js("message.value+'\u005cnPlease confirm timing.'"));
      const href=await js("wa.href"),msg=new URL(href).searchParams.get('text');
      assert(msg.includes('Estimated total: ₹5,625') && msg.includes('Collection: Arabic Florals') && msg.includes('Please confirm timing.'));
      // Stop at the outgoing handoff without sending any message.
      await click('#wa');
      const popup=await waitFor(async()=>(await targets()).find(t=>t.url===href || t.url.includes('whatsapp.com')));
      await fetch('http://127.0.0.1:'+port+'/json/close/'+popup.id);
      await send('Page.bringToFront');
      await fill('people','3');await check("quote.hidden && wa.hidden && !wa.hasAttribute('href') && !message.value",'Stale quote cleared');
      await submit('bookingForm');await check("amount.textContent==='₹7,688'",'Revised quote');
      await click('#moodKeys button');await check("byId('board').querySelectorAll('img').length===1",'Keyword board');
      const doc=await send('DOM.getDocument'),input=await send('DOM.querySelector',{nodeId:doc.root.nodeId,selector:'#inspiration'});
      const start=requests.length;
      await send('DOM.setFileInputFiles',{nodeId:input.nodeId,files:[path.join(__dirname,'assets','arabic.webp')]});
      await waitFor(()=>js("byId('board').querySelectorAll('img').length===2"));
      await check("byId('board').querySelector('figcaption').textContent==='Arabic Florals'",'Exact palette match ranked first');
      await send('DOM.setFileInputFiles',{nodeId:input.nodeId,files:[path.join(__dirname,'config.js')]});
      await waitFor(()=>js("byId('board').textContent.includes('could not be read')"));
      assert(requests.slice(start).every(url=>url.startsWith('blob:')||url.startsWith('http://127.0.0.1:4173/assets/')),'Photo network traffic');
      for(const [q,answer] of [['pricing','₹8,000'],['travel','₹3,500'],['booking','WhatsApp'],['drying','humidity'],['aftercare','paste'],['available','calendar']]){
        await fill('question',q);await submit('chat');await check('byId("answer").textContent.includes('+JSON.stringify(answer)+')','FAQ '+q);
      }
      await noOverflow();
      assert.deepEqual(errors,[]);
      console.log(width+'px: gallery, keyboard, brief download, calculator, validation, edited WhatsApp handoff, upload privacy and FAQ passed.');
    }
  }finally{
    if(ws)ws.close();
    chrome.kill();
    if(serverProcess)serverProcess.kill();
  }
}
run().catch(err=>{console.error(err);process.exitCode=1;});
