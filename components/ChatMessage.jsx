import React from 'react'
import ProfilePic from '@/components/ProfilePic'
import Username from '@/components/Username'

function ChatMessage({imageSrc, alt, username,message}) {
  return (
   <div className='flex'>
    <div className='flex my-2'>
        <ProfilePic src={imageSrc} alt={alt} imageClass='w-12 h-12 rounded-xl mr-2 ' />
        <div className='flex flex-col'>
            <Username username={username} />
            <p>{message}</p>
        </div>
    </div>
</div>
  )
}

export default ChatMessage