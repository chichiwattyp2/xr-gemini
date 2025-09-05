// This is a mock service to demonstrate Gemini API integration.
// It does not make real API calls.
// In a real application, you would replace this with actual calls to the @google/genai library.
import { GoogleGenAI } from "@google/genai";

// This function simulates a call to the Gemini API.
// NOTE: `process.env.API_KEY` would need to be configured in your build environment.
// For this demo, we are not creating a real instance.
const suggestDescription = async (title: string): Promise<string> => {
  console.log(`Simulating Gemini API call for description for title: "${title}"`);

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
      if (title.toLowerCase().includes('nature') || title.toLowerCase().includes('forest')) key = 'nature';

      resolve(descriptions[key]);
    }, 1500);
  });
};

const suggestTags = async (title: string, description: string): Promise<string[]> => {
  console.log(`Simulating Gemini API call for tags for title: "${title}"`);

  // --- Start of real Gemini API usage example ---
  // const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  // const prompt = `Based on the title "${title}" and description "${description}", suggest 5 relevant, single-word tags for this volumetric XR experience. Return as a JSON array of strings.`;
  // try {
  //   const response = await ai.models.generateContent({
  //     model: 'gemini-2.5-flash',
  //     contents: prompt,
  //     config: { responseMimeType: 'application/json' }
  //   });
  //   const result = JSON.parse(response.text);
  //   return Array.isArray(result) ? result : [];
  // } catch (error) {
  //    console.error("Error calling Gemini API for tags:", error);
  //    return [];
  // }
  // --- End of real Gemini API usage example ---

  return new Promise(resolve => {
    setTimeout(() => {
      const lowerTitle = title.toLowerCase();
      const lowerDesc = description.toLowerCase();
      let tags: string[] = [];

      if (lowerTitle.includes('dance') || lowerDesc.includes('dance')) tags = ['Dance', 'Performance', 'Art', 'Music'];
      else if (lowerTitle.includes('forest') || lowerDesc.includes('forest') || lowerTitle.includes('nature') || lowerDesc.includes('nature')) tags = ['Nature', 'Relaxation', 'Meditation', 'Ambient'];
      else if (lowerTitle.includes('urban') || lowerDesc.includes('urban') || lowerTitle.includes('parkour') || lowerDesc.includes('parkour')) tags = ['Action', 'Sci-Fi', 'Urban', 'Parkour'];
      else tags = ['XR', 'Volumetric', 'Immersive', '6DoF'];

      resolve(tags);
    }, 1200);
  });
};

export const geminiService = {
  suggestDescription,
  suggestTags,
};