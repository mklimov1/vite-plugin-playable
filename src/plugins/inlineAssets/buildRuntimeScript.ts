const runtimeWorkerShim = `
window.Worker=class{
  constructor(){throw new Error("no workers")}
  postMessage(){}terminate(){}addEventListener(){}removeEventListener(){}
};
window.createImageBitmap=undefined;`;

const runtimeFind = `
  const _find=(url)=>{
    let k=url;
    try{k=new URL(k,location.href).pathname.replace(/^\\//, "");}catch(e){}
    if(m[k])return m[k];
    const mk=Object.keys(m);
    for(let i=0;i<mk.length;i++){
      if(k.endsWith(mk[i]))return m[mk[i]];
    }
    return null;
  };`;

const runtimeToBlob = `
  const _toBlob=(d)=>{
    const idx=d.indexOf(",");
    const meta=d.substring(0,idx);
    const data=d.substring(idx+1);
    const mime=meta.split(":")[1].split(";")[0];
    if(meta.indexOf("base64")!==-1){
      const b=atob(data);
      const a=new Uint8Array(b.length);
      for(let i=0;i<b.length;i++)a[i]=b.charCodeAt(i);
      return new Blob([a],{type:mime});
    }
    return new Blob([decodeURIComponent(data)],{type:mime});
  };`;

const runtimeToBlobUrl = `
  const _toBlobUrl=(d)=>{
    if(!blobCache[d])blobCache[d]=URL.createObjectURL(_toBlob(d));
    return blobCache[d];
  };`;

const runtimeFetchOverride = `
  const _f=window.fetch;
  window.fetch=function(u,o){
    const url=typeof u==="string"?u:u.url;
    const d=_find(url);
    if(d)return Promise.resolve(new Response(_toBlob(d),{status:200}));
    return _f.apply(this,arguments);
  };`;

const runtimeImageSrcOverride = `
  const _srcDesc=Object.getOwnPropertyDescriptor(HTMLImageElement.prototype,"src");
  Object.defineProperty(HTMLImageElement.prototype,"src",{
    set(v){
      const d=_find(v);
      _srcDesc.set.call(this,d?_toBlobUrl(d):v);
    },
    get:_srcDesc.get
  });`;

const runtimeFontFaceOverride = `
  const _FF=window.FontFace;
  window.FontFace=function(family,source,desc){
    if(typeof source==="string"){
      const u=source.replace(/url\\(/,"").replace(/\\)/,"").replace(/["\\x27]/g,"");
      const d=_find(u);
      if(d)source="url("+_toBlobUrl(d)+")";
    }
    return new _FF(family,source,desc);
  };
  window.FontFace.prototype=_FF.prototype;`;

export const buildRuntimeScript = (base64: string): string =>
  [
    "<script>",
    runtimeWorkerShim,
    "(function(){",
    `  const m=JSON.parse(atob("${base64}"));`,
    "  const blobCache={};",
    runtimeFind,
    runtimeToBlob,
    runtimeToBlobUrl,
    runtimeFetchOverride,
    runtimeImageSrcOverride,
    runtimeFontFaceOverride,
    "})();",
    "</script>",
  ].join("\n");
