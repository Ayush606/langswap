import Link from 'next/link'
import React from 'react'
import Country from '@/components/Country'
import LanguageList from './LanguageList'

const UserCard = ({name, nativeCountry, profileSrc, currentCity, currentCountry,  languageKnow, languageWant,coverSrc, ctaText, ctaLink }) => {
  return (
    <>
    
<div className="w-96 relative m-4 group cur rounded-xl bg-sky-400 block">
  <Link href={ctaLink} className="block">
    <img className="w-full rounded-xl h-44 object-cover object-center" src={coverSrc} alt="Cover Image" />
    <div className="px-6 py-4">
      <div className="flex -mt-12">
        <img className="w-24 h-24 rounded-xl border-4 border-white" src={profileSrc} alt="Profile Picture" />
      </div>
      <div className="mt-4">
        <div className="font-bold text-xl mb-2 ">{name}</div>
        <div className="your-class">
          <p className="text-md font-bold inline-block mr-2">Native Country:</p>
          <Country countryName={nativeCountry} flagClass="w-8 h-8 inline-block ml-1" />
        </div>
        <div className="your-class">
          <p className="text-md font-bold inline-block mr-2">Currently live:</p>
          <p className="text-base inline-block mr-1">{currentCity + `\ in`}</p>
          <Country countryName={currentCountry} flagClass="w-8 h-8 inline-block ml-1" />
        </div>
        <div className="your-class">
          <p className="text-md font-bold inline-block mr-2">Language Know:</p>
          <LanguageList languages={languageKnow} />
        </div>
        <div className="your-class">
          <p className="text-md font-bold inline-block mr-2">Language Want to learn:</p>
          <LanguageList languages={languageWant} />
        </div>
      </div>
    </div>
  </Link>
  <Link
    href={ctaLink}
    className="absolute bottom-0 left-0 w-full bg-zinc-800 text-white text-center py-2 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
  >
    View Profile
  </Link>
</div>

</>
  )
}

export default UserCard