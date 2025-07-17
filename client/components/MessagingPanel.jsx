import React, { useEffect, useState, useRef } from 'react';
import socket from '../utils/socket.js';
import { authFetch } from '../utils/authFetch.js';
import Messagesocket from '../utils/socket.js'; // Assuming this is the correct import for your messaging socket
const BASE_URL = import.meta.env.VITE_API_URL

const MessagingPanel = ({ user, activeChatUser, setActiveChatUser, setErrors }) => {
  const [chatList, setChatList] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const messagesEndRef = useRef(null);


  useEffect(()=>{
      Messagesocket.emit('join',user.username);
      console.log("Messaging socket connected for user:", user.username);
  },[user.username]);

  useEffect( () => {
    if (!user) return;
    authFetch(`/api/messages/contact/chatlist`)
      .then((res) => res.json())
      .then(setChatList)
      .catch(() => setErrors('Failed to load chat list'));
  }, [user, messages.length]);

  useEffect(() => {
    if (activeChatUser) {
      authFetch(`/api/messages/with/${activeChatUser.username}`)
        .then((res) => res.json())
        .then(setMessages)
        .catch(() => setErrors('Failed to load messages'));
    }
  }, [activeChatUser]);

  useEffect( () => {

    if (!activeChatUser) return;

    const handler = (msg) => {
      // Show message if it's from or to the active chat user
      if (
        (msg.sender === activeChatUser.username && msg.receiver === user.username) ||
        (msg.sender === user.username && msg.receiver === activeChatUser.username)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    Messagesocket.on('newMessage', handler);
    return () => Messagesocket.off('newMessage', handler);
  }, [activeChatUser?.username, user.username]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    const chatId = [user.username, activeChatUser.username].sort().join('_');
    const msg = {
      chatId,
      receiver: activeChatUser.username,
      text: newMessage.trim(),
    };
    try {
      const res = await authFetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msg)
      });
      const data = await res.json();
      setMessages((prev) => [...prev, data]);

    Messagesocket.emit('sendMessage', data);
      setNewMessage('');
      // Update chatList with last message
      setChatList(prev => {
        const idx = prev.findIndex(c => c.user.username === activeChatUser.username);
        if (idx !== -1) {
          const updated = [...prev];
          updated[idx] = { ...updated[idx], lastMessage: data.text, seen: true };
          return updated;
        } else {
          return [{ user: activeChatUser, lastMessage: data.text, seen: true }, ...prev];
        }
      });
    } catch(err) {
      setErrors('Failed to send message'+err.message);
    }
  };


  // Search users by username
  const handleUserSearch = async (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value.length < 2) {
      setSearchResults([]);
      return;
    }
    try {
      const res = await authFetch(`/api/messages/search/users?q=${e.target.value}`);
      const users = await res.json();
      setSearchResults(users.filter(u => u.username !== user.username));
    } catch {
      setSearchResults([]);
    }
  };

  useEffect(() => {
    if (user?.username) {
      socket.emit('join', user.username);
    }
  }, [user]);

  return (
    <div className="bg-white rounded-lg shadow h-[75vh] flex flex-col relative">
      {/* Header */}
      {!activeChatUser ? (
        <div className="flex items-center border-b border-gray-200 px-4 py-2">
          <span className="font-bold text-lg text-gray-600 flex-1">Direct</span>
          <input
            type="text"
            placeholder="Search users…"
            className="border border-gray-200 rounded px-2 py-1 text-sm w-48 focus:outline-pink-500"
            value={searchTerm}
            onChange={handleUserSearch}
          />
        </div>
      ) : (
        <div className="flex items-center border-b px-4 py-2 bg-gray-50">
          <button
            className="mr-3 text-pink-600 font-bold text-lg"
            onClick={() => setActiveChatUser(null)}
            title="Back to chats"
          >
            &#8592;
          </button>
          <img
            src={ activeChatUser.photo ? `${BASE_URL}/api/upload/profile_pics/`+ activeChatUser.photo : `${BASE_URL}/api/upload/profile_pics/default.jpg`}
            onError={e => { e.target.onerror = null; e.target.src = `${BASE_URL}/api/upload/profile_pics/default.jpg`; }}
            className="w-9 h-9 rounded-full object-cover border mr-2"
            alt=""
          />
          <div>
            <div className="font-semibold text-gray-800 text-sm">{activeChatUser.name}</div>
            <div className="text-xs text-gray-500">@{activeChatUser.username}</div>
          </div>
        </div>
      )}

      {/* Search results dropdown */}
      {!activeChatUser && searchResults.length > 0 && (
        <div className="absolute bg-white border rounded shadow w-56 mt-12 ml-4 z-10 max-h-60 overflow-y-auto">
          {searchResults.map((u) => (
            <div
              key={u.username}
              className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-pink-50"
              onClick={() => {
                setActiveChatUser(u);
                setSearchResults([]);
                setSearchTerm('');
                // Add to chatList if not present
                if (!chatList.some(chat => chat.user.username === u.username)) {
                  setChatList(prev => [
                    { user: u, lastMessage: '', seen: true },
                    ...prev,
                  ]);
                }
              }}
            >
              <img
                src={u.photo ? `${BASE_URL}/api/upload/profile_pics/` + u.photo : `${BASE_URL}/api/upload/profile_pics/default.jpg`}
                onError={e => { e.target.onerror = null; e.target.src = `${BASE_URL}/api/upload/profile_pics/default.jpg`; }}
                className="w-8 h-8 rounded-full object-cover"
                alt=""
              />
              <div>
                <div className="font-semibold text-gray-800 text-sm">{u.name}</div>
                <div className="text-xs text-gray-500">@{u.username}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Outlet: Chat List or Messages */}
      {!activeChatUser ? (
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col">
            {chatList.length === 0 && (
              <div className="flex-1 flex items-center justify-center text-gray-400 text-sm h-40">
                No chats yet. Search and start a conversation!
              </div>
            )}
            {chatList.map((chat, i) => (
              <div
                key={i}
                onClick={() => setActiveChatUser(chat.user)}
                className={`flex items-center gap-2 px-4 py-3 cursor-pointer border-b border-gray-200 hover:bg-gray-100 ${
                  activeChatUser?.username === chat.user.username ? 'bg-pink-100' : ''
                }`}
              >
                <img src={chat.user.photo ?  `${BASE_URL}/api/upload/profile_pics/` + chat.user.photo : `${BASE_URL}/api/upload/profile_pics/default.jpg`} 
                onError={e => { e.target.onerror = null; e.target.src = `${BASE_URL}/api/upload/profile_pics/default.jpg`; }}
                className="w-9 h-9 rounded-full object-cover border" alt="" />
                <div>
                  <div className="font-semibold text-gray-800 text-sm">{chat.user.name}</div>
                  <div className="text-xs text-gray-500">@{chat.user.username}</div>
                  <div className="text-xs text-gray-400 truncate max-w-[120px]">{chat.lastMessage}</div>
                </div>
                {!chat.seen && <span className="ml-2 w-2 h-2 rounded-full bg-blue-500 inline-block" />}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-between overflow-y-auto">
          <div className="flex-1 p-3 space-y-2 overflow-y-auto">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === user.username ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className="px-3 py-2 rounded-lg text-sm shadow-sm break-words"
                  style={{
                    background: msg.sender === user.username ? '#ec4899' : '#f3f4f6',
                    color: msg.sender === user.username ? '#fff' : '#222',
                    maxWidth: '70%',
                    minWidth: '2.5rem',
                    wordBreak: 'break-word',
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="border-t p-3 flex gap-2">
            <input
              type="text"
              placeholder="Type a message…"
              className="flex-1 border rounded p-2 focus:outline-pink-500"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button
              onClick={handleSend}
              className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagingPanel;
