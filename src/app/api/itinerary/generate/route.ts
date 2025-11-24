import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { itinerarySchema } from "@/lib/schemas"
import { searchPerplexity } from "@/lib/perplexity"
import { generateItineraryWithOpenAI } from "@/lib/openai"
import { z } from "zod"

// Mock generator for fallback
function generateMockItinerary(destination: string, numDays: number, budget: string): any {
  const activities = [
    { name: "City Walking Tour", cost: "Free", type: "Sightseeing" },
    { name: "Local Museum Visit", cost: "$20", type: "Culture" },
    { name: "Famous Park Stroll", cost: "Free", type: "Nature" },
    { name: "Traditional Lunch", cost: "$30", type: "Food" },
    { name: "Historic Landmark", cost: "$15", type: "History" },
    { name: "Sunset Viewpoint", cost: "Free", type: "Sightseeing" },
    { name: "Dinner at Top Rated Spot", cost: "$50", type: "Food" },
    { name: "Evening Market", cost: "Variable", type: "Shopping" }
  ];

  const days = Array.from({ length: numDays }, (_, i) => ({
    day: i + 1,
    activities: [
      {
        timeSlot: "09:00 AM - 12:00 PM",
        name: `${destination} ${activities[i % activities.length].name}`,
        description: `Start your day exploring the beautiful sights of ${destination}.`,
        cost: activities[i % activities.length].cost,
        whyRecommended: "A must-visit location for first-time travelers."
      },
      {
        timeSlot: "01:00 PM - 02:30 PM",
        name: `Lunch at Local Favorite`,
        description: "Enjoy authentic local cuisine in a charming atmosphere.",
        cost: "$25-40",
        whyRecommended: "Highly rated by locals and tourists alike."
      },
      {
        timeSlot: "03:00 PM - 06:00 PM",
        name: `${destination} ${activities[(i + 2) % activities.length].name}`,
        description: "Immerse yourself in the local culture and history.",
        cost: activities[(i + 2) % activities.length].cost,
        whyRecommended: "Offers a unique perspective on the city."
      }
    ],
    transportation: "Public transit is convenient and affordable.",
    dailyCost: budget === "Budget-Friendly" ? "$50-80" : budget === "Luxury" ? "$200+" : "$100-150"
  }));

  return {
    overview: {
      destination,
      duration: `${numDays} Days`,
      totalEstimatedCost: budget === "Budget-Friendly" ? `$${numDays * 80}` : budget === "Luxury" ? `$${numDays * 300}` : `$${numDays * 150}`
    },
    days,
    summary: {
      totalEstimatedCost: budget === "Budget-Friendly" ? `$${numDays * 80}` : budget === "Luxury" ? `$${numDays * 300}` : `$${numDays * 150}`,
      totalActivities: numDays * 3,
      keyHighlights: ["Historic City Center", "Local Cuisine Tasting", "Scenic Views"]
    }
  };
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const validation = itinerarySchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { message: "Invalid input", errors: validation.error.issues },
        { status: 400 }
      )
    }

    const {
      destination,
      numDays,
      budget,
      ageGroups,
      partySize,
      activityLevel,
    } = validation.data

    let itineraryData;

    // Check if API keys are present
    const hasOpenAI = !!process.env.OPENAI_API_KEY;
    const hasPerplexity = !!process.env.PERPLEXITY_API_KEY;

    if (!hasOpenAI) {
      console.warn("Missing OPENAI_API_KEY, using mock data generation.");
      itineraryData = generateMockItinerary(destination, numDays, budget);
    } else {
      try {
        // 1. Search Perplexity for real-time data (Optional, can fail gracefully)
        let perplexityData = "";
        if (hasPerplexity) {
          console.log("Searching Perplexity for:", destination)
          try {
            const perplexityQuery = `Find top attractions, restaurants, and activities in ${destination} suitable for ${ageGroups.join(
              ", "
            )} with ${activityLevel} intensity. Include current hours, prices, and accessibility info.`
            perplexityData = await searchPerplexity(perplexityQuery)
          } catch (error: any) {
            console.error("Perplexity search failed, proceeding without real-time data:", error.message)
            // Continue without perplexity data
          }
        }

        // 2. Generate Itinerary with OpenAI
        console.log("Generating itinerary with OpenAI...")
        const systemPrompt = `You are a travel itinerary expert. Create a detailed ${numDays}-day itinerary for ${destination}.`

        const userPrompt = `
          Create a ${numDays}-day itinerary for ${destination} based on these preferences:
          - Budget: ${budget}
          - Party Size: ${partySize}
          - Age Groups: ${ageGroups.join(", ")}
          - Activity Level: ${activityLevel}

          Use this real-time data (if available):
          ${perplexityData}

          Return a valid JSON object with this structure:
          {
            "overview": {
              "destination": "string",
              "duration": "string",
              "totalEstimatedCost": "string"
            },
            "days": [
              {
                "day": number,
                "activities": [
                  {
                    "timeSlot": "string (e.g. 9:00 AM - 11:00 AM)",
                    "name": "string",
                    "description": "string",
                    "cost": "string",
                    "whyRecommended": "string"
                  }
                ],
                "transportation": "string",
                "dailyCost": "string"
              }
            ],
            "summary": {
              "totalEstimatedCost": "string",
              "totalActivities": number,
              "keyHighlights": ["string"]
            }
          }
        `

        const itineraryJson = await generateItineraryWithOpenAI(userPrompt, systemPrompt)

        if (!itineraryJson) {
          throw new Error("OpenAI returned empty response")
        }

        itineraryData = JSON.parse(itineraryJson)

      } catch (error: any) {
        console.error("AI Generation failed, falling back to mock data:", error.message);
        itineraryData = generateMockItinerary(destination, numDays, budget);
      }
    }

    // 3. Save to Database
    console.log("Saving itinerary to database...")
    const itinerary = await prisma.itinerary.create({
      data: {
        userId: session.user.id,
        destination,
        numDays,
        budget,
        ageGroups,
        partySize,
        activityLevel,
        itineraryData,
      },
    })

    console.log("Itinerary created successfully:", itinerary.id)
    return NextResponse.json({ success: true, itineraryId: itinerary.id })
  } catch (error: any) {
    console.error("Generation error:", error)
    return NextResponse.json(
      { message: "Failed to generate itinerary", error: error.message || "Unknown error" },
      { status: 500 }
    )
  }
}
