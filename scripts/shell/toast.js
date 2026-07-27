let region;
export function toast(message,{type='info',timeout=4500}={}){region||=document.querySelector('[data-toast-region]');if(!region)return;const item=document.createElement('div');item.className=`toast toast-${type}`;item.setAttribute('role',type==='error'?'alert':'status');item.textContent=message;region.append(item);if(timeout)setTimeout(()=>item.remove(),timeout)}
