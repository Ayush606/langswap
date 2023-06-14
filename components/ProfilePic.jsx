import React from 'react'

function ProfilePic({imageClass,src, alt}) {
  return (

      <img className={imageClass} src={src} alt={alt} />
  )
}

export default ProfilePic