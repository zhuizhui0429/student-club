// import { DataSource } from 'typeorm';
// import { User } from './entities'


// const db = new DataSource({
//     type: "mysql",
//     synchronize: true,
//     database: "studentClub",
//     entities: [User],
//     host: 'localhost',
//     port: 3306,
//     username: 'root',
//     password: 'zzxcxy666'
// })
// let dataSource: DataSource = null as any
// export const getDataSource = async () => {
//     if (!dataSource) {
//         dataSource = await db.initialize()
//     }
//     return dataSource
// }