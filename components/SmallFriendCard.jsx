import Link from 'next/link'
import React from 'react'

function SmallFriendCard({imageSrc, name, id}) {
  return (
    <>
    <Link href={`/chat/${id}`}>
    <div className='flex p-4 border-b border-zinc-600 cursor-pointer hover:bg-zinc-600 '>
        <div>
            <img src={imageSrc} alt={name + ' profile picture'}  className='h-12 w-12 rounded-xl'/>
        </div>
        <div className='m-3'>
            <p>{name}</p>
        </div>
    </div>
    </Link>
    </>
  )
}

export default SmallFriendCard