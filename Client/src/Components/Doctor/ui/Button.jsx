
export default function Button({ type = 'button', onClick, children, variant = 'primary', loading }) {
  const base = 'rounded-xl px-4 py-2 font-medium transition-all text-sm';
  const variants = {
    primary: 'bg-teal-600 text-white hover:bg-teal-700',
    outline: 'border border-teal-600 text-teal-600 hover:bg-teal-50',
  };
  return (
    <button 
      type={type} 
      onClick={onClick} 
      className={`${base} ${variants[variant]}`} 
      disabled={loading}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
}
