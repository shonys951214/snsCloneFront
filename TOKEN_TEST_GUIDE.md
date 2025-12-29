# 토큰 테스트 가이드

액세스 토큰과 리프레시 토큰이 올바르게 작동하는지 테스트하는 방법입니다.

## 📋 테스트 전 준비사항

### 1. 액세스 토큰 만료 시간을 짧게 설정 (테스트용)

백엔드 `.env` 파일에서 액세스 토큰 만료 시간을 짧게 설정합니다:

```env
JWT_EXPIRES_IN=1m  # 1분으로 설정 (테스트용)
# 또는
JWT_EXPIRES_IN=30s  # 30초로 설정 (더 빠른 테스트)
```

**주의**: 테스트 후에는 다시 `15m`으로 변경하세요.

### 2. 백엔드 서버 재시작

`.env` 파일을 수정한 후 백엔드 서버를 재시작해야 합니다:

```bash
cd sns-back
npm run start:dev
```

### 2. 브라우저 개발자 도구 열기

- Chrome/Edge: `F12` 또는 `Ctrl + Shift + I`
- Application 탭 → Local Storage → `http://localhost:3000` 선택

## 🧪 테스트 시나리오

### 시나리오 1: 액세스 토큰 자동 갱신 테스트

**목적**: 액세스 토큰이 만료되면 자동으로 리프레시 토큰으로 갱신되는지 확인

**단계**:
1. 로그인하여 토큰 발급받기
2. Application 탭에서 `accessToken`과 `refreshToken` 확인
3. 액세스 토큰 만료 시간까지 대기 (예: 1분)
4. 피드 페이지나 내 페이지에서 API 호출 (게시글 새로고침 등)
5. **확인사항**:
   - 콘솔에서 토큰 갱신 로그 확인
   - Application 탭에서 `accessToken`이 새로 갱신되었는지 확인
   - API 호출이 성공적으로 완료되는지 확인

**예상 결과**:
- 액세스 토큰이 만료되어 401 에러 발생
- 자동으로 리프레시 토큰으로 새 액세스 토큰 발급
- 원래 요청이 새 토큰으로 재시도되어 성공

### 시나리오 2: 리프레시 토큰 만료 테스트

**목적**: 리프레시 토큰도 만료되면 로그인 페이지로 리다이렉트되는지 확인

**단계**:
1. 백엔드 `.env`에서 리프레시 토큰 만료 시간을 짧게 설정:
   ```env
   JWT_REFRESH_EXPIRES_IN=1m  # 테스트용
   ```
2. 로그인
3. 리프레시 토큰 만료 시간까지 대기
4. API 호출 시도 (게시글 작성, 수정 등)
5. **확인사항**:
   - 콘솔에서 토큰 갱신 실패 로그 확인
   - 자동으로 `/login` 페이지로 리다이렉트되는지 확인
   - Local Storage에서 토큰이 삭제되었는지 확인

**예상 결과**:
- 리프레시 토큰 만료로 갱신 실패
- 토큰 삭제 후 로그인 페이지로 이동

### 시나리오 3: 수동 토큰 삭제 테스트

**목적**: 토큰이 없을 때 API 호출이 올바르게 처리되는지 확인

**단계**:
1. 로그인 상태에서 Application 탭 열기
2. Local Storage에서 `accessToken`과 `refreshToken` 수동 삭제
3. 피드 페이지에서 게시글 새로고침 시도
4. **확인사항**:
   - API 호출이 401 에러를 반환하는지 확인
   - 자동으로 로그인 페이지로 리다이렉트되는지 확인

**예상 결과**:
- 401 에러 발생
- 리프레시 토큰도 없으므로 로그인 페이지로 이동

### 시나리오 4: 로그아웃 후 토큰 무효화 테스트

**목적**: 로그아웃 시 토큰이 올바르게 무효화되는지 확인

**단계**:
1. 로그인
2. Application 탭에서 `refreshToken` 복사 (나중에 테스트용)
3. 로그아웃 버튼 클릭
4. **확인사항**:
   - Local Storage에서 토큰이 삭제되었는지 확인
   - 로그인 페이지로 이동했는지 확인
5. 복사한 리프레시 토큰으로 수동 API 호출 시도:
   ```javascript
   // 브라우저 콘솔에서 실행
   fetch('http://localhost:3000/auth/refresh', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ refreshToken: '복사한_토큰' })
   }).then(r => r.json()).then(console.log)
   ```
6. **확인사항**:
   - 리프레시 토큰이 무효화되어 에러가 발생하는지 확인

**예상 결과**:
- 로그아웃 시 토큰 삭제
- 무효화된 리프레시 토큰으로는 갱신 불가

## 🔍 디버깅 팁

### 콘솔 로그 확인

브라우저 개발자 도구의 Console 탭에서 다음 로그를 확인:

1. **API 요청 로그**: 
   ```
   API 요청: GET http://localhost:3000/posts
   ```

2. **토큰 갱신 로그**:
   - `client.ts`의 응답 인터셉터에서 401 에러 발생 시 자동 갱신 시도
   - `refresh.ts`에서 "토큰 갱신 성공" 또는 "Refresh token 갱신 실패" 로그

### 빠른 테스트 방법 (브라우저 콘솔)

브라우저 개발자 도구의 Console 탭에서 다음 코드를 실행하여 수동으로 테스트할 수 있습니다:

```javascript
// 1. 현재 토큰 확인
console.log('Access Token:', localStorage.getItem('accessToken'));
console.log('Refresh Token:', localStorage.getItem('refreshToken'));

// 2. 액세스 토큰 수동 삭제 (만료 시뮬레이션)
localStorage.removeItem('accessToken');
console.log('액세스 토큰 삭제 완료. 이제 API 호출 시 자동 갱신이 작동합니다.');

// 3. 수동으로 리프레시 토큰 갱신 테스트
async function testRefresh() {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    console.error('리프레시 토큰이 없습니다.');
    return;
  }
  
  try {
    const response = await fetch('http://localhost:3000/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    });
    
    const data = await response.json();
    console.log('리프레시 응답:', data);
    
    if (data.success && data.data && data.data.accessToken) {
      localStorage.setItem('accessToken', data.data.accessToken);
      console.log('✅ 토큰 갱신 성공!');
    } else if (data.accessToken) {
      localStorage.setItem('accessToken', data.accessToken);
      console.log('✅ 토큰 갱신 성공!');
    } else {
      console.error('❌ 토큰 갱신 실패:', data);
    }
  } catch (error) {
    console.error('❌ 토큰 갱신 에러:', error);
  }
}

// 실행: testRefresh();
```

### Network 탭 확인

1. Network 탭 열기
2. API 호출 시도
3. **확인사항**:
   - 요청 헤더에 `Authorization: Bearer <token>` 포함 여부
   - 401 에러 발생 시 자동으로 `/auth/refresh` 호출되는지
   - 토큰 갱신 후 원래 요청이 재시도되는지

### 토큰 내용 확인 (JWT 디코딩)

JWT 토큰은 Base64로 인코딩되어 있습니다. 다음 사이트에서 디코딩 가능:
- https://jwt.io

또는 브라우저 콘솔에서:
```javascript
// 액세스 토큰 디코딩
const token = localStorage.getItem('accessToken');
const payload = JSON.parse(atob(token.split('.')[1]));
console.log('토큰 만료 시간:', new Date(payload.exp * 1000));
console.log('사용자 ID:', payload.sub);
```

## ✅ 테스트 체크리스트

- [ ] 액세스 토큰 만료 시 자동 갱신 작동
- [ ] 리프레시 토큰 만료 시 로그인 페이지로 이동
- [ ] 토큰 없을 때 API 호출 시 로그인 페이지로 이동
- [ ] 로그아웃 시 토큰 삭제 및 무효화
- [ ] 토큰 갱신 후 원래 요청이 성공적으로 재시도
- [ ] 여러 탭에서 동시에 사용해도 토큰 갱신이 올바르게 작동

## 🚨 주의사항

1. **테스트 후 설정 복원**: 테스트용으로 만료 시간을 짧게 설정했다면, 테스트 후 원래 값으로 복원하세요.
2. **프로덕션 환경**: 프로덕션에서는 액세스 토큰은 15분, 리프레시 토큰은 7일 정도가 적절합니다.
3. **보안**: 리프레시 토큰은 안전하게 저장되어야 하며, XSS 공격에 취약한 `localStorage` 대신 `httpOnly` 쿠키 사용을 고려할 수 있습니다.

## 📝 테스트 결과 기록

테스트 결과를 기록하여 문제가 발견되면 수정하세요:

```
테스트 날짜: 
테스트자: 
결과: ✅ 성공 / ❌ 실패
발견된 문제: 
```

