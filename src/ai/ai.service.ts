import * as dotenv from "dotenv";
dotenv.config();
import { streamText } from "ai";
import { AI_PROMPTS } from "./ai.prompts";
import { createGroq, GroqProvider } from "@ai-sdk/groq";
import { ConfigService } from "@nestjs/config";

export class AIService {
  private query: string;
  declare private previous_output: string;

  constructor(query: string) {
    this.query = query;
  }

  async intentExtractor(): Promise<void> {
    this.previous_output = await this.askAi(
      AI_PROMPTS.INTENT_EXTRACTOR(this.query),
    );
  }

  async normalizationQuery(): Promise<void> {
    this.previous_output = await this.askAi(
      AI_PROMPTS.NORMALIZATION(this.previous_output),
    );
  }

  async controlGrouping(): Promise<void> {
    this.previous_output = await this.askAi(
      AI_PROMPTS.GROUPING(this.query, this.previous_output),
    );
  }

  async depthValidator(): Promise<void> {
    this.previous_output = await this.askAi(
      AI_PROMPTS.DEPTH_VALIDATOR(this.previous_output),
    );
  }

  async AIOrchestrator(): Promise<string> {
    await this.intentExtractor();
    await this.normalizationQuery();
    await this.controlGrouping();
    await this.depthValidator();
    return this.previous_output;
  }

  async askAi(prompt: string): Promise<string> {
    const groq = createGroq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const result = await streamText({
      model: groq("llama-3.3-70b-versatile"),
      prompt,
    });

    const text = await result.text;
    const clean = text.replace(/```json|```/g, "").trim();
    return clean;
  }
}
