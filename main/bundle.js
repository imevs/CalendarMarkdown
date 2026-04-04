"use strict";(()=>{var x=(e,t)=>()=>(e&&(t=e(e=0)),t);var N=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports);var L=(e,t,r)=>new Promise((n,a)=>{var i=d=>{try{g(r.next(d))}catch(h){a(h)}},u=d=>{try{g(r.throw(d))}catch(h){a(h)}},g=d=>d.done?n(d.value):Promise.resolve(d.value).then(i,u);g((r=r.apply(e,t)).next())});function k(e){let{year:t,month:r,view:n}=e;if(e.columns==="continuous"&&n==="Year")return H(e,"markdown");if(n==="Year"){let a=`# Calendar ${t}

`;for(let i=1;i<=12;i++)a+=`### ${D[i-1]} ${t}

`,a+=C(A(e,i)),a+=`

`;return a.trim()}else{let a=r||new Date().getMonth()+1;return`### ${D[a-1]} ${t}

`+C(A(e,a))}}function E(e){let{year:t,month:r,view:n}=e;if(e.columns==="continuous"&&n==="Year")return H(e,"text");if(n==="Year"){let a=`${t} Calendar

`;for(let i=1;i<=12;i++)a+=`${D[i-1]} ${t}

`,a+=j(A(e,i)),a+=`

`;return a.trim()}else{let a=r||new Date().getMonth()+1;return`${D[a-1]} ${t}

`+j(A(e,a))}}function C(e){let t=a=>a.padStart(3," "),r=e[0]||[],n="| "+r.map(t).join(" | ")+` |
`;n+="| "+r.map(()=>"---").join(" | ")+` |
`;for(let a=1;a<e.length;a++){let i=e[a]||[];n+="| "+i.map(t).join(" | ")+` |
`}return n.trim()}function j(e){let t=a=>a.padStart(3," "),r=e[0]||[],n=r.map(t).join(" ")+`
`;n+=r.map(()=>"---").join(" ")+`
`;for(let a=1;a<e.length;a++){let i=e[a]||[];n+=i.map(t).join(" ")+`
`}return n.trim()}function $(e,t,r){let{columns:n,view:a}=t;if(n==="continuous"||n<=1||a==="Month")return e;let i=r==="markdown"?/(?=### )/:new RegExp(`(?=(?:${D.join("|")}) \\d{4})`),u=e.split(i).map(s=>s.trim()).filter(s=>s.length>0),d=(u[0]||"").includes("Calendar"),h="";d&&(h=u.shift()||"");let o=h?`${h.trim()}

`:"";for(let s=0;s<u.length;s+=n){let w=[];for(let y=0;y<n&&s+y<u.length;y++){let S=u[s+y]||"",c="";if(r==="markdown"){let l=S.match(/### (.*) \d{4}/);c=l&&l[1]?l[1]:""}else{let l=S.match(/^([A-Za-z]+) \d{4}/);c=l&&l[1]?l[1]:""}let m=[];r==="markdown"?m=S.split(`
`).filter(l=>l.includes("|")):m=S.split(`
`).filter(f=>f.trim().length>0).slice(1);let p=m.map(l=>{if(r==="markdown")return l.split("|").map(f=>f.trim()).slice(1,-1);{let f=[];for(let v=0;v<7;v++)f.push(l.slice(v*4,v*4+3).trim());return f}});w.push({name:c,grid:p})}if(w.length!==0){if(r==="markdown"){let y=w.map(c=>{let m=[],p=l=>l.padEnd(10," ");return m.push([c.name,...Array(7).fill("")].map(p)),m.push(Array(8).fill("---").map(p)),c.grid.forEach((l,f)=>{f===1&&l.every(M=>M==="---"||M==="")||m.push(["",...l].map(p))}),m}),S=Math.max(...y.map(c=>c.length));y.forEach(c=>{let m=p=>p.padEnd(10," ");for(;c.length<S;)c.push(Array(8).fill("").map(m))});for(let c=0;c<S;c++){let m=[];y.forEach((p,l)=>{let f=p[c]||Array(8).fill("".padEnd(10," "));m.push(...f),l<y.length-1&&m.push(c===1?"---":"   ")}),o+="| "+m.join(" | ")+` |
`}}else{let y=w.map(c=>{let m=[],p=M=>M.padStart(3," "),l=c.name,f=Math.floor((27-l.length)/2),v=[" ".repeat(f)+l+" ".repeat(27-f-l.length)];return m.push(v),m.push([" ".repeat(27)]),c.grid.forEach((M,R)=>{R===1&&M.every(T=>T==="---"||T==="")||m.push([M.map(p).join(" ")])}),m}),S=Math.max(...y.map(c=>c.length));y.forEach(c=>{for(;c.length<S;)c.push([" ".repeat(27)])});for(let c=0;c<S;c++){let m="  ";y.forEach((p,l)=>{let f=p[c]||[" ".repeat(27)];m+=f[0],l<y.length-1&&(m+="    ")}),o+=m.trimEnd()+`
`}}o+=`
`}}return o.trim()}function A(e,t){let{year:r,startDay:n}=e,a=new Date(r,t,0).getDate(),i=new Date(r,t-1,1).getDay(),u=i;n==="Monday"&&(u=(i+6)%7);let d=[n==="Monday"?["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]],h=1,o=Array(7).fill("");for(let s=u;s<7;s++)o[s]=h.toString(),h++;for(d.push(o);h<=a;){o=Array(7).fill("");for(let s=0;s<7&&h<=a;s++)o[s]=h.toString(),h++;d.push(o)}return d}function H(e,t){let{year:r,startDay:n}=e,a=n==="Monday",i=a?["  M","  T","  W","  T","  F","  S","  S"]:["  S","  M","  T","  W","  T","  F","  S"],u="";t==="markdown"?(u+=`# Calendar ${r}

`,u+=`|  W |   Month | ${i.join(" | ")} |
`,u+=`| --:| -------:| -----:| -----:| -----:| -----:| -----:| -----:| -----:|
`):(u+=`${r} Calendar

`,u+=`  W    Month   ${i.join("   ")}
`,u+=` --  -------   ---   ---   ---   ---   ---   ---   ---
`);let d=new Date(r,0,1).getDay(),h=d;a&&(h=d===0?6:d-1);let o=new Date(r,0,1-h),s=1,w=new Date(r,11,31),y=-1;for(;o<=w;){let S=[],c=!1,m=-1;for(let p=0;p<7;p++){let l=new Date(o.getFullYear(),o.getMonth(),o.getDate()+p);l.getFullYear()===r?(c=!0,S.push(l.getDate().toString().padStart(2," ")),(m===-1||l.getDate()===1)&&(m=l.getMonth())):S.push("  ")}if(c){let p="     ";if(m!==-1&&m!==y){y=m;let f=(D[m]||"").substring(0,3).toUpperCase();p=t==="markdown"?`**${f}**`:f.padEnd(5," "),t==="markdown"&&(p=p.padStart(7," "))}else p=t==="markdown"?"       ":"     ";let l=s.toString().padStart(2,"0");if(t==="markdown"){let f=S.map(v=>v.padStart(5," "));u+=`| ${l} | ${p} | ${f.join(" | ")} |
`}else{let f=S.map(M=>M.padStart(3," ")),v=p.padStart(7," ");u+=` ${l}    ${v}   ${f.join("   ")}
`}s++}o=new Date(o.getFullYear(),o.getMonth(),o.getDate()+7)}return u.trim()}var D,I=x(()=>{"use strict";D=["January","February","March","April","May","June","July","August","September","October","November","December"]});function Y(e,t,r){if(t==="Month"){let d=e.trim().split(`
`),o=(d[0]||"").startsWith("### ")&&d.shift()||"",s=d.join(`
`);return`
      <div class="month-card">
        ${o?`<h3 style="margin-top: 0;">${o.replace("### ","")}</h3>`:""}
        ${b(s)}
      </div>
    `}if(r==="continuous"){let d=e.trim().split(`
`),o=(d[0]||"").startsWith("# ")&&d.shift()||"",s=d.join(`
`);return`
      <div class="year-view">
        ${o?`<h1>${o.replace("# ","")}</h1>`:""}
        ${b(s)}
      </div>
    `}let n=e.split(/(?=### )/),i=(n[0]||"").startsWith("# ")?n.shift():"",u=`display: grid; grid-template-columns: repeat(${r}, minmax(0, 1fr)); gap: 0.25rem;`,g=n.map(d=>{let h=d.split(`
`),o=h.shift()||"",s=h.join(`
`);return`
      <div class="month-card">
        <h3 style="margin-top: 0;">${o.replace("### ","")}</h3>
        ${b(s)}
      </div>
    `}).join("");return`
    <div class="year-view">
      ${i?`<h1>${i.replace("# ","")}</h1>`:""}
      <div style="${u}">
        ${g}
      </div>
    </div>
  `}function b(e){let t=e.trim().split(`
`),r=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],n=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],a=t.findIndex(o=>{let s=o.trim();return s.startsWith("|")?!0:s.includes("|")&&(r.some(w=>s.includes(w))||n.some(w=>s.includes(w)))});if(a===-1)return`<pre style="font-family: 'JetBrains Mono', monospace; padding: 1rem; background: rgba(0,0,0,0.1); border-radius: 8px; overflow-x: auto; margin: 0;">${e.trim()}</pre>`;let i=t.slice(a);if(i.length<2)return`<pre>${i.join(`
`)}</pre>`;let u=o=>{let s=o.split("|");return o.startsWith("|")&&s.shift(),o.endsWith("|")&&s.pop(),s.map(w=>w.trim())},d=u(i[0]||"").map(o=>`<th>${o}</th>`).join(""),h=i.slice(2).map(o=>{let s=u(o);return s.length===0?"":`<tr>${s.map(y=>`<td>${y.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>")}</td>`).join("")}</tr>`}).filter(o=>o!=="").join("");return`
    <table class="calendar-table">
      <thead>
        <tr>${d}</tr>
      </thead>
      <tbody>
        ${h}
      </tbody>
    </table>
  `}var W=x(()=>{"use strict"});var K=N(()=>{I();W();var P=!1;function B(){return P?Promise.resolve():new Promise((e,t)=>{let r=document.createElement("script");r.src="https://cdn.jsdelivr.net/npm/marked@15.0.7/marked.min.js",r.onload=()=>{P=!0,e()},r.onerror=()=>t(new Error("Failed to load marked.js")),document.head.appendChild(r)})}function V(){let e=new URLSearchParams(window.location.search),t=e.get("year"),r=e.get("month"),n=e.get("columns"),a=e.get("renderAs"),i;return n==="continuous"?i="continuous":n&&(i=parseInt(n)),{year:t?parseInt(t):void 0,month:r?parseInt(r):void 0,startDay:e.get("startDay")||void 0,view:e.get("view")||void 0,columns:i,renderAs:a||void 0}}function z(){let e=localStorage.getItem("theme"),t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light",r=e||t;document.documentElement.setAttribute("data-theme",r)}function U(){let t=document.documentElement.getAttribute("data-theme")==="dark"?"light":"dark";document.documentElement.setAttribute("data-theme",t),localStorage.setItem("theme",t)}function F(e){let t=a=>document.getElementById(a);t("year")&&(t("year").value=e.year.toString()),t("month")&&(t("month").value=(e.month||1).toString()),t("startDay")&&(t("startDay").value=e.startDay),t("view")&&(t("view").value=e.view),t("columns")&&(t("columns").value=e.columns.toString()),t("renderAs")&&(t("renderAs").value=e.renderAs);let r=document.getElementById("month-group"),n=document.getElementById("columns-group");e.view==="Year"?(r==null||r.classList.add("hidden"),n==null||n.classList.remove("hidden")):(r==null||r.classList.remove("hidden"),n==null||n.classList.add("hidden"))}function J(e,t){if(t)document.body.innerHTML=`<pre style="color: red; font-family: monospace; padding: 2rem;">Error: ${e}</pre>`;else{let r=document.getElementById("error-message");r&&(r.textContent=e,r.style.display="block")}}function Z(){let e=document.getElementById("error-message");e&&(e.style.display="none")}function _(e){let t=new URL(window.location.href);return t.searchParams.set("year",e.year.toString()),e.view==="Month"&&e.month?t.searchParams.set("month",e.month.toString()):t.searchParams.delete("month"),t.searchParams.set("view",e.view),t.searchParams.set("startDay",e.startDay),t.searchParams.set("columns",e.columns.toString()),t.searchParams.set("renderAs",e.renderAs),t.toString()}function O(e,t){return L(this,null,function*(){try{Z();let r="";if(e.renderAs==="markdown"){let n=k(e);r=$(n,e,"markdown")}else if(e.renderAs==="text"){let n=E(e);r=$(n,e,"text")}else if(e.renderAs==="marked"){let n=k(e),a=$(n,e,"markdown");yield B(),r=window.marked.parse(a)}else{let n=k(e);r=Y(n,e.view,e.columns)}if(t)document.body.className="raw-mode",e.renderAs==="html"||e.renderAs==="marked"?document.body.innerHTML=r:document.body.innerHTML=`<pre style="white-space: pre; font-family: monospace; margin: 0; padding: 2rem; overflow-x: auto;">${r}</pre>`;else{let n=document.getElementById("output");n&&(e.renderAs==="markdown"||e.renderAs==="text"?n.innerHTML=`<pre id="raw-preview">${r}</pre>`:n.innerHTML=r)}}catch(r){J(r.message,t)}})}function q(){var a,i,u;z();let e=V(),t=!!(e.year&&(e.month||e.view==="Year")),r=new Date,n={year:e.year||r.getFullYear(),month:e.month||r.getMonth()+1,startDay:e.startDay||"Monday",view:e.view||"Year",columns:e.columns||1,renderAs:e.renderAs||"markdown"};if(!t){F(n);let g=o=>document.getElementById(o),d=["year","month","startDay","view","columns","renderAs"],h=()=>{n.year=parseInt(g("year").value)||r.getFullYear(),n.month=parseInt(g("month").value),n.startDay=g("startDay").value,n.view=g("view").value;let o=g("columns").value;n.columns=o==="continuous"?"continuous":parseInt(o),n.renderAs=g("renderAs").value,F(n),O(n,!1)};d.forEach(o=>{var s,w;(s=g(o))==null||s.addEventListener("input",h),(w=g(o))==null||w.addEventListener("change",h)}),(a=g("theme-toggle"))==null||a.addEventListener("click",U),(i=g("copy-markdown-btn"))==null||i.addEventListener("click",()=>{let o=n.renderAs==="text"?E(n):k(n),s=$(o,n,n.renderAs==="text"?"text":"markdown");navigator.clipboard.writeText(s).then(()=>alert(`${n.renderAs==="text"?"Text":"Markdown"} copied!`))}),(u=g("copy-link-btn"))==null||u.addEventListener("click",()=>{navigator.clipboard.writeText(_(n)).then(()=>alert("Shareable link (Raw Mode) copied!"))})}O(n,t)}window.addEventListener("DOMContentLoaded",q)});K();})();
