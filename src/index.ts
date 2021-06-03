import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

const dynamodb = new DynamoDB({
  apiVersion: '2012-08-10',
});

const table = "suscriptions"

const createSuscription = async (name: string) => {
  return await dynamodb.putItem({
    TableName: table,
    Item: {
      ["name"]: { S: name },
      ["id"]: { N: uuidv4() }
    },
  }).promise()
}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {

  return await createSuscription("olvid")
    .then(() => ({ statusCode: 200, body: JSON.stringify({ "correcta": "prueba" }) }))
    .catch(e => ({ statusCode: 400, body: JSON.stringify({ "error": e }) }))

};



