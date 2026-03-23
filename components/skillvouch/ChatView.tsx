"use client";

import React, { useState, useEffect, useRef } from 'react';
import { User, Message, ExchangeRequest } from '@/lib/types';
import { apiService } from '@/lib/skillvouchApi';
import { Send, Search, MessageSquare, Lock, UserPlus, Video, ExternalLink, CheckCircle2, X, Star, Loader2, ArrowLeft } from 'lucide-react';

interface ChatViewProps {
  currentUser: User;
  initialChatUserId?: string;
}

export const ChatView: React.FC<ChatViewProps> = ({ currentUser, initialChatUserId }) => {
  const [conversations, setConversations] = useState<User[]>([]);
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [foundFriends, setFoundFriends] = useState<User[]>([]);
  const [exchangeRequest, setExchangeRequest] = useState<ExchangeRequest | null>(null);
  const [exchangeLoading, setExchangeLoading] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackStars, setFeedbackStars] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load conversations
  useEffect(() => {
    async function loadConversations() {
      try {
        const convs = await apiService.getConversations();
        setConversations(convs);
        
        if (initialChatUserId) {
           // Find user in convs or fetch if new
           const existing = convs.find((u: User) => u.id === initialChatUserId);
           if (existing) {
             setActiveUser(existing);
           } else {
             // In a real app we'd fetch the user info here
             // For now, if we came from MatchFinder, we might not have it in list yet
           }
        }
      } catch (err) {
        console.error("Failed to load conversations:", err);
      }
    }
    loadConversations();
  }, [initialChatUserId]);

  // Load messages when active user changes
  useEffect(() => {
    let unsubscribe: () => void = () => {};

    if (activeUser) {
      apiService.markAsRead(activeUser.id);
      unsubscribe = apiService.subscribeToConversation(activeUser.id, (msgs) => {
          setMessages(msgs);
          scrollToBottom();
      });
    } else {
        setMessages([]);
    }

    return () => unsubscribe();
  }, [activeUser]);

  // Load exchange request
  useEffect(() => {
    async function loadExchange() {
      if (!activeUser) {
        setExchangeRequest(null);
        return;
      }

      setExchangeLoading(true);
      try {
        const requests = await apiService.getRequests();
        const relevant = requests
          .filter((r: any) =>
            (r.fromUserId === currentUser.id && r.toUserId === activeUser.id) ||
            (r.fromUserId === activeUser.id && r.toUserId === currentUser.id)
          )
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setExchangeRequest(relevant[0] || null);
      } catch (err) {
        console.error("Failed to load exchange request:", err);
      } finally {
        setExchangeLoading(false);
      }
    }
    loadExchange();
  }, [activeUser, currentUser.id]);

  const scrollToBottom = () => {
    setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeUser) return;

    const content = newMessage;
    setNewMessage('');
    
    try {
        await apiService.sendMessage(activeUser.id, content);
        // Refresh messages immediately
        const msgs = await apiService.getConversation(activeUser.id);
        setMessages(msgs);
        scrollToBottom();
        
        // Refresh conversations if first message
        if (messages.length === 0) {
            const convs = await apiService.getConversations();
            setConversations(convs);
        }
    } catch (err) {
        console.error("Failed to send message:", err);
    }
  };

  const handleUpdateExchangeStatus = async (status: string) => {
    if (!exchangeRequest || !activeUser) return;
    try {
        const result = await apiService.updateExchangeStatus(exchangeRequest.id, status);
        setExchangeRequest(result);

        if (status === 'accepted') {
          await apiService.sendMessage(activeUser.id, 'I accepted the skill exchange. Let\'s schedule a session!');
        } else if (status === 'rejected') {
          await apiService.sendMessage(activeUser.id, 'I cannot do this exchange right now. Maybe another time.');
        }
    } catch (err) {
        console.error("Failed to update status:", err);
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
      
      {/* Sidebar */}
      <div className={`w-full md:w-80 border-r border-slate-200 dark:border-slate-800 flex flex-col ${activeUser ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search chats..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
            {conversations.length > 0 ? (
                conversations.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase())).map(u => (
                    <button
                        key={u.id}
                        onClick={() => setActiveUser(u)}
                        className={`w-full p-4 flex items-center space-x-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition border-b border-slate-200 dark:border-slate-800/50 ${
                            activeUser?.id === u.id ? 'bg-indigo-50 dark:bg-indigo-900/20 border-l-4 border-l-indigo-600' : ''
                        }`}
                    >
                        <div className="relative">
                            {u.avatar ? (
                                <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full bg-slate-200" />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xs">
                                    {u.name.charAt(0)}
                                </div>
                            )}
                        </div>
                        <div className="flex-1 text-left min-w-0">
                            <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate">{u.name}</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">Click to chat</p>
                        </div>
                    </button>
                ))
            ) : (
                <div className="p-8 text-center text-slate-500">
                    <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-20" />
                    <p className="text-sm">No messages yet.</p>
                </div>
            )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col ${!activeUser ? 'hidden md:flex' : 'flex'}`}>
        {activeUser ? (
          <>
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button onClick={() => setActiveUser(null)} className="md:hidden text-slate-500 mr-2">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                {activeUser.avatar ? (
                    <img src={activeUser.avatar} alt={activeUser.name} className="w-10 h-10 rounded-full" />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
                        {activeUser.name.charAt(0)}
                    </div>
                )}
                <div>
                    <h3 className="font-bold text-slate-900 dark:text-slate-100">{activeUser.name}</h3>
                    <p className="text-xs text-green-500 flex items-center">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                        Online
                    </p>
                </div>
              </div>
            </div>

            {exchangeRequest && (
              <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div className="text-sm">
                    <span className="font-semibold text-slate-900 dark:text-slate-100">Trade:</span>{' '}
                    <span className="text-slate-600 dark:text-slate-400">{exchangeRequest.offeredSkill} ↔ {exchangeRequest.requestedSkill}</span>
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${
                        exchangeRequest.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' :
                        exchangeRequest.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        'bg-slate-200 text-slate-600'
                    }`}>
                        {exchangeRequest.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {exchangeRequest.status === 'pending' && exchangeRequest.toUserId === currentUser.id && (
                      <>
                        <button
                          onClick={() => handleUpdateExchangeStatus('accepted')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center transition"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                          Accept
                        </button>
                        <button
                          onClick={() => handleUpdateExchangeStatus('rejected')}
                          className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center transition"
                        >
                          <X className="w-3.5 h-3.5 mr-1" />
                          Decline
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30 dark:bg-slate-950/30">
              {messages.length === 0 ? (
                  <div className="text-center py-10">
                      <p className="text-slate-400 text-sm">No messages yet. Say hi!</p>
                  </div>
              ) : (
                  messages.map((msg: any) => {
                    const isMe = msg.senderId === currentUser.id;
                    return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                                isMe 
                                ? 'bg-indigo-600 text-white rounded-br-none' 
                                : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-bl-none'
                            }`}>
                                <p className="text-sm">{msg.content}</p>
                                <p className={`text-[10px] mt-1 ${isMe ? 'text-indigo-200' : 'text-slate-500'}`}>
                                    {formatTime(msg.timestamp)}
                                </p>
                            </div>
                        </div>
                    );
                  })
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 focus:outline-none focus:border-indigo-500"
                />
                <button 
                    type="submit"
                    disabled={!newMessage.trim()} 
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white p-2.5 rounded-xl transition"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="w-8 h-8 opacity-20" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">Select a Conversation</h3>
            <p className="max-w-xs text-sm">Choose a chat from the sidebar to start learning together.</p>
          </div>
        )}
      </div>
    </div>
  );
};
