const ErrorMessage = ({ message, onRetry }) => (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="text-red-600 text-lg mb-4">{message}</div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
        >
          Try Again
        </button>
      )}
    </div>
  );
  
  export default ErrorMessage;
  
  