"use server";

import { suggestMapImprovements, type SuggestMapImprovementsInput } from "@/ai/flows/suggest-map-improvements";
import { z } from "zod";

const SuggestionResultSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});
export type SuggestionResult = z.infer<typeof SuggestionResultSchema>;

export async function getMapImprovementSuggestions(
  input: SuggestMapImprovementsInput
): Promise<SuggestionResult> {
  try {
    const result = await suggestMapImprovements(input);
    if (!result || !result.suggestedImprovements) {
      return {
        success: false,
        message: "Failed to get suggestions. The AI model did not return a valid response.",
      };
    }
    return {
      success: true,
      message: result.suggestedImprovements,
    };
  } catch (error) {
    console.error("Error getting map improvement suggestions:", error);
    return {
      success: false,
      message: "An unexpected error occurred while contacting the AI service.",
    };
  }
}
