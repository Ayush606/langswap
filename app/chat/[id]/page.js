'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Bars3Icon, XCircleIcon, VideoCameraIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline'
import ChatMessage from '@/components/ChatMessage';
import { createChat, getChats, seenMessage, client } from '@/utils/appwrite-utils';
import { useAppContext } from '@/app/context/AppContext'
import Link from 'next/link';
import SmallFriendCard from '@/components/SmallFriendCard';

const ChatPage = () => {
    const [showSidebar, setShowSidebar] = useState(false);
    const [friendId, setFriendId] = useState('');
    const { accountInfo, setAccountInfo } = useAppContext();
    const { friendsProfile, setFriendsProfile } = useAppContext();
    const { currentUserData, setCurrentUserData } = useAppContext();
    const [chats, setChats] = useState([]);
    const bottomRef = useRef();

    // effect to get chats
    useEffect(() => {
        // getting friend id from url
        const friendId = window.location.pathname.split('/')[2];

        // setting friend id
        setFriendId(friendId);
        // run only when accountInfo is not empty
        if (Object.keys(accountInfo).length !== 0) {
            // calling getChats function to get chats
            getChats(accountInfo.$id, friendId)
                .then(res => {
                    console.log(res);
                    setChats(res);
                })
                .catch(err => {
                    console.log(err);
                })
        }
        console.log(friendsProfile);

    }, [accountInfo]);

    // effect to get real time chat
    useEffect(() => {
        const unsubscribe = client.subscribe(

            `databases.${process.env.NEXT_PUBLIC_DATABASE_ID}.collections.${process.env.NEXT_PUBLIC_CHATS_COLLECTION}.documents`,

            response => {
                console.log(response);
                // if payload.senderId and payload.receiverId are equal to accountInfo.$id and friendId
                // then add the payload to chats
                if (Object.keys(accountInfo).length !== 0) {
                    if (response.events[5] === `databases.${process.env.NEXT_PUBLIC_DATABASE_ID}.collections.${process.env.NEXT_PUBLIC_CHATS_COLLECTION}.documents.*.create`) {
                        if (response.payload.senderId === accountInfo.$id && response.payload.receiverId === friendId || response.payload.senderId === friendId && response.payload.receiverId === accountInfo.$id) {
                            setChats(prev => [...prev, response.payload]);
                        }
                    }
                }
            },
        )

        // unsubscribe when pages changes
        return () => {

            unsubscribe();
        }


    }, [accountInfo, friendId])

    // effect to fire seen message function
    useEffect(() => {
        // check if the last chat in the chats array was sent by the friend
        if (chats.length > 0 && chats[chats.length - 1].senderId === friendId) {
            // call seenMessageHandler with the id of the last chat
            seenMessageHandler(chats[chats.length - 1].$id);
        }
    }, [chats]);

    // scroll to bottom whenever chats update
    useEffect(() => {
        bottomRef.current.scrollIntoView();
    }, [chats]);




    // create chat function
    const createChatHandler = () => {
        // getting message from chat-input
        const message = document.getElementById('chat-input').value;
        // clearing chat input
        document.getElementById('chat-input').value = '';
        // calling create chat function to create document in chat collection
        createChat(accountInfo.$id, friendId, message, accountInfo.name, currentUserData.profilePic)
            .then(res => {
                console.log(res);

            })
            .catch(err => {
                console.log(err);
            })
    };

    // seen chat function
    const seenMessageHandler = (seenMessageId) => {
        // calling seen chat function to update seen field in chat collection
        seenMessage(seenMessageId).then(res => {
            console.log(res);
        }).catch(err => {
            console.log(err);
        });
    };

    return (
        <>
            <div className='flex bg-zinc-800 w-full h-10 text-white'>
                {/* Sidebar toggle button */}
                <div
                    onClick={() => setShowSidebar(!showSidebar)}
                    className=" cursor-pointer pt-1 ml-1 "
                >
                    {showSidebar ? <XCircleIcon className="w-8 h-8" /> : <Bars3Icon className="w-8 h-8" />}
                </div>
                <h1 className=' mx-auto text-xl pt-1'>Chat</h1>
                <Link href={`/chat/${friendId}/video`} className='cursor-pointer'>
                    <VideoCameraIcon className="w-8 h-8 mr-2" />
                </Link>

            </div>
            <div className=" flex h-[80vh]">

                {/* Sidebar */}
                <div
                    className={` bg-zinc-800 text-white w-64 ${showSidebar ? 'block' : 'hidden'
                        } block`}
                >
                    <div className="p-4 border-b">
                        <h2 className="text-lg font-semibold text-center">Friends</h2>
                    </div>
                    <ul>
                        {/* mapping friends */}
                        {friendsProfile.map(friend => {
                            return (
                                <SmallFriendCard key={friend.$id} name={friend.name} imageSrc={friend.profilePic} id={friend.$id} />
                            )
                        })}

                    </ul>
                </div>
                {/* Chat area */}
                <div className="flex flex-col flex-grow">
                    <div className="flex-grow overflow-auto p-4">
                        {/* Chat messages */}
                        {/* mapping chats  */}
                        {chats.map(chat => {
                            return (

                                <ChatMessage
                                    key={chat.$id}
                                    imageSrc={chat.profilePic}
                                    alt={chat.name + ' profile picture'}
                                    username={chat.name}
                                    message={chat.message}
                                />
                            );
                        })}
                        {/* scroll to bottom button */}
                        <div ref={bottomRef} />
                    </div>
                    <div className="border-t">
                        {/* Chat input */}
                        {/*  message send on enter */}
                        <div className="relative">
                            <input
                                id='chat-input'
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        createChatHandler();
                                    }
                                }}
                                type="text"
                                placeholder="Type a message"
                                className="w-full px-4 py-2 inline-block pr-10 text-black"
                            />
                            {/* Chat send button */}
                            <div className="absolute right-0 top-0 bottom-0 flex items-center px-4">
                                <button onClick={createChatHandler}>
                                    <PaperAirplaneIcon className="w-8 h-8 mr-2 inline bg-zinc-800 rounded-md" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ChatPage;