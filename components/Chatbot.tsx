"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
    id: string;
    role: "user" | "bot";
    content: string;
    timestamp: Date;
}

export function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        setMessages([
            {
                id: "1",
                role: "bot",
                content: "Hello! I'm your VconnectU assistant. How can I help you today?",
                timestamp: new Date(),
            },
        ]);
    }, []);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isAutoSpeak, setIsAutoSpeak] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const recognitionRef = useRef<any>(null);

    // Initialize Speech Recognition
    useEffect(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;

            recognitionRef.current.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setInputValue(transcript);
                setIsListening(false);
            };

            recognitionRef.current.onerror = (event: any) => {
                console.error("Speech recognition error:", event.error);
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }
    }, []);

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
        } else {
            setIsListening(true);
            recognitionRef.current?.start();
        }
    };

    const speak = (text: string) => {
        if (typeof window !== "undefined" && window.speechSynthesis) {
            window.speechSynthesis.cancel(); // Stop any current speech
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1;
            utterance.pitch = 1;
            window.speechSynthesis.speak(utterance);
        }
    };

    const toggleChat = () => setIsOpen(!isOpen);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();

        if (!inputValue.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: inputValue,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputValue("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: userMessage.content }),
            });

            if (!response.ok) {
                throw new Error("Failed to fetch response");
            }

            const data = await response.json();

            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "bot",
                content: data.response,
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, botMessage]);

            if (isAutoSpeak) {
                speak(botMessage.content);
            }
        } catch (error) {
            console.error("Chat error:", error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "bot",
                content: "Sorry, I'm having trouble connecting right now. Please try again later.",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={toggleChat}
                className={cn(
                    "fixed bottom-6 right-6 z-50 p-5 rounded-[1.5rem] shadow-2xl transition-all duration-500 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-100",
                    isOpen
                        ? "bg-slate-900 text-white rotate-90"
                        : "bg-blue-600 text-white"
                )}
                aria-label="Toggle chat"
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
            </button>

            <div
                className={cn(
                    "fixed bottom-24 right-6 z-40 w-[22rem] md:w-[26rem] bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] origin-bottom-right flex flex-col",
                    isOpen
                        ? "opacity-100 scale-100 translate-y-0"
                        : "opacity-0 scale-90 translate-y-12 pointer-events-none"
                )}
                style={{ maxHeight: "calc(100vh - 140px)", height: "600px" }}
            >
                {/* Header */}
                <div className="bg-slate-900 p-8 text-white flex justify-between items-start">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 rounded-full text-[10px] font-black uppercase tracking-widest text-blue-400 mb-4">
                            Live Support
                        </div>
                        <h3 className="font-black text-2xl flex items-center gap-3 tracking-tight">
                            VconnectU AI
                        </h3>
                        <p className="text-slate-400 text-xs mt-1 font-medium italic">Ask me about jobs, resumes, or ideas!</p>
                    </div>
                    <button
                        onClick={() => setIsAutoSpeak(!isAutoSpeak)}
                        className={cn(
                            "p-3 rounded-2xl transition-all border",
                            isAutoSpeak
                                ? "bg-blue-600 border-blue-500 text-white shadow-lg"
                                : "bg-white/5 border-white/10 text-white/40 hover:text-white"
                        )}
                        title={isAutoSpeak ? "Mute Assistant" : "Unmute Assistant"}
                    >
                        {isAutoSpeak ? <Volume2 size={20} /> : <VolumeX size={20} />}
                    </button>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={cn(
                                "flex w-full animate-in fade-in slide-in-from-bottom-2",
                                msg.role === "user" ? "justify-end" : "justify-start"
                            )}
                        >
                            <div
                                className={cn(
                                    "max-w-[85%] p-4 rounded-[1.5rem] text-sm shadow-sm font-medium leading-relaxed",
                                    msg.role === "user"
                                        ? "bg-blue-600 text-white rounded-tr-none shadow-blue-100"
                                        : "bg-white text-slate-800 border border-slate-100 rounded-tl-none shadow-slate-100"
                                )}
                            >
                                {msg.content}
                                <div className="flex justify-between items-center mt-2 pt-2 border-t border-black/5 gap-4">
                                    {msg.role === "bot" && (
                                        <button
                                            onClick={() => speak(msg.content)}
                                            className="text-slate-300 hover:text-blue-600 transition-colors"
                                        >
                                            <Volume2 size={14} />
                                        </button>
                                    )}
                                    <div
                                        className={cn(
                                            "text-[10px] font-bold uppercase tracking-tight",
                                            msg.role === "user" ? "text-blue-200" : "text-slate-300"
                                        )}
                                    >
                                        {msg.timestamp.toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start w-full">
                            <div className="bg-white p-4 rounded-[1.5rem] rounded-tl-none border border-slate-100 shadow-sm flex items-center gap-3">
                                <Loader2 size={16} className="animate-spin text-blue-600" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Thinking...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-6 bg-white border-t border-slate-50">
                    <form
                        onSubmit={handleSendMessage}
                        className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-full border border-slate-200 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-50 focus-within:bg-white transition-all group"
                    >
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Type a question..."
                            className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-4 text-slate-900 font-bold placeholder:text-slate-400 placeholder:font-medium"
                            disabled={isLoading}
                        />
                        <button
                            type="button"
                            onClick={toggleListening}
                            className={cn(
                                "p-3 rounded-full transition-all",
                                isListening
                                    ? "bg-red-500 text-white shadow-lg shadow-red-100 animate-pulse"
                                    : "text-slate-400 hover:bg-white hover:text-blue-600 hover:shadow-sm"
                            )}
                            disabled={isLoading}
                        >
                            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                        </button>
                        <button
                            type="submit"
                            disabled={!inputValue.trim() || isLoading}
                            className="p-3 bg-slate-900 text-white rounded-full hover:bg-slate-800 disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-xl shadow-slate-200"
                        >
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
