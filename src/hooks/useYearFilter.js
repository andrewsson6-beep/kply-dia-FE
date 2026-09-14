import { useAppDispatch, useAppSelector } from '../store/hooks.js';
import { setSelectedYear } from '../store/slices/yearFilterSlice.js';

const useYearFilter = () => {
  const dispatch = useAppDispatch();
  const selectedYear = useAppSelector(state => state.yearFilter.selectedYear);

  return {
    selectedYear,
    setSelectedYear: year => dispatch(setSelectedYear(year)),
  };
};

export default useYearFilter;