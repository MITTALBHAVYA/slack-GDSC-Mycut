import { useEffect, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import { useSelector, useDispatch } from "react-redux";
import { addMessage } from "../features/messageSlice";

const useSocket = () => {
  const socketRef = useRef(null); // Initialize socketRef as null
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    // Create socket connection only if it doesn't exist
    if (token && !socketRef.current) {
      socketRef.current = io(import.meta.env.VITE_SOCKET_URL, {
        auth: {
          token,
        },
      });

      socketRef.current.on("newMessage", (message) => {
        dispatch(addMessage(message));
      });

      socketRef.current.on("error", (error) => {
        console.error("from useSocket error: ", error);
      });
    }

    // Cleanup the socket connection when the component unmounts or token changes
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null; // Reset the socket reference
      }
    };
  }, [token, dispatch]);

  const joinChannel = useCallback((channelId,userId) => {
    if (socketRef.current) {
      socketRef.current.emit("joinRoom", channelId,userId);
    }
  }, []);

  const sendMessage = useCallback((messageData) => {
    if (socketRef.current) {
      socketRef.current.emit("sendMessage", messageData);
    }
  }, []);

  return {
    socket: socketRef.current,
    joinChannel,
    sendMessage,
  };
};

export default useSocket;
