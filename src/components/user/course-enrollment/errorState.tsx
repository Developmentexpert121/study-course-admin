interface ErrorStateProps {
  onBack: () => void;
}

export default function ErrorState({ onBack }: ErrorStateProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6 dark:bg-gray-900">
      <div className="text-center">
        <p className="text-gray-600 dark:text-gray-300">Course not found</p>
        <button
          onClick={onBack}
          className="mt-4 text-blue-600 hover:text-blue-700"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}
