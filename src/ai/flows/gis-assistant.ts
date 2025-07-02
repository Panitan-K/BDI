
'use server';
/**
 * @fileOverview A GIS assistant AI agent for NLI-Thai.
 *
 * - askGisAssistant - A function that handles queries for the GIS assistant.
 * - GisAssistantInput - The input type for the askGisAssistant function.
 * - GisAssistantOutput - The return type for the askGisAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GisAssistantInputSchema = z.object({
  query: z.string().describe('The user\'s natural language query about GIS data and infrastructure impact.'),
  language: z.string().describe("The language for the AI's response, e.g., 'en' for English or 'th' for Thai."),
});
export type GisAssistantInput = z.infer<typeof GisAssistantInputSchema>;

const GisAssistantOutputSchema = z.object({
  response: z.string().describe('The AI\'s response to the user query, formatted as a markdown string.'),
});
export type GisAssistantOutput = z.infer<typeof GisAssistantOutputSchema>;

export async function askGisAssistant(input: GisAssistantInput): Promise<GisAssistantOutput> {
  return gisAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'gisAssistantPrompt',
  input: {schema: GisAssistantInputSchema},
  output: {schema: GisAssistantOutputSchema},
  prompt: `You are "Typhoon LLM", a sophisticated AI assistant for the "NLI-Thai" (National Logistic Investment Thai) GIS platform. Your purpose is to help government officials, planners, and policymakers analyze the potential impacts of major infrastructure investments in Thailand.

You will receive a query from a user. Based on this query, you must provide a detailed, data-driven analysis. Simulate the response as if you have access to a vast repository of real-time GIS data, economic models, and environmental data for Thailand.

Your response should be clear, concise, and structured. Use markdown for formatting, including bullet points, bold text, and tables where appropriate to present data effectively.

IMPORTANT: You must generate your entire response in the language specified by the 'language' code: {{{language}}}. For example, if the code is 'th', your response must be in Thai.

User Query:
"{{{query}}}"

Generate a simulated, insightful response to this query.
`,
});

const gisAssistantFlow = ai.defineFlow(
  {
    name: 'gisAssistantFlow',
    inputSchema: GisAssistantInputSchema,
    outputSchema: GisAssistantOutputSchema,
  },
  async (input) => {
    // In a real implementation, you would call the LLM like this:
    // const {output} = await prompt(input);
    // return output!;

    // Mock Response for Demonstration
    if (input.query.toLowerCase().includes("high-speed rail") || input.query.includes("รถไฟความเร็วสูง")) {
        if (input.language === 'th') {
            return {
                response: `### การวิเคราะห์สำหรับรถไฟความเร็วสูง: กรุงเทพฯ - ชลบุรี

จากข้อเสนอโครงการรถไฟความเร็วสูงเชื่อมต่อระหว่างกรุงเทพฯ และชลบุรี สรุปผลกระทบที่คาดการณ์ได้ดังนี้:

**ผลกระทบทางเศรษฐกิจ:**
*   **การเติบโตของ GDP:** คาดว่าจะเพิ่มขึ้น **+0.8%** สำหรับภูมิภาคระเบียงเศรษฐกิจภาคตะวันออก (EEC) ภายใน 5 ปีของการดำเนินงาน
*   **มูลค่าที่ดิน:** คาดการณ์ว่าราคาที่ดินจะเพิ่มขึ้น **+15-25%** รอบสถานีหลัก (เช่น ฉะเชิงเทรา, ชลบุรี, ศรีราชา)
*   **การสร้างงาน:** ประมาณ **15,000** ตำแหน่งงานใหม่ในช่วงก่อสร้าง และ **4,500** ตำแหน่งงานถาวรในการดำเนินงาน, การท่องเที่ยว และบริการที่เกี่ยวข้อง

**การปรับปรุงการไหลของโลจิสติกส์:**
*   **การลดระยะเวลาเดินทาง:** เวลาเดินทางของผู้โดยสารระหว่างกรุงเทพฯ และชลบุรีลดลงจาก ~2 ชั่วโมง เหลือ **45 นาที**
*   **การเปลี่ยนแปลงรูปแบบการขนส่งสินค้า:** มีศักยภาพในการเปลี่ยนการขนส่งสินค้ามูลค่าสูงที่ต้องการความรวดเร็ว **10%** จากถนนสู่ระบบราง ซึ่งช่วยลดความแออัดบนทางหลวง

**คะแนนด้านสิ่งแวดล้อม:**
*   **คะแนนเริ่มต้น:** 65/100
*   **ข้อควรพิจารณา:** คะแนนโครงการได้รับผลกระทบจากการก่อสร้างผ่านพื้นที่ชายฝั่งที่ละเอียดอ่อน แนะนำให้ใช้กลยุทธ์การบรรเทาผลกระทบ เช่น รางยกระดับและทางเชื่อมสำหรับสัตว์ป่า เพื่อปรับปรุงคะแนนนี้

การจำลองนี้บ่งชี้ถึงแนวโน้มทางเศรษฐกิจที่เป็นบวกอย่างมาก แต่ต้องมีการจัดการด้านสิ่งแวดล้อมอย่างรอบคอบ`,
            };
        }
       return {
         response: `### Analysis for High-Speed Rail: Bangkok to Chon Buri

Based on the proposed high-speed rail link between Bangkok and Chon Buri, here is a summary of the projected impacts:

**Economic Impact:**
*   **GDP Growth:** Estimated **+0.8%** increase for the Eastern Economic Corridor (EEC) region within 5 years of operation.
*   **Land Value:** Projected **+15-25%** increase in land prices around key stations (e.g., Chachoengsao, Chon Buri, Si Racha).
*   **Job Creation:** Approximately **15,000** new jobs during the construction phase and **4,500** permanent jobs in operations, tourism, and related services.

**Logistic Flow Improvements:**
*   **Travel Time Reduction:** Passenger travel time between Bangkok and Chon Buri reduced from ~2 hours to **45 minutes**.
*   **Freight Shift:** Potential to shift **10%** of high-value, time-sensitive freight from road to rail, reducing highway congestion.

**Environmental Score:**
*   **Initial Score:** 65/100
*   **Considerations:** The project score is impacted by construction through sensitive coastal areas. Mitigation strategies, such as elevated tracks and wildlife corridors, are recommended to improve this score.

This simulation indicates a strong positive economic outlook but requires careful environmental management.`,
       };
    }

    if (input.language === 'th') {
        return {
          response: "ฉันพร้อมที่จะวิเคราะห์คำถามเกี่ยวกับการลงทุนในโครงสร้างพื้นฐานของคุณแล้ว โปรดให้รายละเอียดเกี่ยวกับโครงการที่คุณต้องการจำลอง เช่น 'การสร้างรถไฟความเร็วสูงจากกรุงเทพฯ ไปชลบุรีมีผลกระทบทางเศรษฐกิจอย่างไร?'"
        };
    }
    return {
      response: "I am ready to analyze your infrastructure investment query. Please provide details on the project you would like to simulate, for example: 'What is the economic impact of building a high-speed rail from Bangkok to Chon Buri?'"
    };
  }
);
