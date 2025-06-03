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
import { AppointmentStatus } from '../../enums';

export class DynamoDBAdapter implements GetAllById, Save, Update {
    private client: DynamoDBClient;
    private tableName: string;
    public readonly name = 'DynamoDB';

    constructor(tableName: string, region: string = 'us-east-2') {
        this.client = new DynamoDBClient({ region });
        this.tableName = tableName;
    }
    toString() {
        return this.name;
    }

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

    async update(fields: Record<string, string>, keys: Record<string, string>): Promise<boolean> {
        const updateExpression = Object.entries(fields)
            .map(([key, value]) => `${key} = :${key}`)
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
