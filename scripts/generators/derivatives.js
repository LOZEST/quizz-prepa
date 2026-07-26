import{randInt,nonZero,choice,createQuestion}from'../generator-utils.js';
const polyText=(a,b,c)=>`${a}x^2 ${b>=0?'+':'-'} ${Math.abs(b)}x ${c>=0?'+':'-'} ${Math.abs(c)}`;
export function generatePolynomialDerivative(difficulty=1){
 const a=nonZero(-7,7),b=nonZero(-9,9),c=randInt(-10,10);
 return createQuestion({id:`der-poly-${a}-${b}-${c}`,partId:'D',chapterId:'derivatives',notionId:'derivative-basic',difficulty,questionHtml:`Dériver <span class="math">f(x) = ${polyText(a,b,c)}</span>.`,hint:'Dériver terme à terme : (xⁿ)′ = nxⁿ⁻¹ et la dérivée d’une constante est nulle.',correctionHtml:`<span class="math">f'(x) = ${2*a}x ${b>=0?'+':'-'} ${Math.abs(b)}</span>.`,hiddenConcept:'Le coefficient multiplicatif reste devant la dérivée.',oralFormulation:'« J’applique la linéarité de la dérivation terme à terme. »',generator:'derivatives.polynomial'});
}
export function generateCompositeDerivative(difficulty=2){
 const a=nonZero(1,5),b=nonZero(-7,7),c=randInt(-5,8),n=randInt(3,difficulty>2?7:5);const inner=polyText(a,b,c);const innerPrime=`${2*a}x ${b>=0?'+':'−'} ${Math.abs(b)}`;
 return createQuestion({id:`der-comp-${a}-${b}-${c}-${n}`,partId:'D',chapterId:'derivatives',notionId:'derivative-composite',difficulty,questionHtml:`Dériver <span class="math">f(x) = (${inner})^{${n}}</span>. Identifier la fonction intérieure et la fonction extérieure.`,hint:'Pour (uⁿ)′, utiliser n·u′·uⁿ⁻¹.',correctionHtml:`Fonction intérieure : <span class="math">u(x) = ${inner}</span>. Alors <span class="math">u'(x) = ${innerPrime}</span> et <span class="math">f'(x) = ${n}(${innerPrime})(${inner})^{${n-1}}</span>.`,hiddenConcept:'La dérivée de la fonction intérieure est indispensable : oublier u′ est l’erreur classique.',oralFormulation:'« Je reconnais une composition et j’applique la dérivation en chaîne. »',generator:'derivatives.composite'});
}
export function generateTangent(difficulty=2){
 const a=nonZero(-4,4),b=randInt(-8,8),c=randInt(-6,6),x0=randInt(-3,3);const fx=a*x0*x0+b*x0+c,m=2*a*x0+b;const constant=fx-m*x0;
 return createQuestion({id:`tangent-${a}-${b}-${c}-${x0}`,partId:'D',chapterId:'derivatives',notionId:'derivative-tangent',difficulty,questionHtml:`Pour <span class="math">f(x) = ${polyText(a,b,c)}</span>, déterminer l’équation de la tangente au point d’abscisse <span class="math">${x0}</span>.`,hint:'Utiliser y = f′(a)(x−a)+f(a).',correctionHtml:`<span class="math">f′(x) = ${2*a}x ${b>=0?'+':'−'} ${Math.abs(b)}</span>, donc <span class="math">f′(${x0}) = ${m}</span> et <span class="math">f(${x0}) = ${fx}</span>. Tangente : <span class="math">y = ${m}(x − ${x0}) + ${fx} = ${m}x ${constant>=0?'+':'−'} ${Math.abs(constant)}</span>.`,hiddenConcept:'f′(a) est un nombre : le coefficient directeur de la tangente.',oralFormulation:'« La tangente passe par (a,f(a)) et a pour pente f′(a). »',generator:'derivatives.tangent'});
}
export const derivativeGenerators=[generatePolynomialDerivative,generateCompositeDerivative,generateTangent];
