
import { GoogleGenAI, Type, Schema, Part } from "@google/genai";
import { Medication, Reminder, ScanResult, PharmacyTips, PharmacyStructuredData, MedicineAnalysis } from "../types";

// Initialize the client. API_KEY is injected by the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SAFETY_PREAMBLE = `
You are MediSage, a helpful health assistant.
RULES:
1. You are NOT a doctor. Never diagnose illnesses or prescribe medication.
2. If a user asks about a medical emergency (chest pain, trouble breathing, severe bleeding, etc.), tell them to call emergency services immediately.
3. Keep answers simple, reassuring, and easy to understand for non-technical users.
4. Translate medical jargon into plain English.
`;

// --- Feature 1: Image Analysis (Prescription Parsing) ---
export const analyzePrescriptionImage = async (base64Image: string): Promise<ScanResult> => {
  // Schema strictly following the user's request
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      summary: {
        type: Type.STRING,
        description: "A short, human-friendly explanation of the prescription (under 3 sentences).",
      },
      per_medicine: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "Name of the medicine" },
            dosage: { type: Type.STRING, description: "Dosage strength (e.g., 500mg)" },
            frequency: { type: Type.STRING, description: "Frequency string (e.g., 3 times daily)" },
            purpose: { type: Type.STRING, description: "Simple explanation of what it treats" },
            expiry_date: { type: Type.STRING, description: "Expiry date text if visible (e.g. '12/25'), else null" },
            patient_instruction: { type: Type.STRING, description: "Simple, clear instructions for the patient in plain English." },
            safety_notes: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of safety warnings, side effects, or expiry warnings"
            },
            reminder_slots: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Recommended times of day (e.g., 'morning', 'afternoon', 'night')"
            }
          },
          required: ["name", "patient_instruction", "safety_notes", "reminder_slots", "purpose", "dosage", "frequency"],
        },
      },
    },
    required: ["summary", "per_medicine"],
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image
            }
          },
          {
            text: `${SAFETY_PREAMBLE}
            Analyze this prescription image. 
            
            Task:
            1. OCR the text from the image.
            2. Generate a short, human-friendly explanation of the prescription.
            3. Produce a structured reminder plan for each medicine found.
            4. Detect any expiry dates. If found, return them. If an expiry date is passed or within 30 days, YOU MUST add a clear warning to 'safety_notes'.
            
            Requirements:
            - Use only the information visible; do not invent dosages.
            - If data is missing, note it in the instructions.
            - Keep the summary under 3 sentences.
            - Translate instructions into simple English suitable for a non-medical person.
            `
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      
      const medications: Medication[] = data.per_medicine.map((m: any) => ({
        name: m.name,
        dosage: m.dosage || "As prescribed",
        frequency: m.frequency || "As directed",
        purpose: m.purpose || "Health condition",
        instructions: m.patient_instruction,
        sideEffects: m.safety_notes?.join(", ") || "",
        safety_notes: m.safety_notes || [],
        reminder_slots: m.reminder_slots || [],
        schedule: [],
        expiryDate: m.expiry_date || undefined
      }));

      return {
        summary: data.summary,
        medications
      };
    }
    return { summary: "Could not analyze image.", medications: [] };
  } catch (error) {
    console.error("Analysis failed", error);
    throw new Error("Could not analyze the image. Please ensure the text is clear.");
  }
};

// --- Feature: Daily Schedule Generation ---
export const createReminderSchedule = async (
  medicines: Partial<Medication>[],
  wakeTime: string,
  sleepTime: string
): Promise<{ schedule: { name: string, reminders: Reminder[] }[] }> => {
  
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      schedule: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            reminders: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  time: { type: Type.STRING, description: "24-hour format HH:MM" },
                  label: { type: Type.STRING, description: "Friendly label like 'Morning after breakfast'" }
                },
                required: ["time", "label"]
              }
            }
          },
          required: ["name", "reminders"]
        }
      }
    },
    required: ["schedule"]
  };

  try {
    const medList = medicines.map(m => ({
      name: `${m.name} ${m.dosage || ''}`,
      frequency_per_day: m.frequency, // Passing the string, model will infer count
      duration: "As prescribed"
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `
      You help users turn a prescription into a daily reminder plan.

      Input:
      Wake Up Time: ${wakeTime}
      Sleep Time: ${sleepTime}
      Medicines: ${JSON.stringify(medList)}

      Task:
      Generate a JSON list of reminder times in 24‑hour format and friendly labels.

      Rules:
      1. Spread reminders evenly between wake and sleep times based on frequency.
      2. Never change the prescribed frequency.
      3. If the schedule conflicts with sleep_time, gently suggest the user confirm timing with the doctor in the label.
      4. Use the provided JSON schema.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    return { schedule: [] };
  } catch (error) {
    console.error("Schedule generation failed", error);
    throw new Error("Could not generate schedule.");
  }
};

// --- Feature: Pharmacy Search Advice ---
export const getPharmacySearchTips = async (medicines: string[], location: string): Promise<PharmacyTips> => {
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      guide: { type: Type.STRING, description: "A short paragraph guiding the user on how to find the medicines." },
      tips: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "3 bullet points on what to check." 
      }
    },
    required: ["guide", "tips"]
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `
      Task: Create short, safe text suggestions to help a user find pharmacies.
      
      Input:
      Medicines: ${medicines.join(', ')}
      Location: ${location || 'local pharmacies'}

      Output:
      1. A short paragraph guiding the user how to search nearby pharmacies.
      2. 3 bullet-point tips on what to check (availability, expiry date, generic equivalents, etc.).

      Constraints:
      - Do not recommend specific brands or stores by name.
      - Encourage users to buy from licensed pharmacies only.
      - Keep the tone neutral and supportive.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    return { guide: "Unable to generate tips.", tips: [] };
  } catch (error) {
    console.error("Pharmacy tips generation failed", error);
    throw new Error("Could not generate pharmacy tips.");
  }
};

// --- Feature 2: Chatbot ---
export const chatWithMediSage = async (history: {role: string, parts: Part[]}[], message: string): Promise<string> => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-3-pro-preview',
      history: [
        {
            role: 'user',
            parts: [{ text: "Hello" }]
        },
        {
            role: 'model',
            parts: [{ text: "Hello! I am MediSage. I can help explain medications and health topics. Remember, I am an AI, not a doctor. Always consult a professional for medical advice." }]
        },
        ...history
      ],
      config: {
        systemInstruction: SAFETY_PREAMBLE,
        tools: [{googleSearch: {}}]
      }
    });

    const result = await chat.sendMessage({ message });
    return result.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Chat failed", error);
    return "I'm having trouble connecting right now. Please try again later.";
  }
};

// --- Feature 3: Pharmacy Discovery (Maps Grounding) ---
export const findNearbyPharmacies = async (userLat: number, userLng: number, query: string): Promise<{ text: string, chunks: any[] }> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Find pharmacies near me. Context: ${query}`,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: userLat,
              longitude: userLng
            }
          }
        }
      }
    });

    const text = response.text || "No pharmacy information found.";
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return { text, chunks };

  } catch (error) {
    console.error("Maps search failed", error);
    throw new Error("Unable to find pharmacies at this time.");
  }
};

// --- Feature: Parse Pharmacy Text ---
export const parsePharmacyText = async (rawText: string): Promise<PharmacyStructuredData> => {
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      pharmacies: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            distance: { type: Type.STRING },
            travel_time: { type: Type.STRING },
            rating: { type: Type.STRING },
            reviews_count: { type: Type.STRING }
          },
          required: ["name", "distance", "travel_time", "rating", "reviews_count"]
        }
      }
    },
    required: ["pharmacies"]
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `
      Task:
      1. Extract up to 8 pharmacies from the input text.
      2. For each pharmacy, capture: name, distance, travel_time, rating, reviews_count.
      3. Return a JSON object only.
      4. Do NOT invent data. If some field is missing, use an empty string "".

      Input text:
      "${rawText}"
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    return { pharmacies: [] };

  } catch (error) {
    console.error("Parsing pharmacy text failed", error);
    return { pharmacies: [] };
  }
};

// --- Feature: Identify Medicine ---
export const identifyMedicine = async (base64Image: string): Promise<MedicineAnalysis> => {
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING, description: "The name of the medicine detected." },
      description: { type: Type.STRING, description: "A brief description of the medicine." },
      uses: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING }, 
        description: "List of common diseases or conditions this medicine treats." 
      },
      warnings: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "Important safety warnings." 
      },
      side_effects: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "Common side effects."
      }
    },
    required: ["name", "description", "uses", "warnings", "side_effects"]
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image
            }
          },
          {
            text: `${SAFETY_PREAMBLE}
            Analyze this image of a medicine (pill, bottle, blister pack).
            
            Task:
            1. Identify the medicine name.
            2. Explain what it is used for (indications).
            3. List key warnings and common side effects.
            
            If the image is unclear or not a medicine, state 'Unknown Medicine' as the name and explain why in the description.
            `
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    throw new Error("No data returned");
  } catch (error) {
    console.error("Medicine identification failed", error);
    throw new Error("Could not identify the medicine.");
  }
};
