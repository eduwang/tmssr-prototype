import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebaseConfig.js';

const provider = new GoogleAuthProvider();

const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const exerciseBtn = document.getElementById('goToExercise');
const userInfoDiv = document.getElementById('userInfo');

// ✅ 로그인 상태 확인
onAuthStateChanged(auth, (user) => {
    if (user) {
      userInfoDiv.textContent = `👤 ${user.displayName} 님`;
      loginBtn.style.display = 'none';
      logoutBtn.style.display = 'inline-block';
      exerciseBtn.style.display = 'inline-block';
    } else {
      userInfoDiv.textContent = '🔐 로그인되지 않았습니다.';
      loginBtn.style.display = 'inline-block';
      logoutBtn.style.display = 'none';
      exerciseBtn.style.display = 'none';
    }
  });

// ✅ 로그인 버튼
loginBtn.addEventListener('click', async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      alert(`${user.displayName}님 환영합니다!`);
    } catch (error) {
      console.error('로그인 오류:', error);
      alert('로그인 중 오류가 발생했습니다.');
    }
  });
  
  // ✅ 로그아웃 버튼
  logoutBtn.addEventListener('click', async () => {
    try {
      await signOut(auth);
      alert('로그아웃 되었습니다.');
    } catch (error) {
      console.error('로그아웃 오류:', error);
    }
  });
  

// 수업 시뮬레이션 페이지로 이동
exerciseBtn.addEventListener('click', () => {
  window.location.href = '/mainExercise/exercise.html';
});
