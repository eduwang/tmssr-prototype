// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// 환경변수에서 Firebase 설정 값 불러오기 (.env 사용)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: "G-819RL7CC06"
};

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);

// 필요한 Firebase 서비스 export
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;

