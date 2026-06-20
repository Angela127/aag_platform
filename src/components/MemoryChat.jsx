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
    ``,
    `## Response Guidelines`,
    `- Always provide **detailed, comprehensive answers** — never respond with just a single sentence.`,
    `- Structure your responses using **bold headings**, bullet points, and clear sections.`,
    `- Use specific data points (dates, amounts, names, plan details) when available.`,
    `- When discussing a client's situation, provide context, analysis, and actionable recommendations.`,
    `- Use markdown formatting: **bold** for emphasis, bullet lists with "- " for key points.`,
    `- If asked about preferences, list ALL known preferences with details.`,
    `- If asked about plans, include premium, coverage, and renewal details.`,
    `- If asked about follow-ups, include priority levels and due dates.`,
    `- End responses with a brief actionable suggestion or next step when appropriate.`,
    `- If the data does not contain enough information, say so honestly and suggest what the advisor could gather next.`,
    `- Never fabricate data that is not present in the context below.\n`,
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
  if (client.maritalStatus) parts.push(`- **Marital Status:** ${client.maritalStatus}`);
  if (client.nationality) parts.push(`- **Nationality:** ${client.nationality}`);
  if (client.dob) parts.push(`- **Date of Birth:** ${client.dob}`);
  if (client.gender) parts.push(`- **Gender:** ${client.gender}`);
  if (client.mobileNumber) parts.push(`- **Mobile Number:** ${client.mobileNumber}`);
  if (client.employmentStatus) parts.push(`- **Employment Status:** ${client.employmentStatus}`);
  if (client.companyName) parts.push(`- **Company Name:** ${client.companyName}`);
  if (client.industry) parts.push(`- **Industry:** ${client.industry}`);
  if (client.yearsExperience) parts.push(`- **Years of Experience:** ${client.yearsExperience}`);
  if (client.numDependents !== undefined) parts.push(`- **Number of Dependents:** ${client.numDependents}`);
  if (client.spouseName) parts.push(`- **Spouse Name:** ${client.spouseName}`);
  if (client.childrenAges) parts.push(`- **Children's Ages:** ${client.childrenAges}`);
  if (client.anyFamilyDependent) parts.push(`- **Any Family Dependent:** ${client.anyFamilyDependent}`);
  if (client.estimatedInvestableAssets) parts.push(`- **Estimated Investable Assets:** ${client.estimatedInvestableAssets}`);
  if (client.annualIncomeRange) parts.push(`- **Annual Income Range:** ${client.annualIncomeRange}`);
  if (client.financialGoals?.length) parts.push(`- **Financial Goals:** ${client.financialGoals.join(', ')}`);
  if (client.preferredLanguage) parts.push(`- **Preferred Language:** ${client.preferredLanguage}`);
  if (client.preferredConsultation) parts.push(`- **Preferred Consultation:** ${client.preferredConsultation}`);
  if (client.lifeStage) parts.push(`- **Life Stage / Goal:** ${client.lifeStage}`);
  if (client.nextImportantDateLabel) parts.push(`- **Next Important Event:** ${client.nextImportantDateLabel} (${client.nextImportantDate || 'No Date'})`);
  if (client.specialPreferences?.length) parts.push(`- **Special Preferences:** ${client.specialPreferences.join(', ')}`);

  // --- Fact-Find Questionnaire ---
  if (client.questionnaire) {
    const q = client.questionnaire;
    parts.push(`\n## Fact-Find Questionnaire Data`);
    if (q.personalInfo) {
      parts.push(`### Personal Info`);
      if (q.personalInfo.nationality) parts.push(`- Nationality: ${q.personalInfo.nationality}`);
      if (q.personalInfo.maritalStatus) parts.push(`- Marital Status: ${q.personalInfo.maritalStatus}`);
      if (q.personalInfo.gender) parts.push(`- Gender: ${q.personalInfo.gender}`);
      if (q.personalInfo.dateOfBirth) parts.push(`- Date of Birth: ${q.personalInfo.dateOfBirth}`);
      if (q.personalInfo.mobileNumbers?.length) parts.push(`- Mobile Numbers: ${q.personalInfo.mobileNumbers.filter(Boolean).join(', ')}`);
    }
    if (q.employmentInfo) {
      parts.push(`### Employment Info`);
      if (q.employmentInfo.occupation) parts.push(`- Occupation: ${q.employmentInfo.occupation}`);
      if (q.employmentInfo.companyName) parts.push(`- Company Name: ${q.employmentInfo.companyName}`);
      if (q.employmentInfo.industry) parts.push(`- Industry: ${q.employmentInfo.industry}`);
      if (q.employmentInfo.employmentStatus) parts.push(`- Employment Status: ${q.employmentInfo.employmentStatus}`);
      if (q.employmentInfo.yearsOfExperience) parts.push(`- Years of Experience: ${q.employmentInfo.yearsOfExperience}`);
    }
    if (q.familyInfo) {
      parts.push(`### Family Info`);
      if (q.familyInfo.numberOfDependents !== undefined) parts.push(`- Number of Dependents: ${q.familyInfo.numberOfDependents}`);
      if (q.familyInfo.financiallyDependentMembers) parts.push(`- Financially Dependent Members: ${q.familyInfo.financiallyDependentMembers}`);
      if (q.familyInfo.summary) parts.push(`- Family Summary: ${q.familyInfo.summary}`);
    }
    if (q.financialInfo) {
      parts.push(`### Financial Info`);
      if (q.financialInfo.annualIncomeRange) parts.push(`- Annual Income Range: ${q.financialInfo.annualIncomeRange}`);
      if (q.financialInfo.estimatedInvestableAssets) parts.push(`- Estimated Investable Assets: ${q.financialInfo.estimatedInvestableAssets}`);
      if (q.financialInfo.financialGoals?.length) parts.push(`- Financial Goals: ${q.financialInfo.financialGoals.filter(Boolean).join(', ')}`);
    }
    if (q.communicationPreferences) {
      parts.push(`### Communication Preferences`);
      if (q.communicationPreferences.preferredLanguage) parts.push(`- Preferred Language: ${q.communicationPreferences.preferredLanguage}`);
      if (q.communicationPreferences.preferredConsultation) parts.push(`- Preferred Consultation: ${q.communicationPreferences.preferredConsultation}`);
    }
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
  const buildPayload = useCallback(
    (userQuery) => {
      const systemPrompt = buildSystemPrompt(client);
      const contents = [];

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

      return { contents, systemInstruction: systemPrompt };
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
      const { contents, systemInstruction } = buildPayload(trimmed);

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contents, systemInstruction }),
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
