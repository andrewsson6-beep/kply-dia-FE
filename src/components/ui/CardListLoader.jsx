import React from 'react';

const SkeletonCard = ({ variant }) => {
  if (variant === 'community') {
    return (
      <div className="relative min-h-[218px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <div className="h-12 w-12 animate-pulse rounded-2xl bg-slate-200" />
          <div className="h-5 w-20 animate-pulse rounded-full bg-slate-100" />
        </div>
        <div className="space-y-3">
          <div className="h-4 w-4/5 animate-pulse rounded bg-slate-200" />
          <div className="h-3 w-2/5 animate-pulse rounded bg-slate-100" />
        </div>
        <div className="absolute bottom-5 left-5 right-5 grid grid-cols-2 gap-2">
          <div className="h-10 animate-pulse rounded-xl bg-slate-100" />
          <div className="h-10 animate-pulse rounded-xl bg-slate-100" />
        </div>
      </div>
    );
  }

  if (variant === 'family') {
    return (
      <div className="relative min-h-[280px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[1, 2, 3, 4].map(item => (
            <div key={item} className="space-y-2">
              <div className="h-3 w-1/3 animate-pulse rounded bg-blue-100" />
              <div className="h-9 animate-pulse rounded-md bg-slate-100" />
            </div>
          ))}
        </div>
        <div className="absolute bottom-5 left-5 right-5 h-10 animate-pulse rounded-lg bg-slate-100" />
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 shrink-0 animate-pulse rounded-xl bg-slate-200" />
          <div className="flex-1 space-y-3">
            <div className="h-5 w-2/3 animate-pulse rounded bg-slate-200" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-slate-100" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[1, 2, 3, 4].map(item => (
            <div key={item} className="h-9 animate-pulse rounded-lg bg-slate-100" />
          ))}
        </div>
      </div>
    </div>
  );
};

const CardListLoader = ({ variant = 'list', count = 3 }) => (
  <div
    className={
      variant === 'community'
        ? 'grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'
        : variant === 'family'
          ? 'grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6'
          : 'space-y-5'
    }
    aria-label="Loading results"
    role="status"
  >
    {Array.from({ length: count }, (_, index) => (
      <SkeletonCard key={index} variant={variant} />
    ))}
    <span className="sr-only">Loading results</span>
  </div>
);

export default CardListLoader;