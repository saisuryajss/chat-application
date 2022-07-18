import io from 'socket.io-client';
import chatActionTypes from '../chats/chatActionTypes';
import messageActionTypes from '../messages/messageActionTypes';
import socketActionTypes from './socketActionTypes';
import userActionTypes from '../user/userActionTypes';

export default function socketMiddleware() {
    let socket = null;

    return store => next => action => {
        switch (action.type) {
            case socketActionTypes.SET_UP:
                if (socket && socket.active) {
                    break;
                }
                socket = io.connect('http://localhost:5000', {
                    reconnection: true,
                    reconnectionDelay: 1000,
                    reconnectionDelayMax: 5000,
                    reconnectionAttempts: Infinity
                });
                socket.emit('setup', action.payload);
                socket.on('connected', () => {
                    console.log('connected to socket');
                });
                socket.on('added to group', (newChat) => {
                    store.dispatch({ type: chatActionTypes.ADD_NEW_CHAT, payload: newChat });
                });
                socket.on('message received', (msg) => {
                    console.log(msg);
                    const chats = store.getState().chats;
                    const selectedChat = store.getState().selectedChat;
                    const otherChats = chats.filter((ct) => ct._id !== msg.chat._id);
                    if (msg && selectedChat && msg.chat._id === selectedChat._id) {
                        const payload = {
                            otherChats,
                            newChat: msg.chat
                        }
                        store.dispatch({ type: chatActionTypes.UPDATE_CHAT, payload: payload });
                        store.dispatch({ type: messageActionTypes.ADD_NEW_MESSAGE, payload: msg });
                    }
                    else {
                        store.dispatch({ type: chatActionTypes.NEW_CHAT, payload: msg });
                    }
                });
                break;
            case userActionTypes.SIGN_OUT:
                socket.disconnect();
                break;
            case messageActionTypes.MESSAGE_SENT_SUCCESSFULLY:
                socket.emit('new message', action.payload);
                const element = document.getElementById('message-txt-area');
                element.value = '';
                break;
            case messageActionTypes.MESSAGES_FETCHED_SUCCESSFULLY:
                socket.emit('join chat', action.payload);
                break;
            case chatActionTypes.CREATED_GROUP_SUCCESSFULLY:
                socket.emit('add to group', action.payload);
                break;
            default:
                break;
        }
        return next(action);
    };
};
