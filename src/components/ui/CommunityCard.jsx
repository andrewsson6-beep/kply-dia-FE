const CommunityCard = ({ number, name, onClick }) => {
  const handleKeyDown = e => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center justify-center min-h-[120px] border border-gray-200 hover:shadow-lg transition-shadow duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
    >
      <div className="w-12 h-12 rounded-full border-2 border-blue-400 flex items-center justify-center mb-3">
        <span className="text-blue-400 font-semibold text-lg">{number}</span>
      </div>
      <h3 className="text-gray-800 font-medium text-sm text-center leading-tight">
        {name}
      </h3>
    </div>
  );
};

export default CommunityCard;
