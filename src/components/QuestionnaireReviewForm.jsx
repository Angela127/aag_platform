import { useState } from 'react';
import PropTypes from 'prop-types';
import DynamicStringList from './DynamicStringList.jsx';
import { Save, X } from 'lucide-react';

export default function QuestionnaireReviewForm({ initialData, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    personalInfo: {
      nationality: '',
      maritalStatus: '',
      gender: '',
      mobileNumbers: [],
      dateOfBirth: '',
      ...initialData?.personalInfo
    },
    employmentInfo: {
      industry: '',
      yearsOfExperience: 0,
      employmentStatus: '',
      occupation: '',
      companyName: '',
      ...initialData?.employmentInfo
    },
    familyInfo: {
      numberOfDependents: 0,
      financiallyDependentMembers: 'No',
      summary: '',
      ...initialData?.familyInfo
    },
    financialInfo: {
      estimatedInvestableAssets: '',
      financialGoals: [],
      annualIncomeRange: '',
      ...initialData?.financialInfo
    },
    communicationPreferences: {
      preferredLanguage: '',
      preferredConsultation: '',
      ...initialData?.communicationPreferences
    }
  });

  const handlePersonalInfoChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  const handleEmploymentInfoChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      employmentInfo: {
        ...prev.employmentInfo,
        [field]: value
      }
    }));
  };

  const handleFamilyInfoChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      familyInfo: {
        ...prev.familyInfo,
        [field]: value
      }
    }));
  };

  const handleFinancialInfoChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      financialInfo: {
        ...prev.financialInfo,
        [field]: value
      }
    }));
  };

  const handleCommunicationPreferencesChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      communicationPreferences: {
        ...prev.communicationPreferences,
        [field]: value
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 flex-grow overflow-y-auto pr-1.5 min-h-0">
      <div className="bg-aag-accent/10 border border-aag-accent/30 rounded-xl p-4 mb-4">
        <h4 className="text-xs font-bold text-aag-primary uppercase tracking-wider mb-1">
          Review Fact-Find Data
        </h4>
        <p className="text-xs text-gray-600 leading-relaxed">
          The fields below were extracted from the uploaded PDF. Please review and update any incorrect or missing information before saving.
        </p>
      </div>

      {/* 1. Personal Information Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
          <span className="w-1.5 h-3.5 bg-aag-primary rounded-full"></span>
          Personal Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Nationality
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-aag-primary focus:border-aag-primary"
              value={formData.personalInfo.nationality}
              onChange={(e) => handlePersonalInfoChange('nationality', e.target.value)}
              placeholder="e.g. Malaysian"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Marital Status
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-aag-primary focus:border-aag-primary"
              value={formData.personalInfo.maritalStatus}
              onChange={(e) => handlePersonalInfoChange('maritalStatus', e.target.value)}
            >
              <option value="">Select status...</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Divorced">Divorced</option>
              <option value="Widowed">Widowed</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Gender
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-aag-primary focus:border-aag-primary"
              value={formData.personalInfo.gender}
              onChange={(e) => handlePersonalInfoChange('gender', e.target.value)}
            >
              <option value="">Select gender...</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-aag-primary focus:border-aag-primary"
              value={formData.personalInfo.dateOfBirth}
              onChange={(e) => handlePersonalInfoChange('dateOfBirth', e.target.value)}
            />
          </div>
        </div>

        <div>
          <DynamicStringList
            label="Mobile Numbers"
            items={formData.personalInfo.mobileNumbers}
            onChange={(val) => handlePersonalInfoChange('mobileNumbers', val)}
            placeholder="e.g. +60 12-345 6789"
            addButtonText="+ Add Mobile Number"
          />
        </div>
      </div>

      {/* 2. Employment Information Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
          <span className="w-1.5 h-3.5 bg-aag-primary rounded-full"></span>
          Employment Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Occupation
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-aag-primary focus:border-aag-primary"
              value={formData.employmentInfo.occupation}
              onChange={(e) => handleEmploymentInfoChange('occupation', e.target.value)}
              placeholder="e.g. Marketing Consultant"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Company Name
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-aag-primary focus:border-aag-primary"
              value={formData.employmentInfo.companyName}
              onChange={(e) => handleEmploymentInfoChange('companyName', e.target.value)}
              placeholder="e.g. Koh & Partners"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Industry
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-aag-primary focus:border-aag-primary"
              value={formData.employmentInfo.industry}
              onChange={(e) => handleEmploymentInfoChange('industry', e.target.value)}
              placeholder="e.g. Consulting & Strategy"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Employment Status
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-aag-primary focus:border-aag-primary"
              value={formData.employmentInfo.employmentStatus}
              onChange={(e) => handleEmploymentInfoChange('employmentStatus', e.target.value)}
            >
              <option value="">Select status...</option>
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Self-Employed">Self-Employed</option>
              <option value="Unemployed">Unemployed</option>
              <option value="Retired">Retired</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Years of Experience
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-aag-primary focus:border-aag-primary"
              value={formData.employmentInfo.yearsOfExperience}
              onChange={(e) => handleEmploymentInfoChange('yearsOfExperience', parseInt(e.target.value, 10) || 0)}
              min="0"
            />
          </div>
        </div>
      </div>

      {/* 3. Family Information Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
          <span className="w-1.5 h-3.5 bg-aag-primary rounded-full"></span>
          Family Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Number of Dependents
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-aag-primary focus:border-aag-primary"
              value={formData.familyInfo.numberOfDependents}
              onChange={(e) => handleFamilyInfoChange('numberOfDependents', parseInt(e.target.value, 10) || 0)}
              min="0"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Financially Dependent Members?
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-aag-primary focus:border-aag-primary"
              value={formData.familyInfo.financiallyDependentMembers}
              onChange={(e) => handleFamilyInfoChange('financiallyDependentMembers', e.target.value)}
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Family Summary / Details
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-aag-primary focus:border-aag-primary"
            rows="3"
            value={formData.familyInfo.summary}
            onChange={(e) => handleFamilyInfoChange('summary', e.target.value)}
            placeholder="e.g. Single, no dependents"
          />
        </div>
      </div>

      {/* 4. Financial Information Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
          <span className="w-1.5 h-3.5 bg-aag-primary rounded-full"></span>
          Financial Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Annual Income Range
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-aag-primary focus:border-aag-primary"
              value={formData.financialInfo.annualIncomeRange}
              onChange={(e) => handleFinancialInfoChange('annualIncomeRange', e.target.value)}
              placeholder="e.g. RM200,000 – RM300,000"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Estimated Investable Assets
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-aag-primary focus:border-aag-primary"
              value={formData.financialInfo.estimatedInvestableAssets}
              onChange={(e) => handleFinancialInfoChange('estimatedInvestableAssets', e.target.value)}
              placeholder="e.g. RM400,000 – RM800,000"
            />
          </div>
        </div>

        <div>
          <DynamicStringList
            label="Financial Goals"
            items={formData.financialInfo.financialGoals}
            onChange={(val) => handleFinancialInfoChange('financialGoals', val)}
            placeholder="e.g. Capital Preservation"
            addButtonText="+ Add Financial Goal"
          />
        </div>
      </div>

      {/* 5. Communication Preferences Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
          <span className="w-1.5 h-3.5 bg-aag-primary rounded-full"></span>
          Communication Preferences
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Preferred Language
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-aag-primary focus:border-aag-primary"
              value={formData.communicationPreferences.preferredLanguage}
              onChange={(e) => handleCommunicationPreferencesChange('preferredLanguage', e.target.value)}
              placeholder="e.g. English"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Preferred Consultation
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-aag-primary focus:border-aag-primary"
              value={formData.communicationPreferences.preferredConsultation}
              onChange={(e) => handleCommunicationPreferencesChange('preferredConsultation', e.target.value)}
              placeholder="e.g. In-person Meeting"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-50 transition-all cursor-pointer"
        >
          <X size={14} />
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-aag-primary hover:bg-aag-primary-dark text-white rounded-lg text-xs font-semibold transition-all shadow-sm cursor-pointer"
        >
          <Save size={14} />
          Confirm & Save
        </button>
      </div>
    </form>
  );
}

QuestionnaireReviewForm.propTypes = {
  initialData: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};
