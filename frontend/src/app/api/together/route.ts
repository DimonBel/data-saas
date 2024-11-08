import { NextResponse } from 'next/server';
import Together from 'together-ai';
import { fetchData } from '@/services/fetchData';

export async function GET() {
    const fetchedData = await fetchData();

    if (!fetchedData || fetchedData.length === 0) {
        return NextResponse.json({ error: 'No data found from fetchData' }, { status: 404 });
    }

    try {
        const together = new Together({
            apiKey: process.env.TOGETHER_API_KEY
        });

        const prompt = `
            I am building a SaaS platform for dataset upload and enrichment. 
            Analyze the following dataset and determine which next columns you need to match the data from JSON to. 
            Here are the columns you should return to me in a modified columns format: Name, Email, Phone, Role, Company, LinkedIn, Additional_Info.
            In column Additional_Info write a summary from all those columns with information that did not fit the above criteria (but so that the information is not repeated).
            If there is no relevant information in JSON that could be related to the column, simply return " " and put it in Additional_Info.
            Return ONLY the final JSON result with the updated column names and grouped data.

            ${JSON.stringify(fetchedData)}
        `;

        const response = await together.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
            max_tokens: 5295,
            temperature: 0.7,
            top_p: 0.7,
            top_k: 50,
            repetition_penalty: 1,
            stop: ["<|eot_id|>", "<|eom_id|>"],
            stream: false
        });

        if (response?.choices?.length > 0 && response.choices[0]?.message?.content) {
            const messageContent = response.choices[0].message.content;

            const jsonRegex = /```json([\s\S]*?)```/;
            const match = jsonRegex.exec(messageContent);

            if (match && match[1]) {
                const extractedJson = match[1].trim();
                return NextResponse.json({
                    extractedJson: JSON.parse(extractedJson)
                });
            } else {
                return NextResponse.json({ error: 'No JSON content found in response' }, { status: 500 });
            }
        } else {
            return NextResponse.json({ error: 'No valid response from Together API' }, { status: 500 });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Something went wrong', details: error }, { status: 500 });
    }
}
