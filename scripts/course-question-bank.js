import{createQuestion}from'./generator-utils.js';
import{allNotions}from'./course-map.js';

// Banque relue manuellement : chaque fiche distingue résultat, hypothèses, application et erreur.
// Les formulations sont originales et ne sont pas extraites automatiquement d'un document.
const FUNDAMENTALS={
'fund-priorities':['Les parenthèses, puis puissances, puis produits/quotients, puis sommes/différences sont traités dans cet ordre.','Une barre de fraction regroupe son numérateur et son dénominateur.','Calculer 3+2×5.','13','Additionner avant la multiplication.'],
'fund-signs':['Le produit ou quotient de deux nombres de même signe est positif ; de signes contraires, il est négatif.','La règle s’applique seulement après avoir identifié chaque facteur.','Déterminer le signe de (−3)×(−2)×5.','positif','Confondre la règle du produit avec celle d’une somme.'],
'fund-distributivity':['Pour tous nombres a, b et c, a(b+c)=ab+ac.','Le facteur extérieur multiplie chacun des termes de la parenthèse.','Développer 3(x−2).','3x−6','Oublier de multiplier le second terme.'],
'fund-double-distributivity':['Pour tous a,b,c,d, (a+b)(c+d)=ac+ad+bc+bd.','Chaque terme de la première parenthèse multiplie chaque terme de la seconde.','Développer (x+2)(x−3).','x²−x−6','Oublier un des quatre produits.'],
'fund-reduction':['On ne regroupe que les termes de même nature, c’est-à-dire ayant exactement la même partie littérale.','Les exposants des lettres doivent être identiques.','Réduire 3x²+2x−x²+5x.','2x²+7x','Additionner des termes x et x².'],
'fund-common-factor':['Si A est un facteur commun, AB+AC=A(B+C).','Le facteur doit diviser chacun des termes considérés.','Factoriser 6x²−9x.','3x(2x−3)','Ne sortir le facteur que du premier terme.'],
'fund-square-sum':['Pour tous a,b, (a+b)²=a²+2ab+b².','Le terme médian est le double produit 2ab.','Développer (x+3)².','x²+6x+9','Écrire a²+b² et supprimer 2ab.'],
'fund-square-difference':['Pour tous a,b, (a−b)²=a²−2ab+b².','Le dernier terme b² reste positif.','Développer (2x−1)².','4x²−4x+1','Écrire −b² à la fin.'],
'fund-conjugates':['Pour tous a,b, (a+b)(a−b)=a²−b².','Les deux facteurs doivent être conjugués.','Développer (x+4)(x−4).','x²−16','Conserver à tort un terme croisé.'],
'fund-identities-expand':['Une identité remarquable permet de développer un carré ou un produit de conjugués sans double distributivité.','Il faut d’abord identifier a et b avec leurs signes.','Développer (3x+2)².','9x²+12x+4','Oublier de mettre 3x au carré.'],
'fund-identities-factor':['Les égalités remarquables se lisent dans les deux sens, par exemple a²−b²=(a−b)(a+b).','Les termes reconnus doivent être des carrés exacts.','Factoriser 25x²−9.','(5x−3)(5x+3)','Traiter une somme de carrés comme une différence.'],
'fund-identities-recognize':['Trois termes a²±2ab+b² signalent un carré ; deux carrés séparés par − signalent des conjugués.','La vérification du terme 2ab évite une fausse reconnaissance.','Reconnaître x²−10x+25.','(x−5)²','Se contenter de vérifier les deux carrés extrêmes.'],
'fund-identities-error':['Dans (a±b)², le terme croisé vaut toujours 2ab en valeur absolue.','Son signe est celui placé entre a et b.','Corriger (2x−3)²=4x²−6x+9.','(2x−3)²=4x²−12x+9','Calculer ab au lieu de 2ab.'],
'fund-fraction-add':['Pour additionner a/b et c/d, on utilise un dénominateur commun : (ad+bc)/(bd).','Les dénominateurs b et d sont non nuls.','Calculer 1/3+1/6.','1/2','Additionner séparément les dénominateurs.'],
'fund-fraction-product':['Le produit a/b×c/d vaut ac/bd.','Les dénominateurs b et d sont non nuls.','Calculer 2/3×9/4.','3/2','Mettre les fractions au même dénominateur inutilement.'],
'fund-fraction-division':['Diviser par c/d revient à multiplier par d/c.','Tous les dénominateurs sont non nuls et le diviseur c/d n’est pas nul, donc c≠0.','Calculer (2/5)÷(3/10).','4/3','Retourner la première fraction plutôt que le diviseur.'],
'fund-fraction-simplify':['On simplifie une fraction en divisant numérateur et dénominateur par un même facteur non nul.','On simplifie des facteurs, jamais des termes séparés par + ou −.','Simplifier 18/24.','3/4','Supprimer un terme dans une somme.'],
'fund-fraction-domain':['Une fraction existe exactement lorsque son dénominateur est non nul.','Les exclusions se déterminent sur l’expression initiale.','Donner la condition d’existence de 1/(x−4).','x≠4','Oublier une exclusion après simplification.'],
'fund-complex-fraction':['Une fraction complexe se simplifie en multipliant numérateur et dénominateur par un dénominateur commun.','Toutes les fractions présentes doivent exister et le dénominateur global doit être non nul.','Simplifier (1/x)/(2/x), avec x≠0.','1/2','Multiplier seulement le numérateur.'],
'fund-power-product':['Pour a≠0 si nécessaire, a^m a^n=a^{m+n} et a^m/a^n=a^{m−n}.','La règle porte sur des puissances de même base.','Simplifier x³×x⁵.','x⁸','Multiplier les exposants dans un produit.'],
'fund-power-nested':['Pour tous exposants entiers adaptés, (a^m)^n=a^{mn}.','Les exposants se multiplient seulement pour une puissance de puissance.','Simplifier (x³)^4.','x¹²','Additionner les exposants.'],
'fund-power-negative':['Pour a≠0 et n entier positif, a^{−n}=1/a^n.','La base ne doit pas être nulle.','Écrire x^{−3} sans exposant négatif.','1/x³, avec x≠0','Changer le signe de la base.'],
'fund-square-root':['√x est définie sur les réels si x≥0 et désigne l’unique nombre positif ou nul de carré x.','Le radicand doit être positif ou nul.','Donner le domaine de √(2x−6).','[3,+∞[','Accepter un radicand négatif dans ℝ.'],
'fund-root-square':['Pour tout réel a, √(a²)=|a|, et non toujours a.','La valeur absolue est nécessaire car une racine carrée est positive ou nulle.','Calculer √((-5)²).','5','Répondre −5.'],
'fund-linear-equation':['Si a≠0, ax+b=0 a pour unique solution x=−b/a.','Le cas a=0 doit être traité séparément.','Résoudre 3x−12=0.','x=4','Diviser un seul membre de l’égalité.'],
'fund-zero-product':['Un produit est nul si et seulement si au moins un de ses facteurs est nul.','La forme doit être factorisée et égale à zéro.','Résoudre (x−2)(x+5)=0.','x=2 ou x=−5','Appliquer la règle à une somme.'],
'fund-zero-quotient':['Un quotient est nul si et seulement si son numérateur est nul et son dénominateur non nul.','Les valeurs interdites du dénominateur sont exclues.','Résoudre (x−1)/(x+2)=0.','x=1','Annuler aussi le dénominateur.'],
'fund-inequality-sign':['Multiplier ou diviser une inégalité par un nombre négatif inverse son sens.','Le signe du multiplicateur doit être connu.','Résoudre −2x<6.','x>−3','Conserver le sens après division par −2.'],
'fund-sign-table':['Le signe d’un produit se déduit des zéros et du signe de chacun de ses facteurs sur chaque intervalle.','Les zéros annulent le produit ; les valeurs interdites ne lui appartiennent pas.','Donner le signe de (x−1)(x+2) entre −2 et 1.','négatif','Changer de signe à un point qui n’est ni zéro ni interdit.']
};

const EXISTING={
'powers-product':['a^m a^n=a^{m+n} et a^m/a^n=a^{m-n}.','La base du quotient est non nulle.','Simplifier 2^5/2^3.','4','Soustraire les bases.'],
'powers-nested':['(a^m)^n=a^{mn}.','Les exposants sont entiers dans ce cadre.','Simplifier (x²)^5.','x^{10}','Additionner les exposants.'],
'powers-negative':['a^{-n}=1/a^n.','a≠0 et n>0.','Simplifier 2^{-3}.','1/8','Croire que 2^{-3} est négatif.'],
'powers-multivariable':['Les règles de puissances s’appliquent séparément à chaque base.','Les bases divisées ne sont pas nulles.','Simplifier x³y²/(xy⁵).','x²/y³, avec x≠0 et y≠0','Mélanger les exposants de x et y.'],
'factor-common':['AB+AC=A(B+C).','A doit être facteur de tous les termes.','Factoriser 8x²+12x.','4x(2x+3)','Oublier un terme dans la parenthèse.'],
'factor-identities':['a²+2ab+b²=(a+b)², a²−2ab+b²=(a−b)² et a²−b²=(a−b)(a+b).','Le terme central doit être exactement ±2ab.','Factoriser x²+6x+9.','(x+3)²','Oublier le double produit.'],
'factor-trinomial':['Si P(r)=0, alors x−r est un facteur de P.','La racine doit être vérifiée par substitution.','Factoriser x²−3x+2.','(x−1)(x−2)','Confondre racine r et facteur x+r.'],
'fraction-domain':['Une fraction rationnelle est définie lorsque son dénominateur ne s’annule pas.','Les exclusions viennent du dénominateur initial.','Domaine de (x+1)/(x−2).','R privé de 2','Réintroduire une valeur interdite après simplification.'],
'fraction-simplify':['On factorise avant de simplifier des facteurs communs.','Le facteur simplifié est non nul sur le domaine.','Simplifier (x²−1)/(x−1).','x+1 pour x≠1','Simplifier des termes d’une somme.'],
'fraction-sign':['Le signe d’un quotient est le produit des signes du numérateur et du dénominateur.','Les zéros du dénominateur sont exclus.','Signe de (x−1)/(x+2) sur ]−2,1[.','négatif','Inclure −2 dans le tableau.'],
'quadratic-solve':['Les racines de ax²+bx+c, a≠0, se déduisent de Δ=b²−4ac.','Si Δ<0, il n’y a pas de racine réelle.','Résoudre x²−5x+6=0.','x=2 ou x=3','Oublier le coefficient 2a.'],
'quadratic-sign':['Si a≠0 et Δ>0, le trinôme est du signe de a à l’extérieur des racines et du signe opposé entre elles.','Les racines sont rangées dans l’ordre croissant.','Signe de x²−1 sur ]−1,1[.','négatif','Inverser intérieur et extérieur.'],
'inequalities':['Une inéquation produit ou quotient se résout avec un tableau de signes.','Les valeurs interdites sont exclues et le sens change lors d’une multiplication négative.','Résoudre (x−1)(x+2)≤0.','[-2,1]','Appliquer la règle du produit nul à une inégalité.'],
'sequence-recognition':['Une suite arithmétique a une différence u_{n+1}−u_n constante ; une géométrique a un quotient constant lorsque u_n≠0.','Le critère doit valoir pour tous les indices du domaine.','Identifier u_n=3n+2.','arithmétique de raison 3','Conclure sur seulement deux termes.'],
'sequence-variation':['La variation se prouve par le signe de u_{n+1}−u_n, ou par un quotient si les termes sont strictement positifs.','Le signe de u_n est requis pour la méthode du quotient.','Variation de u_n=2n+1.','strictement croissante','Utiliser un quotient sans connaître son signe.'],
'sequence-arithmetic':['u_n=u_p+(n−p)r pour une suite arithmétique de raison r.','Les indices n et p appartiennent au domaine.','Si u_0=2 et r=3, calculer u_4.','14','Écrire r^n.'],
'sequence-geometric':['u_n=u_p q^{n−p} pour une suite géométrique de raison q.','Les indices sont dans le domaine.','Si u_0=3 et q=2, calculer u_3.','24','Écrire u_0+nq.'],
'sequence-sums':['Une somme arithmétique vaut nombre de termes × (premier+dernier)/2.','Le nombre de termes de p à n inclus est n−p+1.','Calculer 1+2+3+4.','10','Oublier le +1 du nombre de termes.'],
'domain-quotient':['Le domaine d’un quotient exclut les zéros du dénominateur.','Toutes les autres sous-expressions doivent aussi être définies.','Domaine de 1/(x²−4).','R privé de −2 et 2','N’exclure qu’une racine.'],
'domain-log':['ln(u(x)) existe exactement lorsque u(x)>0.','L’inégalité est stricte.','Domaine de ln(x−3).',']3,+∞[','Inclure 3.'],
'domain-composition':['Domaine de f∘g : x doit appartenir au domaine de g et g(x) à celui de f.','Les deux conditions sont simultanées.','Domaine de √(1−x²).','[-1,1]','Vérifier seulement la fonction extérieure.'],
'derivative-basic':['(x^n)′=nx^{n−1}, (e^x)′=e^x et (ln x)′=1/x.','La formule du logarithme vaut pour x>0.','Dériver x^4−2x.','4x³−2','Ne pas diminuer l’exposant.'],
'derivative-product':['(uv)′=u′v+uv′ et (u/v)′=(u′v−uv′)/v².','Pour le quotient, v ne s’annule pas.','Dériver x e^x.','(x+1)e^x','Écrire u′v′.'],
'derivative-composite':['(f∘u)′=(f′∘u)u′.','Les fonctions sont dérivables aux points considérés.','Dériver e^{2x}.','2e^{2x}','Oublier u′.'],
'derivative-tangent':['La tangente en a a pour équation y=f(a)+f′(a)(x−a).','f est dérivable en a.','Tangente à x² en 1.','y=2x−1','Oublier f(a).'],
'derivative-variation':['Le signe de f′ détermine les variations de f sur un intervalle.','f est dérivable sur l’intervalle ; f′(a)=0 seul ne prouve pas un extremum.','Variations de x² sur [0,+∞[.','croissante','Conclure à un extremum à toute annulation de f′.'],
'primitive-basic':['Une primitive F de f vérifie F′=f ; toutes sont F+C sur un intervalle.','Le domaine est un intervalle.','Donner les primitives de 3x².','x³+C','Oublier la constante.'],
'primitive-composite':['Une primitive de u′u^n est u^{n+1}/(n+1) si n≠−1.','u est dérivable et n≠−1.','Primitive de 2x(x²+1)^3.','(x²+1)^4/4+C','Oublier le facteur intérieur.'],
'primitive-log':['Une primitive de u′/u est ln|u|.','u ne s’annule pas sur l’intervalle.','Primitive de 2x/(x²+1).','ln(x²+1)+C','Oublier la valeur absolue en général.'],
'primitive-constant':['Une condition F(a)=b détermine l’unique constante C parmi les primitives.','a appartient à l’intervalle étudié.','Si F′=2x et F(0)=3, trouver F.','F(x)=x²+3','Oublier d’utiliser la condition initiale.'],
'limit-polynomial':['À l’infini, un polynôme a la limite de son terme de plus haut degré.','On considère x vers +∞ ou −∞ séparément.','Limite de −2x³+x en +∞.','−∞','Garder le terme constant.'],
'limit-rational':['Pour un quotient de polynômes à l’infini, on compare les degrés ou factorise par les termes dominants.','Le dénominateur reste non nul dans un voisinage considéré.','Limite de (2x²+1)/(x²−3) en +∞.','2','Conclure à partir de ∞/∞.'],
'limit-log-exp':['À +∞, l’exponentielle domine toute puissance, qui domine le logarithme.','Les logarithmes exigent un argument positif.','Limite de ln(x)/x en +∞.','0','Traiter ∞/∞ comme une valeur.'],
'variation-table':['Un tableau complet relie domaine, zéros de f′, signe de f′, variations et limites ou valeurs aux bornes.','Les points interdits séparent les intervalles.','Pour f(x)=x², placer le minimum.','minimum 0 en x=0','Relier deux intervalles séparés par une valeur interdite.'],
'ode-first':['Les solutions de y′=ay+b, a≠0, sont y=Ce^{ax}−b/a.','a et b sont constants.','Résoudre y′=2y+4.','y=Ce^{2x}−2','Mettre +b/a.'],
'ode-initial':['Une condition y(t_0)=y_0 détermine C dans la solution générale.','La condition est appliquée à une solution définie au point t_0.','Pour y′=y et y(0)=3, trouver y.','y=3e^x','Conserver une constante arbitraire.'],
'ode-second-simple':['Les solutions de y″+ω²y=0, ω>0, sont A cos(ωx)+B sin(ωx).','ω est strictement positif.','Résoudre y″+4y=0.','A cos(2x)+B sin(2x)','Employer e^{2x}.'],
'trig-circle':['Sur le cercle unité, le point d’angle θ a pour coordonnées (cos θ,sin θ).','Les angles sont orientés et mesurés modulo 2π.','Coordonnées pour θ=π/2.','(0,1)','Intervertir sinus et cosinus.'],
'trig-values':['Les valeurs remarquables se lisent sur le cercle à partir des triangles usuels.','Le signe dépend du quadrant.','Donner cos(π/3) et sin(π/3).','1/2 et √3/2','Ignorer le quadrant.'],
'trig-symmetry':['cos est paire et sin impaire ; les deux fonctions sont 2π-périodiques.','L’angle est réel.','Simplifier sin(−x).','−sin x','Dire que sinus est paire.'],
'trig-equations':['cos x=cos a équivaut à x=2kπ±a ; sin x=sin a à x=a+2kπ ou x=π−a+2kπ.','k appartient à Z.','Résoudre cos x=0.','x=π/2+kπ','Oublier la périodicité.'],
'trig-functions':['sin et cos prennent leurs valeurs dans [−1,1] et sont 2π-périodiques.','Les extrema et zéros se répètent par périodicité.','Donner le maximum de 2sin x−1.','1','Confondre amplitude et décalage vertical.']
};
const FACTS={...FUNDAMENTALS,...EXISTING};
const html=s=>s.replaceAll('R privé de','\\mathbb{R}\\setminus').replaceAll('∞','\\infty');
const math=value=>`<span class="math">${html(value)}</span>`;
function questionsFor(notion){const f=FACTS[notion.id];if(!f)return[];const[rule,condition,prompt,answer,error]=f,base=`course-${notion.id}`;return[
 createQuestion({id:`${base}-recall`,partId:notion.partId,chapterId:notion.chapterId,notionId:notion.id,difficulty:1,kind:'Formule de cours',questionHtml:`Énoncer précisément le résultat associé à « ${notion.label} ».`,hint:'Nommer les objets puis vérifier les hypothèses.',correctionHtml:rule,hiddenConcept:condition,oralFormulation:`« ${rule} »`} ),
 createQuestion({id:`${base}-true-false`,partId:notion.partId,chapterId:notion.chapterId,notionId:notion.id,difficulty:2,kind:'Vrai ou faux justifié',questionHtml:`Vrai ou faux : « ${error} » ? Justifier par la règle de cours.`,hint:'Comparer chaque signe, facteur ou condition à l’énoncé exact.',correctionHtml:`Faux. ${rule} Condition importante : ${condition}`,hiddenConcept:error,oralFormulation:'« Je réfute l’affirmation en citant la règle exacte. »'}),
 createQuestion({id:`${base}-conditions`,partId:notion.partId,chapterId:notion.chapterId,notionId:notion.id,difficulty:2,kind:'Conditions de validité',questionHtml:`Quelle condition faut-il contrôler avant d’utiliser le résultat « ${notion.label} » ?`,hint:'Chercher une valeur interdite, un signe ou une hypothèse sur le domaine.',correctionHtml:condition,hiddenConcept:rule,oralFormulation:`« Avant d’appliquer la propriété, je vérifie : ${condition} »`}),
 createQuestion({category:'exercise',id:`exercise-${notion.id}-direct`,partId:notion.partId,chapterId:notion.chapterId,notionId:notion.id,difficulty:1,kind:'Application directe',questionHtml:prompt,hint:'Identifier la propriété unique qui relie les données à la réponse.',correctionHtml:`On applique : ${rule} On obtient ${math(answer)}.`,hiddenConcept:condition,oralFormulation:'« Je cite la propriété, puis je l’applique. »'}),
 createQuestion({category:'exercise',id:`exercise-${notion.id}-diagnose`,partId:notion.partId,chapterId:notion.chapterId,notionId:notion.id,difficulty:2,kind:'Identifier une formule mal écrite',questionHtml:`Un élève affirme : « ${error} » Repérer précisément l’erreur et donner la règle correcte.`,hint:'Contrôler le domaine, les signes et tous les facteurs.',correctionHtml:`L’erreur est : ${error} La règle correcte est : ${rule}`,hiddenConcept:error,oralFormulation:'« Je localise l’erreur avant de corriger la formule. »'}),
 createQuestion({category:'exercise',id:`exercise-${notion.id}-reverse`,partId:notion.partId,chapterId:notion.chapterId,notionId:notion.id,difficulty:3,kind:'Retrouver la formule',questionHtml:`L’exemple « ${prompt} » conduit à ${math(answer)}. Quelle propriété justifie ce passage et sous quelle condition ?`,hint:'Remonter de l’exemple à la famille de formules, sans recalculer.',correctionHtml:`La propriété est : ${rule} Il faut contrôler : ${condition}`,hiddenConcept:rule,oralFormulation:'« Je reconnais la structure de l’exemple et j’énonce ses hypothèses. »'})
]}
export const COURSE_QUESTION_BANK=allNotions().flatMap(questionsFor);
export const COURSE_FACTS=Object.freeze(FACTS);
