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

  const collectionId = req.variables['APPWRITE_FUNCTION_COLLECTION_ID'];

  // getting user id from event data
  const userId = req.variables['APPWRITE_FUNCTION_USER_ID'];

  // getting friend id from event data

  const friendId = req.variables['APPWRITE_FUNCTION_DATA'];

  // checking if the user sent the friend request to if yes then cancel the request by deleting the document

  const check = await database.listDocuments(
    databaseId,
    collectionId,
    [
      sdk.Query.equal('sender', userId),
      sdk.Query.equal('receiver', friendId),
    ]
  );

  if (check.documents.length > 0) {
    // deleting the document
    database.deleteDocument(databaseId, collectionId, check.documents[0].$id)
      .then(() => {
        res.json({
          message: "Friend request cancelled",
        });
      })
      .catch((error) => {
        res.json({
          message: error,
        });
      });
  }
  // if the user sent the friend request to if no then check if the user has received the friend request
  // this is for unfriend feature
  else if (check.documents.length === 0) {
    const check2 = await database.listDocuments(
      databaseId,
      collectionId,
      [
        sdk.Query.equal('sender', friendId),
        sdk.Query.equal('receiver', userId),
      ]
    );

    if (check2.documents.length > 0) {
      // deleting the document
      database.deleteDocument(databaseId, collectionId, check2.documents[0].$id)
        .then(() => {
          res.json({
            message: "Un friended successfully",
          });
        })
        .catch((error) => {
          res.json({
            message: error,
          });
        });
    }
    // if the user has not received the friend request then return an error
    else if (check2.documents.length === 0) {
      res.json({
        message: "Friend request not found",
      });
    }
  }



};
