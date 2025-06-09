# 오늘의 영단어 - 아이엘츠(IELTS) 학습 사이트

매일 새로운 아이엘츠 필수 영단어 10개를 학습할 수 있는 간단한 웹 애플리케이션입니다. React, TypeScript, Vite를 사용하여 구축되었으며, AWS S3와 CloudFront를 통해 손쉽게 배포할 수 있습니다.

---

## ✨ 주요 기능

- **일일 단어 제공**: 날짜별로 10개의 아이엘츠 필수 영단어를 표시합니다.
- **상세 정보**: 각 단어의 한국어 뜻과 실제 활용 예문을 함께 제공합니다.
- **발음 듣기(TTS)**: 웹 브라우저에 내장된 Web Speech API를 사용하여 각 단어의 원어민 발음을 들어볼 수 있습니다.
- **날짜 탐색**: 이전/다음 날짜로 이동하여 다른 날짜의 단어를 학습할 수 있습니다.

---

## 🔧 기술 스택

- **Frontend**: React, TypeScript
- **Build Tool**: Vite
- **Package Manager**: Yarn
- **TTS**: Web Speech API (Browser built-in)
- **Deployment**: AWS S3 (Static Hosting), AWS CloudFront (CDN)

---

## 🚀 시작하기

### 사전 요구 사항

- [Node.js](https://nodejs.org/ko/) (LTS 버전 권장)
- [Yarn](https://classic.yarnpkg.com/en/docs/install) (Corepack을 통해 활성화)

```bash
# Yarn 활성화 (최초 한 번만 실행)
corepack enable
```

### 설치 및 실행

1. **프로젝트 저장소 복제 (Clone the repository)**

   ```bash
   # GitHub에 올린 후, 본인의 사용자 이름(your-username)을 수정하세요.
   git clone [https://github.com/your-username/daily-voca.git](https://github.com/your-username/daily-voca.git)
   ```

2. **프로젝트 폴더로 이동**

   ```bash
   cd daily-voca
   ```

3. **의존성 패키지 설치**

   ```bash
   yarn install
   ```

4. **개발 서버 실행**

   ```bash
   yarn dev
   ```

   서버가 실행되면 터미널에 나오는 `http://localhost:5173/` 와 같은 주소로 접속하세요.

5. **프로덕션 빌드**
   ```bash
   yarn build
   ```
   `dist` 폴더에 배포용 정적 파일이 생성됩니다. 이 파일들을 AWS S3에 업로드하여 배포할 수 있습니다.

---

## 📂 데이터 관리

- 모든 영단어 데이터는 `src/data/vocabulary.json` 파일에서 관리됩니다.
- 새로운 날짜의 단어를 추가하거나 기존 단어를 수정하려면 이 파일을 편집하면 됩니다.

**JSON 데이터 구조:**

```json
{
  "YYYY-MM-DD": [
    {
      "id": 1,
      "word": "word_text",
      "meaning": "korean_meaning",
      "sentence": "example_sentence"
    }
  ]
}
```

---

## ☁️ 배포

이 프로젝트는 정적 웹사이트이므로 AWS S3와 CloudFront 조합을 사용하여 효율적으로 호스팅할 수 있습니다. `yarn build` 명령어로 생성된 `dist` 폴더 안의 모든 파일을 S3 버킷에 업로드하고 CloudFront와 연결하여 사용하세요.
