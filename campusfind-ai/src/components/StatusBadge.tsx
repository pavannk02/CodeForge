import { clsx } from 'clsx';

interface Props {
  status: string;
  labels: Record<string, { label: string; color: string }>;
}

const colorMap: Record<string, string> = {
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
  neutral: 'bg-gray-100 text-gray-600',
};

export default function StatusBadge({ status, labels }: Props) {
  const cfg = labels[status] || { label: status, color: 'neutral' };
  return (
    <span className={clsx('badge', colorMap[cfg.color] || colorMap.neutral)}>
      {cfg.label}
    </span>
  );
}

