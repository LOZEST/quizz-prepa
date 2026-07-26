export const COURSE_MAP=[
 {id:'A',label:'A — Puissances',chapters:[
  {id:'powers',label:'Puissances',notions:[
   {id:'powers-product',label:'Produit et quotient de puissances'},
   {id:'powers-nested',label:'Puissance d’une puissance'},
   {id:'powers-negative',label:'Exposants négatifs et conditions'},
   {id:'powers-multivariable',label:'Expressions à plusieurs variables'}
  ]}
 ]},
 {id:'B',label:'B — Polynômes et fractions rationnelles',chapters:[
  {id:'factorisation',label:'Factorisation',notions:[
   {id:'factor-common',label:'Facteur commun'},
   {id:'factor-identities',label:'Identités remarquables'},
   {id:'factor-trinomial',label:'Trinômes et racines évidentes'}
  ]},
  {id:'rational',label:'Fractions rationnelles',notions:[
   {id:'fraction-domain',label:'Ensemble de définition'},
   {id:'fraction-simplify',label:'Factoriser puis simplifier'},
   {id:'fraction-sign',label:'Signe d’un quotient'}
  ]},
  {id:'equations',label:'Équations et inéquations',notions:[
   {id:'quadratic-solve',label:'Résolution du second degré'},
   {id:'quadratic-sign',label:'Signe d’un trinôme'},
   {id:'inequalities',label:'Inéquations et systèmes'}
  ]}
 ]},
 {id:'C',label:'C — Suites',chapters:[
  {id:'sequences',label:'Suites',notions:[
   {id:'sequence-recognition',label:'Reconnaître une suite'},
   {id:'sequence-variation',label:'Sens de variation'},
   {id:'sequence-arithmetic',label:'Suites arithmétiques'},
   {id:'sequence-geometric',label:'Suites géométriques'},
   {id:'sequence-sums',label:'Sommes et nombre de termes'}
  ]}
 ]},
 {id:'D',label:'D — Fonctions',chapters:[
  {id:'domains',label:'Domaines de définition',notions:[
   {id:'domain-quotient',label:'Quotients'},
   {id:'domain-log',label:'Logarithmes'},
   {id:'domain-composition',label:'Fonctions composées'}
  ]},
  {id:'derivatives',label:'Dérivation',notions:[
   {id:'derivative-basic',label:'Formules de base'},
   {id:'derivative-product',label:'Produit et quotient'},
   {id:'derivative-composite',label:'Composition'},
   {id:'derivative-tangent',label:'Tangentes et approximation'},
   {id:'derivative-variation',label:'Variations et extrema'}
  ]},
  {id:'primitives',label:'Primitives',notions:[
   {id:'primitive-basic',label:'Primitives usuelles'},
   {id:'primitive-composite',label:'Reconnaissance u′uⁿ'},
   {id:'primitive-log',label:'Reconnaissance u′/u'},
   {id:'primitive-constant',label:'Condition initiale'}
  ]},
  {id:'limits',label:'Limites et variations',notions:[
   {id:'limit-polynomial',label:'Polynômes et terme dominant'},
   {id:'limit-rational',label:'Quotients et formes indéterminées'},
   {id:'limit-log-exp',label:'Logarithme et exponentielle'},
   {id:'variation-table',label:'Tableaux de variations complets'}
  ]},
  {id:'differential',label:'Équations différentielles',notions:[
   {id:'ode-first',label:'Équation y′ = ay + b'},
   {id:'ode-initial',label:'Condition initiale'},
   {id:'ode-second-simple',label:'Équations avec dérivée seconde simple'}
  ]}
 ]},
 {id:'E',label:'E — Trigonométrie',chapters:[
  {id:'trigonometry',label:'Trigonométrie',notions:[
   {id:'trig-circle',label:'Cercle trigonométrique'},
   {id:'trig-values',label:'Valeurs remarquables'},
   {id:'trig-symmetry',label:'Symétries et périodicité'},
   {id:'trig-equations',label:'Équations trigonométriques'},
   {id:'trig-functions',label:'Courbes sinus et cosinus'}
  ]}
 ]}
];
export const allNotions=()=>COURSE_MAP.flatMap(p=>p.chapters.flatMap(c=>c.notions.map(n=>({...n,partId:p.id,partLabel:p.label,chapterId:c.id,chapterLabel:c.label}))));
export const findNotion=id=>allNotions().find(n=>n.id===id);
