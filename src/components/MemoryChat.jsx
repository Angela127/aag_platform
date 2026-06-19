import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Bot, User, Sparkles, CheckCircle } from 'lucide-react';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Simple parser to render markdown bold tags (**text**) and bullet lists (- item) as JSX.
 */
function renderMessageText(text, isUser = false) {
  if (!text) return '';

  const lines = text.split('\n');
  const textColorClass = isUser ? 'text-white' : 'text-gray-700';
  const strongColorClass = isUser ? 'font-bold text-white' : 'font-semibold text-gray-900';

  return lines.map((line, lineIndex) => {
    const isListItem = line.trim().startsWith('- ') || line.trim().startsWith('* ');
    const content = isListItem ? line.trim().substring(2) : line;

    // Split by ** bold markers
    const parts = content.split(/(\*\*.*?\*\*)/g);
    const parsedLine = parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className={strongColorClass}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });

    if (isListItem) {
      return (
        <li key={lineIndex} className={`list-disc ml-5 mt-1 leading-relaxed ${textColorClass}`}>
          {parsedLine}
        </li>
      );
    }

    return (
      <p key={lineIndex} className={`${lineIndex > 0 ? "mt-1.5 leading-relaxed" : "leading-relaxed"} ${textColorClass}`}>
        {parsedLine}
      </p>
    );
  });
}

/**
 * Build a rich system instruction that gives Gemini full context about
 * the client so it can answer like a true RAG assistant.
 */
function buildSystemPrompt(client) {
  const parts = [];

  parts.push(
    `You are the AI Memory Assistant for the AAG Advisor Intelligence Platform.`,
    `Your role is to help financial advisors by answering questions about their clients based on the structured client data provided below.`,
    `Always respond in a professional, concise, and helpful tone. Use specific data points (dates, amounts, names) when available.`,
    `If the data does not contain enough information to answer a question, say so honestly and suggest what the advisor could do next.`,
    `Never fabricate data that is not present in the context below.\n`,
  );

  // --- Client Profile ---
  parts.push(`## Client Profile`);
  parts.push(`- **Name:** ${client.name}`);
  parts.push(`- **Age:** ${client.age}`);
  parts.push(`- **Occupation:** ${client.occupation}`);
  parts.push(`- **Health Score:** ${client.healthScore}/100`);
  parts.push(`- **Risk Level:** ${client.riskLevel}`);
  parts.push(`- **Last Contact:** ${client.lastContact}`);
  parts.push(`- **Active Plans:** ${client.activePlans}`);
  parts.push(`- **Family:** ${client.familyDetails}`);

  if (client.specialPreferences) {
    parts.push(`- **Birthday:** ${client.specialPreferences.birthday}`);
    parts.push(`- **Notes:** ${client.specialPreferences.notes}`);
  }

  // --- AI Summary ---
  const summary = client.memorySummary || client.needsSummary;
  if (summary) {
    parts.push(`\n## AI Summary\n${summary}`);
  }

  // --- Plans ---
  if (client.plans?.length) {
    parts.push(`\n## Active Plans`);
    client.plans.forEach((p) => {
      parts.push(`- ${p.name}: Premium ${p.premium}, Renewal ${p.renewal}, Coverage ${p.coverage}`);
    });
  }

  // --- Follow-Ups ---
  if (client.followUps?.length) {
    parts.push(`\n## Outstanding Follow-Ups`);
    client.followUps.forEach((f) => {
      parts.push(`- [${f.priority.toUpperCase()}] ${f.task} — due ${f.date}`);
    });
  }

  // --- Expenses ---
  if (client.expenses?.length) {
    parts.push(`\n## Client Expenses`);
    client.expenses.forEach((e) => {
      parts.push(`- ${e.date}: ${e.type} — ${e.description} (${e.amount})`);
    });
  }

  // --- Health Factors ---
  if (client.healthFactors) {
    const hf = client.healthFactors;
    parts.push(`\n## Health Factors`);
    parts.push(`- Recent Contact: ${hf.recentContact ? 'Yes' : 'No'}`);
    parts.push(`- Plan Complete: ${hf.planComplete ? 'Yes' : 'No'}`);
    parts.push(`- Renewal Soon: ${hf.renewalSoon ? 'Yes' : 'No'}`);
    parts.push(`- Outstanding Follow-Ups: ${hf.outstandingFollowUps}`);
  }

  // --- Timeline ---
  if (client.memoryTimeline?.length) {
    parts.push(`\n## Interaction Timeline`);
    client.memoryTimeline.forEach((t) => {
      parts.push(`- **${t.date}** [${t.category}]: ${t.description}`);
    });
  }

  return parts.join('\n');
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function MemoryChat({ client }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState('');
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);

  // Set the welcome message whenever client changes
  useEffect(() => {
    setMessages([
      {
        role: 'assistant',
        text: `Hi! I'm the AI Memory Assistant for **${client.name}**. I have loaded their full portfolio details and interaction history. Ask me anything!`,
      },
    ]);
    setError('');
  }, [client.id]);

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
  }, [messages, isTyping]);

  // Build conversation history for multi-turn context
  const buildContents = useCallback(
    (userQuery) => {
      const systemPrompt = buildSystemPrompt(client);
      const contents = [];

      // System instruction as first user turn
      contents.push({
        role: 'user',
        parts: [{ text: `[System Context — do not repeat this to the user]\n\n${systemPrompt}\n\n---\n\nPlease acknowledge that you have loaded the client context by responding naturally to my first question.` }],
      });
      contents.push({
        role: 'model',
        parts: [{ text: `Understood. I've loaded the full profile for ${client.name}. I'm ready to answer your questions about them.` }],
      });

      // Existing chat history (skip the initial welcome message)
      for (const msg of messages.slice(1)) {
        contents.push({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.text }],
        });
      }

      // Current user query
      contents.push({
        role: 'user',
        parts: [{ text: userQuery }],
      });

      return contents;
    },
    [client, messages],
  );

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;

    setMessages((prev) => [...prev, { role: 'user', text: trimmed }]);
    setInput('');
    setIsTyping(true);
    setError('');

    try {
      const contents = buildContents(trimmed);

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contents }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Server error');
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { role: 'assistant', text: data.text }]);
    } catch (err) {
      console.error('Vertex AI Proxy error:', err);
      const errMsg = err.message || 'Failed to connect to Vertex AI proxy.';
      setError(errMsg);
      setMessages((prev) => [...prev, { role: 'assistant', text: `⚠️ Error: ${errMsg}` }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestedQuestions = [
    `What does ${client.name.split(' ')[0]} prefer?`,
    `Tell me about their family`,
    `What plans do they have?`,
    `What's their risk profile?`,
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-card overflow-hidden flex flex-col relative">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
        <Sparkles size={16} className="text-aag-primary" />
        <h3 className="text-sm font-semibold text-gray-900">Ask AI Memory</h3>

        {/* Status badge */}
        <span className="ml-auto inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[0.65rem] font-semibold bg-emerald-50 text-emerald-600">
          <CheckCircle size={10} /> Vertex AI Active
        </span>
      </div>

      {/* Suggested Questions */}
      {messages.length <= 1 && (
        <div className="px-5 pt-3 pb-1 flex flex-wrap gap-1.5">
          {suggestedQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => {
                setInput(q);
                inputRef.current?.focus();
              }}
              className="text-[0.7rem] px-2.5 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:border-aag-primary hover:text-aag-primary hover:bg-aag-accent/30 transition-all duration-200 cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className="flex-1 p-4 space-y-3 overflow-y-auto max-h-[340px] min-h-[200px]"
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex items-start gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-fade-in`}
          >
            {/* Avatar */}
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === 'assistant'
                  ? 'bg-gradient-to-br from-aag-primary to-aag-primary-dark text-white'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {msg.role === 'assistant' ? <Bot size={14} /> : <User size={14} />}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[80%] px-3.5 py-2.5 rounded-xl text-sm leading-relaxed ${
                msg.role === 'assistant'
                  ? 'bg-gray-50 text-gray-700 rounded-tl-sm'
                  : 'bg-aag-primary text-white rounded-tr-sm'
              }`}
            >
              {renderMessageText(msg.text, msg.role === 'user')}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-start gap-2.5 animate-fade-in">
            <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 bg-gradient-to-br from-aag-primary to-aag-primary-dark text-white">
              <Bot size={14} />
            </div>
            <div className="bg-gray-50 rounded-xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-4 pb-4">
        <div className="flex items-center gap-2 bg-gray-50 rounded-xl border border-gray-200 pl-4 pr-1.5 py-1.5 focus-within:border-aag-primary focus-within:ring-2 focus-within:ring-aag-primary/10 transition-all">
          <input
            ref={inputRef}
            id="memory-chat-input"
            type="text"
            placeholder={`Ask about ${client.name.split(' ')[0]}...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isTyping}
            className="flex-1 bg-transparent text-sm text-gray-800 placeholder:text-gray-400 outline-none"
          />
          <button
            id="memory-chat-send"
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-aag-primary text-white hover:bg-aag-primary-dark disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
