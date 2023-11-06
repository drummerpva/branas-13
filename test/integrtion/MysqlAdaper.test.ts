import { test, expect } from 'vitest'
import { MysqlAdpter } from '../../src/infra/databaase/MysqlAdapter'

test('Deve fazer uma query no banco de dados', async () => {
  const mysqlAdapter = new MysqlAdpter()
  const rows = await mysqlAdapter.query('SELECT * FROM account limit 1', [])
  await mysqlAdapter.close()
  expect(rows.length).toBe(1)
})
