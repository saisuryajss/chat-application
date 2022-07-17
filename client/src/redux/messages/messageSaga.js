import { all, call, put, select, takeLatest } from "redux-saga/effects";
import { getAllMessages, sendMessage } from "../../utils/httpRequests";
import chatActionTypes from "../chats/chatActionTypes";
import getChats from "../chats/chatSelector";
import getSelectedChat from "../selectedChat/selectedChatSelector";
import messageActionTypes from "./messageActionTypes";


function* send({ payload: { text, chatId, token } }) {
    const response = yield sendMessage(text, chatId, token);
    if (response.status === 'ok') {
        const { data } = response;
        yield put({ type: messageActionTypes.ADD_NEW_MESSAGE, payload: data });
        yield put({ type: messageActionTypes.MESSAGE_SENT_SUCCESSFULLY, payload: data });
        const chats = yield select(getChats);
        const otherChats = chats.filter((ct) => ct._id !== data._id);
        const payload = {
            otherChats,
            newChat: data
        };
        yield put({ type: chatActionTypes.UPDATE_CHAT, payload: payload });
    }
    else {
        console.log(response);
    }
}

function* getMessages({ payload: { chatId, token } }) {
    const response = yield getAllMessages(chatId, token);
    if (response.status === 'ok') {
        yield put({ type: messageActionTypes.SET_MESSAGES, payload: response.data });
        const selectedChat = yield select(getSelectedChat);
        yield put({ type: messageActionTypes.MESSAGES_FETCHED_SUCCESSFULLY, payload: selectedChat._id });
    }
    else {
        console.log(response);
    }
}

function* getAllUserMessages() {
    yield takeLatest(messageActionTypes.GET_ALL_MESSAGES, getMessages);
}

function* sendNewMessage() {
    yield takeLatest(messageActionTypes.SEND_MESSAGE, send);
}

export default function* messageSaga() {
    yield all([
        call(sendNewMessage),
        call(getAllUserMessages)
    ])
}