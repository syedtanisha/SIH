import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Search, X } from 'lucide-react';

export const SearchableDropdown = ({
  label,
  options = [],
  value = '',
  onChange,
  placeholder = 'Type to search...',
  name,
  icon: Icon,
  required = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Sync internal search term when external value changes
  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        if (!searchTerm && value) {
          setSearchTerm(value);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchTerm, value]);

  // Filter options based on input
  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes((searchTerm || '').toLowerCase().trim())
  );

  const handleSelect = (option) => {
    setSearchTerm(option);
    onChange({ target: { name, value: option } });
    setIsOpen(false);
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    onChange({ target: { name, value: val } });
    if (!isOpen) setIsOpen(true);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setSearchTerm('');
    onChange({ target: { name, value: '' } });
    inputRef.current?.focus();
    setIsOpen(true);
  };

  // Helper to highlight matching text
  const highlightMatch = (text, query) => {
    if (!query || !query.trim()) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <span key={i} className="bg-amber-100 text-amber-900 font-bold px-0.5 rounded">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="relative space-y-1.5" ref={dropdownRef}>
      {label && (
        <label className="block text-xs sm:text-sm font-semibold text-slate-800">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Icon className="w-4 h-4" />
          </div>
        )}

        <input
          ref={inputRef}
          type="text"
          name={name}
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          required={required}
          autoComplete="off"
          className={`w-full ${Icon ? 'pl-10' : 'pl-3.5'} pr-14 py-2.5 text-xs sm:text-sm border rounded-xl bg-white outline-none transition shadow-sm focus:ring-2 focus:ring-mospi-500 focus:border-mospi-500 ${
            isOpen ? 'border-mospi-500 ring-2 ring-mospi-500/20' : 'border-slate-300 hover:border-slate-400'
          }`}
        />

        <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-1">
          {searchTerm && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-md transition hover:bg-slate-100"
              title="Clear selection"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-md transition hover:bg-slate-100"
          >
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180 text-mospi-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Dropdown Menu - spacious floating panel */}
      {isOpen && (
        <div className="absolute z-50 mt-1.5 w-full bg-white border border-slate-200 rounded-xl shadow-2xl ring-1 ring-black/10 max-h-72 overflow-y-auto py-1 text-xs sm:text-sm divide-y divide-slate-100 animate-in fade-in duration-150">
          <div className="sticky top-0 z-10 px-3.5 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600 font-medium">
            <span>
              {filteredOptions.length} option{filteredOptions.length === 1 ? '' : 's'} matching
            </span>
            <span className="text-[11px] text-slate-400">Scroll to view all</span>
          </div>

          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, idx) => {
              const isSelected = option.toLowerCase() === (value || '').toLowerCase();
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={`w-full text-left px-3.5 py-2.5 flex items-center justify-between transition group hover:bg-amber-50/80 ${
                    isSelected ? 'bg-amber-50 font-semibold text-mospi-900' : 'text-slate-700 hover:text-slate-900'
                  }`}
                >
                  <span className="leading-relaxed pr-3">
                    {highlightMatch(option, searchTerm)}
                  </span>
                  {isSelected && <Check className="w-4 h-4 text-amber-600 flex-shrink-0" />}
                </button>
              );
            })
          ) : (
            <div className="px-4 py-5 text-center text-slate-500 space-y-1">
              <p className="font-semibold text-slate-700">No exact match found in dataset</p>
              <p className="text-xs text-slate-400">
                You can still register with: <span className="font-semibold text-mospi-800">"{searchTerm}"</span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
