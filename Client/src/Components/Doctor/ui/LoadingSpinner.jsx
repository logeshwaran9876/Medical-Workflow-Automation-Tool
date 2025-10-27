
export default function LoadingSpinner({ fullPage = false }) {
  const spinner = (
    <div className="w-16 h-16 border-4 border-teal-300 border-t-transparent rounded-full animate-spin"></div>
  );
  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60">
        {spinner}
      </div>
    );
  }
  return spinner;
}
