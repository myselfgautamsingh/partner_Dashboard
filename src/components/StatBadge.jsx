export default function StatBadge({ label, value, color = 'blue' }) {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-700 border-blue-100',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    red: 'bg-red-50 text-red-600 border-red-100',
    yellow: 'bg-amber-50 text-amber-700 border-amber-100',
    purple: 'bg-violet-50 text-violet-700 border-violet-100',
    gray: 'bg-gray-50 text-gray-700 border-gray-200',
  };

  return (
    <div className={`flex flex-col items-center justify-center p-3 rounded-lg border ${colorMap[color]}`}>
      <span className="text-xl font-bold">{typeof value === 'number' ? value.toLocaleString() : value}</span>
      <span className="text-xs font-medium mt-0.5 text-center leading-tight">{label}</span>
    </div>
  );
}
