'use client'
import { useState, useEffect } from 'react';
import countries from '/public/data/countries.json';
import languages from '/public/data/languages.json';
import { addUserProfile, updateUserProfile, uploadProfilePic, uploadCoverImage, getImage, getUserProfile } from '@/utils/appwrite-utils';
import { useAppContext } from '@/app/context/AppContext'
import toast from 'react-hot-toast';
export default function Settings() {
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [profilePicture, setProfilePicture] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [profilePicUrl, setProfilePicUrl] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [nativeCountry, setNativeCountry] = useState('');
  const [currentCity, setCurrentCity] = useState('');
  const [currentCountry, setCurrentCountry] = useState('');
  const [age, setAge] = useState();
  const [gender, setGender] = useState('');
  const [knownLanguages, setKnownLanguages] = useState([]);
  const [languagesToLearn, setLanguagesToLearn] = useState([]);
  const [about, setAbout] = useState('');
  const { accountInfo, setAccountInfo } = useAppContext();
  const { currentUserData, setCurrentUserData } = useAppContext();

  //handle first time user
  useEffect(() => {

    if (Object.keys(accountInfo).length === 0) {
      return
    }
    // getting user profile
    getUserProfile(accountInfo.$id)
      .then((res) => {
        // if current userData is empty, then setting it
        if (Object.keys(currentUserData).length === 0) {
          setCurrentUserData(res);
        }
        toast(res.name + ', here you can update your profile')
        setIsFirstTime(false);
        // setting user profile
        setProfilePicture(res.profilePic);
        setCoverImage(res.coverImage);
        setProfilePicUrl(res.profilePic);
        setCoverImageUrl(res.coverImage);
        setFullName(res.name);
        setUsername(res.username);
        setNativeCountry(res.nativeCountry);
        setCurrentCity(res.currentCity);
        setCurrentCountry(res.currentCountry);
        setAge(res.age);
        setGender(res.gender);
        setKnownLanguages(res.languagesKnow);
        setLanguagesToLearn(res.languagesWant);
        setAbout(res.about);
      })
      .catch((error) => {
        // notifying user to complete profile
        toast('Please complete this profile, to use our app, all fields are required', {
          icon: '👩‍🎨',
          style: {
            background: '#2b2b2b',
            color: '#fff',
          },
          duration: 10000,
        });
        setIsFirstTime(true);
        // setting user profile
        setProfilePicture('https://api.dicebear.com/6.x/fun-emoji/svg?seed=' + accountInfo.$id);
        setProfilePicUrl('https://api.dicebear.com/6.x/fun-emoji/svg?seed=' + accountInfo.$id);
        // setting user static cover image
        setCoverImage('https://raw.githubusercontent.com/Ayush606/Ayush606.github.io/main/cool-background.png');
        setCoverImageUrl('https://raw.githubusercontent.com/Ayush606/Ayush606.github.io/main/cool-background.png');
        console.log(error);
      })

  }, [accountInfo])

  // handle cover image change
  function handleCoverImageChange(e) {
    const file = e.target.files[0];
    setCoverImage(URL.createObjectURL(file));
    uploadCoverImage(accountInfo.$id, file)
      .then((res) => {
        toast.success('Cover Image Uploaded Successfully');
        console.log(res);
      })
      .catch((error) => {
        toast.error('Something went wrong');
        console.log(error);
      })

    const coverImage = getImage(accountInfo.$id + '-coverImage');
    setCoverImageUrl(coverImage.href);

  }

  // handle profile picture change
  function handleProfilePictureChange(e) {
    const file = e.target.files[0];
    setProfilePicture(URL.createObjectURL(file));

    uploadProfilePic(accountInfo.$id, file)
      .then((res) => {
        toast.success('Profile Picture Uploaded Successfully');
        console.log(res);
      })
      .catch((error) => {
        toast.error('Something went wrong');
        console.log(error);
      })

    const profilePic = getImage(accountInfo.$id + '-profilePic');
    setProfilePicUrl(profilePic.href);

  }

  function handleSave() {
    const loadingToast = toast.loading('Saving your profile...');
    // if any field is empty then return, username is excluded
    if (!fullName || !nativeCountry || !currentCity || !currentCountry || !age || !gender || !knownLanguages || !languagesToLearn || !about || !profilePicUrl || !coverImageUrl) {
      toast.dismiss(loadingToast);
      toast.error('Please fill all fields');
      return;
    }

    addUserProfile(
      accountInfo.$id,
      profilePicUrl,
      coverImageUrl,
      fullName,
      username,
      nativeCountry,
      currentCountry,
      currentCity,
      age,
      gender,
      knownLanguages,
      languagesToLearn,
      about
    ).then((res) => {
      setIsFirstTime(false);
      // add this data to current user data context
      setCurrentUserData(res);
      toast.dismiss(loadingToast);
      toast.success('Profile Saved Successfully. \n Redirecting to Your Profile...');
      window.location.href = `/profile/${accountInfo.$id}`;
      console.log(res);
    }).catch((error) => {
      toast.dismiss(loadingToast);
      toast.error('Something went wrong ' + error.message);
      console.log(error);
    });
  }

  // handle update profile
  function handleUpdate() {
    const loadingToast = toast.loading('Updating your profile...');
    // if any field is empty then return, username is excluded
    if (!fullName || !nativeCountry || !currentCity || !currentCountry || !age || !gender || !knownLanguages || !languagesToLearn || !about || !profilePicUrl || !coverImageUrl) {
      toast.dismiss(loadingToast);
      toast.error('Please fill all fields');
      return;
    }
    updateUserProfile(
      accountInfo.$id,
      profilePicUrl,
      coverImageUrl,
      fullName,
      username,
      nativeCountry,
      currentCountry,
      currentCity,
      age,
      gender,
      knownLanguages,
      languagesToLearn,
      about
    ).then((res) => {
      // add this data to current user data context
      setCurrentUserData(res);
      toast.dismiss(loadingToast);
      toast.success('Profile Updated Successfully. \n Redirecting to Your Profile...');
      window.location.href = `/profile/${accountInfo.$id}`;
      console.log(res);
    }).catch((error) => {
      toast.dismiss(loadingToast);
      toast.error('Something went wrong ' + error.message);
      console.log(error);
    });
  }

  return (
    <div className="p-4">
      <h2 className="text-lg text-center font-semibold mb-4">User Information</h2>
      <div className="mb-4">
        <label htmlFor="cover-image" className="block mb-2">Cover Image</label>
        <input
          type="file"
          id="cover-image"
          onChange={handleCoverImageChange}
        />
        {coverImage && (
          <div className="mt-2">
            <img
              src={coverImage}
              alt="Cover Image Preview"
              className="w-full h-40 object-cover rounded-xl"
            />
          </div>
        )}
      </div>
      <div className="mb-4">
        <label htmlFor="profile-picture" className="block mb-2 ">Profile Picture</label>
        <input
          type="file"
          id="profile-picture"
          onChange={handleProfilePictureChange}
        />
        {profilePicture && (
          <div className="mt-2">
            <img
              src={profilePicture}
              alt="Profile Picture Preview"
              className="w-16 h-16 rounded-xl object-cover"
            />
          </div>
        )}
      </div>
      <div className="mb-4">
        <label htmlFor="full-name" className="block mb-2">Full Name</label>
        <input
          type="text"
          id="full-name"
          value={fullName}
          placeholder='Enter your full name'
          onChange={e => setFullName(e.target.value)}
          className="border rounded w-full p-2 text-black "
        />
      </div>
      {/* <div className="mb-4">
        <label htmlFor="username" className="block mb-2">Username</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="border rounded w-full p-2"
        />
      </div> */}
      <div className="mb-4">
        <label htmlFor="native-country" className="block mb-2">Native Country</label>
        <select
          id="native-country"
          value={nativeCountry}
          onChange={e => setNativeCountry(e.target.value)}
          className="border rounded w-full p-2 text-black"
        >
          <option value="">Select a country</option>
          {countries.map(country => (
            <option key={country.code} value={country.code}>{country.name}</option>
          ))}

        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="current-city" className="block mb-2">Where are you currently located</label>
        <input
          type="text"
          id="current-city"
          value={currentCity}
          onChange={e => setCurrentCity(e.target.value)}
          placeholder="Enter your current city"
          className="border rounded w-full p-2 mb-2 text-black"
        />
        <select
          value={currentCountry}
          onChange={e => setCurrentCountry(e.target.value)}
          className="border rounded w-full p-2 text-black"
        >
          <option value="">Select a country</option>
          {countries.map(country => (
            <option key={country.code} value={country.code}>{country.name}</option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="age" className="block mb-2">Enter your age, Minimum age required is 14</label>
        <input
          type="number"
          id="age"
          value={age}
          onChange={e => setAge(e.target.value)}
          className="border rounded w-full p-2 text-black"
        />
      </div>
      <div className="mb-4">
        <span className="block mb-2">Select your gender</span>
        <label htmlFor="gender-male" className="mr-4">
          <input
            type="radio"
            name="gender"
            id="gender-male"
            value="Male 👨"
            checked={gender === 'Male 👨'}
            onChange={e => setGender(e.target.value)}
            className="mr-1"
          />
          Male 👨
        </label>
        <label htmlFor="gender-female" className="mr-4">
          <input
            type="radio"
            name="gender"
            id="gender-female"
            value="Female 👩"
            checked={gender === 'Female 👩'}
            onChange={e => setGender(e.target.value)}
            className="mr-1"
          />
          Female 👩
        </label>
        <label htmlFor="gender-nonbinary">
          <input
            type="radio"
            name="gender"
            id="gender-nonbinary"
            value="non-binary 🧑"
            checked={gender === 'non-binary 🧑'}
            onChange={e => setGender(e.target.value)}
            className="mr-1"
          />
          Non-binary 🧑
        </label>
      </div>
      <div className="mb-4">
        <label className="block mb-2">Select your known languages</label>
        <div className="mb-2">
          {knownLanguages.map((language, index) => (
            <span
              key={language}
              className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
            >
              {languages.find(lang => lang.code === language).name}
              <button
                type="button"
                onClick={() => setKnownLanguages(knownLanguages.filter((_, i) => i !== index))}
                className="ml-1 text-gray-500 hover:text-gray-600"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
        <select
          value=""
          onChange={e => setKnownLanguages([...knownLanguages, e.target.value])}
          className="border rounded w-full p-2 text-black"
        >
          <option value="">Select Languages</option>
          {languages
            .filter(language => !knownLanguages.includes(language.code))
            .map(language => (
              <option key={language.code} value={language.code}>{language.name}</option>
            ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-2">Select the languages you want to learn</label>
        <div className="mb-2">
          {languagesToLearn.map((language, index) => (
            <span
              key={language}
              className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
            >
              {languages.find(lang => lang.code === language).name}
              <button
                type="button"
                onClick={() => setLanguagesToLearn(languagesToLearn.filter((_, i) => i !== index))}
                className="ml-1 text-gray-500 hover:text-gray-600"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
        <select
          value=""
          onChange={e => setLanguagesToLearn([...languagesToLearn, e.target.value])}
          className="border rounded w-full p-2 text-black"
        >
          <option value="">Select a language</option>
          {languages
            .filter(language => !languagesToLearn.includes(language.code))
            .map(language => (
              <option key={language.code} value={language.code}>{language.name}</option>
            ))}
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="about" className="block mb-2">Write something about yourself</label>
        <textarea
          id="about"
          value={about}
          placeholder='Write something about yourself'
          onChange={e => setAbout(e.target.value)}
          rows="<EUGPSCoordinates>"
          className="<EUGPSCoordinates>border rounded w-full p-2 text-black"
        />
      </div>
      {
        isFirstTime ? (
          <button onClick={handleSave} type="<EUGPSCoordinates>button" className="<EUGPSCoordinates>bg-blue-500 bg-zinc-800 text-white hover:bg-zinc-600  font-bold py-2 px-4 rounded">
            Save
          </button>
        ) :
          <button onClick={handleUpdate} type="<EUGPSCoordinates>button" className="<EUGPSCoordinates>bg-blue-500 bg-zinc-800 text-white hover:bg-zinc-600 font-bold py-2 px-4 rounded">
            Update Profile
          </button>
      }


    </div>
  );
}
