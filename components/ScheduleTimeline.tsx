import React from 'react';
import { ScheduleItem, ScheduleItemType } from '../types';

interface ScheduleTimelineProps {
  items: ScheduleItem[];
}

const timeToPercentage = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes;
  return (totalMinutes / (24 * 60)) * 100;
};

const TimelineHourMarkers = () => {
    // Display labels for even hours (0, 2, 4, ..., 24) for a cleaner look.
    const hours = Array.from({ length: 13 }, (_, i) => i * 2);
    return (
        <div className="relative h-6 mt-1">
            {hours.map(hour => (
                <div 
                    key={hour} 
                    className="absolute flex flex-col items-center" 
                    style={{ 
                        left: `${(hour / 24) * 100}%`,
                        transform: 'translateX(-50%)'
                    }}
                >
                    <div className="w-px h-1.5 bg-slate-300" />
                    <span className="text-xs text-slate-500 mt-0.5">{hour}</span>
                </div>
            ))}
        </div>
    );
};

const ScheduleTimeline: React.FC<ScheduleTimelineProps> = ({ items }) => {
  return (
    <div className="w-full max-w-4xl mx-auto my-8 p-4 bg-white rounded-xl shadow-lg">
        <h3 className="text-xl font-bold text-slate-700 mb-6">오늘의 타임라인</h3>
      <div className="relative w-full h-10 bg-slate-200 rounded-md overflow-hidden">
        {items.map(item => {
          if (item.type === ScheduleItemType.SCHEDULE) {
            const left = timeToPercentage(item.startTime);
            const width = timeToPercentage(item.endTime) - left;
            return (
              <div
                key={item.id}
                className="absolute h-10 opacity-90 flex items-center justify-center text-white text-xs font-semibold overflow-hidden group rounded"
                style={{ 
                    left: `${left}%`, 
                    width: `${width}%`,
                    backgroundColor: item.color
                }}
                title={`${item.title} (${item.startTime} - ${item.endTime})`}
              >
                <span className="truncate px-2">{item.title}</span>
              </div>
            );
          }
          if (item.type === ScheduleItemType.POINT) {
            const left = timeToPercentage(item.time);
            return (
              <div
                key={item.id}
                className="absolute top-[-4px] h-12 w-1 group"
                style={{ left: `${left}%`, transform: 'translateX(-50%)' }}
                title={`${item.title} (${item.time})`}
              >
                <div className="w-0.5 h-full mx-auto" style={{backgroundColor: item.color}}></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 border-2 border-white rounded-full" style={{backgroundColor: item.color}}></div>
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-slate-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                    {item.title}
                </div>
              </div>
            );
          }
          return null;
        })}
      </div>
      <TimelineHourMarkers/>
    </div>
  );
};

export default ScheduleTimeline;
