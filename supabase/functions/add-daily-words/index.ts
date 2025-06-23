// supabase/functions/add-daily-words/index.ts

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// --- 상수 및 환경 변수 설정 ---
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const MODEL_NAME = "gemini-1.5-flash-latest";

// 환경 변수 로드 및 유효성 검사
const GOOGLE_AI_API_KEY = Deno.env.get("GOOGLE_AI_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!GOOGLE_AI_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    "FATAL: 필수 환경 변수(GOOGLE_AI_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)가 설정되지 않았습니다."
  );
  Deno.exit(1); // 필수 변수 없으면 함수 실행 중단
}

// Supabase 어드민 클라이언트 초기화 (DB 조작용)
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

/**
 * Gemini AI에 보낼 프롬프트를 생성하는 함수
 * @param existingWords - DB에 이미 존재하는 단어 목록
 * @returns Gemini API에 전송할 프롬프트 문자열
 */
const createAddWordsPrompt = (existingWords: string[]): string => {
  return `
    You are an expert IELTS lexical resource specialist, tasked with creating a vocabulary list for students aiming for Band 7.0 to 8.0.

    Your task is to generate 15 English words that fit this specific level.
    The words should be "less common lexical items" that demonstrate precision and sophistication, suitable for Writing Task 2 and the Speaking test.
    Focus on words that allow for nuanced expression. Avoid overly obscure, academic, or archaic words.
    
    For example, words like: 'advocate', 'discrepancy', 'substantiate', 'proliferation', 'mitigate' are good examples of the target level.

    Your response MUST be a single, valid JSON object and nothing else.
    The JSON object must have a single key "words", which is an array of objects.
    Each object in the array must have three keys: "word" (string), "meaning" (string, in Korean), and "sentence" (string, a clear example).

    IMPORTANT: AVOID generating the following words as they are already in the database:
    ${existingWords.join(", ")}
  `;
};

// --- 메인 서빙 함수 ---

serve(async (req: Request) => {
  // CORS preflight 요청 처리
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  try {
    console.log("일일 단어 추가 작업을 시작합니다.");

    // 1. DB에서 기존에 등록된 모든 단어 가져오기
    const { data: existingWordsData, error: selectError } = await supabaseAdmin
      .from("words")
      .select("word");

    if (selectError) {
      throw new Error(`DB 조회 오류: ${selectError.message}`);
    }

    const existingWordsSet = new Set(
      existingWordsData.map((item) => item.word.toLowerCase())
    );
    console.log(`총 ${existingWordsSet.size}개의 기존 단어를 확인했습니다.`);

    // 2. AI에게 보낼 프롬프트 생성
    const prompt = createAddWordsPrompt(Array.from(existingWordsSet));

    // 3. Gemini AI에 요청하여 새로운 단어 생성
    console.log("Google AI에 새로운 단어 생성을 요청합니다...");
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GOOGLE_AI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          // AI가 항상 JSON 형식으로만 응답하도록 강제하는 설정
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

    // 4. AI 응답 파싱 및 중복 제거
    const geminiData = await geminiRes.json();
    const aiResponseText = geminiData.candidates[0].content.parts[0].text;
    const { words: aiGeneratedWords } = JSON.parse(aiResponseText);

    if (!Array.isArray(aiGeneratedWords)) {
      throw new Error("AI 응답이 유효한 단어 배열 형식이 아닙니다.");
    }

    const newWordsToInsert = aiGeneratedWords
      .filter(
        (item) => item.word && !existingWordsSet.has(item.word.toLowerCase())
      )
      .map((item) => ({
        word: item.word,
        meaning: item.meaning,
        sentence: item.sentence,
        date: new Date().toISOString().split("T")[0], // 오늘 날짜
      }))
      .slice(0, 10); // 중복을 제외한 단어 중 최대 10개만 선택

    // 5. 최종 10개의 새로운 단어를 DB에 삽입
    if (newWordsToInsert.length > 0) {
      console.log(
        `${newWordsToInsert.length}개의 새로운 단어를 DB에 추가합니다.`
      );
      const { error: insertError } = await supabaseAdmin
        .from("words")
        .insert(newWordsToInsert);

      if (insertError) {
        throw new Error(`DB 삽입 오류: ${insertError.message}`);
      }
    } else {
      console.log("추가할 새로운 단어가 없습니다. (AI가 중복된 단어만 생성함)");
    }

    return new Response(
      JSON.stringify({
        message: `${newWordsToInsert.length}개의 단어가 성공적으로 추가되었습니다.`,
      }),
      {
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("함수 실행 중 심각한 오류 발생:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      status: 500, // 서버 측 오류이므로 500 상태 코드 사용
    });
  }
});
