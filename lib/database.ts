import { Pool } from "pg"

const globalForDatabase = globalThis as typeof globalThis & {
  coomiDatabasePool?: Pool
}

export function database() {
  const connectionString = process.env.NETLIFY_DB_URL

  if (!connectionString) {
    throw new Error("NETLIFY_DB_URL is not configured")
  }

  globalForDatabase.coomiDatabasePool ??= new Pool({
    connectionString,
    max: 5,
  })

  return globalForDatabase.coomiDatabasePool
}
