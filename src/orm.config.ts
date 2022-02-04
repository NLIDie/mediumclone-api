import { ConnectionOptions } from 'typeorm'

const config: ConnectionOptions = {
  type: 'postgres',
  host: 'db',
  port: 5432,
  username: 'mediumuser',
  password: 'pgmediumpass',
  database: 'mediumdb',
  entities: [__dirname + '/**/*.entity.{ts,js}'],
  synchronize: false,
  migrations: [__dirname + '/migrations/**/*.{ts,js}'],
  cli: {
    migrationsDir: 'src/migrations',
  },
}

export default config
