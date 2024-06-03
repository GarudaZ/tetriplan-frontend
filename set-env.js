const fs = require("fs");
const targetPath = "./src/app/environments/environment.ts";

console.log("HUGGING_FACE_API_TOKEN:", process.env.HUGGING_FACE_API_TOKEN);
console.log("FIREBASE_API_KEY:", process.env.FIREBASE_API_KEY);

const envConfigFile = `export const environment = {
  production: ${process.env.NODE_ENV === "production"},
  huggingFaceApiToken: '${process.env.HUGGING_FACE_API_TOKEN || ""}',
  firebase: {
    apiKey: '${process.env.FIREBASE_API_KEY || ""}',
    authDomain: '${process.env.FIREBASE_AUTH_DOMAIN || ""}',
    projectId: '${process.env.FIREBASE_PROJECT_ID || ""}',
    storageBucket: '${process.env.FIREBASE_STORAGE_BUCKET || ""}',
    messagingSenderId: '${process.env.FIREBASE_MESSAGING_SENDER_ID || ""}',
    appId: '${process.env.FIREBASE_APP_ID || ""}'
  }
};
`;

fs.writeFile(targetPath, envConfigFile, function (err) {
  if (err) {
    console.log(err);
  }
  console.log(`Output generated at ${targetPath}`);
});
