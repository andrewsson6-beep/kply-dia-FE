import React, { useState, useRef, useEffect } from 'react';
// Import SVG logo (was incorrectly pointing to a non-existent PNG and using named import)
import mmtlogo from '../../assets/images/mmtlogo.svg';

const Header = ({
  onSelect,
  selectedLetter: controlledLetter,
  showFilter = false,
  headerInfo,
  searchValue,
  onSearchChange,
}) => {
  const [showAlphabet, setShowAlphabet] = useState(false);
  const [uncontrolledLetter, setUncontrolledLetter] = useState(null);
  const alphaContainerRef = useRef(null);

  const letters = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
  ];

  const isControlled = controlledLetter !== undefined;
  const effectiveSelected = isControlled
    ? controlledLetter
    : uncontrolledLetter;

  const handleSelectLetter = ltr => {
    const nextVal = ltr === effectiveSelected ? null : ltr;
    if (!isControlled) {
      setUncontrolledLetter(nextVal);
    }
    onSelect && onSelect(nextVal);
    setShowAlphabet(false);
  };

  useEffect(() => {
    if (showAlphabet && effectiveSelected && alphaContainerRef.current) {
      const container = alphaContainerRef.current;
      const el = container.querySelector(
        `[data-letter="${effectiveSelected}"]`
      );
      if (el) {
        const containerWidth = container.clientWidth;
        const target = el.offsetLeft + el.offsetWidth / 2 - containerWidth / 2;
        container.scrollTo({ left: Math.max(target, 0), behavior: 'smooth' });
      }
    }
  }, [showAlphabet, effectiveSelected]);
  return (
    <header
      id="app-header"
      className="header bg-gray-100/95 backdrop-blur shadow-sm border-b border-gray-200 flex flex-wrap items-start justify-between gap-3 px-4 sm:px-6 pt-2 pb-3 fixed top-0 left-0 lg:left-64 right-0 z-40 transition-[left,width] duration-300"
    >
      {showAlphabet && (
        <div className="w-full order-1 flex justify-end pl-12 sm:pl-0">
          <div className="max-w-full">
            <div
              ref={alphaContainerRef}
              id="alphabet-bar"
              className="relative bg-white/80 backdrop-blur-sm rounded-md border border-blue-100 px-2 py-2 flex overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 hide-scrollbar shadow-sm"
              style={{ scrollbarWidth: 'none' }}
              aria-label="Alphabet navigation"
              role="tablist"
            >
              <div className="flex space-x-1 min-w-max pr-1">
                {letters.map(letter => (
                  <button
                    key={letter}
                    data-letter={letter}
                    onClick={() => handleSelectLetter(letter)}
                    role="tab"
                    aria-selected={effectiveSelected === letter}
                    className={`w-7 h-7 sm:w-8 sm:h-8 text-[11px] sm:text-xs font-medium rounded-md border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-400 ${effectiveSelected === letter ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-100'}`}
                  >
                    {letter}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="w-full flex flex-wrap items-center gap-4 order-2">
        <div className="flex items-center flex-shrink-0 order-1">
          <img
            src={mmtlogo}
            alt="MMT Hospital Logo"
            className="h-10 sm:h-12 w-auto"
          />
        </div>
        <div className="order-2 flex-1 text-center min-w-[160px]">
          <div className="text-base sm:text-xl font-bold text-blue-600 leading-tight truncate px-2">
            {headerInfo?.title || 'Header Title'}
          </div>
          <div className="text-xs sm:text-sm text-gray-600 truncate px-2">
            {headerInfo?.subtitle || 'Subtitle or additional info'}
          </div>
        </div>
        <div className="flex items-center space-x-3 ml-auto relative order-3">
          {showFilter && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowAlphabet(s => !s)}
                aria-expanded={showAlphabet}
                aria-controls="alphabet-bar"
                className={`relative text-xs rounded-full px-3 py-1 font-medium tracking-wide transition-colors shadow-sm border ${
                  showAlphabet
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : effectiveSelected
                      ? 'bg-white border-blue-600 text-blue-600 hover:bg-blue-50'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                A–Z
                {showAlphabet && (
                  <span className="pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-blue-600" />
                )}
              </button>
            </div>
          )}
          <div className="relative w-40 sm:w-56 md:w-64 border border-blue-400 rounded-md">
            <input
              type="text"
              placeholder="Search.."
              value={searchValue || ''}
              onChange={e => onSearchChange && onSearchChange(e.target.value)}
              className="pl-8 pr-3 py-2  rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full text-sm"
            />
            <svg
              className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
