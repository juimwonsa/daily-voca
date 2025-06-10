import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};
const MODEL_NAME = "gemini-1.5-flash-latest";

const GOOGLE_AI_API_KEY = Deno.env.get("GOOGLE_AI_API_KEY");
if (!GOOGLE_AI_API_KEY) {
  console.error("FATAL: GOOGLE_AI_API_KEY 환경 변수가 설정되지 않았습니다.");
  Deno.exit(1);
}

// === 여기가 수정된 부분입니다 ===
const createQuizPrompt = (words: string[]): string => {
  const wordList = words.join(", ");
  return `
    You are an English teacher creating a vocabulary quiz for beginner to intermediate learners.
    Your task is to create one simple, clear, and common example sentence for each word in the provided list.

    For each sentence you create, you MUST replace the target word with the special placeholder token "{{BLANK}}". Do not use any other format for the blank.

    The list of words is: ${wordList}

    Your response MUST be a single, valid JSON object and nothing else.
    The JSON object should have a single key "quiz".
    The value of "quiz" should be an array of objects.
    Each object in the array must have two keys:
    1. "sentence_template": The sentence with the {{BLANK}} placeholder.
    2. "answer": The original word that fits in the blank.

    Example for words ["run", "eat"]:
    {
      "quiz": [
        {
          "sentence_template": "I like to {{BLANK}} in the park every morning.",
          "answer": "run"
        },
        {
          "sentence_template": "What do you want to {{BLANK}} for dinner?",
          "answer": "eat"
        }
      ]
    }
  `;
};

// --- 서버 로직 (변경 없음) ---
serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  try {
    const { words } = await req.json();
    if (!Array.isArray(words) || words.length === 0) {
      throw new Error("'words'는 비어 있지 않은 배열이어야 합니다.");
    }

    const prompt = createQuizPrompt(words);

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
        `Google AI API Error: ${geminiRes.status} - ${errorBody}`
      );
    }

    const geminiData = await geminiRes.json();
    const quizResultText = geminiData.candidates[0].content.parts[0].text;
    const quizResultJson = JSON.parse(quizResultText);

    return new Response(JSON.stringify(quizResultJson), {
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
