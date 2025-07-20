export function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded shadow-md ${className}`}>
      {children}
    </div>
  );
}
