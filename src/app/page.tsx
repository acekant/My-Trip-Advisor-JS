import { Navbar } from "@/components/ui/navbar";
import { Hero } from "@/components/ui/hero";
import { Features } from "@/components/ui/features";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-slate-900">
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <Features />

      {/* Call to Action Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 shadow-2xl">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Start Your Adventure?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of travelers who trust MTA Planner to create unforgettable journeys.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/create">
              <Button size="lg" variant="secondary" className="rounded-full px-8 text-lg font-semibold shadow-lg hover:shadow-xl transition-all">
                Create Your First Itinerary
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="rounded-full px-8 text-lg font-semibold bg-white/10 text-white border-white/30 hover:bg-white/20 shadow-lg">
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-600 dark:text-gray-400">
            © 2025 MTA Planner. Powered by AI to make your travels extraordinary.
          </p>
          <div className="mt-4 flex gap-6 justify-center text-sm">
            <Link href="/about" className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors">
              About
            </Link>
            <Link href="/privacy" className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors">
              Terms
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
