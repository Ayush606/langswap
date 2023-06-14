import React from 'react';
import Link from 'next/link';

const CallNotification = ({ name, onIgnore, onAnswer }) => {
  return (
    <div className='absolute top-20 left-2 right-0 w-[98%] h-16 z-10 bg-zinc-800 rounded-lg  text-white text-center  items-center'>
        <div className="flex justify-between">
        <h1 className="text-2xl font-bold p-1 m-3">{name} Is Calling You</h1>
        <div>
            <button
            onClick={onAnswer}
            // href={`/chat/id-${callerPeerId}/video`}
            className="bg-green-500 hover:bg-green-800 rounded-md font-bold p-2 my-3 mx-3"
            >
            Answer
            </button>
            <button
            onClick={onIgnore}
            className="bg-red-500 hover:bg-red-800 rounded-md font-bold p-2 my-3 mx-3"
            >
            Ignore
            </button>
        </div>
        </div>
    </div>
  );
};

export default CallNotification;