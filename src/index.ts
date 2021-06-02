import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: "Saludos desde el API Gateway",
    }),
  };

  if (event.httpMethod === "GET") {
    return response;
  }
};
