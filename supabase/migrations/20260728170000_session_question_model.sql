-- Refonte des séances : quatre types de questions et trois difficultés visibles.
-- À appliquer après 20260727220000_question_banks.sql.

alter table public.questions drop constraint if exists questions_variables;
alter table public.questions drop constraint if exists questions_difficulty;
alter table public.questions alter column difficulty drop not null;

alter type public.question_type rename to question_type_legacy;
create type public.question_type as enum ('course','formula','calculation','reflex','parameterized');
alter table public.questions
 alter column question_type type public.question_type
 using question_type::text::public.question_type;
drop type public.question_type_legacy;

-- L’ancien niveau 3 devient le type Réflexe lorsqu’il ne dépend pas d’un générateur de variables.
update public.questions
 set question_type='reflex', difficulty=null, updated_at=now()
 where difficulty=3 and question_type in ('formula');

-- Les anciens exercices paramétrés de niveau 3 restent des calculs variables compatibles.
update public.questions
 set difficulty=2, updated_at=now()
 where difficulty=3 and question_type in ('course','parameterized');

alter table public.questions
 add constraint questions_difficulty check (
  (question_type='reflex' and difficulty is null)
  or (question_type<>'reflex' and difficulty in (1,2,4))
 ),
 add constraint questions_variables check (
  (question_type='parameterized' and jsonb_typeof(variable_spec)='object')
  or (question_type<>'parameterized' and variable_spec is null)
 );

comment on column public.questions.question_type is
 'Type pédagogique : course, formula, calculation ou reflex. parameterized est un sous-type technique de calculation conservé pour les variantes.';
comment on column public.questions.difficulty is
 'Difficulté visible : 1 Fondamental, 2 Standard, 4 Piège. NULL pour le type Réflexe.';
