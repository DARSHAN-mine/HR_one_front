export function Button({ children, variant, ...props }) {
  const base = "px-4 py-2 rounded text-white font-medium";
  const variants = {
    default: "bg-blue-600 hover:bg-blue-700",
    destructive: "bg-red-600 hover:bg-red-700",
  };
  const classes = `${base} ${variants[variant] || variants.default}`;
  return <button className={classes} {...props}>{children}</button>;
}
