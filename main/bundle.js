"use strict";(()=>{var A=(e,t)=>()=>(e&&(t=e(e=0)),t);var P=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports);function x(e){let{year:t,month:r,view:n}=e;if(e.columns==="continuous"&&n==="Year")return H(e,"markdown");if(n==="Year"){let o=`# Calendar ${t}

`;for(let i=1;i<=12;i++)o+=`### ${D[i-1]} ${t}

`,o+=L($(e,i)),o+=`

`;return o.trim()}else{let o=r||new Date().getMonth()+1;return`### ${D[o-1]} ${t}

`+L($(e,o))}}function E(e){let{year:t,month:r,view:n}=e;if(e.columns==="continuous"&&n==="Year")return H(e,"text");if(n==="Year"){let o=`${t} Calendar

`;for(let i=1;i<=12;i++)o+=`${D[i-1]} ${t}

`,o+=C($(e,i)),o+=`

`;return o.trim()}else{let o=r||new Date().getMonth()+1;return`${D[o-1]} ${t}

`+C($(e,o))}}function L(e){let t=o=>o.padStart(3," "),r=e[0]||[],n="| "+r.map(t).join(" | ")+` |
`;n+="| "+r.map(()=>"---").join(" | ")+` |
`;for(let o=1;o<e.length;o++){let i=e[o]||[];n+="| "+i.map(t).join(" | ")+` |
`}return n.trim()}function C(e){let t=o=>o.padStart(3," "),r=e[0]||[],n=r.map(t).join(" ")+`
`;n+=r.map(()=>"---").join(" ")+`
`;for(let o=1;o<e.length;o++){let i=e[o]||[];n+=i.map(t).join(" ")+`
`}return n.trim()}function b(e,t,r){let{columns:n,view:o}=t;if(n==="continuous"||n<=1||o==="Month")return e;let i=r==="markdown"?/(?=### )/:new RegExp(`(?=(?:${D.join("|")}) \\d{4})`),m=e.split(i).map(s=>s.trim()).filter(s=>s.length>0),h=(m[0]||"").includes("Calendar"),p="";h&&(p=m.shift()||"");let a=p?`${p.trim()}

`:"";for(let s=0;s<m.length;s+=n){let w=[];for(let g=0;g<n&&s+g<m.length;g++){let S=m[s+g]||"",c="";if(r==="markdown"){let l=S.match(/### (.*) \d{4}/);c=l&&l[1]?l[1]:""}else{let l=S.match(/^([A-Za-z]+) \d{4}/);c=l&&l[1]?l[1]:""}let d=[];r==="markdown"?d=S.split(`
`).filter(l=>l.includes("|")):d=S.split(`
`).filter(f=>f.trim().length>0).slice(1);let u=d.map(l=>{if(r==="markdown")return l.split("|").map(f=>f.trim()).slice(1,-1);{let f=[];for(let v=0;v<7;v++)f.push(l.slice(v*4,v*4+3).trim());return f}});w.push({name:c,grid:u})}if(w.length!==0){if(r==="markdown"){let g=w.map(c=>{let d=[],u=l=>l.padEnd(10," ");return d.push([c.name,...Array(7).fill("")].map(u)),d.push(Array(8).fill("---").map(u)),c.grid.forEach((l,f)=>{f===1&&l.every(M=>M==="---"||M==="")||d.push(["",...l].map(u))}),d}),S=Math.max(...g.map(c=>c.length));g.forEach(c=>{let d=u=>u.padEnd(10," ");for(;c.length<S;)c.push(Array(8).fill("").map(d))});for(let c=0;c<S;c++){let d=[];g.forEach((u,l)=>{let f=u[c]||Array(8).fill("".padEnd(10," "));d.push(...f),l<g.length-1&&d.push(c===1?"---":"   ")}),a+="| "+d.join(" | ")+` |
`}}else{let g=w.map(c=>{let d=[],u=M=>M.padStart(3," "),l=c.name,f=Math.floor((27-l.length)/2),v=[" ".repeat(f)+l+" ".repeat(27-f-l.length)];return d.push(v),d.push([" ".repeat(27)]),c.grid.forEach((M,F)=>{F===1&&M.every(k=>k==="---"||k==="")||d.push([M.map(u).join(" ")])}),d}),S=Math.max(...g.map(c=>c.length));g.forEach(c=>{for(;c.length<S;)c.push([" ".repeat(27)])});for(let c=0;c<S;c++){let d="  ";g.forEach((u,l)=>{let f=u[c]||[" ".repeat(27)];d+=f[0],l<g.length-1&&(d+="    ")}),a+=d.trimEnd()+`
`}}a+=`
`}}return a.trim()}function $(e,t){let{year:r,startDay:n}=e,o=new Date(r,t,0).getDate(),i=new Date(r,t-1,1).getDay(),m=i;n==="Monday"&&(m=(i+6)%7);let h=[n==="Monday"?["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]],p=1,a=Array(7).fill("");for(let s=m;s<7;s++)a[s]=p.toString(),p++;for(h.push(a);p<=o;){a=Array(7).fill("");for(let s=0;s<7&&p<=o;s++)a[s]=p.toString(),p++;h.push(a)}return h}function H(e,t){let{year:r,startDay:n}=e,o=n==="Monday",i=o?["  M","  T","  W","  T","  F","  S","  S"]:["  S","  M","  T","  W","  T","  F","  S"],m="";t==="markdown"?(m+=`# Calendar ${r}

`,m+=`|  W |   Month | ${i.join(" | ")} |
`,m+=`| --:| -------:| -----:| -----:| -----:| -----:| -----:| -----:| -----:|
`):(m+=`${r} Calendar

`,m+=`  W    Month   ${i.join("   ")}
`,m+=` --  -------   ---   ---   ---   ---   ---   ---   ---
`);let h=new Date(r,0,1).getDay(),p=h;o&&(p=h===0?6:h-1);let a=new Date(r,0,1-p),s=1,w=new Date(r,11,31),g=-1;for(;a<=w;){let S=[],c=!1,d=-1;for(let u=0;u<7;u++){let l=new Date(a.getFullYear(),a.getMonth(),a.getDate()+u);l.getFullYear()===r?(c=!0,S.push(l.getDate().toString().padStart(2," ")),(d===-1||l.getDate()===1)&&(d=l.getMonth())):S.push("  ")}if(c){let u="     ";if(d!==-1&&d!==g){g=d;let f=(D[d]||"").substring(0,3).toUpperCase();u=t==="markdown"?`**${f}**`:f.padEnd(5," "),t==="markdown"&&(u=u.padStart(7," "))}else u=t==="markdown"?"       ":"     ";let l=s.toString().padStart(2,"0");if(t==="markdown"){let f=S.map(v=>v.padStart(5," "));m+=`| ${l} | ${u} | ${f.join(" | ")} |
`}else{let f=S.map(M=>M.padStart(3," ")),v=u.padStart(7," ");m+=` ${l}    ${v}   ${f.join("   ")}
`}s++}a=new Date(a.getFullYear(),a.getMonth(),a.getDate()+7)}return m.trim()}var D,j=A(()=>{"use strict";D=["January","February","March","April","May","June","July","August","September","October","November","December"]});function I(e,t,r){if(t==="Month"){let h=e.trim().split(`
`),a=(h[0]||"").startsWith("### ")&&h.shift()||"",s=h.join(`
`);return`
      <div class="month-card">
        ${a?`<h3 style="margin-top: 0;">${a.replace("### ","")}</h3>`:""}
        ${T(s)}
      </div>
    `}if(r==="continuous"){let h=e.trim().split(`
`),a=(h[0]||"").startsWith("# ")&&h.shift()||"",s=h.join(`
`);return`
      <div class="year-view">
        ${a?`<h1>${a.replace("# ","")}</h1>`:""}
        ${T(s)}
      </div>
    `}let n=e.split(/(?=### )/),i=(n[0]||"").startsWith("# ")?n.shift():"",m=`display: grid; grid-template-columns: repeat(${r}, minmax(0, 1fr)); gap: 1rem;`,y=n.map(h=>{let p=h.split(`
`),a=p.shift()||"",s=p.join(`
`);return`
      <div class="month-card">
        <h3 style="margin-top: 0;">${a.replace("### ","")}</h3>
        ${T(s)}
      </div>
    `}).join("");return`
    <div class="year-view">
      ${i?`<h1>${i.replace("# ","")}</h1>`:""}
      <div style="${m}">
        ${y}
      </div>
    </div>
  `}function T(e){let t=e.trim().split(`
`),r=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],n=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],o=t.findIndex(a=>{let s=a.trim();return s.startsWith("|")?!0:s.includes("|")&&(r.some(w=>s.includes(w))||n.some(w=>s.includes(w)))});if(o===-1)return`<pre style="font-family: 'JetBrains Mono', monospace; padding: 1rem; background: rgba(0,0,0,0.1); border-radius: 8px; overflow-x: auto; margin: 0;">${e.trim()}</pre>`;let i=t.slice(o);if(i.length<2)return`<pre>${i.join(`
`)}</pre>`;let m=a=>{let s=a.split("|");return a.startsWith("|")&&s.shift(),a.endsWith("|")&&s.pop(),s.map(w=>w.trim())},h=m(i[0]||"").map(a=>`<th>${a}</th>`).join(""),p=i.slice(2).map(a=>{let s=m(a);return s.length===0?"":`<tr>${s.map(g=>`<td>${g.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>")}</td>`).join("")}</tr>`}).filter(a=>a!=="").join("");return`
    <table class="calendar-table">
      <thead>
        <tr>${h}</tr>
      </thead>
      <tbody>
        ${p}
      </tbody>
    </table>
  `}var Y=A(()=>{"use strict"});var Z=P(()=>{j();Y();function N(){let e=new URLSearchParams(window.location.search),t=e.get("year"),r=e.get("month"),n=e.get("columns"),o=e.get("renderAs"),i;return n==="continuous"?i="continuous":n&&(i=parseInt(n)),{year:t?parseInt(t):void 0,month:r?parseInt(r):void 0,startDay:e.get("startDay")||void 0,view:e.get("view")||void 0,columns:i,renderAs:o||void 0}}function R(){let e=localStorage.getItem("theme"),t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light",r=e||t;document.documentElement.setAttribute("data-theme",r)}function B(){let t=document.documentElement.getAttribute("data-theme")==="dark"?"light":"dark";document.documentElement.setAttribute("data-theme",t),localStorage.setItem("theme",t)}function W(e){let t=o=>document.getElementById(o);t("year")&&(t("year").value=e.year.toString()),t("month")&&(t("month").value=(e.month||1).toString()),t("startDay")&&(t("startDay").value=e.startDay),t("view")&&(t("view").value=e.view),t("columns")&&(t("columns").value=e.columns.toString()),t("renderAs")&&(t("renderAs").value=e.renderAs);let r=document.getElementById("month-group"),n=document.getElementById("columns-group");e.view==="Year"?(r==null||r.classList.add("hidden"),n==null||n.classList.remove("hidden")):(r==null||r.classList.remove("hidden"),n==null||n.classList.add("hidden"))}function V(e,t){if(t)document.body.innerHTML=`<pre style="color: red; font-family: monospace; padding: 2rem;">Error: ${e}</pre>`;else{let r=document.getElementById("error-message");r&&(r.textContent=e,r.style.display="block")}}function U(){let e=document.getElementById("error-message");e&&(e.style.display="none")}function z(e){let t=new URL(window.location.href);return t.searchParams.set("year",e.year.toString()),e.view==="Month"&&e.month?t.searchParams.set("month",e.month.toString()):t.searchParams.delete("month"),t.searchParams.set("view",e.view),t.searchParams.set("startDay",e.startDay),t.searchParams.set("columns",e.columns.toString()),t.searchParams.set("renderAs",e.renderAs),t.toString()}function O(e,t){try{U();let r="";if(e.renderAs==="markdown"){let n=x(e);r=b(n,e,"markdown")}else if(e.renderAs==="text"){let n=E(e);r=b(n,e,"text")}else{let n=x(e);r=I(n,e.view,e.columns)}if(t)document.body.className="raw-mode",e.renderAs==="html"?document.body.innerHTML=r:document.body.innerHTML=`<pre style="white-space: pre; font-family: monospace; margin: 0; padding: 2rem; overflow-x: auto;">${r}</pre>`;else{let n=document.getElementById("output");n&&(e.renderAs==="markdown"||e.renderAs==="text"?n.innerHTML=`<pre id="raw-preview">${r}</pre>`:n.innerHTML=r)}}catch(r){V(r.message,t)}}function J(){var o,i,m;R();let e=N(),t=!!(e.year&&(e.month||e.view==="Year")),r=new Date,n={year:e.year||r.getFullYear(),month:e.month||r.getMonth()+1,startDay:e.startDay||"Monday",view:e.view||"Year",columns:e.columns||1,renderAs:e.renderAs||"markdown"};if(!t){W(n);let y=a=>document.getElementById(a),h=["year","month","startDay","view","columns","renderAs"],p=()=>{n.year=parseInt(y("year").value)||r.getFullYear(),n.month=parseInt(y("month").value),n.startDay=y("startDay").value,n.view=y("view").value;let a=y("columns").value;n.columns=a==="continuous"?"continuous":parseInt(a),n.renderAs=y("renderAs").value,W(n),O(n,!1)};h.forEach(a=>{var s,w;(s=y(a))==null||s.addEventListener("input",p),(w=y(a))==null||w.addEventListener("change",p)}),(o=y("theme-toggle"))==null||o.addEventListener("click",B),(i=y("copy-markdown-btn"))==null||i.addEventListener("click",()=>{let a=n.renderAs==="text"?E(n):x(n),s=b(a,n,n.renderAs==="text"?"text":"markdown");navigator.clipboard.writeText(s).then(()=>alert(`${n.renderAs==="text"?"Text":"Markdown"} copied!`))}),(m=y("copy-link-btn"))==null||m.addEventListener("click",()=>{navigator.clipboard.writeText(z(n)).then(()=>alert("Shareable link (Raw Mode) copied!"))})}O(n,t)}window.addEventListener("DOMContentLoaded",J)});Z();})();
