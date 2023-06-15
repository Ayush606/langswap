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

  // checking if the user already sent a friend request to the friend

  const check = await database.listDocuments(
    databaseId,
    collectionId,
    [
      sdk.Query.equal('sender', userId),
      sdk.Query.equal('receiver', friendId),
    ]
  );

  if (check.documents.length > 0) {
    res.json({
      status: '401',
      message: 'You already sent a friend request to this user.',
    });
    return;
  }
  // getting the user's name and profile picture from users collection
  const user = await database.getDocument(databaseId, userProfileId, userId);

  // creating a document in friend_requests collection
  database.createDocument(
    databaseId,
    collectionId,
    ID.unique(),
    {
      sender: userId,
      receiver: friendId,
      status: 'pending'
    },
    [
      sdk.Permission.read(
        sdk.Role.user(userId)
      ),
      sdk.Permission.read(
        sdk.Role.user(friendId)
      )
    ]

  ).then((response) => {
    console.log(response);
    // creating a document in notifications collection
    database.createDocument(
      databaseId,
      notificationId,
      ID.unique(),
      {
        userId: friendId,
        type: 'friend_request',
        content: 'has sent you a friend request.',
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

    res.json({
      status: 'success',
    });
  }).catch((error) => {
    console.log(error);
    res.json({
      status: 'error',
    });
  });


};
