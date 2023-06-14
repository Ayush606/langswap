'use client';
import React, { useEffect, useState, useRef } from "react";
import { createCall } from '@/utils/appwrite-utils';
import { useAppContext } from '@/app/context/AppContext'
import toast from 'react-hot-toast';



const Video = () => {
    const { accountInfo, setAccountInfo } = useAppContext();
    const [friendId, setFriendId] = useState('');
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [isVideoCalling, setIsVideoCalling] = useState(false);
    const [peerId, setPeerId] = useState('');
    const [remotePeerIdValue, setRemotePeerIdValue] = useState('');
    const remoteVideoRef = useRef(null);
    const currentUserVideoRef = useRef(null);
    const peerInstance = useRef(null);

    useEffect(() => {
        const loading = toast.loading('Give Permission to access camera and microphone');
        //getting permission for video and audio
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((res) => {
                toast.success('Permission granted', { id: loading });
            })
            .catch((err) => {
                toast.error('Permission denied' + err.message, { id: loading });
                console.log(err);
                // going back to chat page
                // window.history.back();

            })
        // getting friend id from url
        const friendId = window.location.pathname.split('/')[2];
        setFriendId(friendId);

        if (friendId.includes('id-')) {
            const remotePeerId = friendId.replace('id-', '');
            setRemotePeerIdValue(remotePeerId);
        }
        import("peerjs").then(({ default: Peer }) => {
            // normal synchronous code
            const peer = new Peer();

            peer.on('open', (id) => {
                setPeerId(id)
            });

            peer.on('call', (call) => {
                toast.success('Call received');
                var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

                getUserMedia({ video: true, audio: true }, (mediaStream) => {
                    setLocalStream(mediaStream);
                    currentUserVideoRef.current.srcObject = mediaStream;
                    currentUserVideoRef.current.play();
                    call.answer(mediaStream)
                    call.on('stream', function (remoteStream) {
                        remoteVideoRef.current.srcObject = remoteStream
                        remoteVideoRef.current.play();
                    });
                });
            })
            peerInstance.current = peer;
        })
    }, [])

    // effect for creating call
    useEffect(() => {

        // 
        if (Object.keys(accountInfo).length !== 0 && peerId !== '' && friendId.includes('id-') === false) {
            setIsVideoCalling(true);
            console.log('isVideoCalling')
            createCall(accountInfo.$id, friendId, peerId, 'ringing', accountInfo.name).then((res) => {
                console.log(res);
            }).catch((err) => {
                console.log(err);
                // going back to chat page
                window.history.back();
            })
        }
    }, [accountInfo, peerId])


    const call = (remotePeerId) => {
        setIsVideoCalling(true);
        var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        getUserMedia({ video: true, audio: true }, (mediaStream) => {
            setRemoteStream(mediaStream);
            currentUserVideoRef.current.srcObject = mediaStream;
            currentUserVideoRef.current.play();
            const call = peerInstance.current.call(remotePeerId, mediaStream)
            call.on('stream', (remoteStream) => {
                remoteVideoRef.current.srcObject = remoteStream
                remoteVideoRef.current.play();
            });
        });
    }

    const hangUp = () => {
        if (localStream !== null) {
            localStream.getTracks().forEach(track => track.stop());
        }
        if (remoteStream !== null) {
            remoteStream.getTracks().forEach(track => track.stop());
        }
        setIsVideoCalling(false);
        window.history.back();


    }

    return (
        <div className="App p-4">
            {/* <h1 className="text-2xl font-bold mb-4">Current user id is {peerId}</h1> */}
            <div className="flex items-center mb-4">
                {/* <input
                    type="text"
                    value={remotePeerIdValue}
                    onChange={e => setRemotePeerIdValue(e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 mr-2"
                /> */}
            </div>
            <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/2">
                    <h2 className="text-lg font-bold mb-2 text-center">Local Video</h2>
                    <video
                        ref={currentUserVideoRef}
                        className="w-full border border-gray-300"
                        autoPlay
                        playsInline
                    />
                </div>
                <div className="w-full md:w-1/2">
                    <h2 className="text-lg font-bold mb-2 text-center">Remote Video</h2>
                    <video
                        ref={remoteVideoRef}
                        className="w-full border border-gray-300"
                        autoPlay
                        playsInline
                    />
                </div>
            </div>

            {/* dive to center two buttons */}
            <div className="flex justify-center mt-4">
                {
                    friendId.includes('id-') === false ? '' :
                        isVideoCalling && friendId.includes('id-') ? '' :
                            (
                                <button
                                    onClick={() => call(remotePeerIdValue)}
                                    className="px-4 py-2 m-2 bg-blue-500 text-white rounded"
                                >
                                    Click To Start The Call
                                </button>
                            )
                }
                <button
                    onClick={() => hangUp()}
                    className="px-4 py-2 m-2 bg-red-500 text-white rounded"
                >
                    Hang Up
                </button>
            </div>

        </div>
    );
}



export default Video;
