"use client";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "title" | "circle" | "rect" | "card";
}

export default function Skeleton({ className = "", variant = "text" }: SkeletonProps) {
  const base = "skeleton rounded-[3px]";

  const variants = {
    text: "h-4 w-full",
    title: "h-6 w-3/4",
    circle: "h-10 w-10 rounded-full",
    rect: "h-20 w-full",
    card: "h-32 w-full",
  };

  return (
    <div className={`${base} ${variants[variant]} ${className}`} aria-hidden="true" />
  );
}

export function SkeletonCard() {
  return (
    <div className="panel p-6">
      <div className="flex items-center gap-3 mb-4">
        <Skeleton variant="circle" className="!h-10 !w-10" />
        <div className="flex-1">
          <Skeleton className="!h-4 !w-1/3 mb-2" />
          <Skeleton className="!h-3 !w-1/2" />
        </div>
      </div>
      <Skeleton variant="rect" className="!h-16 mb-3" />
      <Skeleton className="!h-3 !w-2/3" />
    </div>
  );
}

export function SkeletonDashboard() {
  return (
    <div className="space-y-6">
      {/* Hero skeleton */}
      <div className="panel p-8">
        <Skeleton className="!h-3 !w-24 mb-4" />
        <Skeleton variant="title" className="!h-8 !w-1/2 mb-3" />
        <Skeleton className="!h-4 !w-2/3 mb-6" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} variant="rect" className="!h-16" />
          ))}
        </div>
      </div>
      {/* Content skeleton */}
      <div className="grid grid-cols-2 gap-6">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}
