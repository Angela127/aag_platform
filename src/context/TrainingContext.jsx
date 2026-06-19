// src/context/TrainingContext.jsx
import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from './AuthContext.jsx';
import { db } from '../lib/firebase.js';
import { collection, doc, setDoc, getDoc, getDocs, onSnapshot, query, limit } from 'firebase/firestore';
import {
  CPD_TOTAL,
  CPD_CATEGORIES,
  CERTIFICATES,
  COURSES,
  QUIZZES,
  KB_ARTICLES,
  CPD_ACTIVITY
} from '../lib/trainingData.js';

const TrainingContext = createContext(null);

// Database seeding helper
const seedDatabaseIfEmpty = async () => {
  try {
    const coursesCol = collection(db, 'trainingCourses');
    const qSnapshot = await getDocs(query(coursesCol, limit(1)));
    if (qSnapshot.empty) {
      console.log('Training database is empty. Seeding Firestore with default data...');
      
      // 1. Seed courses
      for (const course of COURSES) {
        await setDoc(doc(db, 'trainingCourses', course.id), course);
      }
      
      // 2. Seed quizzes
      for (const quiz of QUIZZES) {
        await setDoc(doc(db, 'trainingQuizzes', quiz.id), quiz);
      }
      
      // 3. Seed certificates
      for (const cert of CERTIFICATES) {
        await setDoc(doc(db, 'trainingCertificates', cert.id), cert);
      }
      
      // 4. Seed KB articles
      for (const article of KB_ARTICLES) {
        await setDoc(doc(db, 'knowledgeBaseArticles', article.id), article);
      }
      
      console.log('Seeding complete!');
    }
  } catch (err) {
    console.error('Error seeding database:', err);
  }
};

export function TrainingProvider({ children }) {
  const { user } = useAuth();
  
  // Static collections loaded from Firestore
  const [courses, setCourses] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [kbArticles, setKbArticles] = useState([]);
  
  // User progress states loaded from Firestore
  const [cpdEarned, setCpdEarned] = useState(0);
  const [categoryHours, setCategoryHours] = useState({});
  const [completedVideos, setCompletedVideos] = useState(new Set());
  const [completedQuizzes, setCompletedQuizzes] = useState(new Set());
  const [quizScores, setQuizScores] = useState({});
  const [cpdActivity, setCpdActivity] = useState([]);
  
  // UI States
  const [activeVideo, setActiveVideo] = useState(null);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Sync Status
  const [staticLoaded, setStaticLoaded] = useState(false);
  const [progressLoaded, setProgressLoaded] = useState(false);

  // 1. Load Static Collections (and seed if empty)
  useEffect(() => {
    const loadStaticData = async () => {
      await seedDatabaseIfEmpty();
      try {
        const coursesSnap = await getDocs(collection(db, 'trainingCourses'));
        const quizzesSnap = await getDocs(collection(db, 'trainingQuizzes'));
        const certsSnap = await getDocs(collection(db, 'trainingCertificates'));
        const kbSnap = await getDocs(collection(db, 'knowledgeBaseArticles'));
        
        setCourses(coursesSnap.docs.map(d => d.data()));
        setQuizzes(quizzesSnap.docs.map(d => d.data()));
        setCertificates(certsSnap.docs.map(d => d.data()));
        setKbArticles(kbSnap.docs.map(d => d.data()));
        setStaticLoaded(true);
      } catch (err) {
        console.error('Error loading static training data:', err);
        setStaticLoaded(true); // Prevent infinite loading overlay on error
      }
    };
    
    loadStaticData();
  }, []);

  // 2. Load and Sync User Progress
  useEffect(() => {
    if (!user) {
      setProgressLoaded(true);
      return;
    }
    
    setProgressLoaded(false);
    const userProgressDocRef = doc(db, 'userTrainingProgress', user.uid);
    
    // Initialize user progress document with defaults if not present
    getDoc(userProgressDocRef).then((docSnap) => {
      if (!docSnap.exists()) {
        const defaultProgress = {
          cpdEarned: CPD_TOTAL.earned,
          categoryHours: Object.fromEntries(CPD_CATEGORIES.map(c => [c.id, c.earned])),
          completedVideos: ['c01', 'c02', 'c05', 'c06', 'c09'],
          completedQuizzes: ['q01', 'q02', 'q06'],
          quizScores: { q01: 90, q02: 60, q06: 80 },
          cpdActivity: CPD_ACTIVITY,
        };
        setDoc(userProgressDocRef, defaultProgress);
      }
    }).catch(err => {
      console.error('Error checking/initializing user progress:', err);
    });

    // Setup real-time listener
    const unsub = onSnapshot(userProgressDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setCpdEarned(data.cpdEarned ?? 0);
        setCategoryHours(data.categoryHours ?? {});
        setCompletedVideos(new Set(data.completedVideos ?? []));
        setCompletedQuizzes(new Set(data.completedQuizzes ?? []));
        setQuizScores(data.quizScores ?? {});
        setCpdActivity(data.cpdActivity ?? []);
      }
      setProgressLoaded(true);
    }, (err) => {
      console.error('Error syncing user progress:', err);
      setProgressLoaded(true);
    });

    return unsub;
  }, [user]);

  // Combined Loading State
  const loading = !staticLoaded || (user && !progressLoaded);

  // 3. Dynamic Certificates Calculation
  const earnedCerts = useMemo(() => {
    const earned = new Set(['cert01', 'cert02', 'cert03', 'cert04']); // Base certificates
    
    // check cert05: Complete c03 + score >= 80% on q02
    const scoreQ02 = quizScores['q02'] || 0;
    if (completedVideos.has('c03') && scoreQ02 >= 80) {
      earned.add('cert05');
    }
    
    // check cert06: Complete c04 + c08
    if (completedVideos.has('c04') && completedVideos.has('c08')) {
      earned.add('cert06');
    }
    
    // check cert07: Complete c06 + score >= 85% on q03
    const scoreQ03 = quizScores['q03'] || 0;
    if (completedVideos.has('c06') && scoreQ03 >= 85) {
      earned.add('cert07');
    }
    
    // check cert08: Earn all other 7 certifications + complete 40 CPD hours
    const hasOther7 = ['cert01', 'cert02', 'cert03', 'cert04', 'cert05', 'cert06', 'cert07'].every(c => earned.has(c));
    if (hasOther7 && cpdEarned >= 40) {
      earned.add('cert08');
    }
    
    return earned;
  }, [completedVideos, quizScores, cpdEarned]);

  // 4. Dynamic Learning Path Roadmapping
  const learningPath = useMemo(() => {
    const staticPathCourseIds = ['c01', 'c02', 'c06', 'c03', 'c04', 'c08'];
    return staticPathCourseIds.map((courseId, idx) => {
      const isCompleted = completedVideos.has(courseId);
      const prevCompleted = idx === 0 || completedVideos.has(staticPathCourseIds[idx - 1]);
      
      let status = 'locked';
      if (isCompleted) {
        status = 'completed';
      } else if (prevCompleted) {
        status = 'current';
      }
      
      return {
        id: `lp${idx + 1}`,
        courseId,
        step: idx + 1,
        status
      };
    });
  }, [completedVideos]);

  // 5. Dynamic AI Recommendations Engine
  const aiRecommendation = useMemo(() => {
    const lowQuizzes = [];
    Object.entries(quizScores).forEach(([quizId, score]) => {
      if (score < 70) {
        const quiz = quizzes.find(q => q.id === quizId);
        if (quiz) {
          lowQuizzes.push({ quiz, score });
        }
      }
    });

    if (lowQuizzes.length > 0) {
      lowQuizzes.sort((a, b) => a.score - b.score);
      const weakest = lowQuizzes[0];
      const category = weakest.quiz.category;
      
      const topicNames = {
        ethics: 'Ethics & Compliance',
        product: 'Retirement & Insurance Products',
        technical: 'Portfolio & Investment Management'
      };
      const topicName = topicNames[category] || category;
      
      const recommendedCourseIds = courses
        .filter(c => c.category === category && !completedVideos.has(c.id))
        .map(c => c.id);

      return {
        weakTopic: topicName,
        score: weakest.score,
        message: `You scored ${weakest.score}% in the ${weakest.quiz.title} quiz — below the 70% competency threshold. We recommend completing the following course path to build mastery:`,
        path: recommendedCourseIds.length > 0 ? recommendedCourseIds.slice(0, 3) : ['c02', 'c03', 'c04']
      };
    }

    return {
      weakTopic: 'All Areas',
      score: 100,
      message: 'You have maintained high scores across all quizzes! Continue your learning path with these recommended courses:',
      path: ['c03', 'c04', 'c08']
    };
  }, [quizScores, quizzes, courses, completedVideos]);

  // Mark a video complete → credit CPD & write to Firestore
  const markVideoComplete = useCallback(async (course) => {
    if (!user || completedVideos.has(course.id)) return;

    const newCompletedVideos = [...completedVideos, course.id];
    const newCpdEarned = Math.min(cpdEarned + course.cpd, CPD_TOTAL.required);
    
    const currentCatHrs = categoryHours[course.category] || 0;
    const requiredCatHrs = CPD_CATEGORIES.find(c => c.id === course.category)?.required || 99;
    const newCategoryHours = {
      ...categoryHours,
      [course.category]: Math.min(currentCatHrs + course.cpd, requiredCatHrs)
    };

    // Add activity log item
    const newActivity = {
      id: `a_${Date.now()}`,
      type: 'video',
      title: course.title,
      date: new Date().toISOString().split('T')[0],
      hours: course.cpd,
      category: course.category
    };
    const newCpdActivity = [newActivity, ...cpdActivity];

    try {
      const userProgressDocRef = doc(db, 'userTrainingProgress', user.uid);
      await setDoc(userProgressDocRef, {
        cpdEarned: newCpdEarned,
        categoryHours: newCategoryHours,
        completedVideos: newCompletedVideos,
        completedQuizzes: Array.from(completedQuizzes),
        quizScores,
        cpdActivity: newCpdActivity
      }, { merge: true });
    } catch (err) {
      console.error('Error writing video completion to Firestore:', err);
    }
  }, [user, completedVideos, cpdEarned, categoryHours, completedQuizzes, quizScores, cpdActivity]);

  // Mark quiz complete → credit CPD & write to Firestore
  const markQuizComplete = useCallback(async (quiz, score) => {
    if (!user) return;

    const alreadyDone = completedQuizzes.has(quiz.id);
    const newCompletedQuizzes = alreadyDone 
      ? Array.from(completedQuizzes)
      : [...completedQuizzes, quiz.id];
    
    const prevScore = quizScores[quiz.id] || 0;
    const newQuizScores = {
      ...quizScores,
      [quiz.id]: Math.max(prevScore, score)
    };

    let newCpdEarned = cpdEarned;
    let newCategoryHours = { ...categoryHours };
    let newCpdActivity = [...cpdActivity];

    if (!alreadyDone) {
      newCpdEarned = Math.min(cpdEarned + quiz.cpd, CPD_TOTAL.required);
      
      const currentCatHrs = categoryHours[quiz.category] || 0;
      const requiredCatHrs = CPD_CATEGORIES.find(c => c.id === quiz.category)?.required || 99;
      newCategoryHours[quiz.category] = Math.min(currentCatHrs + quiz.cpd, requiredCatHrs);

      // Add activity log item
      const newActivity = {
        id: `a_${Date.now()}`,
        type: 'quiz',
        title: quiz.title,
        date: new Date().toISOString().split('T')[0],
        hours: quiz.cpd,
        category: quiz.category
      };
      newCpdActivity = [newActivity, ...cpdActivity];
    }

    try {
      const userProgressDocRef = doc(db, 'userTrainingProgress', user.uid);
      await setDoc(userProgressDocRef, {
        cpdEarned: newCpdEarned,
        categoryHours: newCategoryHours,
        completedVideos: Array.from(completedVideos),
        completedQuizzes: newCompletedQuizzes,
        quizScores: newQuizScores,
        cpdActivity: newCpdActivity
      }, { merge: true });
    } catch (err) {
      console.error('Error writing quiz completion to Firestore:', err);
    }
  }, [user, completedQuizzes, quizScores, cpdEarned, categoryHours, cpdActivity, completedVideos]);

  // Navigate to video player tab
  const openVideo = useCallback((course) => {
    setActiveVideo(course);
    setActiveTab('player');
  }, []);

  // Navigate to quiz runner
  const openQuiz = useCallback((quiz) => {
    setActiveQuiz(quiz);
    setActiveTab('quizzes');
  }, []);

  return (
    <TrainingContext.Provider value={{
      courses,
      quizzes,
      certificates,
      kbArticles,
      cpdActivity,
      learningPath,
      aiRecommendation,
      quizScores,
      loading,
      cpdEarned,
      cpdRequired: CPD_TOTAL.required,
      categoryHours,
      completedVideos,
      completedQuizzes,
      earnedCerts,
      activeVideo,
      setActiveVideo,
      activeQuiz,
      setActiveQuiz,
      activeTab,
      setActiveTab,
      markVideoComplete,
      markQuizComplete,
      openVideo,
      openQuiz,
    }}>
      {children}
    </TrainingContext.Provider>
  );
}

export function useTraining() {
  const ctx = useContext(TrainingContext);
  if (!ctx) throw new Error('useTraining must be used inside TrainingProvider');
  return ctx;
}
