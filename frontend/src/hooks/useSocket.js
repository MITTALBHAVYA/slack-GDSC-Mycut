// useSocket.js
import { useEffect, useRef, useCallback } from "react";
import {io} from 'socket.io-client';
import { useSelector,useDispatch } from "react-redux";
import { addMessage } from "../features/messageSlice";

const useSocket = () =>{
    const socketRef = useRef();
    const dispatch = useDispatch();
    const token = useSelector((state)=>state.auth.token);

    useEffect(()=>{
        if(token){
            socketRef.current = io(import.meta.env.VITE_SOCKET_URL,{
                auth:{
                    token,
                },
            });
            socketRef.current.on('newMessage',(message)=>{
                dispatch(addMessage(message));
            });
            socketRef.current.on('error',(error)=>{
                console.error('from useSocket error: ',error);
            });
            return ()=>{
                if(socketRef.current){
                    socketRef.current.disconnect();
                }
            };
        }
    },[token,dispatch]);

    const joinChannel = useCallback((channelId)=>{
        if(socketRef.current){
            socketRef.current.emit('joinRoom',channelId);
        }
    },[]);

    const sendMessage = useCallback((messageData) => {
        if (socketRef.current) {
          socketRef.current.emit('sendMessage', messageData);
        }
    }, []);

    return {
        socket : socketRef.current,
        joinChannel,
        sendMessage,
    };
};

export default useSocket;