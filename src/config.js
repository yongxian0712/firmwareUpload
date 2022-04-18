const config = {

  MAX_ATTACHMENT_SIZE: 1000000,
    // Backend config
    s3: {
      REGION: process.env.REACT_APP_REGION,
      BUCKET: process.env.REACT_APP_BUCKET,
    },
    apiGateway: {
      REGION: "ap-southeast-1",
      URL: "https://7l9vtrvo83.execute-api.ap-southeast-1.amazonaws.com/dev",
    },
    cognito: {
      REGION: "ap-southeast-1",
      USER_POOL_ID: "ap-southeast-1_i4OCg2NEs",
      APP_CLIENT_ID: "3890qq2hnvbmqesljkrv3ae5t2",
      //IDENTITY_POOL_ID: "ap-southeast-1:0640fb3f-dac8-419b-9838-cc02205e5c3a",
    },
  };
  
  export default config;