import { DataSource } from 'typeorm';
import { User, Club, Activity, Message } from './entities'


const db = new DataSource({
    type: "mysql",
    synchronize: true,
    database: "student-club",
    entities: [User, Club, Activity,Message],
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'zzxcxy666'
})
let dataSource: DataSource = null as any
export const getDataSource = async () => {
    if (!dataSource) {
        dataSource = await db.initialize()
    }
    return dataSource
}