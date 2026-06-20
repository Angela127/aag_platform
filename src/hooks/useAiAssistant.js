import { useState, useEffect } from 'react';
import { generateVertexContent } from '../lib/vertexAi.js';
import { getMarketContext } from '../lib/dataGateway.js';

export function useAiAssistant(activeCategory) {
  const [loadingContext, setLoadingContext] = useState(false);
  const [contextData, setContextData] = useState({ tier1: [], tier2And3: [], asOf: '' });
  const [generatingResponse, setGeneratingResponse] = useState(false);

  // Load compliance and market context whenever category changes
  useEffect(() => {
    if (!activeCategory) return;
    
    const loadContext = async () => {
      setLoadingContext(true);
      try {
        const data = await getMarketContext(activeCategory);
        setContextData(data);
      } catch (error) {
        console.error('Failed to load market context: ', error);
      } finally {
        setLoadingContext(false);
      }
    };

    loadContext();
  }, [activeCategory]);

  const generateCoachResponse = async (chatMessages) => {
    if (!activeCategory) return '';
    setGeneratingResponse(true);
    try {
      // Build conversation transcript
      const conversationText = chatMessages.slice(-8).map(m => 
        `${m.sender?.role === 'ai' ? 'AI Sales Coach' : 'Advisor'}: ${m.text}`
      ).join('\n');

      // --- Detect advisor's language from their latest message ---
      const lastAdvisorMsg = [...chatMessages].reverse().find(m => m.sender?.role === 'advisor');
      const lastText = lastAdvisorMsg?.text || '';
      const hasChinese = /[\u4e00-\u9fff]/.test(lastText);
      const hasMalay = /\b(saya|awak|anda|boleh|macam|tak|bila|dengan|untuk|yang|bagaimana|kenapa|nak|ada|buat)\b/i.test(lastText);
      const detectedLang = hasChinese ? 'Mandarin Chinese (Simplified 简体中文)' : hasMalay ? 'Bahasa Malaysia' : 'English';

      // Build context strings
      const tier1Text = contextData.tier1.map(stat => 
        `- Stat: "${stat.value}" [Source: ${stat.source}]`
      ).join('\n');

      const tier2And3Text = contextData.tier2And3.map(m => 
        `- ${m.source} (${m.key.toUpperCase().replace('_', ' ')}): ${m.value}${m.unit || ''}`
      ).join('\n');

      const prompt = `
      You are the AAG AI Sales Coach helping financial advisors in Malaysia. Your job is to give the advisor 3 ready-to-copy reply messages they can send directly to their customer.

      Active Topic: ${activeCategory.toUpperCase()}
      Reference Data (As of ${contextData.asOf || 'Today'}):
      ${tier1Text}
      ${tier2And3Text}

      --- CONVERSATION CONTEXT ---
      ${conversationText}

      ⚠️ LANGUAGE RULE (CRITICAL): The advisor wrote in ${detectedLang}. You MUST write ALL 3 reply options in ${detectedLang} ONLY. Do NOT mix languages. Do NOT add translations.

      OUTPUT FORMAT (follow EXACTLY):

      Give 3 short reply options the advisor can directly copy-paste to their customer.
      
      Each message must:
      - Be spoken AS the advisor to the customer (first-person "I" / "we")
      - Be 2–3 sentences max — like a WhatsApp message between close friends, not a formal email
      - Start with a relatable everyday hook (a life situation, a feeling, a "what if" scenario) — NOT a statistic
      - Be CREATIVE and CONVINCING — use storytelling, analogies, or a gentle surprise to make the customer think
      - Use at most ONE fact/stat naturally embedded in the message, not upfront
      - Sound like a trusted friend giving honest advice, not a salesperson reading from a script
      - If ${detectedLang} is Mandarin Chinese: use natural spoken 简体中文, warm and relatable, not stiff or corporate
      - If ${detectedLang} is Bahasa Malaysia: use casual, friendly BM — mix in common expressions naturally

      Use this EXACT format:

      **Option 1 — Warm & Relatable**
      "[message in ${detectedLang}]"

      **Option 2 — Direct & Confident**
      "[message in ${detectedLang}]"

      **Option 3 — Creative Hook**
      "[message in ${detectedLang}]"

      💡 *Coach's Tip: [one sentence — which option to pick and why, based on the customer's situation]*

      STRICT RULES:
      - ALL messages must be in ${detectedLang} only — no other language
      - Each message inside double quotes is what the advisor copies and sends — keep it clean
      - Max 60 words per message
      - Do NOT invent statistics — only use numbers from the reference data above
      - Cite source in brackets only when a specific number is used (e.g. [EPF Annual Report])
      `;

      const responseText = await generateVertexContent(prompt);
      return responseText;
    } catch (error) {
      console.error("Error generating coach response:", error);
      return "I apologize, but I encountered an error retrieving my coaching models. Please try again.";
    } finally {
      setGeneratingResponse(false);
    }
  };

  return {
    loadingContext,
    contextData,
    generatingResponse,
    generateCoachResponse
  };
}
