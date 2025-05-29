// import mysql from "serverless-mysql";
// import { DatabaseAdapter } from "./DatabaseAdapter";

// export class MySQLAdapter implements DatabaseAdapter {
//   private db: ReturnType<typeof mysql>;
//   private tableName: string;

//   constructor(config: { host: string; user: string; password: string; database: string }, tableName: string) {
//     this.db = mysql({
//       config: {
//         host: config.host,
//         user: config.user,
//         password: config.password,
//         database: config.database,
//       }
//     });
//     this.tableName = tableName;
//   }

//   async getAllByInsuredId<T>(insuredId: string): Promise<T[] | null> {
//     try {
//       const results = await this.db.query<T[]>(`SELECT * FROM \`${this.tableName}\` WHERE insuredId = ?`, [insuredId]);
//       await this.db.end(); // cerrar conexión
//       return results.length ? results : null;
//     } catch (error) {
//       console.error("MySQL getAllByInsuredId error:", error);
//       return null;
//     }
//   }

//   async save<T>(data: T): Promise<boolean> {
//     try {
//       const result = await this.db.query(`INSERT INTO \`${this.tableName}\` SET ?`, data);
//       await this.db.end(); // cerrar conexión

//       // result puede tener affectedRows (depende de mysql2/serverless-mysql)
//       return (result as any).affectedRows === 1;
//     } catch (error) {
//       console.error("MySQL save error:", error);
//       return false;
//     }
//   }
// }
