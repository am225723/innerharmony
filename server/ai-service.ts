import type { Request, Response } from "express";

interface PerplexityMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface PerplexityResponse {
  id: string;
  model: string;
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  citations?: string[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class AIService {
  private apiKey: string;
  private baseUrl = "https://api.perplexity.ai/chat/completions";

  constructor() {
    this.apiKey = process.env.PERPLEXITY_API_KEY || "";
    if (!this.apiKey) {
      console.warn("PERPLEXITY_API_KEY not found in environment");
    }
  }

  async generateInsight(context: string, messages: PerplexityMessage[]): Promise<{ insight: string; citations: string[] }> {
    if (!this.apiKey) {
      throw new Error("Perplexity API key not configured");
    }

    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-sonar-small-128k-online",
          messages,
          temperature: 0.2,
          top_p: 0.9,
          return_images: false,
          return_related_questions: false,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`Perplexity API error: ${response.statusText}`);
      }

      const data: PerplexityResponse = await response.json();
      
      return {
        insight: data.choices[0]?.message?.content || "No insight generated",
        citations: data.citations || [],
      };
    } catch (error) {
      console.error("AI Service Error:", error);
      throw error;
    }
  }

  // Protocol guidance - helps guide through 6 F's Protocol
  async getProtocolGuidance(
    protocolType: string,
    currentStep: string,
    userResponse?: string
  ): Promise<{ guidance: string; citations: string[] }> {
    const systemPrompt = `You are a compassionate IFS (Internal Family Systems) therapy guide. You provide trauma-informed, gentle guidance for the ${protocolType} protocol. Always maintain a calm, curious, and compassionate tone. Use the 8 C's of Self-energy: Curiosity, Compassion, Calm, Clarity, Confidence, Courage, Creativity, and Connectedness.`;

    const userPrompt = userResponse
      ? `I'm working on the ${protocolType} protocol, currently at step: "${currentStep}". My response was: "${userResponse}". What guidance or reflection questions should I consider next to deepen my understanding?`
      : `I'm about to start step "${currentStep}" in the ${protocolType} protocol. What should I know or be aware of for this step?`;

    const result = await this.generateInsight(protocolType, [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ]);
    
    return {
      guidance: result.insight,
      citations: result.citations,
    };
  }

  // Parts dialogue analysis - identifies patterns in parts work
  async analyzePartsDialogue(
    dialogue: string,
    partType?: string
  ): Promise<{ analysis: string; patterns: string[]; citations: string[] }> {
    const systemPrompt = `You are an IFS therapy expert analyzing dialogue with internal parts. Identify patterns, burdens, protective strategies, and healing opportunities. Be trauma-informed and compassionate.`;

    const userPrompt = `Analyze this dialogue with ${partType || "an internal part"}:\n\n"${dialogue}"\n\nWhat patterns, burdens, or protective strategies do you notice? What healing path might be beneficial?`;

    const result = await this.generateInsight("parts_dialogue", [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ]);

    // Extract patterns from the insight
    const patterns: string[] = [];
    const insight = result.insight.toLowerCase();
    
    if (insight.includes("abandon") || insight.includes("left")) patterns.push("Abandonment wound");
    if (insight.includes("reject") || insight.includes("unwanted")) patterns.push("Rejection wound");
    if (insight.includes("betray") || insight.includes("trust")) patterns.push("Betrayal wound");
    if (insight.includes("unfair") || insight.includes("justice")) patterns.push("Injustice wound");
    if (insight.includes("neglect") || insight.includes("unseen")) patterns.push("Neglect wound");
    
    if (insight.includes("protect") || insight.includes("guard")) patterns.push("Protective strategy");
    if (insight.includes("burden") || insight.includes("belief")) patterns.push("Core burden identified");

    return {
      analysis: result.insight,
      patterns: patterns.length > 0 ? patterns : ["General parts work"],
      citations: result.citations,
    };
  }

  // Wound identification - helps identify childhood wounds
  async identifyWound(
    description: string,
    symptoms?: string[]
  ): Promise<{ woundType: string; explanation: string; healingPath: string; citations: string[] }> {
    const systemPrompt = `You are an IFS expert specializing in childhood wound identification. The 5 core wounds are: Rejection, Abandonment, Injustice, Betrayal, and Neglect. Identify which wound(s) are present and explain with compassion.`;

    const symptomsText = symptoms ? `\nSymptoms/triggers: ${symptoms.join(", ")}` : "";
    const userPrompt = `Based on this description: "${description}"${symptomsText}\n\nWhich childhood wound(s) might be present? Explain the wound and suggest a healing path using IFS principles.`;

    const result = await this.generateInsight("wound_identification", [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ]);

    // Parse wound type from response
    let woundType = "Unknown";
    const content = result.insight.toLowerCase();
    if (content.includes("rejection")) woundType = "Rejection";
    else if (content.includes("abandon")) woundType = "Abandonment";
    else if (content.includes("injustice") || content.includes("unfair")) woundType = "Injustice";
    else if (content.includes("betrayal") || content.includes("trust")) woundType = "Betrayal";
    else if (content.includes("neglect")) woundType = "Neglect";

    return {
      woundType,
      explanation: result.insight,
      healingPath: "Work with the exile carrying this wound through the 6 F's Protocol, then proceed to unburdening",
      citations: result.citations,
    };
  }

  // Unburdening visualization - suggests imagery for unburdening
  async getUnburdeningVisualization(
    burden: string
  ): Promise<{ visualization: string; elements: string[]; citations: string[] }> {
    const systemPrompt = `You are an IFS unburdening guide. Suggest powerful, healing visualizations for releasing burdens using the elements (fire, water, light, earth, air). Keep it poetic, healing, and specific.`;

    const userPrompt = `Suggest a visualization for unburdening this belief/burden: "${burden}". What element would work best? Describe the release process.`;

    const result = await this.generateInsight("unburdening", [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ]);

    const elements: string[] = [];
    const content = result.insight.toLowerCase();
    if (content.includes("fire") || content.includes("burn")) elements.push("fire");
    if (content.includes("water") || content.includes("wash") || content.includes("ocean")) elements.push("water");
    if (content.includes("light") || content.includes("sun")) elements.push("light");
    if (content.includes("earth") || content.includes("ground")) elements.push("earth");
    if (content.includes("wind") || content.includes("air") || content.includes("breeze")) elements.push("air");

    return {
      visualization: result.insight,
      elements: elements.length > 0 ? elements : ["light"],
      citations: result.citations,
    };
  }

  // Educational Q&A - answers IFS questions
  async answerIFSQuestion(question: string): Promise<{ answer: string; citations: string[] }> {
    const systemPrompt = `You are an IFS (Internal Family Systems) expert educator. Answer questions about IFS theory, practices, and applications clearly and compassionately. Base your answers on IFS literature and Richard Schwartz's work.`;

    const userPrompt = `Question about IFS: ${question}`;

    return this.generateInsight("education", [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ]);
  }

  // Reparenting phrases - suggests Self-to-exile phrases
  async getReparentingPhrases(
    woundType: string,
    exileAge?: string,
    situation?: string
  ): Promise<{ phrases: string[]; explanation: string; citations: string[] }> {
    const systemPrompt = `You are an IFS reparenting guide. Suggest compassionate, healing phrases for Self to speak to wounded exile parts. These should be specific, nurturing, and corrective.`;

    const ageText = exileAge ? ` who is around ${exileAge} years old` : "";
    const situationText = situation ? ` The situation was: "${situation}"` : "";
    const userPrompt = `Suggest 3-5 reparenting phrases for an exile${ageText} carrying a ${woundType} wound.${situationText} What would their adult Self say to heal this part?`;

    const result = await this.generateInsight("reparenting", [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ]);

    // Extract phrases - look for quoted text or bullet points
    const phrases: string[] = [];
    const lines = result.insight.split("\n");
    for (const line of lines) {
      const quoted = line.match(/"([^"]+)"/);
      if (quoted) phrases.push(quoted[1]);
      else if (line.trim().match(/^[-*•]\s*(.+)/)) {
        const phrase = line.trim().replace(/^[-*•]\s*/, "");
        if (phrase && !phrase.toLowerCase().includes("phrase")) {
          phrases.push(phrase.replace(/^["']|["']$/g, ""));
        }
      }
    }

    return {
      phrases: phrases.length > 0 ? phrases : [
        "I am here now, and I will not leave you.",
        "What happened was not your fault.",
        "You are safe with me now.",
      ],
      explanation: result.insight,
      citations: result.citations,
    };
  }
}

export const aiService = new AIService();
