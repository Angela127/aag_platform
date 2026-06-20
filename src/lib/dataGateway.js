import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { db } from './firebase.js';
import referenceData from './dataSources/referenceData.json';

// Seed or update Firestore market cache
export const seedMarketDataCache = async () => {
  try {
    const cacheRef = collection(db, 'market_data_cache');
    const snapshot = await getDocs(cacheRef);
    
    // Seed default rates if empty
    if (snapshot.empty) {
      console.log('Seeding market_data_cache in Firestore...');
      const defaultRates = [
        { key: 'bnm_opr', tier: '2', value: '3.00', unit: '% p.a.', source: 'Bank Negara Malaysia', fetched_at: new Date().toISOString(), expires_at: new Date(Date.now() + 86400000).toISOString() },
        { key: 'mas_sora', tier: '2', value: '3.65', unit: '% p.a.', source: 'Monetary Authority of Singapore', fetched_at: new Date().toISOString(), expires_at: new Date(Date.now() + 86400000).toISOString() },
        { key: 'fbm_klci', tier: '3', value: '1612.45', unit: 'points', source: 'Bursa Malaysia', fetched_at: new Date().toISOString(), expires_at: new Date(Date.now() + 3600000).toISOString() },
        { key: 'sti_index', tier: '3', value: '3345.80', unit: 'points', source: 'Singapore Exchange', fetched_at: new Date().toISOString(), expires_at: new Date(Date.now() + 3600000).toISOString() },
        { key: 'inflation_my', tier: '2', value: '2.50', unit: '%', source: 'Department of Statistics Malaysia', fetched_at: new Date().toISOString(), expires_at: new Date(Date.now() + 86400000).toISOString() },
        { key: 'inflation_sg', tier: '2', value: '3.10', unit: '%', source: 'Monetary Authority of Singapore', fetched_at: new Date().toISOString(), expires_at: new Date(Date.now() + 86400000).toISOString() }
      ];
      
      for (const item of defaultRates) {
        await setDoc(doc(db, 'market_data_cache', item.key), item);
      }
      console.log('Seeding of market_data_cache finished.');
    }
  } catch (error) {
    console.error('Failed to seed market_data_cache: ', error);
  }
};

export const getMarketContext = async (category) => {
  let tier2And3 = [];
  try {
    // Attempt to load from firestore cache
    const cacheRef = collection(db, 'market_data_cache');
    const snapshot = await getDocs(cacheRef);
    if (!snapshot.empty) {
      snapshot.forEach(doc => {
        tier2And3.push({ key: doc.id, ...doc.data() });
      });
    }
  } catch (error) {
    console.warn('Could not read market cache from Firestore, using fallbacks: ', error);
  }

  // Fallback fallback if Firestore is offline or unseeded
  if (tier2And3.length === 0) {
    tier2And3 = [
      { key: 'bnm_opr', tier: '2', value: '3.00', unit: '% p.a.', source: 'Bank Negara Malaysia' },
      { key: 'mas_sora', tier: '2', value: '3.65', unit: '% p.a.', source: 'Monetary Authority of Singapore' },
      { key: 'fbm_klci', tier: '3', value: '1612.45', unit: 'points', source: 'Bursa Malaysia' },
      { key: 'sti_index', tier: '3', value: '3345.80', unit: 'points', source: 'Singapore Exchange' },
      { key: 'inflation_my', tier: '2', value: '2.50', unit: '%', source: 'Department of Statistics Malaysia' },
      { key: 'inflation_sg', tier: '2', value: '3.10', unit: '%', source: 'Monetary Authority of Singapore' }
    ];
  }

  // Filter static reference stats from referenceData.json
  const tier1Filtered = referenceData.filter(stat => 
    stat.category === category && stat.complianceReviewed === true
  );

  return {
    tier1: tier1Filtered,
    tier2And3: tier2And3,
    asOf: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
  };
};
