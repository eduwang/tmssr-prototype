import { auth } from '../firebaseConfig.js';
import { onAuthStateChanged } from 'firebase/auth';
import { db } from '../firebaseConfig.js';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { marked } from 'marked';

const adminUIDs = [
  "0eKT8AOlyhVMaMwzukJY56Dyrc52",
  "ebAYvBi8VHSpsqfmpqyrp8AWK8O2",
  "uid_3_여기에입력"
];

const contentDiv = document.getElementById('adminContent');

function formatConversation(text) {
  const lines = text.split('\n').map(line => {
    if (line.startsWith('👩‍🏫')) {
      return `<span class="teacher-line">${line}</span>`;
    } else {
      return line;
    }
  });
  return lines.join('<br>');
}

function renderEntries(docs) {
  const html = docs.map(data => `
    <div class="entry">
      <p><strong>🧑 사용자:</strong> ${data.userName || '알 수 없음'}</p>
      <p><strong>🕒 시간:</strong> ${data.timestamp?.toDate?.().toLocaleString?.() || '기록 없음'}</p>
      <p><strong>🗣️ 대화 내용:</strong></p>
      <div class="conversation-box">${formatConversation(data.conversation || '')}</div>
      <p><strong>📋 피드백 내용:</strong></p>
      <div class="markdown">${marked.parse(data.feedback || '')}</div>
    </div>
  `).join("<hr/>");

  document.getElementById('caseResult').innerHTML = html;
}

let selectedCase = "all";
let searchTerm = "";
let allDocs = []; // ✅ 전역 변수로 선언하여 모든 함수에서 접근 가능하게

function applyFilters() {
let filtered = allDocs;

if (selectedCase !== "all") {
    filtered = filtered.filter(d => 
      (d.caseId || '').trim().toLowerCase() === selectedCase.trim().toLowerCase()
    );
  }
  

if (searchTerm.trim()) {
    filtered = filtered.filter(d =>
    (d.userName || "").toLowerCase().includes(searchTerm.trim().toLowerCase())
    );
}

renderEntries(filtered);
}


onAuthStateChanged(auth, async (user) => {
  if (!user || !adminUIDs.includes(user.uid)) {
    alert("접근 권한이 없습니다.");
    window.location.href = "/index.html";
    return;
  }

  try {
    const q = query(collection(db, "lessonFeedbacks"), orderBy("timestamp", "desc"));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      contentDiv.innerHTML = "<p>저장된 피드백이 없습니다.</p>";
      return;
    }

    const caseSet = new Set();
    const userSet = new Set();
    // const allDocs = [];

    snapshot.forEach(doc => {
      const data = doc.data();
      console.log("📦 저장된 caseId:", data.caseId);
      if (data.caseId) caseSet.add(data.caseId);
      if (data.userName) userSet.add(data.userName);
      allDocs.push(data);
    });

    // 필터 UI 렌더링
    const filterUI = `
    <div class="filter-bar">
      <select id="caseSelect">
        <option value="all">전체 케이스</option>
        ${[...caseSet].map(cid => {
          const cleanId = cid.trim().toLowerCase();
          return `<option value="${cleanId}">${cleanId}</option>`;
        }).join('')}
      </select>
  
      <select id="userSelect">
        <option value="all">전체 사용자</option>
        ${[...userSet].map(name => `<option value="${name}">${name}</option>`).join('')}
      </select>
    </div>
    <div id="caseResult"></div>
  `;
  
    contentDiv.innerHTML = filterUI;

    renderEntries(allDocs); // 기본 전체 표시

  } catch (err) {
    console.error("Firestore 조회 오류:", err);
    contentDiv.textContent = "🔥 데이터를 불러오는 중 오류가 발생했습니다.";
  }

// ✅ 이거만 유지!
// 🟦 case 선택
    document.getElementById('caseSelect').addEventListener('change', (e) => {
        selectedCase = e.target.value;
        applyFilters();
    });
    
    // 🟦 사용자 선택
    document.getElementById('userSelect').addEventListener('change', (e) => {
        searchTerm = e.target.value === "all" ? "" : e.target.value;
        applyFilters();
    });
   

});
