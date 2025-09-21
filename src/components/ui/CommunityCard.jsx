const CommunityCard = ({ number, name, onView, onViewFamilies }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center justify-between min-h-[160px] border border-gray-200 hover:shadow-lg transition-shadow duration-200 focus:outline-none">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 rounded-full border-2 border-blue-400 flex items-center justify-center mb-3">
          <span className="text-blue-400 font-semibold text-lg">{number}</span>
        </div>
        <h3 className="text-gray-800 font-medium text-sm text-center leading-tight">
          {name}
        </h3>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 w-full">
        <button
          type="button"
          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs"
          onClick={onView}
        >
          View
        </button>
        <button
          type="button"
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs"
          onClick={onViewFamilies}
        >
          View Families
        </button>
      </div>
    </div>
  );
};

export default CommunityCard;
