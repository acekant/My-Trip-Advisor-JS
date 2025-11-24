import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export function Features() {
    const features = [
        {
            title: "AI-Powered Itineraries",
            description: "Generate personalized travel plans instantly with cutting‑edge AI.",
        },
        {
            title: "Collaborative Planning",
            description: "Share and edit itineraries with friends or family in real time.",
        },
        {
            title: "Smart Recommendations",
            description: "Get suggestions for attractions, restaurants, and activities based on your interests.",
        },
    ];

    return (
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
            <h2 className="text-3xl font-bold text-center mb-12 text-primary">Features</h2>
            <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto px-4">
                {features.map((f, idx) => (
                    <Card key={idx} className="shadow-lg hover:shadow-xl transition-shadow">
                        <CardHeader>
                            <CardTitle>{f.title}</CardTitle>
                            <CardDescription>{f.description}</CardDescription>
                        </CardHeader>
                        <CardContent></CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
}

export default Features;
