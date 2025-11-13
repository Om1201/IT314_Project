import React from 'react';
import { InfiniteMovingCards } from './ui/infinite-moving-cards';
import { Brain, Code, Lightbulb, Target, Zap } from 'lucide-react';

export function InfiniteMovingCardsDemo() {
    return (
        <div
            //   className="h-[40rem] rounded-md flex flex-col antialiased bg-[#020618] bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
            //    className="h-[40rem] rounded-md flex flex-col antialiased bg-gradient-to-b from-[#020618] via-[#00191F] to-[#00BAD9]/30 bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
            className="h-[40rem] rounded-md flex flex-col antialiased bg-gradient-to-b from-[#020618] via-[#00191F] to-[#02354B] bg-grid-white/[0.05] items-center justify-center relative overflow-hidden"
        >
            <div className="text-center mb-20">
                <h2
                    className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 
                 bg-gradient-to-r from-blue-400 via-blue-200 to-white 
                 bg-clip-text text-transparent tracking-wide drop-shadow-[0_2px_6px_rgba(0,186,217,0.25)]"
                >
                    Powerful Features
                </h2>
                <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
                    Everything you need to create and follow your perfect learning journey with ease
                    and clarity.
                </p>
            </div>

            <InfiniteMovingCards items={testimonials} direction="right" speed="fast" />
        </div>
    );
}

const testimonials = [
    {
        icon: Zap, // your lucide-react or custom icon
        title: 'AI Generation',
        description:
            'Instantly generate personalized roadmaps tailored to your goals and skill level',
    },
    {
        icon: Target,
        title: 'Goal Tracking',
        description: 'Monitor your progress with detailed milestones and achievement tracking',
    },
    {
        icon: Lightbulb,
        title: 'Smart Insights',
        description: 'Get AI-powered recommendations to optimize your learning path',
    },
    {
        icon: Code,
        title: 'Resource Library',
        description: 'Access curated resources and learning materials for every step',
    },
    // ...more items
];
