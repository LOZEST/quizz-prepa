export function seededRandom(seed=Date.now()) {let state=(Number(seed)>>>0)||0x9e3779b9;return()=>{state=(state+0x6d2b79f5)|0;let t=Math.imul(state^(state>>>15),1|state);t^=t+Math.imul(t^(t>>>7),61|t);return((t^(t>>>14))>>>0)/4294967296}}
export const int=(random,min,max)=>Math.floor(random()*(max-min+1))+min;
export const pick=(random,items)=>items[int(random,0,items.length-1)];
export const nonZeroInt=(random,min,max)=>{let value=0;while(value===0)value=int(random,min,max);return value};
export const gcdExact=(a,b)=>{a=Math.abs(a);b=Math.abs(b);while(b)[a,b]=[b,a%b];return a||1};
export function fraction(numerator,denominator=1){if(!Number.isInteger(numerator)||!Number.isInteger(denominator)||denominator===0)throw new RangeError('Fraction exacte invalide');const sign=denominator<0?-1:1,g=gcdExact(numerator,denominator);return Object.freeze({numerator:sign*numerator/g,denominator:Math.abs(denominator/g)})}
export const fractionLatex=value=>value.denominator===1?String(value.numerator):`\\dfrac{${value.numerator}}{${value.denominator}}`;
export const text=value=>({type:'text',value});
export const math=(value,display=false)=>({type:'math',value,display});
