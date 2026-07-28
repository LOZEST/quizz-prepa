export function prepareSessionDom(){
 const app=document.getElementById('app');if(!app)return;
 // questionTimer est rendu dans le HTML pour éviter tout changement de géométrie après démarrage.
 const notion=document.getElementById('notionSelect')?.closest('label'),filters=document.getElementById('filters');if(filters&&!document.getElementById('questionTypeSelect')){const label=document.createElement('label');label.textContent='Type';const select=document.createElement('select');select.id='questionTypeSelect';for(const[value,text]of[['formula','Formules'],['course','Cours'],['calculation','Calcul'],['reflex','Réflexe']]){const option=document.createElement('option');option.value=value;option.textContent=text;select.append(option)}label.append(select);notion?.after(label)}
 const difficulty=document.getElementById('difficultySelect');if(difficulty){difficulty.replaceChildren(...[[1,'Fondamental'],[2,'Standard'],[4,'Piège']].map(([value,text])=>{const option=document.createElement('option');option.value=String(value);option.textContent=text;return option}))}
 document.getElementById('almostButton')?.remove();const evaluation=document.getElementById('evaluationButtons');if(evaluation)evaluation.querySelector('p').textContent='Après comparaison avec la correction :';
 const testLevel=document.querySelector('#testApp select[name="level"]');if(testLevel){testLevel.querySelector('option[value="3"]')?.remove();if(testLevel.value==='3')testLevel.value='2'}
}
prepareSessionDom();
