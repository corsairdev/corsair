import { Pool } from 'pg'
import { existsSync, readdirSync, readFileSync, rmSync } from 'fs'
import { resolve, join } from 'path'
import { loadConfig, loadEnv, checkDatabaseUrl } from './config.js'

export async function migrate() {
  const cfg = loadConfig()
  checkDatabaseUrl(cfg.connection)

  console.log(
    '🔍 Running migration in a transaction (will rollback on error)...\n'
  )

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  })

  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    const sqlPath = resolve(process.cwd(), 'corsair/sql')

    if (!existsSync(sqlPath)) {
      console.log(`❌ No migration files found in ${sqlPath}`)
      await client.query('ROLLBACK')
      client.release()
      await pool.end()
      process.exit(1)
    }

    const files = readdirSync(sqlPath)
    const sqlFiles = files
      .filter(file => file.endsWith('.sql'))
      .sort()
      .map(file => join(sqlPath, file))

    if (sqlFiles.length === 0) {
      console.log(`❌ No migration files found in ${sqlPath}`)
      await client.query('ROLLBACK')
      client.release()
      await pool.end()
      process.exit(1)
    }

    for (const file of sqlFiles) {
      const migrationSQL = readFileSync(file, 'utf-8')
      const fileName = file.split('/').pop()

      try {
        await client.query(migrationSQL)
        console.log(`✅ ${fileName} - Done\n`)
      } catch (error: any) {
        console.log(`❌ ${fileName} - ERROR:\n`)
        console.error(`   ${error.message}\n`)
        await client.query('ROLLBACK')
        console.log('🚨 Migration failed!')
        client.release()
        await pool.end()
        process.exit(1)
      }
    }

    await client.query('COMMIT')
    console.log('✨ Migration completed!')

    // Clean up SQL files after successful migration
    rmSync(sqlPath, { recursive: true, force: true })
    console.log('🧹 Cleaned up migration files\n')

    client.release()
    await pool.end()
  } catch (error: any) {
    console.error('❌ Unexpected error:', error)
    try {
      await client.query('ROLLBACK')
    } catch (rollbackError) {
      // Ignore rollback errors
    }
    client.release()
    await pool.end()
    process.exit(1)
  }
}
