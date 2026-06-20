import { useState, useEffect, useRef } from 'react';
import { X, ChevronDown, ChevronUp, Save } from 'lucide-react';
import PropTypes from 'prop-types';
import DynamicStringList from './DynamicStringList.jsx';

export default function EditClientModal({ client, isOpen, onClose, onSave }) {
  const modalRef = useRef(null);

  // Form State grouped by sections
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [occupation, setOccupation] = useState('');
  const [riskLevel, setRiskLevel] = useState('Medium');
  const [avatar, setAvatar] = useState('');

  // Personal Info
  const [nationality, setNationality] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('Single');
  const [gender, setGender] = useState('Male');
  const [mobileNumbers, setMobileNumbers] = useState([]);
  const [dob, setDob] = useState('');
  const [lifeStage, setLifeStage] = useState('');
  const [nextImportantDateLabel, setNextImportantDateLabel] = useState('');
  const [nextImportantDate, setNextImportantDate] = useState('');

  // Employment Info
  const [industry, setIndustry] = useState('');
  const [yearsExperience, setYearsExperience] = useState('');
  const [employmentStatus, setEmploymentStatus] = useState('Employed');
  const [companyName, setCompanyName] = useState('');

  // Family Info
  const [numDependents, setNumDependents] = useState(0);
  const [anyFamilyDependent, setAnyFamilyDependent] = useState('No');
  const [familyDetails, setFamilyDetails] = useState('');
  const [spouseName, setSpouseName] = useState('');
  const [childrenAges, setChildrenAges] = useState('');

  // Financial Info
  const [estimatedInvestableAssets, setEstimatedInvestableAssets] = useState('');
  const [annualIncomeRange, setAnnualIncomeRange] = useState('');
  const [financialGoals, setFinancialGoals] = useState([]);

  // Communication Preferences
  const [preferredLanguage, setPreferredLanguage] = useState('English');
  const [preferredConsultation, setPreferredConsultation] = useState('Online Meeting');

  // Special Preferences
  const [specialPreferences, setSpecialPreferences] = useState([]);

  // Accordion open/collapse states (Basic Profile starts open, others closed)
  const [openSections, setOpenSections] = useState({
    basic: true,
    personal: false,
    employment: false,
    family: false,
    financial: false,
    communication: false,
    special: false
  });

  // Pre-fill form state when client changes or modal opens
  useEffect(() => {
    if (client) {
      setName(client.name || '');
      setAge(client.age || '');
      setOccupation(client.occupation || '');
      setRiskLevel(client.riskLevel || 'Medium');
      setAvatar(client.avatar || '');

      setNationality(client.nationality || '');
      setMaritalStatus(client.maritalStatus || 'Single');
      setGender(client.gender || 'Male');
      
      // Ensure mobile numbers is array
      if (Array.isArray(client.mobileNumber)) {
        setMobileNumbers(client.mobileNumber);
      } else if (client.mobileNumber) {
        setMobileNumbers([client.mobileNumber]);
      } else {
        setMobileNumbers([]);
      }

      setDob(client.dob || '');
      setLifeStage(client.lifeStage || '');
      setNextImportantDateLabel(client.nextImportantDateLabel || '');
      setNextImportantDate(client.nextImportantDate || '');

      setIndustry(client.industry || '');
      setYearsExperience(client.yearsExperience || '');
      setEmploymentStatus(client.employmentStatus || 'Employed');
      setCompanyName(client.companyName || '');

      setNumDependents(client.numDependents || 0);
      setAnyFamilyDependent(client.anyFamilyDependent || 'No');
      setFamilyDetails(client.familyDetails || '');
      setSpouseName(client.spouseName || '');
      setChildrenAges(client.childrenAges || '');

      setEstimatedInvestableAssets(client.estimatedInvestableAssets || '');
      setAnnualIncomeRange(client.annualIncomeRange || '');
      
      setFinancialGoals(client.financialGoals || []);
      setPreferredLanguage(client.preferredLanguage || 'English');
      setPreferredConsultation(client.preferredConsultation || 'Online Meeting');
      
      setSpecialPreferences(client.specialPreferences || []);
    }
  }, [client, isOpen]);

  // Handle closing with Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();

    // Helper to trim and filter out blank strings from list arrays
    const cleanList = (list) => {
      if (!Array.isArray(list)) return [];
      return list.map(item => item.trim()).filter(item => item !== '');
    };

    const cleanedMobileNumbers = cleanList(mobileNumbers);
    const cleanedFinancialGoals = cleanList(financialGoals);
    const cleanedSpecialPreferences = cleanList(specialPreferences);

    const updatedData = {
      name: name.trim(),
      age: parseInt(age, 10) || 0,
      occupation: occupation.trim(),
      riskLevel,
      avatar: avatar.trim(),

      nationality: nationality.trim(),
      maritalStatus,
      gender,
      mobileNumber: cleanedMobileNumbers,
      dob,
      lifeStage: lifeStage.trim(),
      nextImportantDateLabel: nextImportantDateLabel.trim(),
      nextImportantDate: nextImportantDate,

      industry: industry.trim(),
      yearsExperience: yearsExperience.toString().trim(),
      employmentStatus,
      companyName: companyName.trim(),

      numDependents: parseInt(numDependents, 10) || 0,
      anyFamilyDependent,
      familyDetails: familyDetails.trim(),
      spouseName: maritalStatus === 'Married' ? spouseName.trim() : '',
      childrenAges: maritalStatus === 'Married' ? childrenAges.trim() : '',

      estimatedInvestableAssets,
      annualIncomeRange,
      financialGoals: cleanedFinancialGoals,

      preferredLanguage,
      preferredConsultation,
      specialPreferences: cleanedSpecialPreferences
    };

    onSave(updatedData);
  };

  const handleOverlayClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4 animate-fade-in"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-scale-in border border-gray-100"
      >
        {/* Fixed Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-white to-gray-55/10">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Edit Client &mdash; <span className="text-aag-primary">{name || client?.name}</span>
            </h2>
            <p className="text-xs text-gray-500">Update client profile and advisor intelligence details</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSave} className="flex-grow overflow-y-auto p-6 space-y-4">
          
          {/* Section 1: Basic Profile */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection('basic')}
              className="w-full px-5 py-3.5 bg-gray-55/20 hover:bg-gray-55/40 flex items-center justify-between text-sm font-semibold text-gray-800 transition-colors"
            >
              <span>Basic Profile</span>
              {openSections.basic ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            
            {openSections.basic && (
              <div className="p-5 bg-white border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4 animate-slide-down">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-aag-primary focus:border-aag-primary focus:outline-none"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Age</label>
                  <input
                    type="number"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-aag-primary focus:border-aag-primary focus:outline-none"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Occupation</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-aag-primary focus:border-aag-primary focus:outline-none"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Risk Level</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-aag-primary focus:border-aag-primary focus:outline-none bg-white"
                    value={riskLevel}
                    onChange={(e) => setRiskLevel(e.target.value)}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Avatar Image URL (Optional)</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-aag-primary focus:border-aag-primary focus:outline-none"
                    placeholder="https://example.com/avatar.jpg"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Personal Information */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection('personal')}
              className="w-full px-5 py-3.5 bg-gray-55/20 hover:bg-gray-55/40 flex items-center justify-between text-sm font-semibold text-gray-800 transition-colors"
            >
              <span>Personal Information</span>
              {openSections.personal ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {openSections.personal && (
              <div className="p-5 bg-white border-t border-gray-100 space-y-4 animate-slide-down">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Nationality</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-aag-primary focus:border-aag-primary focus:outline-none"
                      value={nationality}
                      onChange={(e) => setNationality(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Marital Status</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-aag-primary focus:border-aag-primary focus:outline-none bg-white"
                      value={maritalStatus}
                      onChange={(e) => setMaritalStatus(e.target.value)}
                    >
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Divorced">Divorced</option>
                      <option value="Widowed">Widowed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Gender</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-aag-primary focus:border-aag-primary focus:outline-none bg-white"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Date of Birth</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-aag-primary focus:border-aag-primary focus:outline-none bg-white"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Life Stage / Primary Goal</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-aag-primary focus:border-aag-primary focus:outline-none"
                      placeholder="e.g. Young Family, Education Planning, Retirement Focus"
                      value={lifeStage}
                      onChange={(e) => setLifeStage(e.target.value)}
                    />
                  </div>
                </div>

                {/* Mobile Numbers via DynamicStringList */}
                <div className="border-t border-gray-100 pt-3">
                  <DynamicStringList
                    label="Mobile Numbers"
                    items={mobileNumbers}
                    onChange={setMobileNumbers}
                    placeholder="e.g. +60 12-345 6789"
                    addButtonText="+ ADD NEW MOBILE NUMBER"
                  />
                </div>

                {/* Next Important Date side-by-side */}
                <div className="border-t border-gray-100 pt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Next Important Date Event</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-aag-primary focus:border-aag-primary focus:outline-none"
                      placeholder="e.g. Policy Renewal"
                      value={nextImportantDateLabel}
                      onChange={(e) => setNextImportantDateLabel(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Next Important Date</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-aag-primary focus:border-aag-primary focus:outline-none bg-white"
                      value={nextImportantDate}
                      onChange={(e) => setNextImportantDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Employment Information */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection('employment')}
              className="w-full px-5 py-3.5 bg-gray-55/20 hover:bg-gray-55/40 flex items-center justify-between text-sm font-semibold text-gray-800 transition-colors"
            >
              <span>Employment Information</span>
              {openSections.employment ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {openSections.employment && (
              <div className="p-5 bg-white border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4 animate-slide-down">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Employment Status</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-aag-primary focus:border-aag-primary focus:outline-none bg-white"
                    value={employmentStatus}
                    onChange={(e) => setEmploymentStatus(e.target.value)}
                  >
                    <option value="Employed">Employed</option>
                    <option value="Self-Employed">Self-Employed</option>
                    <option value="Business Owner">Business Owner</option>
                    <option value="Retired">Retired</option>
                    <option value="Unemployed">Unemployed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Company Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-aag-primary focus:border-aag-primary focus:outline-none"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Industry</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-aag-primary focus:border-aag-primary focus:outline-none"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Years of Experience</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-aag-primary focus:border-aag-primary focus:outline-none"
                    value={yearsExperience}
                    onChange={(e) => setYearsExperience(e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Occupation (synced with Basic Profile)</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-aag-primary focus:border-aag-primary focus:outline-none"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Family Information */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection('family')}
              className="w-full px-5 py-3.5 bg-gray-55/20 hover:bg-gray-55/40 flex items-center justify-between text-sm font-semibold text-gray-800 transition-colors"
            >
              <span>Family Information</span>
              {openSections.family ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {openSections.family && (
              <div className="p-5 bg-white border-t border-gray-100 space-y-4 animate-slide-down">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Number of Dependents</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-aag-primary focus:border-aag-primary focus:outline-none"
                      value={numDependents}
                      onChange={(e) => setNumDependents(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Any Family Members Dependent on You?</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-aag-primary focus:border-aag-primary focus:outline-none bg-white"
                      value={anyFamilyDependent}
                      onChange={(e) => setAnyFamilyDependent(e.target.value)}
                    >
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>

                  {maritalStatus === 'Married' && (
                    <>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Spouse Name (Optional)</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-aag-primary focus:border-aag-primary focus:outline-none"
                          value={spouseName}
                          onChange={(e) => setSpouseName(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Children's Ages (Optional)</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-aag-primary focus:border-aag-primary focus:outline-none"
                          placeholder="e.g. 5, 8"
                          value={childrenAges}
                          onChange={(e) => setChildrenAges(e.target.value)}
                        />
                      </div>
                    </>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Family Details Summary</label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-aag-primary focus:border-aag-primary focus:outline-none min-h-[70px]"
                    placeholder="e.g. Married, two children (ages 8 and 10)"
                    value={familyDetails}
                    onChange={(e) => setFamilyDetails(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 5: Financial Information */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection('financial')}
              className="w-full px-5 py-3.5 bg-gray-55/20 hover:bg-gray-55/40 flex items-center justify-between text-sm font-semibold text-gray-800 transition-colors"
            >
              <span>Financial Information</span>
              {openSections.financial ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {openSections.financial && (
              <div className="p-5 bg-white border-t border-gray-100 space-y-4 animate-slide-down">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Estimated Investable Assets</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-aag-primary focus:border-aag-primary focus:outline-none bg-white"
                      value={estimatedInvestableAssets}
                      onChange={(e) => setEstimatedInvestableAssets(e.target.value)}
                    >
                      <option value="">Select Range</option>
                      <option value="Below RM20,000">Below RM20,000</option>
                      <option value="RM20,000 – RM50,000">RM20,000 – RM50,000</option>
                      <option value="RM50,000 – RM150,000">RM50,000 – RM150,000</option>
                      <option value="RM150,000 – RM300,000">RM150,000 – RM300,000</option>
                      <option value="RM300,000 – RM500,000">RM300,000 – RM500,000</option>
                      <option value="RM500,000+">RM500,000+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Annual Income Range</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-aag-primary focus:border-aag-primary focus:outline-none bg-white"
                      value={annualIncomeRange}
                      onChange={(e) => setAnnualIncomeRange(e.target.value)}
                    >
                      <option value="">Select Range</option>
                      <option value="Below RM24,000">Below RM24,000</option>
                      <option value="RM24,000 – RM60,000">RM24,000 – RM60,000</option>
                      <option value="RM60,000 – RM120,000">RM60,000 – RM120,000</option>
                      <option value="RM120,050 – RM180,000">RM120,050 – RM180,000</option>
                      <option value="RM150,000 – RM300,000">RM150,000 – RM300,000</option>
                      <option value="RM300,000 – RM500,000">RM300,000 – RM500,000</option>
                      <option value="RM500,000+">RM500,000+</option>
                    </select>
                  </div>
                </div>

                {/* Financial Goals List */}
                <div className="border-t border-gray-100 pt-3">
                  <DynamicStringList
                    label="Financial Goals"
                    items={financialGoals}
                    onChange={setFinancialGoals}
                    placeholder="e.g. Retirement Funding"
                    addButtonText="+ ADD NEW FINANCIAL GOAL"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 6: Communication Preferences */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection('communication')}
              className="w-full px-5 py-3.5 bg-gray-55/20 hover:bg-gray-55/40 flex items-center justify-between text-sm font-semibold text-gray-800 transition-colors"
            >
              <span>Communication Preferences</span>
              {openSections.communication ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {openSections.communication && (
              <div className="p-5 bg-white border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4 animate-slide-down">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Preferred Language</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-aag-primary focus:border-aag-primary focus:outline-none bg-white"
                    value={preferredLanguage}
                    onChange={(e) => setPreferredLanguage(e.target.value)}
                  >
                    <option value="English">English</option>
                    <option value="Mandarin">Mandarin</option>
                    <option value="Malay">Malay</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Preferred Consultation Method</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-aag-primary focus:border-aag-primary focus:outline-none bg-white"
                    value={preferredConsultation}
                    onChange={(e) => setPreferredConsultation(e.target.value)}
                  >
                    <option value="Online Meeting">Online Meeting</option>
                    <option value="In-person Meeting">In-person Meeting</option>
                    <option value="Video Call">Video Call</option>
                    <option value="Phone Call">Phone Call</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Section 7: Special Preferences */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection('special')}
              className="w-full px-5 py-3.5 bg-gray-55/20 hover:bg-gray-55/40 flex items-center justify-between text-sm font-semibold text-gray-800 transition-colors"
            >
              <span>Special Preferences (Advisor Notes)</span>
              {openSections.special ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {openSections.special && (
              <div className="p-5 bg-white border-t border-gray-100 animate-slide-down">
                <DynamicStringList
                  label="Special Preferences / Notes"
                  items={specialPreferences}
                  onChange={setSpecialPreferences}
                  placeholder="e.g. Vegetarian - mention for lunch meetings"
                  addButtonText="+ ADD NEW SPECIAL PREFERENCE"
                />
              </div>
            )}
          </div>

        </form>

        {/* Fixed Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSave}
            className="px-4 py-2 bg-aag-primary hover:bg-aag-primary-dark text-white rounded-lg text-sm font-medium transition-colors shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Save size={16} />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

EditClientModal.propTypes = {
  client: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired
};
