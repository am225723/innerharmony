import type { Part, JournalEntry } from "@shared/schema";

const PERPLEXITY_API_URL = "https://api.perplexity.ai/chat/completions";
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;

interface PerplexityMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface PerplexityResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

async function callPerplexityAPI(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const messages: PerplexityMessage[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ];

  const requestBody = {
    model: "sonar",
    messages,
    temperature: 0.7,
    top_p: 0.9,
    stream: false,
    return_images: false,
    return_related_questions: false,
  };

  console.log("[AI Insights] Calling Perplexity API with model:", requestBody.model);

  const response = await fetch(PERPLEXITY_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("[AI Insights] Perplexity API error:", {
      status: response.status,
      statusText: response.statusText,
      error: errorText,
    });
    throw new Error(`Perplexity API error: ${response.statusText} - ${errorText}`);
  }

  const data: PerplexityResponse = await response.json();
  return data.choices[0].message.content;
}

export async function analyzeJournalEntry(entry: JournalEntry): Promise<string> {
  const systemPrompt = `You are a compassionate IFS (Internal Family Systems) therapy assistant. 
Your role is to provide gentle, trauma-informed reflections on journal entries. 
Use IFS language: parts, Self, protectors, exiles, managers, firefighters.
Focus on:
- Acknowledging emotions without judgment
- Recognizing protective parts and their intentions
- Inviting curiosity rather than giving advice
- Validating the person's experience
- Suggesting gentle questions for self-reflection

Keep responses warm, brief (3-4 sentences), and focused on Self-energy (curiosity, compassion, calm).
Never diagnose or provide clinical advice.`;

  const userPrompt = `Please provide a gentle, compassionate reflection on this journal entry from an IFS perspective:

Protocol: ${entry.protocol}
Entry: ${entry.content}

Offer 2-3 gentle observations or curious questions that might help deepen their awareness of their parts.`;

  return await callPerplexityAPI(systemPrompt, userPrompt);
}

export async function analyzePartsPatterns(parts: Part[]): Promise<string> {
  const systemPrompt = `You are an IFS (Internal Family Systems) therapy assistant specializing in parts mapping analysis.
Analyze patterns in how someone's protective system is organized.
Look for:
- Common themes across protectors (managers and firefighters)
- What exiles might be protected
- Polarizations between parts
- The roles different parts play in the internal system

Provide insights in a warm, non-pathologizing way using IFS terminology.
Keep your analysis concise (4-5 sentences) and focused on patterns, not individual parts.`;

  const partsDescription = parts
    .map(
      (p) =>
        `${p.type.toUpperCase()}: "${p.name}" - Description: ${p.description || "Not specified"}, Emotions: ${p.emotions?.join(", ") || "None listed"}`
    )
    .join("\n");

  const userPrompt = `Analyze the patterns in this person's parts map:

${partsDescription}

What patterns do you notice in their protective system? What might this tell us about what's being protected?`;

  return await callPerplexityAPI(systemPrompt, userPrompt);
}

export async function answerTherapeuticQuestion(
  question: string,
  userContext?: {
    partsCount?: number;
    journalEntriesCount?: number;
    recentProtocols?: string[];
  }
): Promise<string> {
  const systemPrompt = `You are a trauma-informed IFS (Internal Family Systems) therapy assistant.
Provide supportive, educational responses about IFS concepts and practices.
Guidelines:
- Use accessible, everyday language while maintaining IFS terminology
- Prioritize safety and self-compassion
- Acknowledge that healing takes time
- Never replace professional therapy
- Encourage curiosity about parts rather than trying to eliminate them
- Honor all parts, even those causing distress

If the question is about trauma or intense experiences, emphasize:
- Going slowly and checking in with the body
- The importance of grounding and Self-energy
- That some work is best done with a therapist

Keep responses warm, informative, and grounded in IFS principles (3-5 sentences).`;

  let contextInfo = "";
  if (userContext) {
    contextInfo = `\n\nContext about the person: They have identified ${userContext.partsCount || 0} parts`;
    if (userContext.recentProtocols && userContext.recentProtocols.length > 0) {
      contextInfo += ` and have been working with: ${userContext.recentProtocols.join(", ")}`;
    }
  }

  const userPrompt = `${question}${contextInfo}`;

  return await callPerplexityAPI(systemPrompt, userPrompt);
}

export async function generateUnburdeningVisualization(
  exile: Part,
  burden: string
): Promise<string> {
  const systemPrompt = `You are an IFS therapy assistant helping create personalized unburdening visualizations.
In IFS, unburdening is the process of releasing burdens (painful beliefs, emotions, sensations) that exiled parts carry.
Generate a brief, sensory-rich visualization for releasing a specific burden.

Guidelines:
- Use all five senses where possible
- Keep it gentle and non-forcing
- Include elements of nature, light, or transformation
- Honor the exile's experience before suggesting release
- End with the exile feeling lighter and loved by Self

Format: 4-5 sentences creating a vivid, healing image.`;

  const userPrompt = `Create a gentle unburdening visualization for an exiled part:

Part name: ${exile.name}
Part's age: ${exile.age || "young"}
Burden to release: ${burden}
Part's emotions: ${exile.emotions?.join(", ") || "pain, fear"}

The visualization should help this exile release the burden of "${burden}" in a way that feels safe and healing.`;

  return await callPerplexityAPI(systemPrompt, userPrompt);
}

export async function suggestProtectorAppreciation(protector: Part): Promise<string> {
  const systemPrompt = `You are an IFS therapy assistant helping people appreciate their protective parts.
In IFS, all parts are welcome and have positive intentions, even if their methods cause distress.
Your role is to help someone recognize the protective intention behind a part's behavior.

Guidelines:
- Acknowledge the part's hard work and positive intention
- Recognize what the part is protecting them from
- Use compassionate, validating language
- Suggest a way to thank or appreciate the part
- Keep it brief and heartfelt (2-3 sentences)`;

  const userPrompt = `Help me appreciate this protective part:

Part name: ${protector.name}
Part type: ${protector.type}
Part's description: ${protector.description || "protection"}
Emotions: ${protector.emotions?.join(", ") || "various"}

What might this part be trying to protect me from, and how can I appreciate its efforts?`;

  return await callPerplexityAPI(systemPrompt, userPrompt);
}
