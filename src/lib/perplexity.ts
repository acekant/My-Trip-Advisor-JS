export async function searchPerplexity(query: string) {
    if (!process.env.PERPLEXITY_API_KEY) {
        throw new Error("PERPLEXITY_API_KEY is not set")
    }

    try {
        const response = await fetch("https://api.perplexity.ai/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.PERPLEXITY_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "llama-3.1-sonar-small-128k-online",
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful travel assistant. Provide current, accurate information about attractions, restaurants, and activities. Include hours, prices, and accessibility info where possible.",
                    },
                    {
                        role: "user",
                        content: query,
                    },
                ],
                max_tokens: 1000,
            }),
        })

        if (!response.ok) {
            const errorText = await response.text()
            console.error("Perplexity API Error:", response.status, errorText)
            throw new Error(`Perplexity API error: ${response.statusText}`)
        }

        const data = await response.json()
        return data.choices[0].message.content
    } catch (error: any) {
        console.error("Perplexity API Error:", error.message)
        throw new Error(`Perplexity API failed: ${error.message}`)
    }
}
