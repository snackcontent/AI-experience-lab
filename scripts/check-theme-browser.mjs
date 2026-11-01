/**
 * Browser smoke and layout parity test.
 * Run after: npm install --no-save playwright && npx playwright install chromium
 * Usage: SITE_URL=http://127.0.0.1:8765/AI%20Experience%20Lab.dc.html node scripts/check-theme-browser.mjs
 * Exact visual/pixel approval requires human-reviewed baseline screenshots.
 */
import { chromium } from 'playwright';
const url=process.env.SITE_URL ?? 'http://127.0.0.1:8765/AI%20Experience%20Lab.dc.html';
const browser=await chromium.launch({headless:true});
const failures=[];
const sections=['#o2-top','#o2-network','#o2-services','#o2-products','#next','#o2-faq','#o2-contact'];
const dimensions=[{width:1440,height:900},{width:768,height:1024},{width:390,height:844}];
const relativeDiff=(a,b)=>Math.abs(a-b)/Math.max(1,a,b);
try{
 for(const viewport of dimensions){
  const page=await browser.newPage({viewport});
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  const response=await page.goto(url,{waitUntil:'domcontentloaded',timeout:60000});
  if(!response?.ok())failures.push('Document HTTP failure '+viewport.width);
  await page.waitForTimeout(900);
  const snapshots={};
  for(const mode of ['dark','light']){
   await page.evaluate(m=>{document.documentElement.dataset.theme=m;document.documentElement.style.colorScheme=m;},mode);
   await page.waitForTimeout(150);
   snapshots[mode]=await page.evaluate(selectors=>selectors.map(selector=>{
    const el=document.querySelector(selector);
    const r=el?.getBoundingClientRect();
    return {selector,exists:!!el,display:el?getComputedStyle(el).display:null,
      width:r?.width??0,height:r?.height??0,x:r?.x??0,
      scrollWidth:el?.scrollWidth??0,clientWidth:el?.clientWidth??0};
   }),sections);
   for(const item of snapshots[mode])if(!item.exists||item.display==='none'||item.width<1)
    failures.push(`${viewport.width}px ${mode}: missing or hidden ${item.selector}`);
   await page.screenshot({path:`/tmp/ai-experience-${viewport.width}-${mode}.png`,fullPage:true});
  }
  for(let i=0;i<sections.length;i++){
   const a=snapshots.dark[i],b=snapshots.light[i];
   if(a.exists&&b.exists&&relativeDiff(a.width,b.width)>0.025)
    failures.push(`${viewport.width}px: width drift ${a.selector}: dark=${a.width}, light=${b.width}`);
  }
  for(const e of errors)failures.push(`${viewport.width}px page error: ${e}`);
  await page.close();
 }
}finally{await browser.close();}
console.log(JSON.stringify({ok:failures.length===0,checkedViewports:dimensions,failures},null,2));
if(failures.length)process.exitCode=1;
