import { DatabaseConfig, GetAllById, Save } from '../../interfaces';
import mysql, { ServerlessMysql } from 'serverless-mysql';
import { ResultSetHeader } from 'mysql2';

/**
 * Class that provides an adapter pattern implementation for MySQL operations
 * @implements {Save}
 * @implements {GetAllById}
 */
export class MySQLAdapter implements Save, GetAllById {
    private tableName: string;
    private db: ServerlessMysql;
    public readonly name = 'MySQL';

    /**
     * Creates a new MySQL adapter instance
     * @param {string} tableName - The name of the MySQL table
     * @param {DatabaseConfig} config - The database configuration
     */
    constructor(tableName: string, config: DatabaseConfig) {
        this.tableName = tableName;
        this.db = mysql({ config });
    }

    /**
     * Returns the name of the adapter
     * @returns {string} The adapter name
     */
    toString() {
        return this.name;
    }

    /**
     * Retrieves all items by a specific field value
     * @template K - The type of items to return
     * @param {string} field - The field to query by
     * @param {string} id - The value to match
     * @param {string[]} deleteItems - Array of field names to exclude from results
     * @returns {Promise<K[]>} Array of matching items
     */
    async getAllById<K>(field: string, id: string, deleteItems: string[] = []): Promise<K[]> {
        const resp: K[] = await this.db.query(`select * from ${this.tableName} where ${field} = ?`, [id]);

        return resp.map((element) => {
            for (const item of deleteItems) {
                delete (element as Record<string, any>)[item];
            }
            return element;
        });
    }

    /**
     * Saves an item to MySQL
     * @template K - The type of item to save
     * @param {K} data - The data to save
     * @returns {Promise<boolean>} True if save was successful
     */
    async save<K>(data: K): Promise<boolean> {
        const result: ResultSetHeader = await this.db.query(`INSERT INTO \`${this.tableName}\` SET ?`, data);
        const wasCreated = result?.affectedRows > 0;
        await this.closeConnection();
        return wasCreated;
    }

    /**
     * Closes the database connection
     * @returns {Promise<void>}
     * @private
     */
    private async closeConnection() {
        await this.db.end();
    }
}
