(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[185],{1066:function(e,t,n){Promise.resolve().then(n.bind(n,3241)),Promise.resolve().then(n.t.bind(n,3247,23)),Promise.resolve().then(n.t.bind(n,8877,23))},3241:function(e,t,n){"use strict";n.d(t,{ThemeProvider:function(){return v}});var c=n(7437),o=n(2265),a=["light","dark"],r="(prefers-color-scheme: dark)",l="undefined"==typeof window,s=o.createContext(void 0),i=e=>o.useContext(s)?e.children:o.createElement(d,{...e}),m=["light","dark"],d=e=>{let{forcedTheme:t,disableTransitionOnChange:n=!1,enableSystem:c=!0,enableColorScheme:l=!0,storageKey:i="theme",themes:d=m,defaultTheme:v=c?"system":"light",attribute:b="data-theme",value:g,children:S,nonce:p}=e,[w,_]=o.useState(()=>h(i,v)),[k,C]=o.useState(()=>h(i)),E=g?Object.values(g):d,T=o.useCallback(e=>{let t=e;if(!t)return;"system"===e&&c&&(t=y());let o=g?g[t]:t,r=n?f():null,s=document.documentElement;if("class"===b?(s.classList.remove(...E),o&&s.classList.add(o)):o?s.setAttribute(b,o):s.removeAttribute(b),l){let e=a.includes(v)?v:null,n=a.includes(t)?t:e;s.style.colorScheme=n}null==r||r()},[]),x=o.useCallback(e=>{let t="function"==typeof e?e(e):e;_(t);try{localStorage.setItem(i,t)}catch(e){}},[t]),L=o.useCallback(e=>{C(y(e)),"system"===w&&c&&!t&&T("system")},[w,t]);o.useEffect(()=>{let e=window.matchMedia(r);return e.addListener(L),L(e),()=>e.removeListener(L)},[L]),o.useEffect(()=>{let e=e=>{e.key===i&&x(e.newValue||v)};return window.addEventListener("storage",e),()=>window.removeEventListener("storage",e)},[x]),o.useEffect(()=>{T(null!=t?t:w)},[t,w]);let N=o.useMemo(()=>({theme:w,setTheme:x,forcedTheme:t,resolvedTheme:"system"===w?k:w,themes:c?[...d,"system"]:d,systemTheme:c?k:void 0}),[w,x,t,k,c,d]);return o.createElement(s.Provider,{value:N},o.createElement(u,{forcedTheme:t,disableTransitionOnChange:n,enableSystem:c,enableColorScheme:l,storageKey:i,themes:d,defaultTheme:v,attribute:b,value:g,children:S,attrs:E,nonce:p}),S)},u=o.memo(e=>{let{forcedTheme:t,storageKey:n,attribute:c,enableSystem:l,enableColorScheme:s,defaultTheme:i,value:m,attrs:d,nonce:u}=e,h="system"===i,f="class"===c?"var d=document.documentElement,c=d.classList;".concat("c.remove(".concat(d.map(e=>"'".concat(e,"'")).join(","),")"),";"):"var d=document.documentElement,n='".concat(c,"',s='setAttribute';"),y=s?(a.includes(i)?i:null)?"if(e==='light'||e==='dark'||!e)d.style.colorScheme=e||'".concat(i,"'"):"if(e==='light'||e==='dark')d.style.colorScheme=e":"",v=function(e){let t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n=!(arguments.length>2)||void 0===arguments[2]||arguments[2],o=m?m[e]:e,r=t?e+"|| ''":"'".concat(o,"'"),l="";return s&&n&&!t&&a.includes(e)&&(l+="d.style.colorScheme = '".concat(e,"';")),"class"===c?t||o?l+="c.add(".concat(r,")"):l+="null":o&&(l+="d[s](n,".concat(r,")")),l},b=t?"!function(){".concat(f).concat(v(t),"}()"):l?"!function(){try{".concat(f,"var e=localStorage.getItem('").concat(n,"');if('system'===e||(!e&&").concat(h,")){var t='").concat(r,"',m=window.matchMedia(t);if(m.media!==t||m.matches){").concat(v("dark"),"}else{").concat(v("light"),"}}else if(e){").concat(m?"var x=".concat(JSON.stringify(m),";"):"").concat(v(m?"x[e]":"e",!0),"}").concat(h?"":"else{"+v(i,!1,!1)+"}").concat(y,"}catch(e){}}()"):"!function(){try{".concat(f,"var e=localStorage.getItem('").concat(n,"');if(e){").concat(m?"var x=".concat(JSON.stringify(m),";"):"").concat(v(m?"x[e]":"e",!0),"}else{").concat(v(i,!1,!1),";}").concat(y,"}catch(t){}}();");return o.createElement("script",{nonce:u,dangerouslySetInnerHTML:{__html:b}})}),h=(e,t)=>{let n;if(!l){try{n=localStorage.getItem(e)||void 0}catch(e){}return n||t}},f=()=>{let e=document.createElement("style");return e.appendChild(document.createTextNode("*{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}")),document.head.appendChild(e),()=>{window.getComputedStyle(document.body),setTimeout(()=>{document.head.removeChild(e)},1)}},y=e=>(e||(e=window.matchMedia(r)),e.matches?"dark":"light");function v(e){let{children:t,...n}=e;return(0,c.jsx)(i,{...n,children:t})}},8877:function(){},3247:function(e){e.exports={style:{fontFamily:"'__Inter_36bd41', '__Inter_Fallback_36bd41'",fontStyle:"normal"},className:"__className_36bd41"}}},function(e){e.O(0,[569,971,23,744],function(){return e(e.s=1066)}),_N_E=e.O()}]);