const CommunityCard = ({ number, name, onView, onViewFamilies }) => {
  return (
    <article className="group relative flex min-h-[218px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)] transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_14px_30px_rgba(37,99,235,0.12)]">
      <div className="h-1.5 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400" />
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-lg font-bold text-blue-600 ring-1 ring-inset ring-blue-100">
            {number}
          </div>
          <span className="rounded-full bg-slate-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
            Community
          </span>
        </div>
        <div className="mt-5 min-h-[48px]">
          <h3 className="line-clamp-2 text-base font-bold leading-snug text-slate-800">
            {name}
          </h3>
          <p className="mt-1 text-xs text-slate-400">Community ID {number}</p>
        </div>
        <div className="mt-auto grid grid-cols-2 gap-2 pt-5">
        <button
          type="button"
          className="rounded-xl bg-blue-600 px-3 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
          onClick={onView}
        >
          Details
        </button>
        <button
          type="button"
          className="rounded-xl border border-blue-200 bg-blue-50 px-3 py-2.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-300"
          onClick={onViewFamilies}
        >
          Families
        </button>
        </div>
      </div>
    </article>
  );
};

export default CommunityCard;
