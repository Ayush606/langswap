'use client';
import SmallFriendCard from '@/components/SmallFriendCard';
import React from 'react';
import { useAppContext } from '@/app/context/AppContext'



function Chat() {
    const { friendsProfile } = useAppContext();
    return (
        <div>
            <h1 className="text-3xl font-bold text-center border-b border-zinc-500 p-2">Your Friends</h1>
            {!friendsProfile.length && <h1 className="text-2xl font-bold text-center">You have no friends yet</h1>}
            {friendsProfile.map(friend => {
                return <SmallFriendCard key={friend.$id} imageSrc={friend.profilePic} name={friend.name} id={friend.$id} />
            })}
        </div>
    );
}

export default Chat;