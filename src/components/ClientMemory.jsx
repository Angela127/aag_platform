import { useState, useEffect } from 'react';
import { Brain, Users, Heart, CalendarDays, Eye, Star, Baby, Target, Sparkles, AlertTriangle, ShieldCheck, RefreshCw, Loader2 } from 'lucide-react';

const CATEGORY_CONFIG = {
  'Meeting Summary': { icon: CalendarDays, color: 'bg-blue-100 text-blue-600', dotColor: 'bg-blue-500' },
  'Advisor Observation': { icon: Eye, color: 'bg-violet-100 text-violet-600', dotColor: 'bg-violet-500' },
  'Client Preference': { icon: Star, color: 'bg-amber-100 text-amber-600', dotColor: 'bg-amber-500' },
  'Life Event': { icon: Baby, color: 'bg-emerald-100 text-emerald-600', dotColor: 'bg-emerald-500' },
};

/**
 * Build rich context from client data for the RAG prompt.
 */
function buildClientContext(client) {
  const parts = [];

  parts.push(`## Client Profile`);
  parts.push(`- **Name:** ${client.name}`);
  parts.push(`- **Age:** ${client.age}`);
  parts.push(`- **Occupation:** ${client.occupation}`);
  parts.push(`- **Health Score:** ${client.healthScore}/100`);
  parts.push(`- **Risk Level:** ${client.riskLevel}`);
  parts.push(`- **Last Contact:** ${client.lastContact}`);
  parts.push(`- **Active Plans:** ${client.activePlans}`);
  parts.push(`- **Family:** ${client.familyDetails || 'Not specified'}`);
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

  if (client.plans?.length) {
    parts.push(`\n## Active Plans`);
    client.plans.forEach((p) => {
      parts.push(`- ${p.name}: Premium ${p.premium}, Renewal ${p.renewal}, Coverage ${p.coverage}`);
    });
  }

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

  if (client.followUps?.length) {
    parts.push(`\n## Follow-Ups`);
    client.followUps.forEach((f) => {
      const status = f.completed ? '✅ Completed' : '⏳ Pending';
      parts.push(`- [${(f.priority || 'medium').toUpperCase()}] ${f.task} — due ${f.date} (${status})`);
    });
  }

  if (client.expenses?.length) {
    parts.push(`\n## Client Expenses`);
    client.expenses.forEach((e) => {
      parts.push(`- ${e.date}: ${e.type} — ${e.description} (${e.amount})`);
    });
  }

  if (client.healthFactors) {
    const hf = client.healthFactors;
    parts.push(`\n## Health Factors`);
    parts.push(`- Recent Contact: ${hf.recentContact ? 'Yes' : 'No'}`);
    parts.push(`- Plan Complete: ${hf.planComplete ? 'Yes' : 'No'}`);
    parts.push(`- Renewal Soon: ${hf.renewalSoon ? 'Yes' : 'No'}`);
    parts.push(`- Outstanding Follow-Ups: ${hf.outstandingFollowUps}`);
  }

  if (client.memoryTimeline?.length) {
    parts.push(`\n## Interaction Timeline`);
    client.memoryTimeline.forEach((t) => {
      parts.push(`- **${t.date}** [${t.category}]: ${t.description}`);
    });
  }

  return parts.join('\n');
}

/**
 * Render markdown-like text with bold (**text**) and bullet lists.
 */
function renderSummaryText(text) {
  if (!text) return null;

  const lines = text.split('\n');
  const elements = [];

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const trimmed = lines[lineIndex].trim();

    // Skip empty lines (removes gaps between headings and content)
    if (!trimmed) continue;

    const isListItem = trimmed.startsWith('- ') || trimmed.startsWith('* ') || /^\d+\.\s/.test(trimmed);
    const content = isListItem ? trimmed.replace(/^[-*]\s|^\d+\.\s/, '') : trimmed;

    // Parse **bold** markers
    const parts = content.split(/(\*\*.*?\*\*)/g);
    const parsedLine = parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-semibold text-gray-900">{part.slice(2, -2)}</strong>;
      }
      return part;
    });

    // Check if entire line is bold (section heading)
    const isSectionHeading = trimmed.startsWith('**') && trimmed.endsWith('**') && trimmed.indexOf('**', 2) === trimmed.length - 2;

    if (isListItem) {
      elements.push(
        <li key={lineIndex} className="list-disc ml-5 mt-1 leading-relaxed text-xs text-gray-700">
          {parsedLine}
        </li>
      );
    } else if (isSectionHeading) {
      elements.push(
        <p key={lineIndex} className={`${elements.length > 0 ? "mt-3" : ""} text-xs text-gray-700 leading-relaxed`}>
          {parsedLine}
        </p>
      );
    } else {
      elements.push(
        <p key={lineIndex} className={`${elements.length > 0 ? "mt-1" : ""} text-xs text-gray-700 leading-relaxed`}>
          {parsedLine}
        </p>
      );
    }
  }

  return elements;
}

export default function ClientMemory({ client, section, hideShell = false }) {
  const [aiSummary, setAiSummary] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  // Generate AI summary on mount (only for AI memory section or if no section is specified)
  useEffect(() => {
    const controller = new AbortController();
    if (client && !hasGenerated && (section === 'ai-memory' || !section)) {
      generateSummary(controller.signal);
    }
    return () => {
      controller.abort();
    };
  }, [client?.id, section]);

  async function generateSummary(signal = null) {
    setIsGenerating(true);
    setAiSummary('');

    try {
      const clientContext = buildClientContext(client);

      const systemInstruction = `You are the AI Memory Engine for the AAG Advisor Intelligence Platform. Generate a single, concise paragraph summarizing this client for their financial advisor.

## Rules
- Write exactly **1 paragraph** (4-6 sentences).
- Cover: who the client is, their current plans/coverage status, key preferences, health score drivers, and the most important next step.
- Use **bold** for names, amounts, dates, and key highlights.
- Do NOT use bullet points, headers, or multiple paragraphs.
- Do NOT use markdown headers (#).
- Be direct and informative — write as a quick briefing before a client meeting.`;

      const contents = [
        {
          role: 'user',
          parts: [{ text: `Generate a comprehensive AI Client Memory summary for the following client:\n\n${clientContext}` }],
        },
      ];

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents, systemInstruction }),
        signal: signal
      });

      if (!response.ok) {
        throw new Error('Failed to generate AI summary');
      }

      const data = await response.json();
      setAiSummary(data.text || 'Unable to generate summary.');
      setHasGenerated(true);
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log("Fetch aborted for generateSummary.");
        return;
      }
      console.error('Error generating AI memory summary:', err);
      setAiSummary('⚠️ Failed to generate AI summary. Please try again.');
    } finally {
      if (!signal || !signal.aborted) {
        setIsGenerating(false);
      }
    }
  }

  if (!client) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-card p-6">
        <p className="text-sm text-gray-500">No memory data available.</p>
      </div>
    );
  }

  const timeline = client.memoryTimeline || [];

  const labelMap = {
    phone: 'Mobile Number',
    mobileNumber: 'Mobile Number',
    dob: 'Date of Birth',
    DOB: 'Date of Birth',
    birthday: 'Date of Birth',
    maritalStatus: 'Marital Status',
    nationality: 'Nationality',
    gender: 'Gender',
    
    employmentStatus: 'Employment',
    occupation: 'Occupation',
    company: 'Company',
    companyName: 'Company Name',
    jobTitle: 'Job Title',
    industry: 'Industry',
    department: 'Department',
    workExperience: 'Work Exp.',
    yearsExperience: 'Experience',
    
    preferredContact: 'Pref. Contact',
    preferredCommunicationChannel: 'Pref. Channel',
    preferredLanguage: 'Pref. Language',
    preferredConsultation: 'Pref. Consultation',
    communicationPreferences: 'Comm. Prefs',
    languages: 'Languages Spoken',

    income: 'Income',
    netWorth: 'Net Worth',
    budget: 'Budget',
    annualIncome: 'Annual Income',
    salary: 'Salary',
    taxBracket: 'Tax Bracket',
    assets: 'Assets',
    liabilities: 'Liabilities',
    financialGoals: 'Financial Goals',
    monthlySavings: 'Monthly Savings',
    estimatedInvestableAssets: 'Est. Assets',
    annualIncomeRange: 'Annual Income',
    existingFinancialAdvisor: 'Existing Advisor',

    numDependents: 'Dependents',
    spouseName: 'Spouse Name',
    childrenAges: "Children's Ages",
    anyFamilyDependent: 'Family Dependent?',
    familyDetails: 'Family Details',
    lifeStage: 'Life Stage',
    nextImportantDateLabel: 'Next Event',
    nextImportantDate: 'Next Event Date',
    specialPreferences: 'Special Prefs'
  };

  const personalKeys = [
    'maritalStatus', 'mobileNumber', 'dob', 'DOB', 'nationality', 'gender', 'lifeStage', 'nextImportantDateLabel', 'nextImportantDate'
  ];

  const employmentKeys = [
    'employmentStatus', 'occupation', 'company', 'companyName', 'jobTitle', 'industry', 'department', 'workExperience', 'yearsExperience'
  ];

  const communicationKeys = [
    'preferredContact', 'preferredCommunicationChannel', 'preferredLanguage', 'preferredConsultation', 'communicationPreferences', 'languages'
  ];

  const financialKeys = [
    'income', 'netWorth', 'budget', 'annualIncome', 'salary', 'taxBracket',
    'assets', 'liabilities', 'financialGoals', 'monthlySavings', 'estimatedInvestableAssets', 'annualIncomeRange', 'existingFinancialAdvisor'
  ];

  const familyKeys = [
    'familyDetails', 'spouseName', 'childrenAges', 'numDependents', 'anyFamilyDependent'
  ];

  const standardKeys = [
    'id', 'name', 'fullName', 'preferredName', 'email', 'avatar', 'status', 'createdAt', 'updatedAt',
    'age', 'healthScore', 'riskLevel', 'lastContact', 'activePlans',
    'plans', 'followUps', 'expenses', 'healthFactors', 'memorySummary', 'memoryTimeline',
    'needs', 'needsSummary', 'pinned', 'unreadCount',
    'seen', 'lastMessage', 'time', '_updatedAtMs', 'registrationStatus', 'consentGiven', 'planConfirmed',
    'residentialAddress', 'phone', 'specialPreferences'
  ];

  const specialPreferencesInfo = client.specialPreferences || [];

  const personalInfo = [];
  const employmentInfo = [];
  const communicationInfo = [];
  const financialInfo = [];
  const familyInfo = [];

  Object.entries(client).forEach(([key, val]) => {
    if (standardKeys.includes(key)) return;
    if (val === undefined || val === null || val === '') return;
    if (typeof val === 'object' && !Array.isArray(val)) return;

    const label = labelMap[key] || key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase());

    const item = { key, label, val };

    if (personalKeys.includes(key)) {
      personalInfo.push(item);
    } else if (employmentKeys.includes(key)) {
      employmentInfo.push(item);
    } else if (communicationKeys.includes(key)) {
      communicationInfo.push(item);
    } else if (financialKeys.includes(key)) {
      financialInfo.push(item);
    } else if (familyKeys.includes(key)) {
      familyInfo.push(item);
    }
  });

  const hasExtraFields = financialInfo.length > 0 || personalInfo.length > 0 || employmentInfo.length > 0 || communicationInfo.length > 0 || familyInfo.length > 0 || specialPreferencesInfo.length > 0;

  const renderSnapshot = () => {
    const content = (
      <div className="pt-4 pb-3 px-5 flex gap-6 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent scroll-smooth flex-grow">
        {/* Personal Information */}
        {personalInfo.length > 0 && (
          <div className="flex-1 min-w-[280px] sm:min-w-[calc(50%-12px)] sm:max-w-[calc(50%-12px)] shrink-0 animate-fade-in flex flex-col justify-start pr-6 border-r border-gray-100 last:border-r-0 last:pr-0">
            <div>
              <p className="text-[0.65rem] uppercase font-bold text-aag-primary tracking-wider mb-2 border-b border-aag-primary/20 pb-1">
                Personal Information
              </p>
              <div className="space-y-2 pt-1">
                {personalInfo.map((item) => (
                  <div key={item.key} className="flex justify-between items-center py-1 border-b border-gray-50 last:border-b-0 text-xs gap-3">
                    <span className="text-gray-400 font-medium uppercase text-[0.6rem] tracking-wider shrink-0">{item.label}</span>
                    <span className="font-semibold text-gray-800 text-right">
                      {Array.isArray(item.val) ? item.val.join(', ') : item.val}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Employment Information */}
        {employmentInfo.length > 0 && (
          <div className="flex-1 min-w-[280px] sm:min-w-[calc(50%-12px)] sm:max-w-[calc(50%-12px)] shrink-0 animate-fade-in flex flex-col justify-start pr-6 border-r border-gray-100 last:border-r-0 last:pr-0">
            <div>
              <p className="text-[0.65rem] uppercase font-bold text-aag-primary tracking-wider mb-2 border-b border-aag-primary/20 pb-1">
                Employment Information
              </p>
              <div className="space-y-2 pt-1">
                {employmentInfo.map((item) => (
                  <div key={item.key} className="flex justify-between items-center py-1 border-b border-gray-50 last:border-b-0 text-xs gap-3">
                    <span className="text-gray-400 font-medium uppercase text-[0.6rem] tracking-wider shrink-0">{item.label}</span>
                    <span className="font-semibold text-gray-800 text-right">
                      {Array.isArray(item.val) ? item.val.join(', ') : item.val}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Family Information */}
        {familyInfo.length > 0 && (
          <div className="flex-1 min-w-[280px] sm:min-w-[calc(50%-12px)] sm:max-w-[calc(50%-12px)] shrink-0 animate-fade-in flex flex-col justify-start pr-6 border-r border-gray-100 last:border-r-0 last:pr-0">
            <div>
              <p className="text-[0.65rem] uppercase font-bold text-aag-primary tracking-wider mb-2 border-b border-aag-primary/20 pb-1">
                Family Information
              </p>
              <div className="space-y-2 pt-1">
                {familyInfo.map((item) => (
                  <div key={item.key} className="flex justify-between items-center py-1 border-b border-gray-50 last:border-b-0 text-xs gap-3">
                    <span className="text-gray-400 font-medium uppercase text-[0.6rem] tracking-wider shrink-0">{item.label}</span>
                    <span className="font-semibold text-gray-800 text-right">
                      {Array.isArray(item.val) ? item.val.join(', ') : item.val}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Financial Information */}
        {financialInfo.length > 0 && (
          <div className="flex-1 min-w-[280px] sm:min-w-[calc(50%-12px)] sm:max-w-[calc(50%-12px)] shrink-0 animate-fade-in flex flex-col justify-start pr-6 border-r border-gray-100 last:border-r-0 last:pr-0">
            <div>
              <p className="text-[0.65rem] uppercase font-bold text-aag-primary tracking-wider mb-2 border-b border-aag-primary/20 pb-1">
                Financial Information
              </p>
              <div className="space-y-2 pt-1">
                {financialInfo.map((item) => (
                  <div key={item.key} className="flex justify-between items-center py-1 border-b border-gray-50 last:border-b-0 text-xs gap-3">
                    <span className="text-gray-400 font-medium uppercase text-[0.6rem] tracking-wider shrink-0">{item.label}</span>
                    <span className="font-semibold text-gray-800 text-right">
                      {Array.isArray(item.val) ? item.val.join(', ') : item.val}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Communication Preferences */}
        {communicationInfo.length > 0 && (
          <div className="flex-1 min-w-[280px] sm:min-w-[calc(50%-12px)] sm:max-w-[calc(50%-12px)] shrink-0 animate-fade-in flex flex-col justify-start pr-6 border-r border-gray-100 last:border-r-0 last:pr-0">
            <div>
              <p className="text-[0.65rem] uppercase font-bold text-aag-primary tracking-wider mb-2 border-b border-aag-primary/20 pb-1">
                Communication Preferences
              </p>
              <div className="space-y-2 pt-1">
                {communicationInfo.map((item) => (
                  <div key={item.key} className="flex justify-between items-center py-1 border-b border-gray-50 last:border-b-0 text-xs gap-3">
                    <span className="text-gray-400 font-medium uppercase text-[0.6rem] tracking-wider shrink-0">{item.label}</span>
                    <span className="font-semibold text-gray-800 text-right">
                      {Array.isArray(item.val) ? item.val.join(', ') : item.val}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Special Preferences */}
        {specialPreferencesInfo.length > 0 && (
          <div className="flex-1 min-w-[280px] sm:min-w-[calc(50%-12px)] sm:max-w-[calc(50%-12px)] shrink-0 animate-fade-in flex flex-col justify-start pr-6 border-r border-gray-100 last:border-r-0 last:pr-0">
            <div>
              <p className="text-[0.65rem] uppercase font-bold text-aag-primary tracking-wider mb-2 border-b border-aag-primary/20 pb-1">
                Special Preferences
              </p>
              <ul className="space-y-1.5 list-disc pl-3 pt-1">
                {specialPreferencesInfo.map((item, idx) => (
                  <li key={idx} className="text-xs font-semibold text-gray-800 leading-relaxed">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    );

    if (hideShell) {
      return (
        <div className="flex flex-col flex-grow relative">
          {hasExtraFields && (
            <div className="absolute right-4 -top-[35px] text-[0.65rem] text-gray-500 animate-pulse bg-white px-2 py-0.5 rounded-full pointer-events-none z-10 font-bold shadow-sm border border-gray-100">
              Scroll →
            </div>
          )}
          {content}
        </div>
      );
    }

    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-card overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
          <Users size={16} className="text-aag-primary" />
          <h3 className="text-sm font-semibold text-gray-900">Client Snapshot</h3>
          {hasExtraFields && (
            <span className="ml-auto text-[0.65rem] text-gray-400 animate-pulse">
              Scroll →
            </span>
          )}
        </div>
        {content}
      </div>
    );
  };

  const renderAiMemory = () => {
    const content = (
      <div className="bg-gradient-to-r from-aag-accent/15 via-white to-white rounded-lg p-4 border-l-4 border-l-aag-primary border border-gray-100 min-h-[120px] shadow-sm relative overflow-hidden flex-grow overflow-y-auto max-h-[220px] scrollbar-thin scrollbar-thumb-gray-200">
        {/* Subtle background decorative icon */}
        <div className="absolute right-3 bottom-3 opacity-[0.03] text-aag-primary pointer-events-none">
          <Brain size={120} />
        </div>
        {isGenerating ? (
          <div className="flex flex-col items-center justify-center gap-3 py-6 relative z-10">
            <div className="relative">
              <Loader2 size={24} className="text-aag-primary animate-spin" />
              <Brain size={12} className="text-aag-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Generating AI Memory...</p>
              <p className="text-xs text-gray-400 mt-0.5">Analyzing client data with Gemini RAG</p>
            </div>
          </div>
        ) : aiSummary ? (
          <div className="prose prose-sm max-w-none relative z-10">
            {renderSummaryText(aiSummary)}
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center py-4 relative z-10">
            AI summary will be generated automatically...
          </p>
        )}
      </div>
    );

    if (hideShell) {
      return (
        <div className="p-5 flex flex-col flex-grow">
          <div className="flex items-center gap-2 mb-3 shrink-0">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-aag-accent text-aag-primary text-[0.65rem] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-aag-primary animate-pulse-slow" />
              RAG Powered
            </span>
            {hasGenerated && !isGenerating && (
              <button
                type="button"
                onClick={generateSummary}
                className="ml-auto inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[0.65rem] font-medium text-gray-500 hover:text-aag-primary hover:bg-aag-accent/30 border border-gray-200 hover:border-aag-primary/30 transition-all cursor-pointer"
                title="Regenerate AI summary"
              >
                <RefreshCw size={10} />
                Regenerate
              </button>
            )}
          </div>
          {content}
        </div>
      );
    }

    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-card overflow-hidden relative flex flex-col min-h-[300px] lg:h-[300px]">
        {/* Decorative top subtle gradient bar */}
        <div className="h-0.5 bg-gradient-to-r from-aag-primary via-aag-primary-light to-aag-accent" />
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2 shrink-0">
          <Brain size={16} className="text-aag-primary" />
          <h3 className="text-sm font-semibold text-gray-900">AI Client Memory</h3>
          <span className="ml-auto inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-aag-accent text-aag-primary text-[0.65rem] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-aag-primary animate-pulse" />
            RAG Powered
          </span>
          {/* Regenerate button */}
          {hasGenerated && !isGenerating && (
            <button
              onClick={generateSummary}
              className="ml-2 inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[0.65rem] font-medium text-gray-500 hover:text-aag-primary hover:bg-aag-accent/30 border border-gray-200 hover:border-aag-primary/30 transition-all cursor-pointer"
              title="Regenerate AI summary"
            >
              <RefreshCw size={10} />
              Regenerate
            </button>
          )}
        </div>
        <div className="p-5 flex flex-col flex-grow">
          {content}
        </div>
      </div>
    );
  };

  const renderTimeline = () => (
    <div className="bg-white rounded-xl border border-gray-200 shadow-card overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
        <Heart size={16} className="text-aag-primary" />
        <h3 className="text-sm font-semibold text-gray-900">Memory Timeline</h3>
      </div>
      <div className="p-5">
        {timeline.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">No timeline events recorded yet.</p>
        ) : (
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[15px] top-2 bottom-2 w-px bg-gray-200" />

            <div className="space-y-4">
              {timeline.map((event, i) => {
                const config = CATEGORY_CONFIG[event.category] || CATEGORY_CONFIG['Meeting Summary'];
                const Icon = config.icon;
                return (
                  <div key={i} className="flex items-start gap-3.5 relative animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
                    {/* Dot */}
                    <div className={`w-[30px] h-[30px] rounded-full flex items-center justify-center ${config.color} shrink-0 z-10 ring-2 ring-white`}>
                      <Icon size={14} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold text-gray-800">{event.date}</span>
                        <span className={`text-[0.6rem] font-semibold px-1.5 py-0.5 rounded-full ${config.color}`}>
                          {event.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                        {event.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (section === 'snapshot') return renderSnapshot();
  if (section === 'ai-memory') return renderAiMemory();
  if (section === 'timeline') return renderTimeline();

  // Default fallback to render all sections stacked
  return (
    <div className="space-y-5">
      {renderSnapshot()}
      {renderAiMemory()}
      {renderTimeline()}
    </div>
  );
}
