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

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {

  if (event.httpMethod === "GET") {
    return await getSuscriptions()
      .then((d) => ({ statusCode: 200, body: JSON.stringify(parseSuscriptionModel(d.Items as DynamoSuscription[])) }))
      .catch(e => ({ statusCode: 400, body: JSON.stringify({ "error": e }) }))
  }
  else if (event.httpMethod === "POST") {
    const body = event.body
    
    let name = (JSON.parse(body).name) as string;
    let email = (JSON.parse(body).email) as string;


    return await createSuscription(name, email)
      .then(() => ({ statusCode: 200, body: JSON.stringify({ "message": "Suscription created!" }) }))
      .catch((e) => ({ statusCode: 400, body: JSON.stringify({ "error": e, "message": "No se ha podido realizar la suscripcion" }) }))
  }



};



