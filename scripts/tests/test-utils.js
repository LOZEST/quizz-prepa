export function hash(value){let h=2166136261;for(const c of String(value)){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return(h>>>0).toString(16).padStart(8,'0')}
export function seededRandom(seed){let x=parseInt(hash(seed),16)||1;return()=>{x+=0x6D2B79F5;let t=x;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
export function clone(value){return globalThis.structuredClone?globalThis.structuredClone(value):JSON.parse(JSON.stringify(value))}
export const halfUnits=value=>{const n=Number(value);if(!Number.isFinite(n)||n<0||Math.round(n*2)!==n*2)throw new TypeError('Les points doivent être des entiers ou demi-points');return Math.round(n*2)};
