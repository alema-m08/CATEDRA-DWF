export default function SkeletonDashboard() {
  return (
    <div className="animate-pulse w-full">
      {/* Cards Skeleton */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-10 bg-gray-200 rounded-lg w-1/3 mb-3"></div>
            <div className="h-3 bg-gray-100 rounded w-2/3"></div>
          </div>
        ))}
      </div>

      {/* Main Content Skeletons */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <div className="h-4 bg-gray-200 rounded w-1/5"></div>
                <div className="h-4 bg-gray-200 rounded w-8"></div>
              </div>
              <div className="h-3 bg-gray-100 rounded-full w-full"></div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <div className="h-4 bg-gray-200 rounded w-1/5"></div>
                <div className="h-4 bg-gray-200 rounded w-8"></div>
              </div>
              <div className="h-3 bg-gray-100 rounded-full w-full"></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between border-b pb-3">
                <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-8"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
