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
  const cssFailures=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',res=>{
   if(res.url().includes('/styles/') && res.url().endsWith('.css') && !res.ok())
    cssFailures.push(`${res.status()} ${res.url()}`);
  });
  page.on('requestfailed',req=>{
   if(req.url().includes('/styles/') && req.url().endsWith('.css'))
    cssFailures.push(`Network failure ${req.url()}: ${req.failure()?.errorText}`);
  });
  const response=await page.goto(url,{waitUntil:'domcontentloaded',timeout:60000});
  if(!response?.ok())failures.push('Document HTTP failure '+viewport.width);
  await page.waitForTimeout(900);
  const styles=await page.evaluate(()=>[...document.querySelectorAll('link[rel="stylesheet"][href*="styles/"]')].map(el=>({
    url:el.href,loaded:!!el.sheet
  })));
  if(styles.length!==8)failures.push(`${viewport.width}px expected 8 CSS modules; got ${styles.length}`);
  for(const style of styles)if(!style.loaded)failures.push(`${viewport.width}px missing stylesheet ${style.url}`);
  failures.push(...cssFailures.map(item=>`${viewport.width}px ${item}`));
  const themeControl=page.locator('[data-o2-theme-switch]').first();
  if(await themeControl.count()){
   await page.evaluate(()=>document.documentElement.dataset.theme='dark');
   await themeControl.click();
   const switched=await page.evaluate(()=>document.documentElement.dataset.theme);
   if(switched!=='light')failures.push(`${viewport.width}px theme switcher did not activate light mode`);
   await themeControl.click();
   const restored=await page.evaluate(()=>document.documentElement.dataset.theme);
   if(restored!=='dark')failures.push(`${viewport.width}px theme switcher did not restore dark mode`);
  }else failures.push(`${viewport.width}px theme switcher not found`);
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
  // Verify that the two themes preserve FAQ support-card geometry in both directions.
  for(const direction of ['ltr','rtl']){
   const measures={};
   for(const mode of ['dark','light']){
    measures[mode]=await page.evaluate(({direction,mode})=>{
     document.documentElement.dir=direction;
     document.documentElement.dataset.theme=mode;
     const el=document.querySelector('#o2-faq .o2-faq-support--desktop');
     const rect=el?.getBoundingClientRect();
     return rect?{width:rect.width,height:rect.height}:null;
    },{direction,mode});
   }
   if(measures.dark&&measures.light&&relativeDiff(measures.dark.width,measures.light.width)>0.025)
    failures.push(`${viewport.width}px ${direction}: FAQ support width differs by theme`);
  }
  await page.evaluate(()=>{document.documentElement.dir='ltr';document.documentElement.dataset.theme='dark';});
  for(const e of errors)failures.push(`${viewport.width}px page error: ${e}`);
  await page.close();
 }
}finally{await browser.close();}
console.log(JSON.stringify({ok:failures.length===0,checkedViewports:dimensions,failures},null,2));
if(failures.length)process.exitCode=1;
