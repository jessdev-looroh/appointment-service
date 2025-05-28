import { DynamoDBClient, PutItemCommand, QueryCommand } from '@aws-sdk/client-dynamodb';
import { StatusCodeEnum } from '../enums/statusCode';
import { StatusTextEnum } from '../enums/statusText';
import { Response } from '../interfaces/response/response';
import { unmarshall } from '@aws-sdk/util-dynamodb';

const ddbClient: DynamoDBClient = new DynamoDBClient({});

const APPOINTMENT_TABLE = process.env.DYNAMO_APPOINTMENT_TABLE_NAME ?? '';

if (!APPOINTMENT_TABLE) {
    throw new Error('DYNAMO_APPOINTMENT_TABLE_NAME is not defined in environment variables');
}

export const listAppointmentsByInsuredId = async (insuredId: string) => {
    let appointmentResponse: Response;
    const command = new QueryCommand({
        TableName: APPOINTMENT_TABLE,
        KeyConditionExpression: 'PK = :pk',
        ExpressionAttributeValues: {
            ':pk': { S: `INSURED#${insuredId}` },
        },
    });

    try {
        const resp = await ddbClient.send(command);
        const wasCreated = resp.$metadata.httpStatusCode == 200;
        console.log(resp.Items);
        console.log(resp.Count);

        const appointmentsList = resp.Count
            ? resp.Items?.map((item) => {
                  const newItem = unmarshall(item);
                  delete newItem.PK;
                  delete newItem.SK;
                  return newItem;
              })
            : [];
        console.log(appointmentsList);
        appointmentResponse = {
            statusCode: wasCreated ? StatusCodeEnum.OK : StatusCodeEnum.INTERNAL,
            statusText: wasCreated ? StatusTextEnum.OK : StatusTextEnum.INTERNAL,
            data: appointmentsList as [],
            error: {},
        };
    } catch (err) {
        console.error('Error (listAppointmentsByInsuredId): ', err);
        appointmentResponse = {
            statusCode: StatusCodeEnum.INTERNAL,
            statusText: StatusTextEnum.INTERNAL,
            data: [],
            error: {
                message: err instanceof Error ? err.message : 'Unknown error',
                stack: err instanceof Error ? err.stack : undefined,
            },
        };
    }
    return appointmentResponse;
};
