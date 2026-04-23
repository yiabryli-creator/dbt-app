import { openDB } from 'idb'

const DB_NAME = 'dbt-skills'
const DB_VERSION = 1
const STORE = 'entries'

function createEmptyEntry(date) {
  return {
    date,
    dayLevel: 0,
    skills: {},
    skillLevels: {},
    notes: '',
  }
}

export async function getDb() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'date' })
      }
    },
  })
}

export async function getEntry(date) {
  const db = await getDb()
  const entry = await db.get(STORE, date)
  return entry ?? createEmptyEntry(date)
}

export async function putEntry(entry) {
  const db = await getDb()
  await db.put(STORE, entry)
}

export async function getAllEntries() {
  const db = await getDb()
  const all = await db.getAll(STORE)
  return all.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))
}

