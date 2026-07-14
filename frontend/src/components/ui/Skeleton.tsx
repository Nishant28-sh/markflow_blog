import clsx from "@/utils/clsx";

export default function Skeleton({ className }: { className?: string }) {
  return <div className={clsx("skeleton", className)} />;
}
