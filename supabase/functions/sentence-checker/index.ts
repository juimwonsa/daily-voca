// Deno의 표준 HTTP 서버 모듈을 가져옵니다.
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
// [수정된 부분] npm을 통해 안정적인 diff 라이브러리를 가져옵니다.
import { diffWords } from "npm:diff@5.2.0";

// --- 상수 및 설정 ---
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};
const MODEL_NAME = "gemini-1.5-flash-latest";

// --- 환경 변수 확인 ---
const GOOGLE_AI_API_KEY = Deno.env.get("GOOGLE_AI_API_KEY");
if (!GOOGLE_AI_API_KEY) {
  console.error("FATAL: GOOGLE_AI_API_KEY 환경 변수가 설정되지 않았습니다.");
  Deno.exit(1);
}

// --- 프롬프트 생성 함수 (변경 없음) ---
const createIeltsPrompt = (word: string, sentence: string): string => {
  return `
    You are an expert IELTS examiner with over 10 years of experience, specializing in Writing Task 2. Your evaluation is strict, precise, and aligned with the official IELTS band descriptors.

    You are assessing a single sentence written by an IELTS candidate.
    The candidate was given the vocabulary word: "${word}"
    The candidate wrote the following sentence: "${sentence}"

    Your task is to analyze this sentence based on IELTS criteria and provide a detailed evaluation. Your response MUST be a single, valid JSON object and nothing else. Do not add any text before or after the JSON object.

    The JSON object must have these keys:
    - "is_correct": A boolean. True ONLY IF the sentence is grammatically flawless AND the word "${word}" is used perfectly in terms of its meaning, part of speech, and natural collocation.
    - "corrected_sentence": A string. If the original sentence has errors (grammar, spelling, awkward phrasing), provide a corrected, more natural version. If the original is perfect, return it unchanged.
    - "score": A number from 0 to 100, based on: Grammatical Accuracy (40), Vocabulary Usage & Collocation (40), Naturalness & Structure (20).
    - "feedback_ko": A string. Provide constructive, encouraging feedback in Korean. Explain the score, highlight strengths, and clearly point out areas for improvement with specific examples.
    - "alternative_examples": An array of 2-3 strings. Provide high-band (Band 8-9) example sentences using "${word}" in different contexts.
    - "common_collocations": An array of strings. List common, natural word pairings (collocations) for "${word}".
  `;
};

// --- 메인 서버 로직 (변경 없음) ---
serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  try {
    const { word, sentence } = await req.json();
    if (!word || !sentence) {
      throw new Error("'word'와 'sentence'는 필수 항목입니다.");
    }
    const prompt = createIeltsPrompt(word, sentence);

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GOOGLE_AI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
          },
        }),
      }
    );

    if (!geminiRes.ok) {
      const errorBody = await geminiRes.text();
      throw new Error(
        `Google AI API Error: ${geminiRes.status} ${geminiRes.statusText} - ${errorBody}`
      );
    }

    const geminiData = await geminiRes.json();
    const analysisResultText = geminiData.candidates[0].content.parts[0].text;
    const analysisResultJson = JSON.parse(analysisResultText);

    // 이 부분의 diffWords 함수는 이제 npm:diff 패키지에서 온 것입니다.
    const differences = diffWords(
      sentence,
      analysisResultJson.corrected_sentence
    );

    const htmlHighlight = differences
      .map((part) => {
        if (part.added) return `<ins>${part.value}</ins>`;
        if (part.removed) return `<del>${part.value}</del>`;
        return `<span>${part.value}</span>`;
      })
      .join("");

    analysisResultJson.html_highlight = htmlHighlight;

    return new Response(JSON.stringify(analysisResultJson), {
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
