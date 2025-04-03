import { readFileSync } from 'fs'
import { resolve } from 'path'
import { pool } from './connection'

async function migrate() {
  try {
    console.log('🗄️  Executando migrações...')

    const sql = readFileSync(resolve(__dirname, 'migrations.sql'), 'utf8')
    const statements = sql.split(';').filter(Boolean)

    for (const statement of statements) {
      await pool.execute(statement)
    }

    console.log('✅ Migrações executadas com sucesso!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Erro ao executar migrações:', error)
    process.exit(1)
  }
}

migrate() 