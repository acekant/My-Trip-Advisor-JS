import { z } from "zod"

// Itinerary Schema
export const itinerarySchema = z.object({
  destination: z.string().min(1, "Destination is required"),
  numDays: z.number().min(1).max(30),
  budget: z.enum(["Budget-Friendly", "Moderate", "Luxury", "No Limit"]),
  ageGroups: z.array(z.enum(["Children", "Teens", "Adults", "Seniors"])).min(1, "Select at least one age group"),
  partySize: z.number().min(1, "Party size must be at least 1"),
  activityLevel: z.enum(["Relaxed", "Moderate", "Active", "Very Active"]),
  dietaryRestrictions: z.array(z.string()).default([]),
  accessibilityNeeds: z.array(z.string()).default([]),
  interests: z.array(z.string()).default([]),
})

export type ItineraryInput = z.input<typeof itinerarySchema>

// Options
export const DIETARY_OPTIONS = [
  "Vegetarian",
  "Vegan",
  "Halal",
  "Kosher",
  "Gluten-Free",
  "Dairy-Free",
  "Nut Allergy",
  "Pescatarian"
] as const

export const ACCESSIBILITY_OPTIONS = [
  "Wheelchair Access",
  "Hearing Assistance",
  "Visual Assistance",
  "Mobility Support",
  "Elevator Required"
] as const

export const INTEREST_OPTIONS = [
  "Culture",
  "Food",
  "Adventure",
  "Nature",
  "Shopping",
  "Nightlife",
  "History",
  "Art",
  "Photography",
  "Sports",
  "Relaxation",
  "Wildlife"
] as const
