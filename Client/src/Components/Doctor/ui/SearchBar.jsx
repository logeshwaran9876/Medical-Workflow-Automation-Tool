
import { FiSearch } from 'react-icons/fi';

export default function SearchBar({ value, onChange, placeholder }) {
  return (
    <div className="flex items-center border rounded-xl px-3 py-2 w-full max-w-sm bg-white">
      <FiSearch className="text-teal-500 mr-2" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full outline-none text-sm text-gray-700"
      />
    </div>
  );
}