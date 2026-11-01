/**
 * Static Theme Architecture QA — node scripts/check-theme-architecture.mjs
 * Checks CSS module wiring, token availability, and static CSS syntax.
 * Does NOT replace browser visual regression or interaction tests.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
const root = process.cwd();
const html = readFileSync(join(root,'AI Experience Lab.dc.html'),'utf8');
const paths = [...html.matchAll(/<link[^>]+href="\.\/styles\/([^"]+\.css)"/g)].map(m=>'styles/'+m[1]);
const required=['styles/tokens.css','styles/base.css','styles/layout.css','styles/components.css','styles/components-continuation.css','styles/responsive.css','styles/themes/dark.css','styles/themes/light.css'];
const failures=[];
for (const p of required) if (!paths.includes(p)) failures.push('Missing stylesheet link: '+p);
for (const p of paths) {
 if (!existsSync(join(root,p))) { failures.push('Missing stylesheet file: '+p); continue; }
 const css=readFileSync(join(root,p),'utf8');
 const clean=css.replace(/\/\*[\s\S]*?\*\//g,'').replace(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g,"''");
 let balance=0; for(const c of clean){if(c==='{')balance++;else if(c==='}')balance--;if(balance<0){failures.push('Invalid closing brace: '+p);break;}}
 if(balance!==0)failures.push('Unbalanced CSS braces: '+p);
}
if(paths.indexOf('styles/tokens.css')>paths.indexOf('styles/themes/light.css'))failures.push('Tokens must load before Light Mode');
const tokens=readFileSync(join(root,'styles/tokens.css'),'utf8');
for(const token of ['--theme-page','--theme-text','--theme-primary','--theme-canvas','--theme-divider'])if(!tokens.includes(token))failures.push('Missing semantic token: '+token);
const dark=readFileSync(join(root,'styles/themes/dark.css'),'utf8');
const light=readFileSync(join(root,'styles/themes/light.css'),'utf8');
if(!dark.includes(':root:not([data-theme="light"])'))failures.push('Dark theme scope missing');
if(!light.includes('html[data-theme="light"]'))failures.push('Light theme scope missing');
console.log(JSON.stringify({ok:failures.length===0,files:paths.length,inlineStyleAttributes:(html.match(/\\sstyle="/g)||[]).length,failures},null,2));
if(failures.length)process.exitCode=1;
