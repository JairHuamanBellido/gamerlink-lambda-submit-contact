import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import { DynamoSuscription, Suscription } from "./suscription.model";

const dynamodb = new DynamoDB({
  apiVersion: '2012-08-10',
});

const table = "suscriptions"

const createSuscription = async (name: string, email: string) => {
  return await dynamodb.putItem({
    TableName: table,
    Item: {
      ["name"]: { S: name },
      ["email"]: { S: email },
      ["id"]: { S: uuidv4() }
    },
  }).promise()
}


const getSuscriptions = async () => {
  return await dynamodb.scan({ TableName: table }).promise()
}

const parseSuscriptionModel = (suscriptionDynamoModel: DynamoSuscription[]) => {
  let suscriptions: Suscription[] = [];

  suscriptionDynamoModel.forEach(sd => {
    suscriptions.push({ id: sd.id.S, name: sd.name.S, email: sd.email.S })
  })

  return suscriptions;
}

export const handler = async (event: any, context: any, callback: any) => {

  if (event.httpMethod === "GET") {

    context.succeed({
      "statusCode": 200,
      "headers": {
        "X-Requested-With": '*',
        "Access-Control-Allow-Headers": 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,x-requested-with',
        "Access-Control-Allow-Origin": '*',
        "Access-Control-Allow-Methods": 'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT'
      },
      "body": await getSuscriptions().then(e => JSON.stringify(parseSuscriptionModel(e.Items as DynamoSuscription[])))
    })

  }
  else if (event.httpMethod === "POST") {
    try {
      const body = event.body

      let name = (JSON.parse(body).name) as string;
      let email = (JSON.parse(body).email) as string;

      await createSuscription(name, email)
      context.succeed({
        "statusCode": 200,
        "headers": {
          "X-Requested-With": '*',
          "Access-Control-Allow-Headers": 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,x-requested-with',
          "Access-Control-Allow-Origin": '*',
          "Access-Control-Allow-Methods": 'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT'
        },
        "body": JSON.stringify({ "message": "suscripción creada" })
      })
    } catch (error) {
      console.error(error)
    }
  }
};



