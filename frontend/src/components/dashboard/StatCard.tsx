import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  accent?: "primary" | "secondary" | "accent" | "warning";
  delay?: number;
}

const accentMap = {
  primary: "from-primary/20 to-primary/5 text-primary",
  secondary: "from-secondary/20 to-secondary/5 text-secondary",
  accent: "from-accent/20 to-accent/5 text-accent",
  warning: "from-warning/20 to-warning/5 text-warning",
};

export default function StatCard({ label, value, icon: Icon, accent = "primary", delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: [0.16, 1, 0.3, 1] }}
      className="glass-card p-5"
    >
      <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${accentMap[accent]} mb-4`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-2xl font-bold tracking-tight">{value}</p>
      <p className="text-sm text-text-muted mt-1">{label}</p>
    </motion.div>
  );
}
