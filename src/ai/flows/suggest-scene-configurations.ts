// src/ai/flows/suggest-scene-configurations.ts
'use server';

/**
 * @fileOverview AI-powered scene configuration suggestions.
 *
 * This file defines a Genkit flow that leverages AI to analyze user habits and
 * device capabilities to suggest optimized and creative smart home scene
 * configurations.
 *
 * @param {SuggestSceneConfigurationsInput} input - The input data for scene
 *   suggestion, including user habits, device capabilities, and environmental
 *   data.
 *
 * @returns {Promise<SuggestSceneConfigurationsOutput>} A promise that resolves with
 *   the AI-suggested scene configurations.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestSceneConfigurationsInputSchema = z.object({
  userHabits: z
    .string()
    .describe(
      'Description of the user habits, routines, and preferences related to smart home usage.'
    ),
  deviceCapabilities: z
    .string()
    .describe(
      'A detailed description of the available smart home devices and their capabilities (e.g., smart lights, thermostats, smart blinds).'
    ),
  environmentalData: z
    .string()
    .describe(
      'Environmental data such as current weather conditions, time of day, and seasonal information.'
    ),
});

export type SuggestSceneConfigurationsInput = z.infer<
  typeof SuggestSceneConfigurationsInputSchema
>;

const SuggestSceneConfigurationsOutputSchema = z.object({
  suggestedScenes: z.array(
    z.object({
      sceneName: z.string().describe('The name of the suggested scene.'),
      sceneDescription: z
        .string()
        .describe('A detailed description of what the scene does.'),
      deviceActions: z.array(
        z.object({
          deviceName: z.string().describe('The name of the device.'),
          action: z.string().describe('The action to be performed on the device.'),
          parameters: z
            .record(z.any())
            .describe('Parameters for the device action.'),
        })
      ),
      energyEfficiencyTips: z
        .string()
        .describe(
          'Tips on how the scene improves energy efficiency and reduces consumption.'
        ),
      userBenefits: z
        .string()
        .describe('Description of the benefits of the suggested scene for the user.'),
    })
  ),
});

export type SuggestSceneConfigurationsOutput = z.infer<
  typeof SuggestSceneConfigurationsOutputSchema
>;

async function suggestSceneConfigurations(
  input: SuggestSceneConfigurationsInput
): Promise<SuggestSceneConfigurationsOutput> {
  return suggestSceneConfigurationsFlow(input);
}

const suggestSceneConfigurationsPrompt = ai.definePrompt({
  name: 'suggestSceneConfigurationsPrompt',
  input: {schema: SuggestSceneConfigurationsInputSchema},
  output: {schema: SuggestSceneConfigurationsOutputSchema},
  prompt: `You are an AI smart home assistant that analyzes user habits,
  device capabilities, and environmental data to suggest optimized and creative
  smart home scene configurations.

  Based on the following information, suggest several smart home scene configurations:

  User Habits: {{{userHabits}}}
  Device Capabilities: {{{deviceCapabilities}}}
  Environmental Data: {{{environmentalData}}}

  Consider energy efficiency and user comfort when creating scene suggestions.
  Provide scene name, scene description, device actions with parameters, energy
  efficiency tips and user benefits for each scene.

  Format your output as a JSON array of scenes. Each scene object must contain fields sceneName, sceneDescription, deviceActions, energyEfficiencyTips, userBenefits.
  Each deviceAction object must contain deviceName, action, and parameters.
  Make sure the device actions match what the user has in their device capabilities.
  The parameters are the arguments to the action on the device.

  Example:
  [
    {
      "sceneName": "Movie Night",
      "sceneDescription": "Sets the perfect ambiance for watching a movie.",
      "deviceActions": [
        {
          "deviceName": "Living Room Lights",
          "action": "dim",
          "parameters": {
            "brightness": 20
          }
        },
        {
          "deviceName": "Living Room Thermostat",
          "action": "setTemperature",
          "parameters": {
            "temperature": 70
          }
        }
      ],
      "energyEfficiencyTips": "Reduces energy consumption by dimming lights and setting a comfortable temperature.",
      "userBenefits": "Creates a cozy atmosphere for an enjoyable movie experience."
    }
  ]
  `,
});

const suggestSceneConfigurationsFlow = ai.defineFlow(
  {
    name: 'suggestSceneConfigurationsFlow',
    inputSchema: SuggestSceneConfigurationsInputSchema,
    outputSchema: SuggestSceneConfigurationsOutputSchema,
  },
  async input => {
    const {output} = await suggestSceneConfigurationsPrompt(input);
    return output!;
  }
);

export {suggestSceneConfigurations, SuggestSceneConfigurationsInput, SuggestSceneConfigurationsOutput};
