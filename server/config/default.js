module.exports = {
    "auth0": {
        "domain": process.env.AUTH0_DOMAIN,
        "audience": process.env.AUTH0_AUDIENCE,
        "clientId": process.env.AUTH0_CLIENT_ID
    },
    "aws": {
        "region": process.env.AWS_REGION || "us-east-1",
        "accessKeyId": process.env.AWS_ACCESS_KEY_ID,
        "secretAccessKey": process.env.AWS_SECRET_ACCESS_KEY
    },
    "dynamoDBTables": {
        "posts": "thankful-wall-posts"
    }
};