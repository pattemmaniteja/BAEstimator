import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Lock, AlertTriangle } from 'lucide-react';

export function DisclaimerSection() {
  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-6"
          >
            {/* AI Disclaimer */}
            <Card className="bg-amber-50/50 border-amber-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-amber-900 mb-2">Ethical AI Disclaimer</h3>
                    <p className="text-sm text-amber-800 leading-relaxed">
                      This tool uses AI algorithms to estimate biological age based on self-reported data. 
                      Results are for informational purposes only and should not replace professional medical 
                      advice, diagnosis, or treatment. Our models are trained on population-level data and 
                      may not account for individual variations.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Privacy Notice */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Lock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold mb-2">Privacy & Data Protection</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Your health data is processed locally in your browser and is not stored on our servers. 
                      We do not share, sell, or transmit your personal health information to third parties. 
                      Downloaded reports are generated client-side for your privacy.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Additional info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-6"
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-secondary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold mb-2">Medical Guidance</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Always consult with qualified healthcare professionals before making any changes to your 
                      health regimen. This tool is designed to provide general wellness insights and should be 
                      used as a complement to, not a replacement for, regular medical check-ups and professional 
                      health assessments. If you have concerns about any health metrics, please seek medical advice.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
