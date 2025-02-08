// /src/components/ChatWrapper.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import Chat from './Chat';

const ChatWrapper = () => { //Functional component to server as a container for the chat component.
  const { sellerId } = useParams(); //useParams return an object containing URL parameters.
  return <Chat sellerId={sellerId} />;
};

export default ChatWrapper;
