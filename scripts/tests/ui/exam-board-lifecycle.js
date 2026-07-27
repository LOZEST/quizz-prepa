export class ExamBoardLifecycle{
 constructor(board){this.board=board;this.normalDraft=null}
 open(){if(!this.normalDraft)this.normalDraft=this.board.capture();this.board.setReadOnly(false)}
 start(){this.open();this.board.setReadOnly(false);this.board.restore(null)}
 showDraft(draft){const restored=this.board.restore(draft);this.board.setReadOnly(false);return restored}
 lock(){this.board.setReadOnly(true)}
 finish(){this.board.setReadOnly(false)}
 exit(){if(this.normalDraft)this.board.restore(this.normalDraft);this.normalDraft=null;this.board.setReadOnly(false)}
}
