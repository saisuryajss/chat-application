import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import getChats from '../../redux/chats/chatSelector';
import getSelectedChat from '../../redux/selectedChat/selectedChatSelector';
import { getLoggedUser } from '../../redux/user/userSelectors';
import { ChatState } from '../../utils/ChatProvider';
import { getAllMessages, sendMessage } from '../../utils/httpRequests';
import MessageItem from '../message item/MessageItem';
import './Messages.css';

function Messages({ socket }) {
    const chats = useSelector(getChats);
    const { setChats } = ChatState();
    const selectedChat = useSelector(getSelectedChat);
    const user = useSelector(getLoggedUser);
    const [messages, setMessages] = useState([]);
    const inputRef = useRef();

    function scrollToBottom() {
        let target = document.getElementsByClassName('m-ref-block');
        target[0].scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
        })
    }

    async function handleKeyDown(event) {
        if (event.key === 'Enter' && inputRef.current.value) {
            event.preventDefault();
            const response = await sendMessage(inputRef.current.value, selectedChat._id, user.token);
            if (response && response.data) {
                inputRef.current.value = '';
                await socket.emit('new message', response.data);
                setMessages([...messages, response.data]);
                const otherChats = chats.filter((ct) => ct._id !== response.data.chat._id);
                setChats([...otherChats, response.data.chat]);
            }
        }
    }

    async function fetchMessages() {
        const response = await getAllMessages(selectedChat._id, user.token);
        if (response && response.data) {
            setMessages(response.data);
            socket.emit('join chat', selectedChat._id)
        }
    }

    useEffect(() => {

    }, [user]);

    useEffect(() => {
        fetchMessages();
        scrollToBottom();
    }, [selectedChat]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className='messages'>
            <div className='m-message-holder'>
                {
                    messages ? messages.map((message, idx) =>
                        <MessageItem
                            key={idx}
                            url={message.sender.pic}
                            message={message.content}
                            senderName={message.sender.name}
                            isLoggedUser={user._id === message.sender._id}
                            leftOrRight={message.sender._id === user._id ? 'right' : 'left'}
                        />)
                        : <></>
                }
                <div className='m-ref-block' >

                </div>
            </div>
            <form onKeyDown={handleKeyDown}>
                <div className='m-input-field'>
                    <textarea ref={inputRef} />
                </div>
            </form>

        </div>
    )
}

export default Messages;