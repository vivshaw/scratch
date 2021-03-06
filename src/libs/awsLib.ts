import { Storage, Amplify } from "aws-amplify";
import config from "../config";

export function setupAws() {
  Amplify.configure({
    Auth: {
      mandatorySignIn: true,
      region: config.cognito.REGION,
      userPoolId: config.cognito.USER_POOL_ID,
      identityPoolId: config.cognito.IDENTITY_POOL_ID,
      userPoolWebClientId: config.cognito.APP_CLIENT_ID,
    },
    Storage: {
      region: config.s3.REGION,
      bucket: config.s3.BUCKET,
      identityPoolId: config.cognito.IDENTITY_POOL_ID,
    },
    API: {
      endpoints: [
        {
          name: "notes",
          endpoint: config.apiGateway.URL,
          region: config.apiGateway.REGION,
        },
      ],
    },
  });
}

interface awsStorageResult {
  key: string;
}

export async function s3Upload(file: File) {
  const filename = `${Date.now()}-${file.name}`;

  const stored = (await Storage.vault.put(filename, file, {
    contentType: file.type,
  })) as awsStorageResult;

  return stored.key;
}
