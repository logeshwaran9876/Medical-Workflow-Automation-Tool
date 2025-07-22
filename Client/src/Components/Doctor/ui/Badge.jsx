// src/components/doctor/ui/Badge.jsx
export default function Badge({ children, color = 'gray' }) {
  const colors = {
    indigo: 'bg-indigo-100 text-indigo-800',
    gray: 'bg-gray-100 text-gray-800',
    teal: 'bg-teal-100 text-teal-800',
    red: 'bg-red-100 text-red-800',
  };
  return (
    <span className={`text-xs font-medium px-3 py-1 rounded-full ${colors[color] || colors.gray}`}>
      {children}
    </span>
  );
}
