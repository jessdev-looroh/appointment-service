/**
 * DynamoDB adapter class that implements GetAllById, Save and Update interfaces
 * Provides methods to interact with DynamoDB tables for basic CRUD operations
 */
import {
    AttributeValue,
    DynamoDBClient,
    PutItemCommand,
    PutItemCommandInput,
    QueryCommand,
    UpdateItemCommand,
} from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { GetAllById, Save, Update } from '../../interfaces';

/**
 * Class that provides an adapter pattern implementation for DynamoDB operations
 * @implements {GetAllById}
 * @implements {Save}
 * @implements {Update}
 */
export class DynamoDBAdapter implements GetAllById, Save, Update {
    private client: DynamoDBClient;
    private tableName: string;
    public readonly name = 'DynamoDB';

    /**
     * Creates a new DynamoDB adapter instance
     * @param {string} tableName - The name of the DynamoDB table
     * @param {string} region - AWS region where the table is located (defaults to us-east-2)
     */
    constructor(tableName: string, region: string = 'us-east-2') {
        this.client = new DynamoDBClient({ region });
        this.tableName = tableName;
    }

    /**
     * Returns the name of the adapter
     * @returns {string} The adapter name
     */
    toString() {
        return this.name;
    }

    /**
     * Saves an item to DynamoDB
     * @param {Record<string, any>} data - The data to save
     * @param {string} [conditionExpression] - Optional condition expression for the save operation
     * @returns {Promise<boolean>} True if save was successful
     */
    async save(data: Record<string, any>, conditionExpression?: string): Promise<boolean> {
        const item = this.convertToAttributeValue(data);
        const input: PutItemCommandInput = {
            TableName: this.tableName,
            Item: item,
        };
        if (conditionExpression) {
            input.ConditionExpression = conditionExpression;
        }
        const command = new PutItemCommand(input);

        const resp = await this.client.send(command);
        return resp.$metadata.httpStatusCode == 200;
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
        const command = new QueryCommand({
            TableName: this.tableName,
            KeyConditionExpression: `${field} = :${field}`,
            ExpressionAttributeValues: {
                [`:${field}`]: { S: `${id}` },
            },
        });

        const result = await this.client.send(command);

        const data = result.Count
            ? result.Items?.map((item) => {
                  const newItem = unmarshall(item);
                  for (const item of deleteItems) {
                      delete newItem[item];
                  }
                  return newItem;
              })
            : [];
        return data as K[];
    }

    /**
     * Converts a JavaScript object to DynamoDB AttributeValue format
     * @param {Record<string, any>} record - The record to convert
     * @param {string} initialKey - Optional prefix for the keys
     * @returns {Record<string, AttributeValue>} DynamoDB formatted attributes
     * @private
     */
    private convertToAttributeValue(
        record: Record<string, any>,
        initialKey: string = '',
    ): Record<string, AttributeValue> {
        return Object.entries(record)
            .map(([key, value]) => {
                const typeValue = typeof value === 'string' ? 'S' : 'N';
                return {
                    [`${initialKey}${key}`]: { [typeValue]: value.toString() } as AttributeValue,
                };
            })
            .reduce((accumulator, currentObject) => ({ ...accumulator, ...currentObject }), {});
    }

    /**
     * Updates an item in DynamoDB
     * @param {Record<string, string>} fields - The fields to update
     * @param {Record<string, string>} keys - The key attributes to identify the item
     * @returns {Promise<boolean>} True if update was successful
     */
    async update(fields: Record<string, string>, keys: Record<string, string>): Promise<boolean> {
        const updateExpression = Object.entries(fields)
            .map(([key]) => `${key} = :${key}`)
            .join(' AND ');

        const keysParse = this.convertToAttributeValue(keys);
        const expressionAttributeValues = this.convertToAttributeValue(fields, ':');

        const command = new UpdateItemCommand({
            TableName: this.tableName,
            Key: keysParse,
            UpdateExpression: `SET ${updateExpression}`,
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: 'ALL_NEW',
        });

        console.log({
            command: JSON.stringify({
                table: this.tableName,
                Key: keysParse,
                UpdateExpression: updateExpression,
                ExpressionAttributeValues: expressionAttributeValues,
            }),
        });

        const result = await this.client.send(command);
        return result.$metadata.httpStatusCode === 200;
    }
}
