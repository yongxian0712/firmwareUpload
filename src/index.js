import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import { Amplify } from 'aws-amplify';
import config from './config';

Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: config.cognito.REGION,
    userPoolId: config.cognito.USER_POOL_ID,
    identityPoolId: config.cognito.IDENTITY_POOL_ID,
    userPoolWebClientId: config.cognito.APP_CLIENT_ID
  },
  API: {
    endpoints: [
      {
        name: "Firmware_CRUD",
        endpoint: config.apiGateway.URL,
        region: config.apiGateway.REGION
      },
    ]
  },
  Storage: {
    AWSS3: {
        bucket: config.s3.BUCKET, //REQUIRED -  Amazon S3 bucket name
        region: config.s3.REGION, //OPTIONAL -  Amazon service region
        identityPoolId: config.cognito.IDENTITY_POOL_ID,
    }
}
});

ReactDOM.render(
  
    <Router>
      <App />
    </Router>
  ,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
