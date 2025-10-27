
export default function Input({ name, value, onChange, type = 'text', placeholder, error, icon }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-teal-500">
        {icon && <div className="mr-2 text-teal-600">{icon}</div>}
        <input
          name={name}
          value={value}
          onChange={onChange}
          type={type}
          placeholder={placeholder}
          className="flex-1 outline-none text-sm text-gray-800"
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}