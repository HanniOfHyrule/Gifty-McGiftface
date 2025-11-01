import React from 'react';

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-center gap-4">
        <div
          className={`
          w-14 h-14 rounded-xl flex items-center justify-center text-white
          ${color}
          shadow-lg
        `}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-3xl font-bold text-gray-800 mb-1">
            {value.toLocaleString()}
          </h3>
          <p className="text-gray-500 font-medium text-sm">{title}</p>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
