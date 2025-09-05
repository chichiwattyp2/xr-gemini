
// This is a mock service to demonstrate Gemini API integration.
// It does not make real API calls.
// In a real application, you would replace this with actual calls to the @google/genai library.
import { GoogleGenAI } from "@google/genai";

// This function simulates a call to the Gemini API.
// NOTE: `process.env.API_KEY` would need to be configured in your build environment.
// For this demo, we are not creating a real instance.
const generateDescription = async (title: string): Promise<string> => {
  console.log(`Simulating Gemini API call for title: "${title}"`);

  // --- Start of real Gemini API usage example ---
  // Ensure you have your API_KEY in environment variables
  // const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // const prompt = `Generate a compelling, short description for a volumetric XR experience titled "${title}". Focus on the feeling and atmosphere. Maximum 3 sentences.`;

  // try {
  //   const response = await ai.models.generateContent({
  //     model: 'gemini-2.5-flash',
  //     contents: prompt,
  //   });
  //   return response.text;
  // } catch (error) {
  //   console.error("Error calling Gemini API:", error);
  //   return "Failed to generate description.";
  // }
  // --- End of real Gemini API usage example ---


  // Mocked response for demonstration purposes
  return new Promise(resolve => {
    setTimeout(() => {
      const descriptions: { [key: string]: string } = {
        'default': `An immersive journey through a beautifully crafted world. Experience the breathtaking visuals and captivating soundscape in this unique volumetric capture.`,
        'dance': `Feel the rhythm and energy in this dynamic dance performance. Captured in stunning volumetric detail, this experience puts you right on the stage.`,
        'nature': `Explore a serene natural landscape like never before. Wander through a photorealistic forest, captured in volumetric video to preserve every detail.`,
      };
      
      let key = 'default';
      if (title.toLowerCase().includes('dance')) key = 'dance';
      if (title.toLowerCase().includes('nature')) key = 'nature';

      resolve(descriptions[key]);
    }, 1500);
  });
};

export const geminiService = {
  generateDescription,
};
