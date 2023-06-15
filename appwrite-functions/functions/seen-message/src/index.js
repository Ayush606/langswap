const sdk = require("node-appwrite");
const { ID } = require('node-appwrite');

/*
  'req' variable has:
    'headers' - object with request headers
    'payload' - request body data as a string
    'variables' - object with function variables

  'res' variable has:
    'send(text, status)' - function to return text response. Status code defaults to 200
    'json(obj, status)' - function to return JSON response. Status code defaults to 200

  If an error is thrown, a response with code 500 will be returned.
*/

module.exports = async function (req, res) {
  const client = new sdk.Client();

  // You can remove services you don't use
  const database = new sdk.Databases(client);

  if (
    !req.variables['APPWRITE_FUNCTION_ENDPOINT'] ||
    !req.variables['APPWRITE_FUNCTION_API_KEY']
  ) {
    console.log("Environment variables are not set. Function cannot use Appwrite SDK.");
  } else {
    client
      .setEndpoint(req.variables['APPWRITE_FUNCTION_ENDPOINT'])
      .setProject(req.variables['APPWRITE_FUNCTION_PROJECT_ID'])
      .setKey(req.variables['APPWRITE_FUNCTION_API_KEY'])
      .setSelfSigned(true);
  }

  //getting database id from event variable

  const databaseId = req.variables['APPWRITE_FUNCTION_DATABASE_ID'];

  // getting collection id from event variable

  const collectionId = req.variables['APPWRITE_FUNCTION_CHAT_COLLECTION_ID'];

  // getting userProfile id from event variable

  const userProfileId = req.variables['APPWRITE_FUNCTION_USER_PROFILE_COLLECTION_ID'];

  // getting notification id from event variable

  const notificationId = req.variables['APPWRITE_FUNCTION_NOTIFICATION_COLLECTION_ID'];

  // getting user id from event data
  const userId = req.variables['APPWRITE_FUNCTION_USER_ID'];

  // getting CHAT_ID from event data

  const chatId = req.variables['APPWRITE_FUNCTION_DATA'];

  //updating seen message
  database.updateDocument(databaseId, collectionId, chatId, {
    seen: true,
  }).then((response) => {
    res.json({
      status: "success",
      data: response,
    });
  })
    .catch((error) => {
      res.json({
        status: "error",
        data: error,
      });
    });

};
