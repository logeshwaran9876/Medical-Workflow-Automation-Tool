import { FiSearch, FiX } from "react-icons/fi";
import { useState, useEffect } from "react";

export default function SearchBar({
  value = "",
  onChange = () => {},
  placeholder = "Search...",
  debounceTime = 300,
  className = "",
}) {
  const [inputValue, setInputValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(inputValue);
    }, debounceTime);

    return () => clearTimeout(timer);
  }, [inputValue, debounceTime, onChange]);
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleClear = () => {
    setInputValue("");
    onChange("");
  };

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FiSearch className="h-5 w-5 text-gray-400 dark:text-gray-500" />
      </div>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={placeholder}
        className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-600 dark:focus:border-blue-600 sm:text-sm"
      />
      {inputValue && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
          aria-label="Clear search"
        >
          <FiX className="h-5 w-5 text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400" />
        </button>
      )}
    </div>
  );
}