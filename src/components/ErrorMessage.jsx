function ErrorMessage({ message }) {
  return (
    <div className="error-card" role="alert">
      <p className="error-title">Something went wrong</p>
      <p className="error-copy">{message}</p>
    </div>
  );
}

export default ErrorMessage;
