const STYLE_ID='quiz-tsi-workspace-polish';
const CSS=`
.topbar{top:5px;left:5px;right:5px;gap:5px}
.indicators{gap:4px;max-width:min(540px,calc(100% - 50px))}
.metric{padding:4px 8px;border-radius:11px;box-shadow:0 2px 9px rgba(17,24,39,.08)}
.metric small{font-size:.61rem}.metric strong{font-size:.76rem}
.question-card{top:50px;left:54px;right:88px;width:auto;padding:7px 10px;border-radius:12px;box-shadow:0 3px 11px rgba(17,24,39,.09)}
.question-text{font-size:.98rem;line-height:1.32;margin-top:3px}
.question-meta{gap:3px}.meta-item,.badge{font-size:.65rem;padding-block:2px}
.compact-button{min-height:36px;min-width:36px;flex-basis:36px;padding:4px}
.question-card.collapsed{max-width:calc(100% - 145px);padding:4px 7px}
.question-card.collapsed .compact-button{min-height:32px;min-width:32px;flex-basis:32px}
.board-toolbar{bottom:61px}.board-toolbar button{min-height:40px;padding:6px 9px}
.actions{bottom:6px}.actions button{min-height:42px;padding:7px 11px}
.tool-toggle{width:68px;min-height:54px}.shape-toggle{top:calc(50% + 61px);width:54px;min-height:48px}
@media(max-width:760px){
 .indicators .metric:nth-child(3),.indicators .metric:nth-child(4){display:none}
 .question-card{top:48px;left:6px;right:72px}
 .question-card.collapsed{right:auto;max-width:calc(100% - 78px)}
}
@media(orientation:landscape){.question-card{top:48px}}
`;
export function initQuizPolish({boardWrap,questionCard,questionToggle}={}){
 if(!document.getElementById(STYLE_ID)){const style=document.createElement('style');style.id=STYLE_ID;style.textContent=CSS;document.head.append(style)}
 boardWrap?.addEventListener('pointerdown',event=>{if(event.pointerType==='pen'&&!questionCard?.classList.contains('collapsed'))questionToggle?.click()},{passive:true});
}
