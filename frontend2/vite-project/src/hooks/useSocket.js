// useSocket.js
import { useEffect, useRef } from "react";
import {io} from 'socket.io-client';
import { useSelector } from "react-redux";

const useSocket = () =>{
    const socketRef = useRef();
    const token = useSelector((state)=>state.auth.token);

    useEffect(()=>{
        if(token){
            socketRef.current = io('http://localhost:3000',{
                auth:{
                    token,
                },
            });

            return ()=>{
                if(socketRef.current){
                    socketRef.current.disconnect();
                }
            };
        }
    },[token]);

    const joinChannel = (channelId)=>{
        if(socketRef.current){
            socketRef.current.emit('joinRoom',channelId);
        }
    };

    const sendMessage = (messageData) =>{
        if(socketRef.current){
            socketRef.current.emit('sendMessage',messageData);
        }
    };

    return {
        socket : socketRef.current,
        joinChannel,
        sendMessage,
    };
};

export default useSocket;