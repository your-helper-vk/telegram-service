import { typeormConfig } from '@config/typeorm.config';
import { DataSource } from 'typeorm';

const dataSource = new DataSource(typeormConfig)

export default dataSource;