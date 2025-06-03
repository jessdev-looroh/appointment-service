import { getAppointmentsByInsuredIdHandler } from '../app';

describe('testing app', () => {
    test('hola mundo test', async () => {
        await getAppointmentsByInsuredIdHandler({
            headers: {},
            body: '',
            multiValueHeaders: {},
            httpMethod: '',
            isBase64Encoded: false,
            path: 'null',
            multiValueQueryStringParameters: {},
            pathParameters: {},
            queryStringParameters: {},
            requestContext: {} as any,
            resource: '',
            stageVariables: {},
        });
    });
});
