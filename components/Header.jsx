'use client'
import Link from 'next/link';
import { useState, useEffect } from 'react';
import ProfilePic from '@/components/ProfilePic';
import {UserCircleIcon,Cog8ToothIcon,ArrowRightOnRectangleIcon,ChatBubbleLeftRightIcon, HomeIcon, BellIcon } from '@heroicons/react/24/outline'
import { logout, getUser, getNotifications,getUserProfile, getUnreadMessages, seenMessage, readNotifications  } from '@/utils/appwrite-utils';
import { useAppContext } from '@/app/context/AppContext'
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const Header = ({ }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    // profile  dropdown state 
    const [dropdown, setDropdown] = useState(false);
    const [NotificationsDropdown, setNotificationDropdown] = useState(false);
    const [messagesDropdown, setMessagesDropdown] = useState(false);
    const {accountInfo, setAccountInfo} = useAppContext();
    const {notifications, setNotifications} = useAppContext();
    const {currentUserData, setCurrentUserData} = useAppContext();
    const {hasNewNotification, setHasNewNotification} = useAppContext();
    const {unreadMessages, setUnreadMessages} = useAppContext();
    const {unreadMessagesCount, setUnreadMessagesCount} = useAppContext();
    const router = useRouter();

    // checking if user is logged in
    useEffect(() => {
      // getting dark mode value from local storage
      const darkMode = localStorage.getItem('darkMode');
      // if dark mode is true, set dark mode to true
      if (darkMode === 'true') {
        setIsDarkMode(true);
        document.body.classList.toggle('dark-mode');
      }
      getUser().then((res) => {
        setIsLoggedIn(true);
        // adding account info to context
        setAccountInfo(res);
        // if page is /, /login, /signup, /forgot-password, /reset-password, redirect to /dashboard
        if (window.location.pathname === '/' || window.location.pathname === '/login' || window.location.pathname === '/signup' || window.location.pathname === '/forgot-password' || window.location.pathname === '/reset-password') {
          window.location.href = '/dashboard';
        }
        console.log(res);
      }).catch((error) => {
        console.log(error);
        setIsLoggedIn(false);
        // if user is not on page / or /login or  /register or /forgot-password or /reset-password. redirect to / else allow user to stay on page
          if (  window.location.pathname !== '/' &&  window.location.pathname !== '/login' && window.location.pathname !== '/register' && window.location.pathname !== '/forgot-password' && window.location.pathname !== '/reset-password') {
            window.location.href = '/';
          }
         
      });
    }, []);
    // getting current user data
    useEffect(() => {
          
      if (accountInfo.$id) {
        getUserProfile(accountInfo.$id).then((res) => {
          toast.success('Welcome back ' + res.name);
          console.log(res);
          setCurrentUserData(res);
        }).catch((error) => {
          toast('You need to set your profile first')
          if (window.location.pathname !== '/settings') {
            window.location.href = '/settings';
          }
          console.log(error);
        });
      }
    
    }, [accountInfo]);
    // notifications useEffect
    useEffect(() => {
      if(Object.keys(accountInfo).length === 0)
      {
        return;
      }

      getNotifications(accountInfo.$id).then((res) => {
        console.log(res.documents);
        setNotifications(res.documents);
        // counting total unread notifications
        let count = 0;
        res.documents.forEach((doc) => {
          if (!doc.read) {
            count++;
          }
        });
        setHasNewNotification(count);
      }).catch((error) => {
        console.log(error);
      });
    
    }, [accountInfo]);

    // get unread Messages
    useEffect(() => {
      if(Object.keys(accountInfo).length !== 0)
      getUnreadMessages(accountInfo.$id).then((res) => {
        console.log('erer',res);
        setUnreadMessages(res.documents);
        setUnreadMessagesCount(res.total);
          }).catch((error) => {
            console.log(error);
            setUnreadMessages([]);
            setUnreadMessagesCount(0);
            });
    } , [accountInfo]);
    
  // toggling dark mode
  function toggleDarkMode() {
    // storing dark mode value in local storage
    localStorage.setItem('darkMode', !isDarkMode);
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-mode');
  }
  // toggling profile dropdown
  function toggleDropDown() {
    setDropdown(!dropdown);
    dropdown ? document.getElementById('dropdown-menu').hidden = true : document.getElementById('dropdown-menu').hidden = false;
    // un hiding background dropdown
      document.getElementById('background-dropdown').hidden = false;
  }

  // toggling notifications dropdown
    function toggleNotificationsDropDown() {
      setHasNewNotification(0);
      setNotificationDropdown(!NotificationsDropdown);
      // un hiding background dropdown
      document.getElementById('background-dropdown').hidden = false;
    }

    // toggle message dropdown
    function toggleMessageDropDown() {
      setMessagesDropdown(!messagesDropdown);
      // making all messages seen
      
        unreadMessages.forEach((doc) => {
          seenMessage(doc.$id)
          setUnreadMessagesCount(0);
        });
      // un hiding background dropdown
      document.getElementById('background-dropdown').hidden = false;
    }
  

    // background dropdown click handler
    function backgroundDropDownClickHandler() {
      // messages dropdown false
      setMessagesDropdown(false);
      // notifications dropdown false
      setNotificationDropdown(false);
      // profile dropdown false
      setDropdown(false);
      // hiding profile dropdown
      document.getElementById('dropdown-menu').hidden = true;

      // hiding background dropdown
      document.getElementById('background-dropdown').hidden = true;
    }
  // logout handler
  function logoutHandler() {
    logout().then((res) => {
      console.log(res);
      window.location.href = '/';
      setIsLoggedIn(false);
      setAccountInfo({});
    }).catch((error) => {
      console.log(error);
    });
  }
  return (
    <header className="flex justify-between items-center p-1  m-auto border-solid border-b-2 border-zinc-800 h-20 w-full bg-sky-400">
      {/* this div will be visible when dropdown and notifications dropdown are true and it will take whole screen when the user click on it, it will close the dropdown when user click outside  */}
      <div onClick={ backgroundDropDownClickHandler } hidden  id="background-dropdown" className="absolute top-0 left-0 w-full h-full z-10" ></div>
      <Link href={isLoggedIn ? '/dashboard' : '/'} className="flex items-center">
        <h1 className="text-xl ml-3 font-bold ">langswap</h1>
      </Link>
      {/* checking if user is logged in */}
      {isLoggedIn ? (
        <nav>
          <ul className="flex">
            {/* home   */}
            <li className='my-2  py-2 mx-2 rounded-xl cursor-pointer hover:bg-slate-400 '>
                <Link href="/dashboard">
                <HomeIcon className='h-8 w-8'/>
              </Link>
            </li>
            {/* messages  */}
            <div className="relative inline-block">
                <li
                  onClick={()=> {
                    toggleMessageDropDown()
                     
                    }}
                 className='mt-2 pt-2 mx-2 rounded-xl cursor-pointer hover:bg-slate-400 '>
                    <ChatBubbleLeftRightIcon className='h-8 w-8 '/>
                    {unreadMessagesCount > 0 && (<span className="absolute top-8 right-2 w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">{unreadMessagesCount}</span>)}
                </li>
            

            {/* messages dropdown */}
            { messagesDropdown  && (

            <ul className="absolute right-0 py-2 w-96 max-h-56 overflow-hidden hover:overflow-auto bg-slate-800 rounded-md shadow-xl z-20">

                    {/* getting unread messages  from context */}
                    {/* if no unread messages, show this   */}
                    {unreadMessages.length === 0 && (
                      <div className="flex items-center px-4 py-2 text-zinc-200 cursor-pointer hover:bg-gray-100">
                        <div className="font-bold">No Unread Messages :) </div> 
                      </div>
                    )}
                    {/* if notifications, show this   */}
                    
                    {[...unreadMessages].reverse().map((message, index) => (
                      // if notification type is friend_request than href = /profile/[id] else href = /chat
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          backgroundDropDownClickHandler()
                          router.push(
                            `/chat/${message.senderId}`
                          );
                          // removing this message from unread messages
                          setUnreadMessages(unreadMessages.filter((msg) => msg.$id !== message.$id));
                          // updating unread messages count
                          // setUnreadMessagesCount(unreadMessagesCount - 1);
                          // making this message read
                          // seenMessage(message.$id);
                        }}
                        key={index}
                        className="flex items-center px-4 py-2 text-zinc-200 cursor-pointer w-full hover:bg-gray-100"
                      >
                        <img
                          src={message.profilePic}
                          alt={message.name + ' Profile picture'}
                          className="w-10 h-10 rounded-xl"
                        />
                        <div className="ml-2">
                          <div className="font-bold">{message.name}</div>
                          <div>{message.message}</div>
                        </div>
                      </button>
              ))}
            </ul>
            )}
            </div>

            {/* /* notifications  */}
      <div className="relative inline-block">
          <li
            onClick={()=> { toggleNotificationsDropDown()
            if (hasNewNotification > 0) {readNotifications()}
            }}
            className="mt-2 pt-2 mx-2 rounded-xl cursor-pointer hover:bg-slate-400 "
            >
              <BellIcon className="w-8 h-8"   />
              
              {hasNewNotification > 0 && 
              (<span className="absolute top-8 right-2 w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">{hasNewNotification}</span>)
              }
          </li>

            {/* Notifications dropdown */}
            { NotificationsDropdown  && (

            <ul className="absolute right-0 py-2 w-96 max-h-56 overflow-hidden hover:overflow-auto bg-slate-800 rounded-md shadow-xl z-20">
                    {/* getting notifications from context */}
                    {/* if no notifications, show this   */}
                    {notifications.length === 0 && (
                      <div className="flex items-center px-4 py-2 text-zinc-200 cursor-pointer hover:bg-gray-100">
                        <div className="font-bold">No Notifications :( </div>
                      </div>
                    )}
                    {/* if notifications, show this   */}
                    {[...notifications].reverse().map((notification, index) => (
                      // if notification type is friend_request than href = /profile/[id] else href = /chat
                      <button
                        onClick={(e) => {
                          backgroundDropDownClickHandler();
                          router.push(
                            `${
                              notification.type === 'friend_request'
                                ? `/profile/${notification.senderId}`
                                : `/chat/${notification.senderId}`
                            }`
                          );
                        }}
                        key={index}
                        className="flex items-center px-4 py-2 text-zinc-200 cursor-pointer w-full hover:bg-gray-100"
                      >
                        <img
                          src={notification.senderPic}
                          alt={notification.senderName + ' Profile picture'}
                          className="w-10 h-10 rounded-xl"
                        />
                        <div className="ml-2">
                          <div className="font-bold">{notification.senderName}</div>
                          <div>{notification.content}</div>
                        </div>
                      </button>
              ))}
            </ul>
            )}
        </div>

          

            {/* profile image */}
            <li>
              <div onClick={toggleDropDown} className=" mt-3 rounded-xl border-solid border-stone-900 border-2 cursor-pointer">
                <ProfilePic imageClass='rounded-xl w-10 h-10' src={currentUserData.profilePic} alt="profile"/>
              </div>
            </li>
            {/*  adding a  dropdown menu for profile which will show on click  */}
            <li hidden id='dropdown-menu' className="py-4 rounded-xl cursor-pointer z-20">
              <div className="relative inline-block text-left">
                <div className="origin-top-right absolute right-0 mt-4 w-48 rounded-md shadow-lg bg-slate-900 ring-1 ring-black ring-opacity-5">
                  <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                    <button
                     onClick={(e)=>{
                      e.preventDefault();
                      router.push(`/profile/${accountInfo.$id}`);
                      toggleDropDown();
                     }} 
                      className="flex w-[98%] px-1 py-1 m-1 text-md text-slate-100 text-center hover:bg-slate-800" role="menuitem">
                        <UserCircleIcon className='h-6 w-6 mr-1'/>
                        Your Profile
                    </button>
                    <button
                      onClick={(e)=>{
                        e.preventDefault();
                        router.push('/settings');
                        toggleDropDown();
                      }} 
                     className="flex w-[98%] px-1 py-1 m-1 text-md text-slate-100 hover:bg-slate-800" role="menuitem" href='/settings/'>
                        <Cog8ToothIcon className='h-6 w-6 mr-1'/>
                        Settings
                    </button>
                    <div onClick={logoutHandler} className="flex px-1 py-1 m-1 text-md text-slate-100 hover:bg-slate-800" role="menuitem">
                        <ArrowRightOnRectangleIcon className='h-6 w-6 mr-1'/>
                        Logout
                    </div>
                  </div>
                </div>
              </div>
            </li>
            {/*  adding a  dropdown menu for profile which will show on click  */}
            {/* dark mode switcher */}
              <li className="ml-4 py-4 rounded-xl cursor-pointer">
            <label htmlFor="toggle" className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  id="toggle"
                  className="sr-only"
                  onClick={toggleDarkMode}
                />
                <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
                <div
                  className={`dot absolute left-1 top-1 bg-slate-100 w-6 h-6 rounded-full transition ${
                    isDarkMode ? 'transform translate-x-full bg-slate-800' : ''
                  }`}
                >
                  {isDarkMode ? '🌙' : '☀️'}
                </div>
              </div>
            </label>
          </li>
          </ul>
                  {/* // notice banner for logged in users */}
            {/* <div
            hidden
              id='notice-banner'
              className='absolute top-20 left-2 right-0 w-[98%] h-16 bg-zinc-800 rounded-lg  text-white text-center  items-center'
            >
              <div className='flex justify-between'>
              <h1 className='text-2xl font-bold p-1 m-3'>Jojo Is Calling You</h1>
              <div>
                <button onClick={null} className='bg-green-500 hover:bg-green-800 rounded-md font-bold p-2 my-3 mx-3'>Answer</button>
                <button onClick={null} className='bg-red-500 hover:bg-red-800 rounded-md font-bold p-2 my-3 mx-3'>Ignore</button>
              </div>
              </div>
            </div> */}
        </nav>
        
      ):(
        // if not logged in, show login and sign up buttons
        <nav>
        <ul className="flex">
          {/* login button */}
          <li className=" mt-3 text-md font-medium ">
            <Link className=' m-2 p-1 rounded-md border cursor-pointer' href="/login">
              Login
            </Link>
          </li>
          {/* sign up button */}
          <li className=" mt-3 text-md font-medium ">
            <Link className=' m-2 p-1 rounded-md border cursor-pointer' href="/register">
              Sign Up
            </Link>
          </li>
          {/* dark mode switcher */}
              <li className="ml-4 py-2 rounded-xl  cursor-pointer">
            <label htmlFor="toggle" className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  id="toggle"
                  className="sr-only"
                  onClick={toggleDarkMode}
                />
                <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
                <div
                  className={`dot absolute left-1 top-1 bg-slate-100 w-6 h-6 rounded-full transition ${
                    isDarkMode ? 'transform translate-x-full bg-slate-800' : ''
                  }`}
                >
                  {isDarkMode ? '🌙' : '☀️'}
                </div>
              </div>
            </label>
          </li>
        </ul>
      </nav>
      )}
    </header>
  );
  }

export default Header;
