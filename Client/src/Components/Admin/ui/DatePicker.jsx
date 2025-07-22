import React, { useState } from 'react';
import { FiCalendar } from 'react-icons/fi';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function DatePicker({
  selected,
  onChange,
  placeholderText = 'Select date',
  selectsStart = false,
  selectsEnd = false,
  startDate = null,
  endDate = null,
  minDate = null,
  maxDate = null,
  className = '',
  disabled = false
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center">
        <ReactDatePicker
          selected={selected}
          onChange={(date) => {
            onChange(date);
            setIsOpen(false);
          }}
          onCalendarClose={() => setIsOpen(false)}
          onCalendarOpen={() => setIsOpen(true)}
          placeholderText={placeholderText}
          selectsStart={selectsStart}
          selectsEnd={selectsEnd}
          startDate={startDate}
          endDate={endDate}
          minDate={minDate}
          maxDate={maxDate}
          disabled={disabled}
          className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          calendarClassName="dark:bg-gray-800 dark:text-white dark:border-gray-600"
          dayClassName={(date) => 
            date.getDate() === new Date().getDate() && 
            date.getMonth() === new Date().getMonth() && 
            date.getFullYear() === new Date().getFullYear()
              ? 'bg-blue-100 dark:bg-blue-900'
              : undefined
          }
          open={isOpen}
        />
        <FiCalendar 
          className="absolute left-3 text-gray-400 dark:text-gray-500" 
          onClick={() => !disabled && setIsOpen(!isOpen)}
        />
      </div>
    </div>
  );
}