import { UnitOfWork } from '../../src/infra/databaase/UnitOfWork'

test('Deve testar o Unit of Work', async () => {
  const connection = new UnitOfWork()
  await connection.query('INSERT INTO unit_of_work(id) values(?)', ['a'], true)
  await connection.query('INSERT INTO unit_of_work(id) values(?)', ['a'], true)
  await connection.execute()
  await connection.close()
})
