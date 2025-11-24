"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { itinerarySchema, ItineraryInput } from "@/lib/schemas"
import { Plane, Calendar, Users, Wallet, Activity, MapPin, Loader2, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"

const ageGroupOptions = ["Children", "Teens", "Adults", "Seniors"] as const

import { useSession } from "next-auth/react"

// ... imports

import { motion, AnimatePresence } from "framer-motion"

// ... (keep existing imports)

export default function CreateItineraryPage() {
    const router = useRouter()
    const { data: session, status } = useSession()
    const [isLoading, setIsLoading] = useState(false)

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (status === "unauthenticated") {
        router.push("/login")
        return null
    }

    const form = useForm<ItineraryInput>({
        resolver: zodResolver(itinerarySchema),
        defaultValues: {
            destination: "",
            numDays: 3,
            budget: "Moderate",
            ageGroups: ["Adults"],
            partySize: 2,
            activityLevel: "Moderate",
        },
    })

    async function onSubmit(data: ItineraryInput) {
        setIsLoading(true)
        try {
            const response = await fetch("/api/itinerary/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })

            if (!response.ok) {
                const text = await response.text()
                console.error("API Error Response:", response.status, text)
                try {
                    const error = JSON.parse(text)
                    throw new Error(error.message || "Failed to generate itinerary")
                } catch (e) {
                    throw new Error(`API returned ${response.status}: ${text.slice(0, 100)}...`)
                }
            }

            const result = await response.json()
            toast.success("Itinerary generated successfully!")
            router.push(`/itinerary/${result.itineraryId}`)
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message)
            } else {
                toast.error("Something went wrong. Please try again.")
            }
            setIsLoading(false) // Only stop loading on error, otherwise keep it for transition
        }
    }

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-slate-900 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative">

            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 dark:bg-gray-950/80 backdrop-blur-md"
                    >
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                rotate: [0, 360],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="mb-8 p-6 bg-primary/10 rounded-full"
                        >
                            <Plane className="w-12 h-12 text-primary" />
                        </motion.div>
                        <motion.h2
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
                        >
                            Crafting your perfect trip to {form.getValues("destination")}...
                        </motion.h2>
                        <p className="text-muted-foreground">
                            Analyzing thousands of reviews and local favorites
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            <Card className="w-full max-w-3xl shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader className="text-center space-y-2 pb-8">
                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <Sparkles className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        Design Your Dream Trip
                    </CardTitle>
                    <CardDescription className="text-lg text-muted-foreground max-w-md mx-auto">
                        Tell us your preferences, and our AI will craft the perfect itinerary for you in seconds.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            {/* Destination Section */}
                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="destination"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2 text-base font-semibold">
                                                <MapPin className="w-4 h-4 text-primary" />
                                                Where do you want to go?
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        placeholder="e.g. Kyoto, Japan"
                                                        className="pl-4 h-12 text-lg bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-primary/20 transition-all"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Duration */}
                                <FormField
                                    control={form.control}
                                    name="numDays"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2 text-base font-semibold">
                                                <Calendar className="w-4 h-4 text-primary" />
                                                Duration (Days)
                                            </FormLabel>
                                            <FormControl>
                                                <div className="space-y-4 pt-2">
                                                    <Slider
                                                        min={1}
                                                        max={30}
                                                        step={1}
                                                        value={[field.value]}
                                                        onValueChange={(vals) => field.onChange(vals[0])}
                                                        className="py-4"
                                                    />
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm text-muted-foreground">1 Day</span>
                                                        <span className="font-bold text-primary text-lg">{field.value} Days</span>
                                                        <span className="text-sm text-muted-foreground">30 Days</span>
                                                    </div>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Party Size */}
                                <FormField
                                    control={form.control}
                                    name="partySize"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2 text-base font-semibold">
                                                <Users className="w-4 h-4 text-primary" />
                                                Party Size
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        type="number"
                                                        min={1}
                                                        max={20}
                                                        className="h-12 bg-white dark:bg-gray-950"
                                                        {...field}
                                                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Budget */}
                                <FormField
                                    control={form.control}
                                    name="budget"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2 text-base font-semibold">
                                                <Wallet className="w-4 h-4 text-primary" />
                                                Budget
                                            </FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="h-12 bg-white dark:bg-gray-950">
                                                        <SelectValue placeholder="Select budget" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Budget-Friendly">💰 Budget-Friendly</SelectItem>
                                                    <SelectItem value="Moderate">💰💰 Moderate</SelectItem>
                                                    <SelectItem value="Luxury">💰💰💰 Luxury</SelectItem>
                                                    <SelectItem value="No Limit">💳 No Limit</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Activity Level */}
                                <FormField
                                    control={form.control}
                                    name="activityLevel"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2 text-base font-semibold">
                                                <Activity className="w-4 h-4 text-primary" />
                                                Pace
                                            </FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="h-12 bg-white dark:bg-gray-950">
                                                        <SelectValue placeholder="Select activity level" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Relaxed">😌 Relaxed</SelectItem>
                                                    <SelectItem value="Moderate">🚶 Moderate</SelectItem>
                                                    <SelectItem value="Active">🏃 Active</SelectItem>
                                                    <SelectItem value="Very Active">⚡ Very Active</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Age Groups */}
                            <FormField
                                control={form.control}
                                name="ageGroups"
                                render={() => (
                                    <FormItem>
                                        <FormLabel className="flex items-center gap-2 text-base font-semibold mb-4">
                                            <Users className="w-4 h-4 text-primary" />
                                            Who is traveling?
                                        </FormLabel>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {ageGroupOptions.map((item) => (
                                                <FormField
                                                    key={item}
                                                    control={form.control}
                                                    name="ageGroups"
                                                    render={({ field }) => {
                                                        const isChecked = field.value?.includes(item)
                                                        return (
                                                            <FormItem
                                                                key={item}
                                                                className="space-y-0"
                                                            >
                                                                <FormControl>
                                                                    <div
                                                                        className={`
                                                                            relative flex cursor-pointer rounded-lg border p-4 shadow-sm focus:outline-none transition-all duration-200
                                                                            ${isChecked
                                                                                ? 'border-primary bg-primary/5 ring-1 ring-primary'
                                                                                : 'border-gray-200 hover:border-primary/50 bg-white dark:bg-gray-950 dark:border-gray-800'
                                                                            }
                                                                        `}
                                                                        onClick={() => {
                                                                            const newValue = isChecked
                                                                                ? field.value?.filter((value) => value !== item)
                                                                                : [...field.value, item]
                                                                            field.onChange(newValue)
                                                                        }}
                                                                    >
                                                                        <div className="flex w-full items-center justify-between">
                                                                            <div className="flex items-center">
                                                                                <div className="text-sm font-medium">
                                                                                    {item}
                                                                                </div>
                                                                            </div>
                                                                            <Checkbox
                                                                                checked={isChecked}
                                                                                className="sr-only"
                                                                                onCheckedChange={(checked) => {
                                                                                    const newValue = checked
                                                                                        ? [...field.value, item]
                                                                                        : field.value?.filter((value) => value !== item)
                                                                                    field.onChange(newValue)
                                                                                }}
                                                                            />
                                                                            {isChecked && (
                                                                                <div className="shrink-0 text-primary">
                                                                                    <Sparkles className="h-4 w-4" />
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </FormControl>
                                                            </FormItem>
                                                        )
                                                    }}
                                                />
                                            ))}
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                className="w-full h-14 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                                disabled={isLoading}
                            >
                                <Plane className="mr-2 h-5 w-5" />
                                Generate My Itinerary
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
