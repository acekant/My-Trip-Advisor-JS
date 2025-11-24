import { notFound, redirect } from "next/navigation"
import { getServerSession } from "next-auth"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ItineraryView } from "@/components/itinerary-view"

interface ItineraryData {
    overview: {
        destination: string
        duration: string
        totalEstimatedCost: string
    }
    days: {
        day: number
        activities: {
            timeSlot: string
            name: string
            description: string
            cost: string
            whyRecommended: string
        }[]
        transportation: string
        dailyCost: string
    }[]
    summary: {
        totalEstimatedCost: string
        totalActivities: number
        keyHighlights: string[]
    }
}

export default async function ItineraryPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const session = await getServerSession(authOptions)
    const { id } = await params

    if (!session) {
        redirect("/login")
    }

    const itinerary = await prisma.itinerary.findUnique({
        where: {
            id,
        },
    })

    if (!itinerary) {
        notFound()
    }

    if (itinerary.userId !== session.user.id) {
        redirect("/dashboard")
    }

    const data = itinerary.itineraryData as unknown as ItineraryData

    return <ItineraryView itinerary={itinerary} data={data} />
}
