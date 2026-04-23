import { useCallback, useEffect, useState } from 'react'
import { getEntry, putEntry } from '../lib/db.js'

export function useEntry(date) {
  const [entry, setEntry] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    getEntry(date)
      .then((e) => {
        if (cancelled) return
        setEntry(e)
        setIsLoading(false)
      })
      .catch(() => {
        if (cancelled) return
        setEntry({
          date,
          dayLevel: 0,
          skills: {},
          skillLevels: {},
          notes: '',
        })
        setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [date])

  const commit = useCallback(async (next) => {
    setEntry(next)
    await putEntry(next)
  }, [])

  const setDayLevel = useCallback(
    async (level) => {
      if (!entry) return
      const next = { ...entry, dayLevel: level }
      await commit(next)
    },
    [commit, entry],
  )

  const toggleSkill = useCallback(
    async (skillId) => {
      if (!entry) return
      const current = !!entry.skills?.[skillId]
      const nextSkills = { ...(entry.skills || {}), [skillId]: !current }
      const next = { ...entry, skills: nextSkills }
      await commit(next)
    },
    [commit, entry],
  )

  const setSkillLevel = useCallback(
    async (skillId, level) => {
      if (!entry) return
      const nextLevels = { ...(entry.skillLevels || {}) }
      if (level === null || level === undefined || level === '') {
        delete nextLevels[skillId]
      } else {
        nextLevels[skillId] = level
      }
      const next = { ...entry, skillLevels: nextLevels }
      await commit(next)
    },
    [commit, entry],
  )

  const setNotes = useCallback(
    async (notes) => {
      if (!entry) return
      const next = { ...entry, notes }
      await commit(next)
    },
    [commit, entry],
  )

  return {
    entry,
    isLoading,
    setDayLevel,
    toggleSkill,
    setSkillLevel,
    setNotes,
    commit,
  }
}

