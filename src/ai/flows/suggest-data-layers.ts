'use server';

/**
 * @fileOverview An AI agent that suggests relevant data layers based on the currently viewed map area.
 *
 * - suggestDataLayers - A function that suggests relevant data layers.
 * - SuggestDataLayersInput - The input type for the suggestDataLayers function.
 * - SuggestDataLayersOutput - The return type for the suggestDataLayers function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestDataLayersInputSchema = z.object({
  mapAreaDescription: z
    .string()
    .describe("A description of the geographical area currently being viewed on the map."),
});
export type SuggestDataLayersInput = z.infer<typeof SuggestDataLayersInputSchema>;

const SuggestDataLayersOutputSchema = z.object({
  suggestedDataLayers: z
    .array(z.string())
    .describe("An array of suggested data layers relevant to the current map area."),
});
export type SuggestDataLayersOutput = z.infer<typeof SuggestDataLayersOutputSchema>;

export async function suggestDataLayers(input: SuggestDataLayersInput): Promise<SuggestDataLayersOutput> {
  return suggestDataLayersFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestDataLayersPrompt',
  input: {schema: SuggestDataLayersInputSchema},
  output: {schema: SuggestDataLayersOutputSchema},
  prompt: `You are a data exploration assistant that suggests relevant data layers based on the current map view.

  Given the following description of the map area, suggest data layers that would be relevant to display.

  Map Area Description: {{{mapAreaDescription}}}

  Please only suggest data layers that are commonly available and relevant to geographical data visualization.
  Return the suggested data layers as an array of strings.
  Example data layers:
  ["Population Density", "Land Use", "Elevation", "Transportation Networks", "Weather Patterns", "Air Quality"]
  `,
});

const suggestDataLayersFlow = ai.defineFlow(
  {
    name: 'suggestDataLayersFlow',
    inputSchema: SuggestDataLayersInputSchema,
    outputSchema: SuggestDataLayersOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
