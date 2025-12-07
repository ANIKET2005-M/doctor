import React, { useState, useRef, useEffect } from 'react';
import { chatWithMediSage } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Icons } from '../constants';
import { Part } from '@google/genai';

const ChatAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Hello! I am MediSage. How can I help you manage your health today? I can explain medications or answer general health questions.'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim() || isThinking) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsThinking(true);

    // Prepare history for API
    const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text } as Part]
    }));
    
    // Add current user message to history effectively for the context
    history.push({ role: 'user', parts: [{ text: userMsg.text } as Part] });

    try {
      const responseText = await chatWithMediSage(history, userMsg.text);
      
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
       const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "Sorry, I encountered an error. Please try again."
       };
       setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-dark-950 relative">
      {/* Disclaimer Header */}
      <div className="bg-yellow-900/30 border-b border-yellow-800/50 p-2 text-center text-xs text-yellow-200/80">
        AI for educational purposes only. In emergencies, call 911 immediately.
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar pb-24">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-primary-600 text-white rounded-br-none' 
                  : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isThinking && (
          <div className="flex justify-start">
            <div className="bg-slate-800 rounded-2xl p-4 rounded-bl-none border border-slate-700 flex items-center gap-2">
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></span>
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="absolute bottom-20 left-0 w-full p-4 bg-gradient-to-t from-dark-950 to-transparent">
        <div className="flex gap-2 items-center bg-slate-900 border border-slate-700 rounded-full px-2 py-2 shadow-xl">
          <input 
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about your medicine..."
            className="flex-1 bg-transparent border-none outline-none text-white placeholder-slate-500 ml-4 h-10"
          />
          <button 
            onClick={handleSend}
            disabled={!inputText.trim() || isThinking}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              !inputText.trim() ? 'bg-slate-800 text-slate-600' : 'bg-primary-500 text-white hover:bg-primary-400'
            }`}
          >
            <Icons.Send />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatAssistant;
