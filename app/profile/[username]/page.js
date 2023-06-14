'use client'
import Country from '@/components/Country'
import LanguageList from '@/components/LanguageList'
import UserCard from '@/components/UserCard'
import React, { useEffect, useState } from 'react'
import { getUserProfile, sendFriendRequest, checkFriendRequest, cancelFriendRequest, acceptFriendRequest } from '@/utils/appwrite-utils';
import Link from 'next/link'
import { useAppContext } from '@/app/context/AppContext'
import toast from 'react-hot-toast';

const Profile = () => {
  // profile id of current page
  const [profileId, setProfileId] = useState('')
  const { accountInfo, setAccountInfo } = useAppContext();
  const [userProfile, setUserProfile] = useState({
    userId: accountInfo.$id,
    profilePic: '',
    coverImage: '',
    name: '',
    username: '',
    nativeCountry: 'IN',
    currentCountry: 'IN',
    currentCity: '',
    age: '',
    gender: '',
    languagesKnow: ['Hi', 'En', 'Pb'],
    languagesWant: ['Hi', 'En', 'Pb'],
    about: ''
  })
  // state to check if friend request is sent
  const [friendRequestSent, setFriendRequestSent] = useState(false)
  // state to check if friend request is received
  const [friendRequestReceived, setFriendRequestReceived] = useState(false)
  // state to check if user is friend
  const [isFriend, setIsFriend] = useState(false)
  useEffect(() => {
    // getting user id from url
    const profileIdFromUrl = window.location.pathname.split('/')[2]
    setProfileId(profileIdFromUrl);
    // fetching user profile info from appwrite
    getUserProfile(profileIdFromUrl).then((userProfile) => {
      setUserProfile(userProfile)
      console.log(userProfile)
    }).catch((error) => {
      console.error(error)
    })

  }, [])


  // checking current user and profile relation, running only when accountInfo $id is not equal to profileId
  useEffect(() => {
    // checking if accountInfo is not empty
    if (Object.keys(accountInfo).length !== 0 && profileId !== '') {

      // checking if accountInfo $id is not equal to profileId
      if (accountInfo.$id !== profileId) {
        // checking if friend request is sent
        checkFriendRequest(accountInfo.$id, profileId).then((response) => {
          console.log(response)
          // if document length is greater than 0 and status is pending then friend request is sent
          if (response.documents.length > 0 && response.documents[0].status === 'pending') {
            setFriendRequestSent(true)
          }
          // if document length is greater than 0 and status is accepted then friend request is received
          else if (response.documents.length > 0 && response.documents[0].status === 'accepted') {
            setIsFriend(true)
          }
        }).catch((error) => {
          console.error(error)
        })

        // checking if friend request is received
        checkFriendRequest(profileId, accountInfo.$id).then((response) => {
          console.log(response)
          // if document length is greater than 0 and status is pending then friend request is received
          if (response.documents.length > 0 && response.documents[0].status === 'pending') {
            setFriendRequestReceived(true)
          }
          // if document length is greater than 0 and status is accepted then user is friend
          else if (response.documents.length > 0 && response.documents[0].status === 'accepted') {
            setIsFriend(true)
          }
        })
          .catch((error) => {
            console.error(error)
          })

      }

    }
  }, [accountInfo, profileId])

  // add friend function
  const handleAddFriend = () => {
    const loadingToast = toast.loading('Sending friend request...');
    // send friend request 
    setFriendRequestSent(true)
    sendFriendRequest(profileId).then((response) => {
      toast.dismiss(loadingToast)
      toast.success('Friend request sent successfully');
      console.log(response)
    }).catch((error) => {
      toast.dismiss(loadingToast)
      toast.error('Error sending friend request ' + error.message);
      console.error(error)
    })
  };

  // cancel friend request function

  const handleCancelFriendRequest = () => {
    const loadingToast = toast.loading('Cancelling friend request...');
    // cancel friend request 
    setFriendRequestSent(false)
    setIsFriend(false)
    cancelFriendRequest(profileId).then((response) => {
      toast.dismiss(loadingToast)
      toast.success('Friend request cancelled successfully');
      console.log(response)
    }).catch((error) => {
      toast.error('Error cancelling friend request ' + error.message);
      console.error(error)
    })
  }
  // cancel friend request 

  // accept friend request function
  const handleAcceptFriendRequest = () => {
    const loadingToast = toast.loading('Accepting friend request...');
    // accept friend request 
    setFriendRequestReceived(false)
    setIsFriend(true)
    acceptFriendRequest(profileId).then((response) => {
      toast.dismiss(loadingToast)
      if (response.statusCode === 500) {
        toast.error('Error accepting friend request ' + error.message);
      }
      toast.success('Friend request accepted successfully');
      console.log(response)
    }).catch((error) => {
      toast.dismiss(loadingToast)
      toast.error('Error accepting friend request ' + error.message);
      console.error(error)
    })
  };



  return (
    <>
      <div className=" rounded-lg overflow-hidden shadow-lg">
        <img className="w-full h-44 object-cover object-center" src={userProfile.coverImage} alt="Cover Image" />
        <div className="px-6 py-4">
          <div className="flex -mt-12">
            <img className="w-24 h-24 rounded-xl border-4 border-white" src={userProfile.profilePic} alt="Profile Picture" />
          </div>
          <div className="mt-4">
            <div className="font-bold text-xl mb-2 ">{userProfile.name}</div>
            <div className="your-class">
              <p className="text-md font-bold inline-block mr-2">Native Country:</p>
              <Country countryName={userProfile.nativeCountry} flagClass="w-8 h-8 inline-block ml-1" />
            </div>
            <div className="your-class">
              <p className="text-md font-bold inline-block mr-2">Currently live:</p>
              <p className="text-base inline-block mr-1">{userProfile.currentCity + '\ in'}</p>
              <Country countryName={userProfile.currentCountry} flagClass="w-8 h-8 inline-block ml-1" />
            </div>
            <div className="your-class">
              <p className="text-md font-bold inline-block mr-2">Age:</p>
              <p className="text-base inline-block">{userProfile.age}</p>
            </div>
            <div className="your-class">
              <p className="text-md font-bold inline-block mr-2">Gender:</p>
              <p className="text-base inline-block">{userProfile.gender}</p>
            </div>
            <div className="your-class">
              <p className="text-md font-bold inline-block mr-2">Language Know:</p>
              <LanguageList languages={userProfile.languagesKnow} />
            </div>
            <div className="your-class">
              <p className="text-md font-bold inline-block mr-2">Language Want to learn:</p>
              <LanguageList languages={userProfile.languagesWant} />
            </div>
            <div className="your-class">
              <p className="text-md font-bold inline-block mr-2">About:</p>
              <p className="text-base inline-block">{userProfile.about}</p>
            </div>
          </div>
        </div>
        {/* checking if current user is the owner of the profile  */}
        {userProfile.$id === accountInfo.$id ? (
          <div className="flex justify-center mt-4">
            <Link className="bg-zinc-700 hover:bg-zinc-500 text-white font-bold py-2 px-4 rounded-xl mb-2" href={`/settings/`}>
              Edit Profile 📝
            </Link>
          </div>
        ) : (
          <div className="px-6 py-4 flex justify-between">
            {
              // checking if friend request is sent
              friendRequestSent ? (
                <button onClick={handleCancelFriendRequest} className="bg-zinc-700 hover:bg-zinc-500 text-white font-bold py-2 px-4 rounded-full mx-auto">
                  Cancel Request
                </button>
              ) : (
                // checking if friend request is received
                friendRequestReceived ? (
                  <button onClick={handleAcceptFriendRequest} className="bg-zinc-700 hover:bg-zinc-500 text-white font-bold py-2 px-4 rounded-full mx-auto">
                    Accept Request
                  </button>
                ) : (
                  // checking if user is friend
                  isFriend ? (
                    <div className='flex justify-center w-full'>
                      <Link href={`/chat/${profileId}`} className="bg-zinc-700 hover:bg-zinc-500 text-white font-bold py-2 px-4 my-4 mx-12 rounded-xl ">
                        Message
                      </Link>
                      <button onClick={handleCancelFriendRequest} className="bg-zinc-700 hover:bg-zinc-500 text-white font-bold py-2 px-4 my-4 mx-12 rounded-xl ">
                        Unfriend
                      </button>
                    </div>

                  ) : (
                    <button onClick={handleAddFriend} className="bg-zinc-700 hover:bg-zinc-500 text-white font-bold py-2 px-4 rounded-full mx-auto">
                      Add Friend
                    </button>
                  )
                )
              )

            }
          </div>
        )}
      </div>
      {/* <div className="flex flex-wrap justify-start m-4">
        <h2 className="text-2xl font-bold mb-2 border-b-2 border-gray-200 text-center w-full">
          Suggested Users
        </h2>
        <UserCard name='Jojo' nativeCountry='JP' profileSrc='https://images.pexels.com/photos/16639180/pexels-photo-16639180/free-photo-of-man-playing-tennis-on-grass-court.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1' languageKnow={["hindi", "enligsh", "punjabi"]} languageWant={['hindi', 'enligsh', 'punjabi']} ctaText='Open Chat' ctaLink='http://localhost:3000/profile/647564118fbd6c628b17' />
      </div> */}
    </>
  )
}

export default Profile