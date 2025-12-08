
import React, { useState, useRef, useEffect } from 'react';
import { chatWithMediSage } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Icons } from '../constants';
import { Part } from '@google/genai';
import { useLanguage } from '../contexts/LanguageContext';

const ChatAssistant: React.FC = () => {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);
  const recognitionRef = useRef<any>(null);

  // Initialize welcome message when component mounts or language changes
  useEffect(() => {
    if (!initialized.current || messages.length === 0) {
       setMessages([{
         id: 'welcome',
         role: 'model',
         text: t('chat_welcome')
       }]);
       initialized.current = true;
    }
  }, [t]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    // Map internal language codes to BCP 47 tags for Speech API
    const langMap: Record<string, string> = {
      'en': 'en-US',
      'hi': 'hi-IN',
      'bn': 'bn-IN',
      'ta': 'ta-IN',
      'te': 'te-IN',
      'es': 'es-ES',
      'fr': 'fr-FR'
    };
    
    recognition.lang = langMap[language] || 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputText(prev => {
        const spacer = prev.length > 0 && !prev.endsWith(' ') ? ' ' : '';
        return prev + spacer + transcript;
      });
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

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
      const responseText = await chatWithMediSage(history, userMsg.text, language);
      
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
          {/* Mic Button */}
          <button
            onClick={handleVoiceInput}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              isListening 
                ? 'bg-red-500/20 text-red-400 animate-pulse ring-2 ring-red-500/50' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Voice Command"
          >
             <Icons.Mic />
          </button>

          <input 
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t('chat_placeholder')}
            className="flex-1 bg-transparent border-none outline-none text-white placeholder-slate-500 ml-1 h-10"
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
