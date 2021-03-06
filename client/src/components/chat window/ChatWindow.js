import React from 'react';
import { ChatState } from '../../utils/ChatProvider';
import './ChatWindow.css';
import ChatMenu from '../chat menu/ChatMenu';
import Messages from '../messages/Messages';

function ChatWindow({ socket }) {
  const { user, selectedChat } = ChatState();
  console.log(selectedChat);
  console.log(socket);
  function getOtherUser(users) {
    if (!user || !users) {
      return null;
    }
    if (users.length === 1) {
      return;
    }
    return users[0]._id === user._id ? users[1] : users[0];
  }

  return (
    <>
      {
        selectedChat ?
          <div className={`chat-window`} >
            <div className='cw-header'>
              <div >
                <h4>{
                  selectedChat.isGroupChat ? selectedChat.chatName : getOtherUser(selectedChat.users).name
                }</h4>
              </div>
              {
                selectedChat.isGroupChat ? <ChatMenu chat={selectedChat} />
                  : <></>
              }
            </div>
            <div className='cw-chat'>
              {
                selectedChat ?
                  <Messages socket={socket} />
                  : <></>
              }
            </div>
          </div>
          :
          <div className='cw-no-user'>
            <h4>Select a user to Chat</h4>
          </div>
      }

    </>
  )
}

export default ChatWindow;