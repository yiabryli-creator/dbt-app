import { useEffect, useMemo, useState } from 'react'
import { useI18n } from '../lib/i18n.jsx'

const STORAGE_KEY = 'dbt-crisis-contacts'
const TRIGGERS_STORAGE_KEY = 'crisis_triggers'
const SUPPORT_STORAGE_KEY = 'crisis_support'
const QUICK_TRIGGER_IDS = [
  'conflicts',
  'loneliness',
  'overload',
  'rejection',
  'criticism',
  'fatigue',
  'uncertainty',
  'comparison',
]
const QUICK_POSITIVE_IDS = [
  'music',
  'walking',
  'movies',
  'close_people',
  'food',
  'animals',
  'rest',
  'creativity',
  'nature',
  'hobby',
]
const QUICK_REASON_IDS = ['important_people', 'goals', 'liked_things', 'future_experience', 'values']

function loadContacts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .map((c) => ({
        name: String(c?.name ?? ''),
        relation: String(c?.relation ?? ''),
        phone: String(c?.phone ?? ''),
        note: String(c?.note ?? ''),
      }))
      .filter((c) => c.name || c.phone || c.relation || c.note)
  } catch {
    return []
  }
}

function saveContacts(contacts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts))
}

function loadTriggers() {
  try {
    const raw = localStorage.getItem(TRIGGERS_STORAGE_KEY)
    if (!raw) return { customTriggers: [], selectedTriggers: [] }
    const parsed = JSON.parse(raw)
    const customTriggers = Array.isArray(parsed?.customTriggers)
      ? parsed.customTriggers.map((v) => String(v)).filter(Boolean)
      : []
    const selectedTriggers = Array.isArray(parsed?.selectedTriggers)
      ? parsed.selectedTriggers.map((v) => String(v)).filter(Boolean)
      : []
    return { customTriggers, selectedTriggers }
  } catch {
    return { customTriggers: [], selectedTriggers: [] }
  }
}

function saveTriggers(state) {
  localStorage.setItem(TRIGGERS_STORAGE_KEY, JSON.stringify(state))
}

function loadSupportState() {
  try {
    const raw = localStorage.getItem(SUPPORT_STORAGE_KEY)
    if (!raw) {
      return { positiveTriggers: [], customPositive: [], reasonsToLive: [] }
    }
    const parsed = JSON.parse(raw)
    return {
      positiveTriggers: Array.isArray(parsed?.positiveTriggers)
        ? parsed.positiveTriggers.map((v) => String(v)).filter(Boolean)
        : [],
      customPositive: Array.isArray(parsed?.customPositive)
        ? parsed.customPositive.map((v) => String(v)).filter(Boolean)
        : [],
      reasonsToLive: Array.isArray(parsed?.reasonsToLive)
        ? parsed.reasonsToLive.map((v) => String(v)).filter(Boolean)
        : [],
    }
  } catch {
    return { positiveTriggers: [], customPositive: [], reasonsToLive: [] }
  }
}

function saveSupportState(state) {
  localStorage.setItem(SUPPORT_STORAGE_KEY, JSON.stringify(state))
}

export function CrisisPage() {
  const { t } = useI18n()
  const [contacts, setContacts] = useState([])
  const [customTriggers, setCustomTriggers] = useState([])
  const [selectedTriggers, setSelectedTriggers] = useState([])
  const [newTrigger, setNewTrigger] = useState('')
  const [positiveTriggers, setPositiveTriggers] = useState([])
  const [customPositive, setCustomPositive] = useState([])
  const [reasonsToLive, setReasonsToLive] = useState([])
  const [newPositive, setNewPositive] = useState('')
  const [newReason, setNewReason] = useState('')
  const [isTriggersOpen, setIsTriggersOpen] = useState(false)
  const [isSupportOpen, setIsSupportOpen] = useState(false)
  const [isReasonsOpen, setIsReasonsOpen] = useState(false)
  const [isContactsOpen, setIsContactsOpen] = useState(false)
  const [draft, setDraft] = useState({
    name: '',
    relation: '',
    phone: '',
    note: '',
  })

  useEffect(() => {
    setContacts(loadContacts())
    const triggers = loadTriggers()
    setCustomTriggers(triggers.customTriggers)
    setSelectedTriggers(triggers.selectedTriggers)
    const support = loadSupportState()
    setPositiveTriggers(support.positiveTriggers)
    setCustomPositive(support.customPositive)
    setReasonsToLive(support.reasonsToLive)
  }, [])

  const canAdd = useMemo(() => {
    return Boolean(draft.name || draft.phone || draft.relation || draft.note)
  }, [draft])

  const triggerAvoidList = useMemo(() => {
    return [...selectedTriggers, ...customTriggers]
  }, [customTriggers, selectedTriggers])

  const supportList = useMemo(
    () => [...positiveTriggers, ...customPositive],
    [positiveTriggers, customPositive],
  )
  const quickTriggers = useMemo(
    () => QUICK_TRIGGER_IDS.map((id) => t(`crisis_trigger_${id}`)),
    [t],
  )
  const quickPositive = useMemo(
    () => QUICK_POSITIVE_IDS.map((id) => t(`crisis_positive_${id}`)),
    [t],
  )
  const quickReasons = useMemo(
    () => QUICK_REASON_IDS.map((id) => t(`crisis_reason_${id}`)),
    [t],
  )

  function updateTriggers(nextCustom, nextSelected) {
    setCustomTriggers(nextCustom)
    setSelectedTriggers(nextSelected)
    saveTriggers({
      customTriggers: nextCustom,
      selectedTriggers: nextSelected,
    })
  }

  function updateSupport(nextPositive, nextCustomPositive, nextReasons) {
    setPositiveTriggers(nextPositive)
    setCustomPositive(nextCustomPositive)
    setReasonsToLive(nextReasons)
    saveSupportState({
      positiveTriggers: nextPositive,
      customPositive: nextCustomPositive,
      reasonsToLive: nextReasons,
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-base font-semibold text-[var(--accent)]">
          {t('crisis')}
        </h1>
      </div>

      <div className="app-card rounded-xl border p-4">
        <h2 className="text-sm font-semibold">{t('crisis_bad_now_title')}</h2>
        <p className="app-text-muted mt-2 text-sm">
          {t('crisis_bad_now_text')}
        </p>
      </div>

      <div className="app-card rounded-xl border p-4">
        <button
          type="button"
          onClick={() => setIsTriggersOpen((v) => !v)}
          className="flex w-full items-center justify-between text-left"
        >
          <h2 className="text-sm font-semibold">{t('crisis_triggers_title')}</h2>
          <span className="app-text-muted text-xs">
            {isTriggersOpen ? t('collapse') : t('expand')}
          </span>
        </button>
        <p className="app-text-muted mt-1 text-xs">
          {t('crisis_triggers_hint')}
        </p>

        {!isTriggersOpen && triggerAvoidList.length > 0 ? (
          <div className="mt-3 rounded-lg border app-border p-2">
            <div className="text-xs font-semibold uppercase app-text-muted">
              {t('selected')}
            </div>
            <ul className="mt-1 space-y-1">
              {triggerAvoidList.map((item, idx) => (
                <li key={`${item}-${idx}`} className="text-sm">
                  - {item}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {isTriggersOpen ? <div className="mt-3 space-y-3">
          <div className="space-y-2">
            <div className="text-xs font-semibold uppercase app-text-muted">
              {t('quick_list')}
            </div>
            <div className="space-y-1">
              {quickTriggers.map((trigger) => {
                const checked = selectedTriggers.includes(trigger)
                return (
                  <label
                    key={trigger}
                    className="app-card flex items-center gap-2 rounded-lg border px-2 py-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {
                        const nextSelected = checked
                          ? selectedTriggers.filter((v) => v !== trigger)
                          : [...selectedTriggers, trigger]
                        updateTriggers(customTriggers, nextSelected)
                      }}
                      className="h-4 w-4 accent-[var(--accent)]"
                    />
                    <span>{trigger}</span>
                  </label>
                )
              })}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-semibold uppercase app-text-muted">
              {t('crisis_custom_triggers')}
            </div>
            <div className="flex gap-2">
              <input
                value={newTrigger}
                onChange={(e) => setNewTrigger(e.target.value)}
                className="app-input h-10 flex-1 rounded-xl border px-3 text-sm"
                placeholder={t('crisis_trigger_add_placeholder')}
              />
              <button
                type="button"
                className="app-accent rounded-xl px-3 py-2 text-xs font-semibold"
                onClick={() => {
                  const value = newTrigger.trim()
                  if (!value) return
                  if (customTriggers.includes(value)) return
                  const nextCustom = [...customTriggers, value]
                  updateTriggers(nextCustom, selectedTriggers)
                  setNewTrigger('')
                }}
              >
                {t('crisis_add_item')}
              </button>
            </div>

            <div className="space-y-1">
              {customTriggers.length === 0 ? (
                <div className="app-text-muted text-xs">
                  {t('crisis_no_custom_triggers')}
                </div>
              ) : (
                customTriggers.map((trigger, idx) => (
                  <div
                    key={`${trigger}-${idx}`}
                    className="app-card flex items-center gap-2 rounded-lg border px-2 py-2"
                  >
                    <input
                      value={trigger}
                      onChange={(e) => {
                        const value = e.target.value
                        const prev = customTriggers[idx]
                        const nextCustom = customTriggers.map((item, i) =>
                          i === idx ? value : item,
                        )
                        const nextSelected = selectedTriggers.map((item) =>
                          item === prev ? value : item,
                        )
                        updateTriggers(nextCustom, nextSelected)
                      }}
                      className="app-input h-9 flex-1 rounded-lg border px-2 text-sm"
                    />
                    <button
                      type="button"
                      className="app-input app-hover rounded-lg border px-2 py-2 text-xs font-semibold"
                      onClick={() => {
                        const target = customTriggers[idx]
                        const nextCustom = customTriggers.filter((_, i) => i !== idx)
                        const nextSelected = selectedTriggers.filter(
                          (item) => item !== target,
                        )
                        updateTriggers(nextCustom, nextSelected)
                      }}
                    >
                      {t('crisis_delete')}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-lg border app-border p-2">
            <div className="text-xs font-semibold uppercase app-text-muted">
              {t('crisis_avoid_list_title')}
            </div>
            {triggerAvoidList.length === 0 ? (
              <div className="app-text-muted mt-1 text-xs">
                {t('crisis_avoid_list_hint')}
              </div>
            ) : (
              <ul className="mt-2 space-y-1">
                {triggerAvoidList.map((item, idx) => (
                  <li key={`${item}-${idx}`} className="text-sm">
                    - {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div> : null}
      </div>

      <div className="app-card rounded-xl border p-4">
        <button
          type="button"
          onClick={() => setIsSupportOpen((v) => !v)}
          className="flex w-full items-center justify-between text-left"
        >
          <h2 className="text-sm font-semibold">{t('crisis_support_title')}</h2>
          <span className="app-text-muted text-xs">
            {isSupportOpen ? t('collapse') : t('expand')}
          </span>
        </button>
        <p className="app-text-muted mt-1 text-xs">
          {t('crisis_support_hint')}
        </p>

        {!isSupportOpen && supportList.length > 0 ? (
          <div className="mt-3 rounded-lg border app-border p-2">
            <div className="text-xs font-semibold uppercase app-text-muted">
              {t('selected')}
            </div>
            <ul className="mt-1 space-y-1">
              {supportList.map((item, idx) => (
                <li key={`${item}-${idx}`} className="text-sm">
                  - {item}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {isSupportOpen ? (
          <div className="mt-3 space-y-3">
            <div className="space-y-2">
              <div className="text-xs font-semibold uppercase app-text-muted">
                {t('quick_list')}
              </div>
              <div className="space-y-1">
                {quickPositive.map((item) => {
                  const checked = positiveTriggers.includes(item)
                  return (
                    <label
                      key={item}
                      className="app-card flex items-center gap-2 rounded-lg border px-2 py-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {
                          const nextPositive = checked
                            ? positiveTriggers.filter((v) => v !== item)
                            : [...positiveTriggers, item]
                          updateSupport(nextPositive, customPositive, reasonsToLive)
                        }}
                        className="h-4 w-4 accent-[var(--accent)]"
                      />
                      <span>{item}</span>
                    </label>
                  )
                })}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold uppercase app-text-muted">
                {t('crisis_custom_support')}
              </div>
              <div className="flex gap-2">
                <input
                  value={newPositive}
                  onChange={(e) => setNewPositive(e.target.value)}
                  className="app-input h-10 flex-1 rounded-xl border px-3 text-sm"
                  placeholder={t('crisis_support_add_placeholder')}
                />
                <button
                  type="button"
                  className="app-accent rounded-xl px-3 py-2 text-xs font-semibold"
                  onClick={() => {
                    const value = newPositive.trim()
                    if (!value || customPositive.includes(value)) return
                    const nextCustomPositive = [...customPositive, value]
                    updateSupport(
                      positiveTriggers,
                      nextCustomPositive,
                      reasonsToLive,
                    )
                    setNewPositive('')
                  }}
                >
                  {t('crisis_add_item')}
                </button>
              </div>

              <div className="space-y-1">
                {customPositive.length === 0 ? (
                  <div className="app-text-muted text-xs">
                    {t('crisis_no_custom_support')}
                  </div>
                ) : (
                  customPositive.map((item, idx) => (
                    <div
                      key={`${item}-${idx}`}
                      className="app-card flex items-center gap-2 rounded-lg border px-2 py-2"
                    >
                      <input
                        value={item}
                        onChange={(e) => {
                          const value = e.target.value
                          const nextCustomPositive = customPositive.map((v, i) =>
                            i === idx ? value : v,
                          )
                          updateSupport(
                            positiveTriggers,
                            nextCustomPositive,
                            reasonsToLive,
                          )
                        }}
                        className="app-input h-9 flex-1 rounded-lg border px-2 text-sm"
                      />
                      <button
                        type="button"
                        className="app-input app-hover rounded-lg border px-2 py-2 text-xs font-semibold"
                        onClick={() => {
                          const nextCustomPositive = customPositive.filter(
                            (_, i) => i !== idx,
                          )
                          updateSupport(
                            positiveTriggers,
                            nextCustomPositive,
                            reasonsToLive,
                          )
                        }}
                      >
                        {t('crisis_delete')}
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-lg border app-border p-2">
              <div className="text-xs font-semibold uppercase app-text-muted">
                {t('crisis_support_list_title')}
              </div>
              {supportList.length === 0 ? (
                <div className="app-text-muted mt-1 text-xs">
                  {t('crisis_support_list_hint')}
                </div>
              ) : (
                <ul className="mt-2 space-y-1">
                  {supportList.map((item, idx) => (
                    <li key={`${item}-${idx}`} className="text-sm">
                      - {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ) : null}
      </div>

      <div className="app-card rounded-xl border p-4">
        <button
          type="button"
          onClick={() => setIsReasonsOpen((v) => !v)}
          className="flex w-full items-center justify-between text-left"
        >
          <h2 className="text-sm font-semibold">{t('crisis_reasons_title')}</h2>
          <span className="app-text-muted text-xs">
            {isReasonsOpen ? t('collapse') : t('expand')}
          </span>
        </button>
        <p className="app-text-muted mt-1 text-xs">
          {t('crisis_reasons_hint')}
        </p>

        {!isReasonsOpen && reasonsToLive.length > 0 ? (
          <div className="mt-3 rounded-lg border app-border p-2">
            <div className="text-xs font-semibold uppercase app-text-muted">
              {t('selected')}
            </div>
            <ul className="mt-1 space-y-1">
              {reasonsToLive.map((item, idx) => (
                <li key={`${item}-${idx}`} className="text-sm">
                  - {item}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {isReasonsOpen ? (
          <div className="mt-3 space-y-3">
            <div className="space-y-1">
              {quickReasons.map((item) => {
                const checked = reasonsToLive.includes(item)
                return (
                  <label
                    key={item}
                    className="app-card flex items-center gap-2 rounded-lg border px-2 py-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {
                        const nextReasons = checked
                          ? reasonsToLive.filter((v) => v !== item)
                          : [...reasonsToLive, item]
                        updateSupport(positiveTriggers, customPositive, nextReasons)
                      }}
                      className="h-4 w-4 accent-[var(--accent)]"
                    />
                    <span>{item}</span>
                  </label>
                )
              })}
            </div>

            <div className="flex gap-2">
              <input
                value={newReason}
                onChange={(e) => setNewReason(e.target.value)}
                className="app-input h-10 flex-1 rounded-xl border px-3 text-sm"
                placeholder={t('crisis_reason_add_placeholder')}
              />
              <button
                type="button"
                className="app-accent rounded-xl px-3 py-2 text-xs font-semibold"
                onClick={() => {
                  const value = newReason.trim()
                  if (!value || reasonsToLive.includes(value)) return
                  const nextReasons = [...reasonsToLive, value]
                  updateSupport(positiveTriggers, customPositive, nextReasons)
                  setNewReason('')
                }}
              >
                {t('crisis_add_item')}
              </button>
            </div>

            <div className="space-y-1">
              {reasonsToLive.length === 0 ? (
                <div className="app-text-muted text-xs">
                  {t('crisis_reasons_empty')}
                </div>
              ) : (
                reasonsToLive.map((item, idx) => (
                  <div
                    key={`${item}-${idx}`}
                    className="app-card flex items-center gap-2 rounded-lg border px-2 py-2"
                  >
                    <input
                      value={item}
                      onChange={(e) => {
                        const value = e.target.value
                        const nextReasons = reasonsToLive.map((v, i) =>
                          i === idx ? value : v,
                        )
                        updateSupport(positiveTriggers, customPositive, nextReasons)
                      }}
                      className="app-input h-9 flex-1 rounded-lg border px-2 text-sm"
                    />
                    <button
                      type="button"
                      className="app-input app-hover rounded-lg border px-2 py-2 text-xs font-semibold"
                      onClick={() => {
                        const nextReasons = reasonsToLive.filter((_, i) => i !== idx)
                        updateSupport(positiveTriggers, customPositive, nextReasons)
                      }}
                    >
                      {t('crisis_delete')}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : null}
      </div>

      <div className="space-y-2">
        <button
          type="button"
          onClick={() => setIsContactsOpen((v) => !v)}
          className="flex w-full items-center justify-between text-left"
        >
          <h2 className="text-sm font-semibold">{t('crisis_contacts')}</h2>
          <span className="app-text-muted text-xs">
            {isContactsOpen ? t('collapse') : t('expand')}
          </span>
        </button>

        {!isContactsOpen && contacts.length > 0 ? (
          <div className="rounded-lg border app-border p-2">
            <div className="app-text-muted text-xs">
              {t('crisis_contacts_saved')}: {contacts.length}
            </div>
          </div>
        ) : null}

        {isContactsOpen ? (
          <>
        <div className="app-card rounded-xl border p-3">
          <div className="grid grid-cols-1 gap-2">
            <input
              value={draft.name}
              onChange={(e) => setDraft((s) => ({ ...s, name: e.target.value }))}
              className="app-input h-10 rounded-xl border px-3 text-sm"
              placeholder={t('crisis_name_ph')}
            />
            <input
              value={draft.relation}
              onChange={(e) =>
                setDraft((s) => ({ ...s, relation: e.target.value }))
              }
              className="app-input h-10 rounded-xl border px-3 text-sm"
              placeholder={t('crisis_relation_ph')}
            />
            <input
              value={draft.phone}
              onChange={(e) =>
                setDraft((s) => ({ ...s, phone: e.target.value }))
              }
              className="app-input h-10 rounded-xl border px-3 text-sm"
              placeholder={t('crisis_phone_ph')}
              inputMode="tel"
            />
            <input
              value={draft.note}
              onChange={(e) => setDraft((s) => ({ ...s, note: e.target.value }))}
              className="app-input h-10 rounded-xl border px-3 text-sm"
              placeholder={t('crisis_note_ph')}
            />
          </div>
          <div className="mt-3 flex justify-end">
            <button
              type="button"
              disabled={!canAdd}
              onClick={() => {
                const next = [
                  ...contacts,
                  {
                    name: draft.name.trim(),
                    relation: draft.relation.trim(),
                    phone: draft.phone.trim(),
                    note: draft.note.trim(),
                  },
                ]
                setContacts(next)
                saveContacts(next)
                setDraft({ name: '', relation: '', phone: '', note: '' })
              }}
              className={[
                'rounded-xl px-3 py-2 text-sm font-semibold',
                canAdd
                  ? 'app-accent'
                  : 'app-input opacity-70',
              ].join(' ')}
            >
              {t('crisis_add')}
            </button>
          </div>
        </div>

        <ul className="space-y-2">
          {contacts.length === 0 ? (
            <li className="app-card app-text-muted rounded-xl border p-3 text-sm">
              {t('crisis_no_contacts')}
            </li>
          ) : null}

          {contacts.map((c, idx) => (
            <li
              key={`${c.name}-${c.phone}-${idx}`}
              className="app-card rounded-xl border p-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">
                    {c.name || '—'}
                  </div>
                  <div className="app-text-muted text-xs">
                    {c.relation || ''}
                  </div>
                  {c.note ? (
                    <div className="app-text-muted mt-1 text-xs">
                      {c.note}
                    </div>
                  ) : null}
                </div>
                {c.phone ? (
                  <div className="flex shrink-0 items-center gap-2">
                    <a
                      className="app-accent rounded-lg px-3 py-2 text-xs font-semibold"
                      href={`tel:${c.phone}`}
                    >
                      {t('crisis_call')}
                    </a>
                    <button
                      type="button"
                      className="app-input app-hover rounded-lg border px-3 py-2 text-xs font-semibold"
                      onClick={() => {
                        const next = contacts.filter((_, i) => i !== idx)
                        setContacts(next)
                        saveContacts(next)
                      }}
                    >
                      {t('crisis_delete')}
                    </button>
                  </div>
                ) : (
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="app-input app-text-muted rounded-lg border px-3 py-2 text-xs">
                      {t('crisis_no_phone')}
                    </span>
                    <button
                      type="button"
                      className="app-input app-hover rounded-lg border px-3 py-2 text-xs font-semibold"
                      onClick={() => {
                        const next = contacts.filter((_, i) => i !== idx)
                        setContacts(next)
                        saveContacts(next)
                      }}
                    >
                      {t('crisis_delete')}
                    </button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
          </>
        ) : null}
      </div>
    </div>
  )
}

