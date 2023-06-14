'use client';
import React, { createContext, useState, useContext, useEffect} from 'react';
import { getUser, client } from '@/utils/appwrite-utils';
import CallNotification from '@/components/CallNotification';
import { useRouter } from 'next/navigation';


export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const router = useRouter();
  const [accountInfo, setAccountInfo] = useState({});
  const [currentUserData, setCurrentUserData] = useState({});
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [friendsId, setFriendsId] = useState([]);
  const [friendsProfile, setFriendsProfile] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [hasNewNotification, setHasNewNotification] = useState(0);
  const [chats, setChats] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState([]);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [call, setCall] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // effect for subscribing to realtime updates of calls
  useEffect(() => {
    if (Object.keys(accountInfo).length === 0) {
      return;
    }
    const unsubscribe = client.subscribe(
      [`databases.${process.env.NEXT_PUBLIC_DATABASE_ID}.collections.${process.env.NEXT_PUBLIC_CALLS_COLLECTION}.documents`],
      (res) => {
        if(res.payload.calleeId === accountInfo.$id && res.payload.status === 'ringing'){
          console.log('ringing');
          setCall({
            callerName: res.payload.callerName,
            callerPeerId: res.payload.callerPeerId,
            calleeId: res.payload.calleeId,
            callerId: res.payload.callerId,
            status: res.payload.status
          });

        }

        
        console.log(res);
      }
    );

    return () => unsubscribe();
    

  }, [accountInfo]);

  // effect for subscribing to realtime updates of notifications
  useEffect(() => {
    if (Object.keys(accountInfo).length === 0) {
      return;
    }
    const unsubscribe = client.subscribe(
      [`databases.${process.env.NEXT_PUBLIC_DATABASE_ID}.collections.${process.env.NEXT_PUBLIC_NOTIFICATIONS_COLLECTION}.documents`],
      (res) => {
        if(res.events[5] === `databases.${process.env.NEXT_PUBLIC_DATABASE_ID}.collections.${process.env.NEXT_PUBLIC_NOTIFICATIONS_COLLECTION}.documents.*.create`){
          console.log(res);
        setNotifications(prev => [...prev, res.payload]);
        setHasNewNotification( prev => prev + 1);
        }
      }
    );

    return () => unsubscribe();
    

  
  }, [accountInfo]);

  // effect for subscribing to realtime updates of messages
  useEffect(() => {
    console.log(router);
    if (Object.keys(accountInfo).length === 0) {
      return;
    }
    const unsubscribe = client.subscribe(
      [`databases.${process.env.NEXT_PUBLIC_DATABASE_ID}.collections.${process.env.NEXT_PUBLIC_CHATS_COLLECTION}.documents`],
      (res) => {
        if(window.location.pathname === `/chat/${res.payload.senderId}` || window.location.pathname === `/chat/${res.payload.receiverId}`){
          return;
        }
        if(res.events[5] === `databases.${process.env.NEXT_PUBLIC_DATABASE_ID}.collections.${process.env.NEXT_PUBLIC_CHATS_COLLECTION}.documents.*.create`){
          console.log(res);
        setUnreadMessages(prev => [...prev, res.payload]);
        setUnreadMessagesCount( prev => prev + 1);
      }
        });

    return () => unsubscribe();
    

  
  }, [accountInfo]);

  // handle ignore call
  const handleIgnore = () => {
    setCall(null);
  };
 const handleAnswer = () => {
    router.push(`/chat/id-${call.callerPeerId}/video`);
    setCall(null);
 };

  return (
    <AppContext.Provider value={{
        suggestedUsers, setSuggestedUsers,
        accountInfo, setAccountInfo, 
        currentUserData, setCurrentUserData,
        friendsId, setFriendsId, 
        friendsProfile, setFriendsProfile, 
        notifications, setNotifications, 
        hasNewNotification, setHasNewNotification,
        unreadMessages, setUnreadMessages,
        unreadMessagesCount, setUnreadMessagesCount,
        chats, setChats,
        loading, setLoading, 
        error, setError,
      }}>
        {call !== null ? (
        <CallNotification name={call.callerName} callerPeerId={call.callerPeerId} onIgnore={handleIgnore} onAnswer={handleAnswer} />
      ): ''}
      {children}
      
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);