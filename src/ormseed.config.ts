import { ConnectionOptions } from 'typeorm'
import ormConfig from './orm.config'

const ormSeedConfig: ConnectionOptions = {
  ...ormConfig,
  migrations: [__dirname + '/seeds/**/*.{ts,js}'],
  cli: {
    migrationsDir: 'src/seeds',
  },
}

export default ormSeedConfig
