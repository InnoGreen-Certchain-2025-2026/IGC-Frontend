import {
  CognitoUserPool,
  CognitoUser,
} from "amazon-cognito-identity-js";

const poolData = {
  UserPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID || "us-east-1_dummy",
  ClientId: import.meta.env.VITE_COGNITO_CLIENT_ID || "dummyclientid",
};

export const userPool = new CognitoUserPool(poolData);

export const getCognitoUser = (email: string) => {
  return new CognitoUser({
    Username: email.toLowerCase(),
    Pool: userPool,
  });
};
