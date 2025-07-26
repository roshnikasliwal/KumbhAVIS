"use server";

import { suggestMapImprovements, type SuggestMapImprovementsInput } from "@/ai/flows/suggest-map-improvements";
import { detectMultimodalAnomalies, type DetectMultimodalAnomaliesInput, type DetectMultimodalAnomaliesOutput, DetectMultimodalAnomaliesOutputSchema } from "@/ai/flows/detect-multimodal-anomalies";
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

const AnomalyDetectionResultSchema = z.object({
    success: z.boolean(),
    data: DetectMultimodalAnomaliesOutputSchema.nullable(),
    message: z.string().optional(),
});
export type AnomalyDetectionResult = z.infer<typeof AnomalyDetectionResultSchema>;


export async function checkFrameForAnomalies(input: DetectMultimodalAnomaliesInput): Promise<AnomalyDetectionResult> {
    try {
        const result = await detectMultimodalAnomalies(input);
        if (!result) {
            return { success: false, data: null, message: 'No response from AI model.' };
        }
        return { success: true, data: result };
    } catch (error) {
        console.error("Error checking frame for anomalies:", error);
        return { success: false, data: null, message: 'An error occurred while checking for anomalies.' };
    }
}
