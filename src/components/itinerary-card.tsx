import Link from "next/link"
import { CalendarDays, MapPin, Users, Wallet } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

interface ItineraryCardProps {
    itinerary: {
        id: string
        destination: string
        numDays: number
        budget: string
        partySize: number
        createdAt: Date
    }
}

export function ItineraryCard({ itinerary }: ItineraryCardProps) {
    return (
        <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    {itinerary.destination}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4" />
                        <span>{itinerary.numDays} Days</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{itinerary.partySize} People</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Wallet className="h-4 w-4" />
                        <span>{itinerary.budget}</span>
                    </div>
                </div>
                <div className="text-xs text-muted-foreground pt-4">
                    Created {format(new Date(itinerary.createdAt), "PPP")}
                </div>
            </CardContent>
            <CardFooter>
                <Button asChild className="w-full">
                    <Link href={`/itinerary/${itinerary.id}`}>View Itinerary</Link>
                </Button>
            </CardFooter>
        </Card>
    )
}
