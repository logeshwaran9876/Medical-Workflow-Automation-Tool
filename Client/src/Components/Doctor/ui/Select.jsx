
export default function Select({ name, value, onChange, options, icon }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-teal-500">
        {icon && <div className="mr-2 text-teal-600">{icon}</div>}
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="flex-1 outline-none text-sm text-gray-800 bg-transparent"
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
