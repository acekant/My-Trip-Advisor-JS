import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
    return (
        <section className="flex flex-col items-center justify-center text-center py-20 bg-gradient-to-b from-primary/10 to-transparent">
            <h1 className="text-5xl font-extrabold tracking-tight text-primary mb-4">
                Plan Your Perfect Trip with AI
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mb-8">
                Generate personalized itineraries in seconds. Choose destinations, set dates, and let our AI craft the ultimate travel plan for you.
            </p>
            <Link href="/create" passHref>
                <Button variant="default" size="lg" className="rounded-full">
                    Get Started
                </Button>
            </Link>
        </section>
    );
}

export default Hero;
