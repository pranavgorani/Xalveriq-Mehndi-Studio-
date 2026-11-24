const byId = id => document.getElementById(id);
const value = id => byId(id).value;
const labelOf = id => byId(id).selectedOptions[0].text;
const money = n => new Intl.NumberFormat('en-IN', {style:'currency',currency:'INR',maximumFractionDigits:0}).format(n);
const styles = [
  {key:'bridal', title:'Bridal Heirloom', short:'Layered paisleys and intricate lacework.', motifs:'Mirrored paisleys, mandalas and fine latticework', placement:'Palms and forearms, with coordinating feet', coverage:'Dense bridal hands and feet', base:'bridal', rate:'traditional', terms:'bridal traditional rajasthani heavy dense intricate mandala paisley symmetrical peacock lattice lacework heirloom'},
  {key:'arabic', title:'Arabic Florals', short:'Sweeping vines with room to breathe.', motifs:'Bold blossoms, shaded leaves and trailing vines', placement:'Diagonally from wrist to fingertip', coverage:'Airy half hand', base:'half', rate:'arabic', terms:'arabic airy floral florals flowers flower rose roses blossom vine vines leaves leaf botanical diagonal flowing trailing'},
  {key:'minimal', title:'Modern Minimal', short:'Fine lines, tiny blooms and open space.', motifs:'Fine lines, tiny buds and delicate dots', placement:'A fingertip, wrist or the back of one hand', coverage:'A single small motif', base:'minimal', rate:'minimal', terms:'minimal minimalist modern geometric tiny fine sparse understated small subtle delicate simple single dainty bracelet dots'}
].map(s=>({...s,image:'assets/'+s.key+'.webp'}));
const dialog = byId('details');
let selected;
let lastFocusedCard = null;
for (const s of styles) {
  const button = document.createElement('button');
  button.className = 'card';
  button.innerHTML = '<img loading="lazy" src="'+s.image+'" alt=""><h3>'+s.title+'</h3><p>'+s.short+'</p>';
  button.onclick = () => {
    lastFocusedCard = button;
    selected = s;
    byId('photo').src = s.image;
    byId('photo').alt = s.short;
    byId('styleName').textContent = s.title;
    byId('description').innerHTML = '<dt>Motifs</dt><dd>'+s.motifs+'</dd><dt>Placement</dt><dd>'+s.placement+'</dd><dt>Coverage</dt><dd>'+s.coverage+'</dd>';
    dialog.showModal();
  };
  byId('cards').append(button);
}
byId('closeDialog').onclick = () => {
  dialog.close();
  if (lastFocusedCard) lastFocusedCard.focus();
};
const menu = document.querySelector('.menu');
function toggleMenu(open) {
  menu.setAttribute('aria-expanded',String(open));
  byId('navigation').classList.toggle('open',open);
}
menu.onclick = () => toggleMenu(menu.getAttribute('aria-expanded')==='false');
byId('navigation').onclick = () => toggleMenu(false);
document.addEventListener('keydown', e=>{
  if(e.key==='Escape' && menu.getAttribute('aria-expanded')==='true') {toggleMenu(false);menu.focus();}
});

function downloadBrief(content) {
  const url = URL.createObjectURL(new Blob([content],{type:'text/plain;charset=utf-8'}));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'Xalveriq-artist-brief.txt';
  link.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}
let plannedCollection;
function carrySelection(s) {
  plannedCollection = s;
  byId('bookingStyle').value = s.rate;
  byId('coverage').value = s.base;
  byId('bookingOccasion').value = value('occasion').toLowerCase();
  invalidateQuote();
}
function showBrief(s) {
  const brief = ['Occasion: '+value('occasion'),'Original request: '+value('preferences'),'Collection: '+s.title,'Suggested motifs: '+s.motifs,'Placement: '+s.placement,'Coverage: '+s.coverage,'Confirm with the artist: sides of each hand, final coverage, personal details and appointment timing.'].join('\n');
  const title = document.createElement('h3'), copy = document.createElement('p');
  title.textContent = s.title;
  copy.className = 'brief';
  copy.textContent = brief;
  const download = document.createElement('button'), estimate = document.createElement('button');
  download.textContent = 'Download artist brief';
  download.onclick = () => downloadBrief(brief);
  estimate.textContent = 'Estimate this design';
  estimate.onclick = () => {carrySelection(s);location.hash='booking';byId('bookingOccasion').focus();};
  byId('result').replaceChildren(title,copy,download,estimate);
  carrySelection(s);
}
byId('useStyle').onclick = () => {
  dialog.close();
  byId('preferences').value = selected.title+'. '+selected.short;
  showBrief(selected);
  location.hash = 'finder';
  byId('preferences').focus();
};
byId('form').oninput = () => byId('result').replaceChildren();
byId('form').onsubmit = e => {
  e.preventDefault();
  const words = new Set(value('preferences').toLowerCase().match(/[a-z]+/g));
  const ranked = styles.map(s=>({s,score:s.terms.split(' ').filter(t=>words.has(t)).length})).sort((a,b)=>b.score-a.score);
  if (!ranked[0].score || ranked[0].score===ranked[1].score) {
    byId('result').textContent = 'Could you add a visual detail? Try paisley lacework, a floral vine or fine dots.';
    return;
  }
  const occasion = [...byId('occasion').options].find(o=>words.has(o.value.toLowerCase()));
  if (occasion) byId('occasion').value = occasion.value;
  showBrief(ranked[0].s);
};

const bases = {minimal:800,half:1500,full:2500,bridal:8000};
const occasions = {wedding:1.6,engagement:1.25,festival:1.1,party:1.05,everyday:1};
const rates = {traditional:1,arabic:1.1,'indo-arabic':1.15,minimal:0.9,portrait:1.35};
const rateList = (id,format) => [...byId(id).options].map(opt=>opt.text+' '+format(opt.value)).join(', ')+'.';
const pricing = 'Coverage bases: '+rateList('coverage',key=>money(bases[key]))+' Occasion multipliers: '+rateList('bookingOccasion',key=>'×'+occasions[key])+' Style multipliers: '+rateList('bookingStyle',key=>'×'+rates[key]);
const travelGuide = 'Travel is added once per enquiry: '+rateList('travel',v=>money(Number(v)));
byId('rateGuide').textContent = pricing+' '+travelGuide;
function localDay() {
  const now = new Date();
  return new Date(now-now.getTimezoneOffset()*60000).toISOString().slice(0,10);
}
byId('bookingDate').min = localDay();
byId('bookingDate').onfocus = () => byId('bookingDate').min=localDay();
let enquiryDetails = '';
function invalidateMessage() {
  byId('review').hidden = true;
  byId('message').value = '';
  byId('wa').hidden = true;
  byId('wa').removeAttribute('href');
}
function invalidateQuote() {
  byId('quote').hidden = true;
  enquiryDetails = '';
  invalidateMessage();
}
byId('bookingForm').oninput = invalidateQuote;
byId('bookingForm').onchange = invalidateQuote;
byId('bookingForm').onsubmit = e => {
  e.preventDefault();
  byId('bookingDate').min = localDay();
  if (!e.target.reportValidity()) {invalidateQuote();return;}
  const base=bases[value('coverage')], occasion=occasions[value('bookingOccasion')], style=rates[value('bookingStyle')];
  const n=Number(value('people')), travel=Number(value('travel'));
  const amount=money(Math.round(base*occasion*style*n+travel+1e-8));
  const reference = plannedCollection?.rate===value('bookingStyle') ? plannedCollection.title : '';
  byId('amount').textContent = amount;
  byId('breakdown').textContent = (reference ? reference+' · ' : '')+money(base)+' base × '+occasion+' occasion × '+style+' style × '+n+' people + '+money(travel)+' travel = '+amount;
  const bridal=value('coverage')==='bridal';
  const days=(Date.parse(value('bookingDate'))-Date.parse(localDay()))/86400000;
  byId('packageAdvice').textContent = (bridal?'Bridal session. Allow a dedicated sitting for hands and feet.':n>1?'Guest-group session. Choose repeatable motifs and discuss staggered arrival times.':'Individual session. Confirm the placement and the sides of each hand.')+
    (n>1?' For mixed coverage, calculate one bridal sitting and the lighter guest group separately. For one visit, add travel to only one estimate.':'')+
    (days<=7?' Your preferred date is within a week. Ask the artist to confirm timing.':' Share your event time when asking the artist to confirm this date.');
  enquiryDetails=['Preferred date: '+value('bookingDate'),'Occasion: '+labelOf('bookingOccasion'),reference && 'Collection: '+reference,'Coverage: '+labelOf('coverage'),'Style: '+labelOf('bookingStyle'),'People: '+n,'Travel: '+labelOf('travel')+' ('+money(travel)+')','Estimated total: '+amount].filter(Boolean).join('\n');
  invalidateMessage();
  byId('quote').hidden=false;
  byId('quote').focus();
};
byId('enquiry').oninput = () => {
  invalidateMessage();
  byId('phone').setCustomValidity('');
  byId('client').setCustomValidity('');
};
function updateLink() {
  const link = byId('wa');
  const number = typeof STUDIO_WHATSAPP !== 'undefined' ? STUDIO_WHATSAPP : (typeof STUDIO_WHATSAPP_NUMBER !== 'undefined' ? STUDIO_WHATSAPP_NUMBER : '');
  link.hidden = !value('message').trim();
  link.href = 'https://wa.me/'+number+'?text='+encodeURIComponent(value('message'));
  link.textContent = number ? 'Open studio chat on WhatsApp' : 'Choose a contact on WhatsApp';
}
byId('message').oninput = updateLink;
byId('enquiry').onsubmit = e => {
  e.preventDefault();
  if (!enquiryDetails) return;
  const phone=value('phone').trim(), name=value('client').trim();
  if (!name) byId('client').setCustomValidity('Enter your name.');
  if (!/^[+\d\s()-]+$/.test(phone)||!/^\d{7,15}$/.test(phone.replace(/\D/g,''))) byId('phone').setCustomValidity('Enter a WhatsApp number with 7 to 15 digits.');
  if (!e.target.reportValidity()) return;
  byId('message').value=['Hi Xalveriq Mehndi Studio, please confirm availability for this enquiry.','Name: '+name,'WhatsApp: '+phone,enquiryDetails].join('\n');
  byId('review').hidden=false;
  updateLink();
  byId('message').focus();
};
const topics=[
  [/availab|slot|date|appointment|free|opening/,'Send your preferred date to the studio. The artist checks the calendar and confirms the appointment directly.'],
  [/travel|distance|km|outside/,travelGuide],
  [/dry|dri(e|ed)/,'Drying time varies with paste thickness and humidity. Leave the design uncovered and still while it sets. Ask your artist when it is ready for removal.'],
  [/aftercare|care|wash|last|water|remov/,'Avoid rubbing the design as it sets. Follow your artist’s instructions for removing their paste and when to wash the area.'],
  [/pric|cost|rate|budget|charge|expensive|how much/,pricing],
  [/book|reserve|whatsapp/,'Calculate an estimate, add your details and review the WhatsApp message. Send the enquiry to the studio for confirmation.']
];
byId('chat').onsubmit=e=>{
  e.preventDefault();
  const answers=topics.filter(([re])=>re.test(value('question').toLowerCase()));
  byId('answer').textContent=answers.length?answers.map(([,answer])=>answer).join(' '):'Ask about pricing, travel, booking, availability, drying or aftercare. You can include other questions in your studio enquiry.';
};
