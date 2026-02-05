import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Dna, TrendingUp, AlertCircle } from 'lucide-react';

export function AgeExplainer() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Chronological vs Biological Age
          </h2>
          <p className="text-xl text-muted-foreground">
            Your birthday tells you how many years you've been alive. Your biological age reveals 
            how well your body has aged — and that's what truly matters for your health.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Chronological Age */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Card variant="elevated" className="h-full">
              <CardContent className="p-8">
                <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-6">
                  <Clock className="w-8 h-8 text-secondary-foreground" />
                </div>
                <h3 className="font-display text-2xl font-semibold mb-4">Chronological Age</h3>
                <p className="text-muted-foreground mb-6">
                  The number of years since you were born. It's fixed, predictable, and tells us 
                  nothing about your actual health status or life expectancy.
                </p>
                <ul className="space-y-3">
                  {[
                    'Simply measures time passed',
                    'Same for everyone born on your birthday',
                    'Cannot be changed or improved',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* Biological Age */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <Card variant="feature" className="h-full border-2 border-primary/20">
              <CardContent className="p-8">
                <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mb-6">
                  <Dna className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="font-display text-2xl font-semibold mb-4">Biological Age</h3>
                <p className="text-muted-foreground mb-6">
                  The true age of your cells, organs, and systems. Influenced by lifestyle, 
                  genetics, and environment. This is the age that determines your health trajectory.
                </p>
                <ul className="space-y-3">
                  {[
                    'Reflects cellular and organ health',
                    'Varies based on lifestyle choices',
                    'Can be improved through interventions',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Key insight */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-12 max-w-3xl mx-auto"
        >
          <Card className="bg-accent/50 border-primary/10">
            <CardContent className="p-6 flex gap-4 items-start">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">The Good News</h4>
                <p className="text-sm text-muted-foreground">
                  Research shows that biological age can be reversed by 3-8 years through targeted 
                  lifestyle interventions. Small changes in sleep, diet, exercise, and stress 
                  management can have dramatic effects on your cellular health.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
