import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send } from 'lucide-react';

export default function ChatPanel({ client }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'advisor',
      text: `Hi ${client.name.split(' ')[0]}, your insurance renewal is coming up soon. Let's schedule a review.`,
      time: '10:30 AM',
    },
    {
      id: 2,
      sender: 'client',
      text: `Thanks for reminding me! When would be a good time to discuss?`,
      time: '10:45 AM',
    },
    {
      id: 3,
      sender: 'advisor',
      text: `How about this Friday at 2 PM? We can go over all your policies together.`,
      time: '11:00 AM',
    },
  ]);
  const [input, setInput] = useState('');
  const messagesContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Single handler function for sending messages
  // Designed for future Firebase/socket integration
  const handleSendMessage = (messageText) => {
    if (!messageText.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: 'advisor',
      text: messageText.trim(),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput('');

    // Simulate client auto-reply after a delay
    setTimeout(() => {
      const autoReplies = [
        'Thanks! Let me check my schedule and get back to you.',
        'Sounds good, I appreciate the update.',
        'Got it, thanks for letting me know!',
        `That works for me. See you then!`,
        `Thanks for the reminder, I'll review the documents.`,
      ];
      const replyText = autoReplies[Math.floor(Math.random() * autoReplies.length)];
      const reply = {
        id: Date.now() + 1,
        sender: 'client',
        text: replyText,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, reply]);
    }, 1200 + Math.random() * 800);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendMessage(input);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(input);
    }
  };

  // Generate initials for avatar
  const clientInitials = client.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-card overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
        <MessageCircle size={16} className="text-aag-primary" />
        <h3 className="text-sm font-semibold text-gray-900">Chat with {client.name.split(' ')[0]}</h3>
        <span className="ml-auto w-2 h-2 rounded-full bg-emerald-400" title="Online" />
      </div>

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className="flex-1 p-4 space-y-3 overflow-y-auto max-h-[350px] min-h-[200px] bg-gray-50/50"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-end gap-2 ${msg.sender === 'advisor' ? 'flex-row-reverse' : ''} animate-fade-in`}
          >
            {/* Avatar */}
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-[0.6rem] font-bold shrink-0 ${
                msg.sender === 'advisor'
                  ? 'bg-aag-primary text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {msg.sender === 'advisor' ? 'You' : clientInitials}
            </div>

            {/* Bubble */}
            <div className={`max-w-[75%] ${msg.sender === 'advisor' ? 'items-end' : 'items-start'}`}>
              <div
                className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.sender === 'advisor'
                    ? 'bg-aag-primary text-white rounded-br-sm'
                    : 'bg-white text-gray-700 border border-gray-200 rounded-bl-sm'
                }`}
              >
                {msg.text}
              </div>
              <p className={`text-[0.6rem] text-gray-400 mt-1 ${msg.sender === 'advisor' ? 'text-right' : 'text-left'}`}>
                {msg.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="px-4 pb-4 pt-2 bg-white">
        <div className="flex items-center gap-2 bg-gray-50 rounded-xl border border-gray-200 pl-4 pr-1.5 py-1.5 focus-within:border-aag-primary focus-within:ring-2 focus-within:ring-aag-primary/10 transition-all">
          <input
            id="chat-panel-input"
            type="text"
            placeholder="Type message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-sm text-gray-800 placeholder:text-gray-400 outline-none"
          />
          <button
            id="chat-panel-send"
            type="submit"
            disabled={!input.trim()}
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-aag-primary text-white hover:bg-aag-primary-dark disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <Send size={14} />
          </button>
        </div>
      </form>
    </div>
  );
}
