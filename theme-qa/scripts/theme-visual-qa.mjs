import { chromium } from 'playwright';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import fs from 'node:fs/promises';
import path from 'node:path';

const repo = 'snackcontent/AI-experience-lab';
const darkSHA = '25a2298fbba921d0b53eef8ead2be68a4af040be';
const currentRef = process.env.THEME_CURRENT_REF || 'development';
const base = process.env.THEME_BASE_URL || ('https://raw.githack.com/' + repo + '/' + darkSHA + '/AI%20Experience%20Lab.dc.html');
const current = process.env.THEME_CURRENT_URL || ('https://raw.githack.com/' + repo + '/' + currentRef + '/AI%20Experience%20Lab.dc.html');
const out = path.resolve('theme-qa-results');
const widths = [320,390,430,768,1024,1440];
const sections = ['o2-top','o2-network','o2-services','o2-products','next','o2-faq','o2-contact'];
const entries = [];
await fs.mkdir(out,{recursive:true});
const browser = await chromium.launch({ headless:true });
const sleep = ms => new Promise(resolve=>setTimeout(resolve,ms));

async function capture(url,label,width,lang,theme) {
  const ctx=await browser.newContext({viewport:{width,height:900},deviceScaleFactor:1,reducedMotion:'reduce'});
  // State is written before navigation to reproduce correct initial rendering.
  await ctx.addInitScript(({lang,theme})=>{
    localStorage.setItem('o2-lang',lang);
    localStorage.setItem('ai-experience-lab-theme',theme);
  },{lang,theme});
  const page=await ctx.newPage();
  const problems=[];
  page.on('pageerror',error=>problems.push(String(error)));
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:60000});
  await page.evaluate(({lang,theme})=>{
    document.documentElement.lang=lang;
    document.documentElement.dir=lang==='ar'?'rtl':'ltr';
    if(window.O2I18n?.setLang)window.O2I18n.setLang(lang);
    if(theme==='dark' && document.documentElement.dataset.theme==='light')document.documentElement.dataset.theme='dark';
  },{lang,theme});
  await page.evaluate(()=>document.fonts?.ready).catch(()=>{});
  await sleep(1300);
  const dir=path.join(out,label,lang,String(width));
  await fs.mkdir(dir,{recursive:true});
  const snapshots={};
  for(const id of sections){
    const el=page.locator('#'+id);
    if(await el.count()){
      await el.scrollIntoViewIfNeeded().catch(()=>{});
      await sleep(250);
      const file=path.join(dir,id+'.png');
      await el.screenshot({path:file,animations:'disabled',timeout:25000}).catch(e=>problems.push(id+': '+String(e)));
      snapshots[id]=file;
    }else problems.push('Missing section: '+id);
  }
  const computed=await page.evaluate(()=>{
    const ids=['o2-site-header','o2-top','o2-network','o2-services','o2-products','next','o2-faq','o2-contact'];
    return Object.fromEntries(ids.map(id=>{
      const node=document.getElementById(id);if(!node)return [id,null];
      const css=getComputedStyle(node),r=node.getBoundingClientRect();
      return [id,{background:css.backgroundColor,color:css.color,border:css.borderColor,
        font:css.fontFamily,fontSize:css.fontSize,lineHeight:css.lineHeight,boxShadow:css.boxShadow,
        width:Math.round(r.width),height:Math.round(r.height)}];
    }));
  });
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+2);
  await fs.writeFile(path.join(dir,'computed.json'),JSON.stringify({computed,overflow,problems},null,2));
  await ctx.close();
  return {snapshots,computed,overflow,problems};
}

try{
  for(const width of widths)for(const lang of ['en','ar']){
    const original=await capture(base,'baseline',width,lang,'dark');
    const now=await capture(current,'current-dark',width,lang,'dark');
    for(const id of sections){
      let diff=null;
      try{
        const [a,b]=await Promise.all([fs.readFile(original.snapshots[id]),fs.readFile(now.snapshots[id])]);
        const imgA=PNG.sync.read(a),imgB=PNG.sync.read(b);
        if(imgA.width!==imgB.width||imgA.height!==imgB.height){
          diff={dimensionsChanged:true,baseline:[imgA.width,imgA.height],current:[imgB.width,imgB.height]};
        } else {
          const image=new PNG({width:imgA.width,height:imgA.height});
          const count=pixelmatch(imgA.data,imgB.data,image.data,imgA.width,imgA.height,{threshold:.12});
          const file=path.join(out,'diff-'+lang+'-'+width+'-'+id+'.png');
          await fs.writeFile(file,PNG.sync.write(image));
          diff={pixelsChanged:count,ratio:count/(imgA.width*imgA.height),diffImage:file};
        }
      }catch(e){diff={error:String(e)}}
      entries.push({width,lang,section:id,diff,baselineComputed:original.computed[id],currentComputed:now.computed[id]});
    }
    entries.push({width,lang,checks:{baselineOverflow:original.overflow,currentOverflow:now.overflow,baselineErrors:original.problems,currentErrors:now.problems}});
    // Capture Light Mode; no image comparison to dark because it is intentionally different.
    await capture(current,'current-light',width,lang,'light');
  }
} finally {await browser.close()}
const summary={baselineCommit:darkSHA,currentRef,base,current,note:'Dynamic canvas/video content creates non-deterministic pixels. Manual visual review required; theme switcher should be masked in a follow-up comparison.',entries};
await fs.writeFile(path.join(out,'report.json'),JSON.stringify(summary,null,2));
console.log('Theme screenshots and diff report saved to '+out);
