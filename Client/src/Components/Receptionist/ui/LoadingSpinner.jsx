import { FiLoader } from 'react-icons/fi';

export default function LoadingSpinner({ fullPage = false, size = 24, className = '' }) {
  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        <FiLoader className={`animate-spin ${className}`} size={size} />
      </div>
    );
  }

  return <FiLoader className={`animate-spin ${className}`} size={size} />;
}