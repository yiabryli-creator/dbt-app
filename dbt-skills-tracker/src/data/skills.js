const DEFAULT_LANG = 'en'

export function localize(value, lang) {
  if (value && typeof value === 'object') {
    return value[lang] ?? value[DEFAULT_LANG] ?? ''
  }
  return String(value ?? '')
}

export const modules = [
  { id: 'mindfulness', name: { ru: 'Осознанность', en: 'Mindfulness' } },
  { id: 'distress', name: { ru: 'Перенос стресса', en: 'Distress Tolerance' } },
  { id: 'emotion', name: { ru: 'Регуляция эмоций', en: 'Emotion Regulation' } },
  {
    id: 'interpersonal',
    name: { ru: 'Межличностная эффективность', en: 'Interpersonal Effectiveness' },
  },
]

export const skills = [
  { id: 'observe', name: { ru: 'Наблюдение', en: 'Observe' }, moduleId: 'mindfulness' },
  { id: 'describe', name: { ru: 'Описание', en: 'Describe' }, moduleId: 'mindfulness' },
  { id: 'participate', name: { ru: 'Участие', en: 'Participate' }, moduleId: 'mindfulness' },
  { id: 'nonjudgmental', name: { ru: 'Безоценочность', en: 'Non-judgmentally' }, moduleId: 'mindfulness' },
  { id: 'one_mindfully', name: { ru: 'Однонаправленность', en: 'One-mindfully' }, moduleId: 'mindfulness' },
  { id: 'effectively', name: { ru: 'Эффективность', en: 'Effectively' }, moduleId: 'mindfulness' },
  { id: 'stop', name: { ru: 'СТОП', en: 'STOP' }, moduleId: 'distress' },
  { id: 'tipp', name: { ru: 'ТРУД', en: 'TIPP' }, moduleId: 'distress' },
  { id: 'pros_cons', name: { ru: 'За и против', en: 'Pros & Cons' }, moduleId: 'distress' },
  { id: 'self_soothe', name: { ru: 'Полуулыбка', en: 'Half-Smiling' }, moduleId: 'distress' },
  { id: 'improve', name: { ru: 'Улучшить момент', en: 'IMPROVE' }, moduleId: 'distress' },
  { id: 'radical_acceptance', name: { ru: 'Радикальное принятие', en: 'Radical Acceptance' }, moduleId: 'distress' },
  { id: 'turning_mind', name: { ru: 'Осознанность к текущим мыслям', en: 'Turning the Mind' }, moduleId: 'distress' },
  { id: 'wise_mind_accepts', name: { ru: 'Отвлечение', en: 'ACCEPTS' }, moduleId: 'distress' },
  { id: 'please', name: { ru: 'Снижение уязвимости', en: 'PLEASE' }, moduleId: 'emotion' },
  { id: 'check_facts', name: { ru: 'Проверка фактов', en: 'Check the Facts' }, moduleId: 'emotion' },
  { id: 'opposite_action', name: { ru: 'Противоположное действие', en: 'Opposite Action' }, moduleId: 'emotion' },
  { id: 'problem_solving', name: { ru: 'Осознанность к текущей эмоции', en: 'Name the Emotion' }, moduleId: 'emotion' },
  { id: 'build_mastery', name: { ru: 'Мастерство', en: 'Build Mastery' }, moduleId: 'emotion' },
  { id: 'cope_ahead', name: { ru: 'Заблаговременный поиск решений', en: 'Cope Ahead' }, moduleId: 'emotion' },
  { id: 'accumulate_positives', name: { ru: 'Позитивные эмоции', en: 'Accumulate Positive Emotions' }, moduleId: 'emotion' },
  { id: 'reduce_vulnerability', name: { ru: 'PLEASE', en: 'Reduce Vulnerability' }, moduleId: 'emotion' },
  { id: 'dear_man', name: { ru: 'ПРОСИ', en: 'DEAR MAN' }, moduleId: 'interpersonal' },
  { id: 'give', name: { ru: 'ДРУГ', en: 'GIVE' }, moduleId: 'interpersonal' },
  { id: 'fast', name: { ru: 'ЧЕСТЬ', en: 'FAST' }, moduleId: 'interpersonal' },
  { id: 'validate', name: { ru: 'Валидация', en: 'Validation' }, moduleId: 'interpersonal' },
  { id: 'boundaries', name: { ru: 'Личные границы', en: 'Boundaries' }, moduleId: 'interpersonal' },
  { id: 'assert', name: { ru: 'Ассертивность', en: 'Assertiveness' }, moduleId: 'interpersonal' },
  { id: 'self_respect', name: { ru: 'Готовность', en: 'Willingness' }, moduleId: 'interpersonal' },
]

export const moduleById = Object.fromEntries(modules.map((m) => [m.id, m]))
export const skillById = Object.fromEntries(skills.map((s) => [s.id, s]))

export function getSkillsByModule() {
  const map = Object.fromEntries(modules.map((m) => [m.id, []]))
  for (const s of skills) map[s.moduleId].push(s)
  return map
}

