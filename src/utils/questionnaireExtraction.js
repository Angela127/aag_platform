import { mockQuestionnaireData } from '../data/mockQuestionnaireExtraction.js';

export async function extractQuestionnaireData(text, clientName = '') {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Customize mock data based on client name for a more personalized demo
      const customizedData = {
        ...mockQuestionnaireData,
        personalInfo: {
          ...mockQuestionnaireData.personalInfo,
          gender: (clientName && ['sarah', 'clara', 'emily', 'jasmin', 'vanessa', 'evelyn', 'aisha'].some(n => clientName.toLowerCase().includes(n))) ? 'Female' : 'Male'
        },
        employmentInfo: {
          ...mockQuestionnaireData.employmentInfo,
          occupation: (clientName && clientName.toLowerCase().includes('garcia')) ? 'Creative Director' : mockQuestionnaireData.employmentInfo.occupation,
          companyName: (clientName && clientName.toLowerCase().includes('garcia')) ? 'Creative Edge Studios' : mockQuestionnaireData.employmentInfo.companyName,
        }
      };
      resolve(customizedData);
    }, 1500);
  });
}
