import { useState, useEffect, useRef } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

export default function Select({
  name,
  value,
  onChange,
  options = [],
  placeholder = "Select...",
  disabled = false,
  icon,
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  const handleSelect = (optionValue) => {
    onChange({
      target: {
        name,
        value: optionValue,
      },
    });
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className={`relative ${className}`} ref={selectRef}>
      <button
        type="button"
        className={`flex items-center justify-between w-full px-3 py-2 text-left bg-white dark:bg-gray-800 border ${
          disabled
            ? "border-gray-200 dark:border-gray-700"
            : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
        } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
          disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer"
        }`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <div className="flex items-center">
          {icon && <span className="mr-2">{icon}</span>}
          {selectedOption ? (
            <span>{selectedOption.label}</span>
          ) : (
            <span className="text-gray-400 dark:text-gray-500">
              {placeholder}
            </span>
          )}
        </div>
        {isOpen ? (
          <FiChevronUp className="text-gray-400" />
        ) : (
          <FiChevronDown className="text-gray-400" />
        )}
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg">
          <ul className="py-1 overflow-auto text-base max-h-60 focus:outline-none">
            {options.map((option) => (
              <li
                key={option.value}
                className={`px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  value === option.value
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                    : "text-gray-900 dark:text-gray-200"
                }`}
                onClick={() => handleSelect(option.value)}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}