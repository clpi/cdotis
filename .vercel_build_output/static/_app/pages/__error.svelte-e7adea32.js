import{S as t,i as s,s as e,k as a,e as r,t as n,L as o,d as c,n as i,c as l,a as u,g as d,f,F as h,h as p,G as m}from"../chunks/vendor-33ac96d6.js";function v(t){let s,e,v,$,E,g,k;return document.title=s=t[0],{c(){e=a(),v=r("h1"),$=n(t[0]),E=a(),g=r("p"),k=n("test")},l(s){o('[data-svelte="svelte-27268p"]',document.head).forEach(c),e=i(s),v=l(s,"H1",{});var a=u(v);$=d(a,t[0]),a.forEach(c),E=i(s),g=l(s,"P",{});var r=u(g);k=d(r,"test"),r.forEach(c)},m(t,s){f(t,e,s),f(t,v,s),h(v,$),f(t,E,s),f(t,g,s),h(g,k)},p(t,[e]){1&e&&s!==(s=t[0])&&(document.title=s),1&e&&p($,t[0])},i:m,o:m,d(t){t&&c(e),t&&c(v),t&&c(E),t&&c(g)}}}function $({error:t,status:s}){return{props:{title:`${s}: ${t.message}`}}}function E(t,s,e){let{title:a}=s;return t.$$set=t=>{"title"in t&&e(0,a=t.title)},[a]}class g extends t{constructor(t){super(),s(this,t,E,v,e,{title:0})}}export{g as default,$ as load};
