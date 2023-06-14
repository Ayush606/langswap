import { Client, Account, ID, Databases, Functions, Query, Permission, Role, Storage } from 'appwrite';
export const client = new Client();
const account = new Account(client);
const databases = new Databases(client);
const functions = new Functions(client);
const storage = new Storage(client);


client
    .setEndpoint(process.env.NEXT_PUBLIC_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_PROJECT_ID);


// account signup
export const signUp = (name, email, password) => {
    return account.create(ID.unique(), email, password, name);
}

// account login
export const login = (email, password) => {
    return account.createEmailSession(email, password);
};

// account logout
export const logout = () => {
    return account.deleteSession('current');
};

// getting current user data
export const getUser = () => {
    return account.get();
};

// setting up user profile pic
export const uploadProfilePic = (userId, profilePic) => {
    // file id is userId+"profilePic"
    return storage.createFile(process.env.NEXT_PUBLIC_USER_IMAGES_BUCKET, userId + "-profilePic", profilePic,
        [Permission.read(Role.any()),
        Permission.write(Role.user(userId))
        ]



    );
};
// setting up user profile pic
export const uploadCoverImage = (userId, coverImage) => {
    // file id is userId+"profilePic"
    return storage.createFile(process.env.NEXT_PUBLIC_USER_IMAGES_BUCKET, userId + "-coverImage", coverImage
        ,
        [Permission.read(Role.any()),
        Permission.write(Role.user(userId))]
    );
};

// // updating user profile pic
// export const deleteProfilePic = (userId) => {
//     return storage.deleteFile(process.env.NEXT_PUBLIC_USER_IMAGES_BUCKET, userId + "-profilePic");
// }


// // updating user cover image
// export const updateCoverImage = (userId, coverImage) => {
//     return storage.updateFile(process.env.NEXT_PUBLIC_USER_IMAGES_BUCKET, userId + "-coverImage", coverImage);
// };

// getting image from storage
export const getImage = (imageId) => {
    return storage.getFileView(process.env.NEXT_PUBLIC_USER_IMAGES_BUCKET, imageId);
}


// Adding user profile info to data 

export const addUserProfile = (userId, profilePic, coverImage, name, username, nativeCountry, currentCountry, currentCity, age, gender, languagesKnow, languagesWant, about) => {
    return databases.createDocument(process.env.NEXT_PUBLIC_DATABASE_ID, process.env.NEXT_PUBLIC_USER_PROFILE_COLLECTION, userId, {
        profilePic,
        coverImage,
        name,
        username,
        nativeCountry,
        currentCountry,
        currentCity,
        age,
        gender,
        languagesKnow,
        languagesWant,
        about
    },
        [
            Permission.read(Role.any()),
            Permission.write(Role.user(userId))
        ]
    );

}

// Updating user profile 
export const updateUserProfile = (userId, profilePic, coverImage, name, username, nativeCountry, currentCountry, currentCity, age, gender, languagesKnow, languagesWant, about) => {
    return databases.updateDocument(process.env.NEXT_PUBLIC_DATABASE_ID, process.env.NEXT_PUBLIC_USER_PROFILE_COLLECTION, userId, {
        profilePic,
        coverImage,
        name,
        username,
        nativeCountry,
        currentCountry,
        currentCity,
        age,
        gender,
        languagesKnow,
        languagesWant,
        about
    })
}
// Getting user profile info from data
export const getUserProfile = (profileId) => {
    return databases.getDocument(process.env.NEXT_PUBLIC_DATABASE_ID, process.env.NEXT_PUBLIC_USER_PROFILE_COLLECTION, profileId);
}
// getting suggested users
export const getSuggestedUsers = () => {
    return databases.listDocuments(process.env.NEXT_PUBLIC_DATABASE_ID, process.env.NEXT_PUBLIC_USER_PROFILE_COLLECTION);
}

// send friend request function
export const sendFriendRequest = (friendId) => {
    return functions.createExecution(process.env.NEXT_PUBLIC_SEND_REQUEST_FUNCTION_ID, friendId);

};


// function to check current user and profile relation
export const checkFriendRequest = (userId, friendId) => {
    console.log(userId, friendId)
    return databases.listDocuments(process.env.NEXT_PUBLIC_DATABASE_ID,
        process.env.NEXT_PUBLIC_FRIEND_REQUESTS_COLLECTION,
        [
            Query.equal('sender', userId),
            Query.equal('receiver', friendId)
        ]
    );
}

// cancel friend request function
export const cancelFriendRequest = (friendId) => {
    return functions.createExecution(process.env.NEXT_PUBLIC_CANCEL_REQUEST_FUNCTION_ID, friendId);

}

// accept friend request function
export const acceptFriendRequest = (friendId) => {
    return functions.createExecution(process.env.NEXT_PUBLIC_ACCEPT_REQUEST_FUNCTION_ID, friendId);


}

// get friendsId list function
export const getFriendsList = async (userId) => {
    const friends = [];

    // Get friend requests sent by the current user
    const sentRequests = await databases.listDocuments(process.env.NEXT_PUBLIC_DATABASE_ID,
        process.env.NEXT_PUBLIC_FRIEND_REQUESTS_COLLECTION,
        [
            Query.equal('sender', userId),
            Query.equal('status', 'accepted')
        ]);

    // Get friend requests received by the current user
    const receivedRequests = await databases.listDocuments(process.env.NEXT_PUBLIC_DATABASE_ID,
        process.env.NEXT_PUBLIC_FRIEND_REQUESTS_COLLECTION,
        [
            Query.equal('receiver', userId),
            Query.equal('status', 'accepted')
        ]);


    // Combine the results
    sentRequests.documents.forEach(request => friends.push(request.receiver));
    receivedRequests.documents.forEach(request => friends.push(request.sender));

    return friends; // Array of friend IDs
}

// get friends profile info function
export const getFriendsProfile = async (friendsId) => {

    const friendsProfile = [];

    for (let i = 0; i < friendsId.length; i++) {
        const friend = await databases.getDocument(process.env.NEXT_PUBLIC_DATABASE_ID, process.env.NEXT_PUBLIC_USER_PROFILE_COLLECTION, friendsId[i]);
        friendsProfile.push(friend);
    }

    return friendsProfile;

}

// getting notifications function
export const getNotifications = async (userId) => {
    return databases.listDocuments(process.env.NEXT_PUBLIC_DATABASE_ID,
        process.env.NEXT_PUBLIC_NOTIFICATIONS_COLLECTION,
        [
            Query.equal('userId', userId)
        ]
    );

}

// read notifications function
export const readNotifications = () => {
    return functions.createExecution(process.env.NEXT_PUBLIC_READ_NOTIFICATIONS_FUNCTION_ID);
    console.log("read notifications function called")
}

// creating a document in chat collection
export const createChat = (senderId, receiverId, message, name, profilePic) => {
    return databases.createDocument(process.env.NEXT_PUBLIC_DATABASE_ID, process.env.NEXT_PUBLIC_CHATS_COLLECTION, ID.unique(), {
        senderId,
        receiverId,
        message,
        name,
        profilePic,
        seen: false
    }
    );
};

// To retrieve all messages between two users, you’ll need to query the “chats” collection twice: once for messages where the sender is user1 and the receiver is user2, and once for messages where the sender is user2 and the receiver is user1. You can then combine the results of the two queries to get all messages between the two users.
// getting chats function
export const getChats = async (senderId, receiverId) => {

    const chats = await databases.listDocuments(process.env.NEXT_PUBLIC_DATABASE_ID,
        process.env.NEXT_PUBLIC_CHATS_COLLECTION,
        [
            Query.equal('senderId', [senderId, receiverId]),
            Query.equal('receiverId', [senderId, receiverId]),
            Query.limit(100)
        ]
    );
    return chats.documents

}

// seen message function
export const seenMessage = (chatId) => {
    return functions.createExecution(process.env.NEXT_PUBLIC_SEEN_MESSAGE_FUNCTION_ID, chatId);
};

// query to get all unread messages for the user
export const getUnreadMessages = (userId) => {
    return databases.listDocuments(process.env.NEXT_PUBLIC_DATABASE_ID,
        process.env.NEXT_PUBLIC_CHATS_COLLECTION,
        [
            Query.equal('receiverId', userId),
            Query.equal('seen', false)
        ]
    );
}

// create calls in calls collection
export const createCall = (callerId, calleeId, callerPeerId, status, callerName) => {
    return databases.createDocument(process.env.NEXT_PUBLIC_DATABASE_ID, process.env.NEXT_PUBLIC_CALLS_COLLECTION, ID.unique(), {
        callerId,
        calleeId,
        callerPeerId,
        status,
        callerName
    }
    );
}


