import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Activity, Brain, Heart, Sparkles, ChevronDown } from 'lucide-react';

interface HeroSectionProps {
  onGetStarted: () => void;
}

export function HeroSection({ onGetStarted }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen gradient-hero overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/3 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-4 pt-20 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-primary/10 mb-8"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered Longevity Intelligence</span>
          </motion.div>

          {/* Main headline */}
          <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Discover Your
            <span className="text-gradient block mt-2">Biological Age</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Your calendar age tells one story. Your body tells another. Uncover the real age of your 
            cells and get personalized insights to extend your healthspan.
          </p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Button variant="hero" size="xl" onClick={onGetStarted}>
              Calculate Your Bio Age
              <Activity className="ml-2 w-5 h-5" />
            </Button>
            <Button variant="outline" size="xl">
              Learn How It Works
            </Button>
          </motion.div>

          {/* Stats */}
          {/* <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-3 gap-8 max-w-2xl mx-auto"
          >
            {[
              { value: '10+', label: 'Health Biomarkers' },
              { value: '95%', label: 'Accuracy Rate' },
              { value: '50K+', label: 'Users Analyzed' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-display font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div> */}
        </motion.div>

        {/* Feature cards */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid md:grid-cols-3 gap-6 mt-20 max-w-5xl mx-auto"
        >
          {[
            {
              icon: Brain,
              title: 'AI Analysis',
              description: 'Advanced algorithms analyze your health data to calculate true biological age',
            },
            {
              icon: Heart,
              title: 'Personalized Insights',
              description: 'Get tailored recommendations based on your unique health profile',
            },
            {
              icon: Activity,
              title: 'Track Progress',
              description: 'Monitor improvements and see how lifestyle changes affect your age',
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="bg-card rounded-2xl p-6 shadow-lg border border-border/50"
            >
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Age comparison visual */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
