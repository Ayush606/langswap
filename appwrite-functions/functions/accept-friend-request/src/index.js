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

  // getting userProfile id from event variable

  const userProfileId = req.variables['APPWRITE_FUNCTION_USER_PROFILE_COLLECTION_ID'];

  // getting notification id from event variable

  const notificationId = req.variables['APPWRITE_FUNCTION_NOTIFICATION_COLLECTION_ID'];

  // getting user id from event data
  const userId = req.variables['APPWRITE_FUNCTION_USER_ID'];

  // getting friend id from event data

  const friendId = req.variables['APPWRITE_FUNCTION_DATA'];

  // checking if the friend request exists

  // getting the user's name and profile picture from users collection
  const user = await database.getDocument(databaseId, userProfileId, userId);

  const check = await database.listDocuments(
    databaseId,
    collectionId,
    [
      sdk.Query.equal('sender', friendId),
      sdk.Query.equal('receiver', userId),
    ]
  );

  if (check.documents.length > 0 && check.documents[0].status == "pending") {
    // updating the friend request status to accepted
    database.updateDocument(databaseId, collectionId, check.documents[0].$id, {
      status: "accepted",
    })
      .then(() => {

        // creating a notification for the user
        // creating a document in notifications collection
        database.createDocument(
          databaseId,
          notificationId,
          ID.unique(),
          {
            userId: friendId,
            type: 'friend_request',
            content: 'has accepted your friend request.',
            read: false,
            senderId: userId,
            senderPic: user.profilePic,
            senderName: user.name
          },
          [
            sdk.Permission.read(
              sdk.Role.user(friendId)
            )
          ]
        ).then((res) => {
          console.log(res);
        }).catch((error) => {
          console.log(error);
        });

        // sending response to the client
        res.json({
          status: "success",
        });

      })
      .catch((error) => {
        // sending error to the client
        res.json({
          status: "error",
          message: error,
        });

      });
  }

};
