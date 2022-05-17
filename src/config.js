const config = {

  MAX_ATTACHMENT_SIZE: 1000000,
    // Backend config
    s3: {
      REGION: "ap-southeast-1",
      BUCKET: "",
    },
    apiGateway: {
      REGION: "ap-southeast-1",
      URL: "https://7l9vtrvo83.execute-api.ap-southeast-1.amazonaws.com/dev",
    },
    cognito: {
      REGION: "ap-southeast-1",
      USER_POOL_ID: "ap-southeast-1_i4OCg2NEs",
      APP_CLIENT_ID: "3890qq2hnvbmqesljkrv3ae5t2",
      IDENTITY_POOL_ID: "ap-southeast-1:0e93681e-0a56-43b2-87b7-6edeaab6e97f",
    },
  };
  
  export default config;