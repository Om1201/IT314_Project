
import { Zap, Brain, Target, Lightbulb, Rocket, CheckCircle2 } from 'lucide-react';

export function About() {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Intelligence',
      description: 'Generate roadmaps that according to your learning goals and current skill level.',
    },
    {
      icon: Target,
      title: 'Personalized Paths',
      description: 'Every roadmap is uniquely tailored to your skill level, pace, and learning preferences.',
    },
    {
      icon: Rocket,
      title: 'Accelerated Learning',
      description: 'Structured progressions designed to help you reach mastery faster and more efficiently.',
    },
    {
      icon: CheckCircle2,
      title: 'Milestone Tracking',
      description: 'Track your progress through clearly defined milestones, helping you stay organized and motivated at every step.',
    } 
  ];

  const benefits = [
    'Generate intelligent learning roadmaps powered by cutting-edge AI',
    'Customize your learning path based on goals, experience level, and available time',
    'Access curated resources, tutorials, and project ideas aligned to your roadmap',
    'Track your progress with interactive dashboards and achievement milestones',
    'Join a community of learners and share your learning journey',
  
  ];

  return (
    <main className="container mx-auto px-4 w-full max-w-5xl py-12 md:py-24">
      
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto text-center mb-20">
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 bg-blue-500/20 border border-blue-400/50 rounded-full hover:bg-blue-500/30 transition-colors">
          <Zap className="w-3 h-3 text-blue-400" />
          <span className="text-sm font-medium text-blue-300">About Our Platform</span>
        </div>
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight bg-gradient-to-r from-blue-300 via-blue-200 to-slate-100 bg-clip-text text-transparent">
          Master Any Skill with AI
        </h1>
        <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto">
          We revolutionize learning by combining artificial intelligence with personalized education. Our platform generates intelligent roadmaps that adapt to your pace, style, and ambitions — turning your learning goals into achievable reality.
        </p>
      </section>

      {/* Mission Section */}
      <section className="max-w-5xl mx-auto mb-20">
        <div className="border border-blue-500/20 bg-gradient-to-br from-slate-800/50 to-blue-900/30 backdrop-blur-sm rounded-lg p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-blue-300 to-slate-200 bg-clip-text text-transparent">
            Our Mission
          </h2>
          <div className="space-y-4">
            <p className="text-slate-300 leading-relaxed text-lg">
              We believe everyone deserves access to personalized, adaptive learning experiences. Our mission is to democratize education by leveraging AI to create intelligent, customizable learning paths that work for any skill, any goal, and any learner.
            </p>
            <p className="text-slate-300 leading-relaxed text-lg">
              Whether you&apos;re starting your first coding project, mastering a new language, or transitioning to a new career, we design your perfect roadmap. No more generic courses — only paths tailored exactly to you.
            </p>
            <div className="pt-4 border-t border-blue-500/20">
              <blockquote className="italic text-blue-300 text-lg font-light">
                &ldquo;Learning isn&apos;t one-size-fits-all. We believe in your unique journey to mastery.&rdquo;
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white">Why Choose Us</h2>
          <p className="text-slate-400 text-lg">
            Intelligent technology designed for personalized learning success
          </p>
        </div>
        <div className="grid md:grid-cols-2  justify-centerlg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="border border-blue-500/20 bg-slate-800/50 hover:bg-slate-800/70 transition-all duration-300 group hover:shadow-xl hover:shadow-blue-500/10 rounded-lg p-6">
              <div className="rounded-lg bg-blue-500/20 w-12 h-12 flex items-center justify-center mb-4 group-hover:bg-blue-500/30 transition-colors">
                <feature.icon className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="font-semibold text-lg text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="max-w-4xl mx-auto">
        <div className="border border-blue-500/20 bg-gradient-to-br from-slate-800/50 to-blue-900/30 backdrop-blur-sm rounded-lg p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-white">What You Can Do</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
                <p className="text-slate-300 leading-relaxed">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
