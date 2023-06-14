'use client'
import UserCard from '@/components/UserCard'
import React, { useEffect } from 'react'
import { getFriendsList, getFriendsProfile, getSuggestedUsers } from '@/utils/appwrite-utils';
import { useAppContext } from '@/app/context/AppContext'
import toast from 'react-hot-toast';

function page() {
  const { accountInfo, setAccountInfo } = useAppContext();
  const { friendsId, setFriendsId } = useAppContext();
  const { friendsProfile, setFriendsProfile } = useAppContext();
  const { currentUserData, setCurrentUserData } = useAppContext();
  const { suggestedUsers, setSuggestedUsers } = useAppContext();
  // getting  friends list
  useEffect(() => {
    // checking if accountInfo is not empty
    if (Object.keys(accountInfo).length !== 0) {
      console.log(currentUserData)
      // checking if this user has set his profile
      getFriendsList(accountInfo.$id).then(res => {
        setFriendsId(res);
        // getting friends profile data
        getFriendsProfile(res).then(res => {
          setFriendsProfile(res);
          console.log(res);
        })
          .catch(err => {
            console.log(err);
          })
      })
    }

  }, [accountInfo])
  console.log(friendsProfile)

  // getting suggested users
  useEffect(() => {
    if (Object.keys(accountInfo).length !== 0) {
      getSuggestedUsers().then(res => {
        console.log(res);
        // removing current user and his friends from suggested users by $id
        const filteredUsers = res.documents.filter(user => {
          return user.$id !== accountInfo.$id && !friendsId.includes(user.$id);
        })
        setSuggestedUsers(filteredUsers);
      })
        .catch(err => {
          console.log(err);
        })
    }

  }, [accountInfo, friendsId])

  // checking current user data

  return (
    <>
      <h1 className="text-3xl font-bold text-center">Your Friends</h1>
      <div className="flex flex-wrap justify-center  py-2">
        {/* friend from friends profile  */}
        {/* if friends profile is empty then show you don't have any friends :()   */}
        {friendsProfile.length === 0 && <div>You don't have any friends :(</div>}
        {friendsProfile.length !== 0 &&
          friendsProfile.map((friend) => {
            return (
              <UserCard key={friend.$id} name={friend.name} nativeCountry={friend.nativeCountry} profileSrc={friend.profilePic} currentCity={friend.currentCity} currentCountry={friend.currentCountry} languageKnow={friend.languagesKnow} languageWant={friend.languagesWant} coverSrc={friend.coverImage} ctaText='Open Chat' ctaLink={`/profile/${friend.$id}`} />
            )
          })
        }



      </div>
      <h2 className='text-3xl font-bold text-center'>Suggested Users</h2>
      <div className="flex flex-wrap justify-center  py-2">
        {/* suggested users also checking there should be any friends profile */}
        {suggestedUsers.length === 0 && <div>We don't have any suggested users :(</div>}
        {suggestedUsers.length !== 0 &&
          suggestedUsers.map((user) => {
            return (
              <UserCard key={user.$id} name={user.name} nativeCountry={user.nativeCountry} profileSrc={user.profilePic} currentCity={user.currentCity} currentCountry={user.currentCountry} languageKnow={user.languagesKnow} languageWant={user.languagesWant} coverSrc={user.coverImage} ctaText='Open Chat' ctaLink={`/profile/${user.$id}`} />
            )
          })
        }

      </div>
    </>
  )
}

export default page