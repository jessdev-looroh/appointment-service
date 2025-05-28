import Database from "./Database";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

let ddbClient: DynamoDBClient;
const APPOINTMENT_TABLE = process.env.DYNAMO_PRODUCT_TABLE_NAME ?? '';

class DynamoService extends Database {
  init(): void {
    ddbClient = new DynamoDBClient({});
  }
  close(): void {

  }

  list(): any[] {
    throw new Error("Method not implemented.");
  }
  create(data: any): void {
    throw new Error("Method not implemented.");
  }
}
