import { DatabaseConfig, GetAllById, Save } from '../../interfaces';
import mysql, { ServerlessMysql } from 'serverless-mysql';
import { ResultSetHeader } from 'mysql2';

export class MySQLAdapter implements Save, GetAllById {
    private tableName: string;
    private db: ServerlessMysql;
    public readonly name = 'MySQL';

    constructor(tableName: string, config: DatabaseConfig) {
        this.tableName = tableName;
        this.db = mysql({ config });
    }

    toString() {
        return this.name;
    }

    async getAllById<K>(field: string, id: string, deleteItems: string[] = []): Promise<K[]> {
        const resp: K[] = await this.db.query(`select * from ${this.tableName} where ${field} = ?`, [id]);

        return resp.map((element) => {
            for (const item of deleteItems) {
                delete (element as Record<string, any>)[item];
            }
            return element;
        });
    }

    async save<K>(data: K): Promise<boolean> {
        const result: ResultSetHeader = await this.db.query(`INSERT INTO \`${this.tableName}\` SET ?`, data);
        const wasCreated = result?.affectedRows > 0;
        await this.closeConnection();
        return wasCreated;
    }

    private async closeConnection() {
        await this.db.end();
    }
}
