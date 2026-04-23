const L = (ru, en) => ({ ru, en })
const baseDescription = L(
  'Навык помогает стабилизироваться и действовать осознанно в сложной ситуации.',
  'This skill helps you stabilize and act mindfully in a difficult situation.',
)
const baseExample = L(
  'Используй его в момент стресса: сделай паузу, назови состояние и выбери полезное действие.',
  'Use it during stress: pause, name your state, and choose a helpful action.',
)

export const dbtSkillsManual = [
  {
    category: L('Осознанность', 'Mindfulness'),
    skills: [
      { name: L('Наблюдение', 'Observe'), description: baseDescription, example: baseExample },
      { name: L('Описание', 'Describe'), description: baseDescription, example: baseExample },
      { name: L('Участие', 'Participate'), description: baseDescription, example: baseExample },
      { name: L('Безоценочность', 'Non-judgmentally'), description: baseDescription, example: baseExample },
      { name: L('Однонаправленность', 'One-mindfully'), description: baseDescription, example: baseExample },
      { name: L('Эффективность', 'Effectively'), description: baseDescription, example: baseExample },
    ],
  },
  {
    category: L('Перенос стресса', 'Distress Tolerance'),
    skills: [
      { name: L('СТОП', 'STOP'), description: baseDescription, example: baseExample },
      { name: L('За и против', 'Pros & Cons'), description: baseDescription, example: baseExample },
      { name: L('ТРУД', 'TIPP'), description: baseDescription, example: baseExample },
      { name: L('Отвлечение', 'ACCEPTS'), description: baseDescription, example: baseExample },
      { name: L('Улучшить момент', 'IMPROVE'), description: baseDescription, example: baseExample },
      { name: L('Радикальное принятие', 'Radical Acceptance'), description: baseDescription, example: baseExample },
      { name: L('Готовность', 'Willingness'), description: baseDescription, example: baseExample },
      { name: L('Полуулыбка', 'Half-Smiling'), description: baseDescription, example: baseExample },
      { name: L('Осознанность к текущим мыслям', 'Turning the Mind'), description: baseDescription, example: baseExample },
    ],
  },
  {
    category: L('Регуляция эмоций', 'Emotion Regulation'),
    skills: [
      { name: L('Проверка фактов', 'Check the Facts'), description: baseDescription, example: baseExample },
      { name: L('Противоположное действие', 'Opposite Action'), description: baseDescription, example: baseExample },
      { name: L('Снижение уязвимости', 'PLEASE'), description: baseDescription, example: baseExample },
      { name: L('Мастерство', 'Build Mastery'), description: baseDescription, example: baseExample },
      { name: L('Заблаговременный поиск решений', 'Cope Ahead'), description: baseDescription, example: baseExample },
      { name: L('Позитивные эмоции', 'Accumulate Positive Emotions'), description: baseDescription, example: baseExample },
      { name: L('Осознанность к текущей эмоции', 'Name the Emotion'), description: baseDescription, example: baseExample },
    ],
  },
  {
    category: L('Межличностная эффективность', 'Interpersonal Effectiveness'),
    skills: [
      { name: L('ПРОСИ', 'DEAR MAN'), description: baseDescription, example: baseExample },
      { name: L('ДРУГ', 'GIVE'), description: baseDescription, example: baseExample },
      { name: L('ЧЕСТЬ', 'FAST'), description: baseDescription, example: baseExample },
      { name: L('Валидация', 'Validation'), description: baseDescription, example: baseExample },
      { name: L('Личные границы', 'Boundaries'), description: baseDescription, example: baseExample },
      { name: L('Ассертивность', 'Assertiveness'), description: baseDescription, example: baseExample },
    ],
  },
]

export function localizeManual(value, lang) {
  if (value && typeof value === 'object') return value[lang] ?? value.en ?? ''
  return String(value ?? '')
}
