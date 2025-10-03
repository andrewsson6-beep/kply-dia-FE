import React from 'react';

/* Reusable skeleton loaders for list/grid entity pages.
 * Usage: <EntitySkeletons variant="family" count={6} />
 * Variants: 'family' (grid 1-2 cols), 'church' (vertical list), 'community' (grid multi),
 * 'institution' (list), 'individual' (grid 1-2 cols)
 */

const basePulse =
  'animate-pulse bg-white border border-gray-200 rounded-lg shadow-sm';

const FamilySkeleton = () => (
  <div className={`${basePulse} p-4 flex flex-col gap-3`}>
    <div className="h-5 w-3/4 bg-gray-200 rounded" />
    <div className="h-4 w-1/2 bg-gray-200 rounded" />
    <div className="flex gap-3 mt-1">
      <div className="h-4 w-16 bg-gray-200 rounded" />
      <div className="h-4 w-20 bg-gray-200 rounded" />
      <div className="h-4 w-12 bg-gray-200 rounded" />
    </div>
    <div className="mt-3 h-8 w-full bg-gray-100 rounded" />
  </div>
);

const ChurchSkeleton = () => (
  <div className={`${basePulse} p-5 flex flex-col gap-4 max-w-4xl mx-auto`}>
    <div className="flex items-start gap-4">
      <div className="h-16 w-16 bg-gray-200 rounded-md" />
      <div className="flex-1 space-y-2">
        <div className="h-5 w-2/3 bg-gray-200 rounded" />
        <div className="h-4 w-1/3 bg-gray-200 rounded" />
        <div className="h-4 w-1/2 bg-gray-200 rounded" />
      </div>
    </div>
    <div className="flex gap-2">
      <div className="h-8 flex-1 bg-gray-100 rounded" />
      <div className="h-8 flex-1 bg-gray-100 rounded" />
    </div>
  </div>
);

const CommunitySkeleton = () => (
  <div className={`${basePulse} p-4 flex flex-col gap-3`}>
    <div className="h-5 w-2/3 bg-gray-200 rounded" />
    <div className="h-4 w-1/2 bg-gray-200 rounded" />
    <div className="mt-2 h-8 w-full bg-gray-100 rounded" />
  </div>
);

const InstitutionSkeleton = () => (
  <div className={`${basePulse} p-5 flex flex-col gap-4`}>
    <div className="flex items-start gap-4">
      <div className="h-14 w-14 bg-gray-200 rounded-md" />
      <div className="flex-1 space-y-2">
        <div className="h-5 w-2/3 bg-gray-200 rounded" />
        <div className="h-4 w-1/2 bg-gray-200 rounded" />
        <div className="h-4 w-1/3 bg-gray-200 rounded" />
      </div>
    </div>
    <div className="flex gap-2">
      <div className="h-8 flex-1 bg-gray-100 rounded" />
      <div className="h-8 flex-1 bg-gray-100 rounded" />
      <div className="h-8 flex-1 bg-gray-100 rounded" />
    </div>
  </div>
);

const IndividualSkeleton = () => (
  <div className={`${basePulse} p-4 flex flex-col gap-3`}>
    <div className="h-5 w-3/4 bg-gray-200 rounded" />
    <div className="h-4 w-1/2 bg-gray-200 rounded" />
    <div className="flex gap-3 mt-1">
      <div className="h-4 w-16 bg-gray-200 rounded" />
      <div className="h-4 w-20 bg-gray-200 rounded" />
      <div className="h-4 w-24 bg-gray-200 rounded" />
    </div>
    <div className="mt-3 h-8 w-full bg-gray-100 rounded" />
  </div>
);

export function EntitySkeletons({ variant, count = 6 }) {
  const components = {
    family: FamilySkeleton,
    church: ChurchSkeleton,
    parish: ChurchSkeleton,
    community: CommunitySkeleton,
    institution: InstitutionSkeleton,
    individual: IndividualSkeleton,
  };
  const Comp = components[variant] || FamilySkeleton;
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Comp key={i} />
      ))}
    </>
  );
}

// Convenience grid/list wrappers
export const SkeletonGrid = ({
  variant,
  count,
  columns = 'grid-cols-1 md:grid-cols-2',
}) => (
  <div className={`grid ${columns} gap-4 md:gap-6`}>
    <EntitySkeletons variant={variant} count={count} />
  </div>
);

export const SkeletonStack = ({ variant, count }) => (
  <div className="space-y-6">
    <EntitySkeletons variant={variant} count={count} />
  </div>
);

export default EntitySkeletons;
