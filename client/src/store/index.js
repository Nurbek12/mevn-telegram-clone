import { createStore } from 'vuex';
import axios from 'axios';
import router from '../router';
import { beginToken } from '../main';
import { io } from 'socket.io-client';

const url = 'http://localhost:5000';
const socket = io(url);

// const url = '';
// const socket = io('/');

const store = createStore({
    state: {
        user: JSON.parse(localStorage.getItem('telegram-clone-user')) || null,
        token: localStorage.getItem('telegram-clone-token') || null,
        status: '',
        darktheme: true,
        navOpen: false,
        staticurl: '',
        currentRoom: null,
        roomMessages: [],
        onlineusers: [],
        rooms: [],
        settingmodal: false,
        userinfomodal: false,
        scrollBox: document.getElementById('box'),
        creategroupmodal: false,
        slider: [],
        alertmessages: [],
    },
    getters: {
        isLoggedIn: state => !!state.user,
        user: state => state.user,
        currentRoom: state => state.currentRoom,
        messages: state => state.roomMessages,
        online: state => state.onlineusers,
        rooms: state => state.rooms,        
        sortedMessages: (state) => {
            if (state.roomMessages.length === 0) return;
                let firsttime = state.roomMessages[0].date.day;
                let messages = [[]];
                let j = 0;
                for (let i = 0; i < state.roomMessages.length; i++) {
                if (firsttime === state.roomMessages[i].date.day) {
                    messages[j].push(state.roomMessages[i]);
                } else {
                    messages.push([state.roomMessages[i]]);
                    firsttime = state.roomMessages[i].date.day;
                    j++;
                }
            }
            return messages;
        },
        staticurl: state => state.staticurl,
        settingmodal: state => state.settingmodal,
        scrollBox: state => state.scrollBox,
        creategroupmodal: state => state.creategroupmodal,
        userinfomodal: state => state.userinfomodal,
        slider: state => state.slider,
        alertmessages: state => state.alertmessages,
        windowWidth: () => window.innerWidth,
        currentRoomAvatar: state => state.currentRoom?.avatar[state.currentRoom?.avatar.length - 1],
    },
    actions: {
        emailSend: async ({commit}, email) => {
            commit('begin_request');
            const { data } = await axios.post(`${url}/users/beginverify`, { email })
            if(data.success){
                commit('user_register', data);
            }else{
                commit('error_request');
            }
        },
        codeSend: async ({commit}, userdata) => {
            commit('begin_request');
            const { data } = await axios.post(`${url}/users/verifycode`, userdata);
            beginToken(data.token);
            if(data.success){
                commit('set_data', data);
                router.push('/');
            }else{
                commit('error_request');
            }
            return data.success
        },
        updateProfile: async ({commit, dispatch, getters}, userData) => {
            commit('begin_request');
            const {data} = await axios.put(`${url}/users/update/${getters.user._id}`, userData);
            if(data.success){
                commit('success_request');
                commit('set_user', data.user)
                if(userData.registered){
                    await dispatch('subscrGroup', '62e47d817c83f921d94d59cf');
                }
                router.push('/');
            }else{
                commit('error_request');
                router.push('/login');
            }
            return data
        },
        getProfile: async ({commit}, id) => {
            const { data } = await axios.get(`${url}/users/finduser/${id}`);
            if(data.success){
                commit('set_user', data.data);
            }else{
                commit('error_request');
            }
        },
        uploadAvatar: async ({commit, getters, dispatch}, formdata) => {
            commit('begin_request');
            if(getters.user.avatar.length >= 10){
                await dispatch('deleteAvatar', {filename: getters.user.avatar[0]})
            }
            const {data} = await axios.put(`${url}/upload/useravatar/${getters.user._id}`, formdata)
            if(data.success){
                dispatch('getProfile', getters.user._id);
            }
        },
        deleteAvatar: async ({getters, dispatch}, formdata) => {
            const {data} = await axios.put(`${url}/upload/useravatar/delete/${getters.user._id}`, formdata)
            if(data.success){
                dispatch('getProfile', getters.user._id);
            }
        },
        changeRoom: async ({commit, dispatch, getters}, chatdata) => {
            const { messages, ...userdata } = chatdata[0];
            messages?.forEach((mess) => {
                if(((mess.sender?._id !== getters.user._id)||mess.sender===null)&&!mess.view){
                    dispatch('viewMessage', {...mess, receiver: (userdata.group?userdata._id:userdata.members[0]) })
                    mess.view = true;
                }
            });
            if(chatdata[1]){
                commit('setRoom', [userdata, true]);
            }else{
                const room = getters.rooms.filter(rm => (rm.group?rm._id:rm.members[0]) === userdata._id)[0];
                if(room){
                    room.messages?.forEach((mess) => {
                        if(((mess.sender?._id !== getters.user._id)||mess.sender===null)&&!mess.view){
                            dispatch('viewMessage', {...mess, receiver: (room.group?room._id:room.members[0]) })
                            mess.view = true;
                        }
                    });
                    commit('setRoom', [room, true]);
                    commit('set_messages', room.messages);
                    return
                }else{
                    commit('setRoom', [userdata, false]);
                }
            }
            commit('set_messages', messages);
        },
        getAllChat: async ({commit, getters}) =>{
            const { data } = await axios.get(`${url}/chat/${getters.user._id}`);
            const rooms = data.chats;
            rooms.forEach(r => {
                if(!r.group){
                    r.users = r?.users.filter(u => u._id !== getters.user._id)
                }
                r.members = r.members.filter(u => u !== getters.user._id)
                r.typedUsers = [];
                return r
            })
            commit('set_rooms', rooms)
        },
        createChat: async ({commit, getters}, user) => {
            commit('begin_request');
            const users = [
                user._id,
                getters.user._id
              ]
              const members = [
                user._id,
                getters.user._id
              ]
            const { data } = await axios.post(`${url}/chat`, {users, members});
            return data.result;
        },
        deleteChat: async ({commit}, fdata) => {
            const { data } = await axios.delete(`${url}/chat/delete/chat/${fdata.id}`);
            if(data.success){
                commit('delete_chat', fdata.id);
                socket.emit('delete-chat', fdata);
            }
        },
        searchChat: async ({commit}, txt) => {
            commit('begin_request');
            const {data} = await axios.get(`${url}/chat/findchat/${txt}`);
            return data.resl;
        },
        messageImage: async ({commit}, fdata) => {
            commit('begin_request');
            const {data} = await axios.post(`${url}/upload/message/photo`, fdata)
            if(data.success){
                return data.result
            }
        },
        sendMessage: async ({commit, getters, dispatch}, fdata) => {
            const room = getters.rooms.filter(rm => (rm.group?rm._id:rm.members[0]) === fdata.receiver._id)[0];
            if(room){
                const {data} = await axios.post(`${url}/message`, fdata);
                socket.emit('send-message', {message: data.message, id: fdata.receiver._id});
                commit('addMessage', data.message);
            }else{
                if(fdata.receiver.group) return;
                const chat = await dispatch('createChat', fdata.receiver);
                commit('add_rooms', {...chat, typedUsers: [], messages: []});
                socket.emit('add-chat', [chat, fdata.receiver._id])
                commit('set_messages', getters.rooms.find(r => r._id === chat._id).messages);
                const mychat = getters.rooms.find(r => r._id === chat._id);
                mychat.users = mychat.users.filter(u => u._id !== getters.user._id)
                mychat.members = mychat.members.filter(u => u !== getters.user._id)
                dispatch('changeRoom', [mychat, true]);
                fdata.chatId = chat._id;
                const {data} = await axios.post(`${url}/message`, fdata);
                socket.emit('send-message', {message: data.message, id: fdata.receiver._id});
                commit('addMessage', data.message);
            }
        },
        updateGroup: async ({ getters, dispatch}, userData) => {
            if(!userData.name.trim()) return
            const {data} = await axios.put(`${url}/chat/update/group/${getters.currentRoom.chatId}`, userData);
            if(data.success){
                dispatch('getAllChat')
            }
        },
        uploadGroupAvatar: async ({commit, dispatch}, formdata) => {
            commit('begin_request');
            const {data} = await axios.put(`${url}/upload/groupavatar/${formdata.get('id')}`, formdata);
            if(data.success){
                dispatch('getAllChat');
            }
        },
        createGroup: async ({commit, dispatch}, fdata) => {
            const { data } = await axios.post(`${url}/chat/create/group`, 
                {name: fdata.get('name'), admin: fdata.get('admin')});
            if(data.success){
                commit('set_creategroupmodal', false)
                if(fdata.has('filename')){
                    fdata.append('id', data.group._id)
                    dispatch('uploadGroupAvatar', fdata);
                    return
                }
                socket.emit('join-group', data.group._id)
                dispatch('getAllChat');
            }
        },
        createConnection: ({commit, dispatch, getters}) => {
            socket.emit('new-user-add', getters.user._id)
            socket.on('get-users', (data) => {
                commit('set_onlineusers', data);
            });
            socket.on('user-typing', (data) => {
                commit('userTyping', data);
            })
            socket.on('add-chat-user', (data) => {
                if(!data.group){
                    data.users = data.users.filter(u => u._id !== getters.user._id)
                }
                data.members = data.members.filter(u => u !== getters.user._id)
                data.typedUsers = [];
                data.messages = [];
                commit('add_rooms', data);
                commit('set_messages', getters.rooms.find(r => r._id === data._id).messages);
            });
            socket.on('receive-message', (data) => {
                commit('addMessage', data);
                if(getters.currentRoom?.chatId !== data.chatId){
                    commit('set_alert', data)
                }else{
                    getters.rooms.find(r => r._id === data.chatId)
                    .messages.map(m => {
                        if(m.view === false) m.view = true;
                        return m
                    });
                    if((data.sender?._id !== getters.user._id)||data.sender===null){
                        dispatch('viewMessage', {...data, receiver: getters.currentRoom._id})
                    }
                }
            });
            socket.on('deleted-chat', (data) => {
                commit('delete_chat', data.id);
            })
            socket.on('delete_user_group', (data) => {
                commit('delete_user_group', data);
            })
            socket.on('add-user', (data) => {
                getters.rooms.find(r => r._id === data.id).users.push(data.data);
            });
            socket.on('user-view-message', (data) => {
                getters.rooms.find(r => r._id === data.chatId)
                .messages.map(m => {
                    if(m._id === data._id) m.view = true;
                    return m
                });
            });
        },
        typingText: ({getters}, text) => {
            socket.emit('me-typing', {
                id: getters.user._id,
                receiver: getters.currentRoom._id,
                chatId: getters.currentRoom.chatId,
                name: getters.user.name,
                typing: !!text.trim()
            })
        },
        subscrGroup: async ({commit, dispatch, getters}, id) => {
            const {data} = await axios.put(`${url}/chat/join/group/${id}`, {id: getters.user._id, name: getters.user.name});
            if(data.success){
                socket.emit('join-group', data.data._id)
                commit('add_rooms', {...data.data, typedUsers: []});
                socket.emit('add-user-group', {data: {
                    _id: getters.user._id, 
                    name: getters.user.name, 
                    email: getters.user.email,
                    avatar: getters.user.avatar,
                    usercolor: getters.user.usercolor
                }, id})
                getters.rooms.find(r => r._id === data.data._id).users.push(getters.user);
                commit('set_messages', getters.rooms.find(r => r._id === data.data._id).messages);
                const mychat = getters.rooms.find(r => r._id === data.data._id);
                dispatch('changeRoom', [mychat, true]);
                socket.emit('send-message', {message: data.message, id});
                commit('addMessage', data.message)
            }
        },
        unjoingroup: async ({commit, }, fdata) => {
            commit('begin_request');
            const { data } = await axios.put(`${url}/chat/unjoin/group/${fdata.id}`, fdata);
            if(data.success){
                commit('delete_chat', fdata.id);
                socket.emit('delete-user-group', fdata);
                socket.emit('leave', fdata.id);
                socket.emit('send-message', {message: data.message, id: fdata.id});
            }
        },
        viewMessage: async ({commit}, message) => {
            commit('begin_request');
            const { data } = await axios.put(`${url}/message/view/${message._id}`);
            if(data.success){
                socket.emit('view-message', message)
            }
        }
    },
    mutations: {
        openNav(state, b){
            state.navOpen = b;
        },
        opensettings(state, b){
            state.settingmodal = b;
        },
        changeTheme(state){
            document.body.classList.toggle('light-theme');
            state.darktheme = !state.darktheme;
        },
        begin_request: state => state.status = 'loading',
        success_request: state => state.status = 'success',
        error_request: state => state.status = 'error',
        set_user_info_modal: (state, data) => state.userinfomodal = data,
        set_sliders: (state, data) => state.slider = data,
        set_alert: (state, data) => {
            const room = state.rooms.find(u => u._id === data.chatId);
            if(!room) return;
            state.alertmessages.push({room: room.group?room:room.users[0], message: data});
            document.getElementById('sound').click();
            setTimeout(() => {
                state.alertmessages = state.alertmessages.filter(m => m.message._id !== data._id)
            }, 6000);
        },
        set_data: (state, data) => {
            localStorage.setItem('telegram-clone-user', JSON.stringify(data.user));
            localStorage.setItem('telegram-clone-token', data.token);
            state.user = data.user;
            state.token = data.token;
        },
        set_user: (state, data) => {
            localStorage.setItem('telegram-clone-user', JSON.stringify(data));
            state.user = data;
        },
        user_register: (state, data) => state.user = { _id: data.id, registered: data.registered },
        logout: state => {
            localStorage.removeItem('telegram-clone-user');
            localStorage.removeItem('telegram-clone-token');
            state.user = null;
            state.token = null;
            state.status = '';
            state.currentRoom = null;
            state.roomMessages = [];
            state.onlineusers = [];
            state.rooms = [];
            state.text = '';
            router.push('/login');
        },
        setRoom: (state, room) => {
            if(room[1]){
                const data = room[0].group?room[0]:room[0].users[0]
                state.currentRoom = {
                    chatId: room[0]._id,
                    typedUsers: room[0].typedUsers || [],
                    ...data
                }
            }else{
                state.currentRoom = {
                    chatId: room[0]._id,
                    typedUsers: room[0].typedUsers || [],
                    ...room[0]
                }
            }
        },
        set_creategroupmodal: (state, b) => state.creategroupmodal = b,
        set_rooms: (state, rooms) => state.rooms = rooms,
        add_rooms: (state, room) => state.rooms.push(room),
        set_messages: (state, data) => state.roomMessages = data || [],
        set_onlineusers: (state, data) => state.onlineusers = data,
        addMessage: (state, data) => {
            state.rooms.map(rm => {
                if(rm._id === data.chatId){
                    rm.messages.push(data)
                    return rm
                }
            })
            const box = document.getElementById('box');
            if(box){
                setTimeout(() => {
                    box.scrollTop = box.scrollHeight;
                }, 100)
            }
        },
        userTyping: (state, data) => {
            state.rooms.map(rm => {
                if(rm._id === data.chatId){
                    if(data.typing){
                        if(rm.typedUsers.filter(r => r.id === data.id).length === 0){
                            rm.typedUsers.push(data)
                        }
                    }else{
                        rm.typedUsers = rm.typedUsers.filter(u => u.id !== data.id)
                        if(state.currentRoom){
                            state.currentRoom.typedUsers = rm.typedUsers;
                        }
                    }
                    return rm
                }
            })
        },
        delete_chat: (state, id) => {
            state.rooms = state.rooms.filter(u => u._id !== id);
            if(state.currentRoom?.chatId === id){
                state.currentRoom = null;
                state.roomMessages = [];
            }
        },
        delete_user_group: (state, data) => {
            state.rooms.forEach(rm => {
                if(rm._id === data.id){
                    rm.users = rm.users.filter(u => u._id !== data.userid)
                    rm.members = rm.users.filter(u => u._id !== data.userid)
                }
            })
            if(state.currentRoom?.chatId === data.id){
                state.currentRoom.users = state.currentRoom.users.filter(u => u._id !== data.userid)
                state.currentRoom.members = state.currentRoom.users.filter(u => u._id !== data.userid)
            }
        },
        clearRoom: state => {
            state.roomMessages = [];
            state.currentRoom = null;
        }
    },
});

export default store