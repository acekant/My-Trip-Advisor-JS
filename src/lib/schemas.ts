import { z } from "zod"

export const itinerarySchema = z.object({
    destination: z.string().min(2, "Destination must be at least 2 characters"),
    numDays: z.number().min(1).max(30, "Trip duration must be between 1 and 30 days"),
    budget: z.enum(["Budget-Friendly", "Moderate", "Luxury", "No Limit"]),
    ageGroups: z.array(z.enum(["Children", "Teens", "Adults", "Seniors"])).min(1, "Select at least one age group"),
    partySize: z.number().min(1).max(20, "Party size must be between 1 and 20"),
    activityLevel: z.enum(["Relaxed", "Moderate", "Active", "Very Active"]),
})

export type ItineraryInput = z.infer<typeof itinerarySchema>
