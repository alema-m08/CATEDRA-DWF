export default function SkeletonTable() {
  return (
    <div className="animate-pulse flex flex-col space-y-4 w-full">
      {/* Table Header Skeleton */}
      <div className="h-10 bg-gray-200 rounded-xl w-full"></div>
      
      {/* Table Row Skeletons */}
      {[1, 2, 3, 4, 5].map((item) => (
        <div key={item} className="flex gap-4 w-full">
          <div className="h-12 bg-gray-100 rounded-xl w-1/4"></div>
          <div className="h-12 bg-gray-100 rounded-xl w-1/4"></div>
          <div className="h-12 bg-gray-100 rounded-xl w-1/4"></div>
          <div className="h-12 bg-gray-100 rounded-xl w-1/4"></div>
        </div>
      ))}
    </div>
  );
}
