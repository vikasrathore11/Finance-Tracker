import { ReactNode } from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function Card({ title, subtitle, icon, children, className = '' }: CardProps) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 ${className}`}>
      {(title || subtitle) && (
        <div className="mb-5">
          {title && (
            <div className="flex items-center gap-2 mb-1">
              {icon && <div className="text-indigo-600">{icon}</div>}
              <h3 className="font-bold text-gray-900">{title}</h3>
            </div>
          )}
          {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
}
