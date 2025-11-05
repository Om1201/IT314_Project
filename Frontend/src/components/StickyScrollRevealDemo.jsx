import React from 'react';
import { StickyScroll } from './ui/sticky-scroll-reveal';

const content = [
    {
        title: 'Define Your Goal',
        description:
            "Share your learning goals and current experience - whether you're just starting out or refining advanced skills, our AI will craft a clear, personalized path to help you reach mastery.",
        content: (
            <img
                src="/images/goal.jpg"
                width={300}
                height={300}
                className="h-full w-full object-cover"
                alt="linear board demo"
            />
        ),
    },
    {
        title: 'AI-Generated Learning Path',
        description:
            'Our AI creates a personalized learning path with milestones that guide your progress and help you stay on track throughout your learning journey.',
        content: (
            <img
                src="/images/ai.jpg"
                width={300}
                height={300}
                className="h-full w-full object-cover"
                alt="linear board demo"
            />
        ),
    },
    {
        title: 'Learn & Track',
        description:
            'Follow your personalized roadmap and consistently track your progress as you advance step by step toward true mastery in your chosen field.',
        content: (
            <img
                src="/images/learn.jpg"
                width={300}
                height={300}
                className="h-full w-full object-cover"
                alt="linear board demo"
            />
        ),
    },
];
export function StickyScrollRevealDemo() {
    return (
        <div className="w-full py-">
            <StickyScroll content={content} />
        </div>
    );
}
