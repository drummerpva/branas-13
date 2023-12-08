import { UnitOfWork } from '../../src/infra/databaase/UnitOfWork'

test.skip('Deve testar o Unit of Work', async () => {
  const connection = new UnitOfWork()
  await connection.query('INSERT INTO unit_of_work(id) values(?)', ['a'], false)
  await connection.query('INSERT INTO unit_of_work(id) values(?)', ['b'], false)
  await connection.execute()
  await connection.close()
})
