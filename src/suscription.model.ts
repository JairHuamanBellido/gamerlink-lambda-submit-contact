type Suscription = {
    id: string;
    name: string;
    email:string;
}

type DynamoSuscription = {
    id: {
        S: string
    },
    name: {
        S: string
    },
    email: {
        S: string
    },
}

export { Suscription, DynamoSuscription }