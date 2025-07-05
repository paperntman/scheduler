import React from 'react';
import { ScheduleItem, ScheduleItemType } from '../types';
import { EditIcon, DeleteIcon } from './icons';

interface ScheduleListProps {
  items: ScheduleItem[];
  onEdit: (item: ScheduleItem) => void;
  onDelete: (id: string) => void;
}

const ScheduleList: React.FC<ScheduleListProps> = ({ items, onEdit, onDelete }) => {
  if (items.length === 0) {
    return (
        <div className="w-full max-w-4xl mx-auto p-6 text-center bg-white rounded-xl shadow-lg">
            <h3 className="text-xl font-bold text-slate-700 mb-2">일정 목록</h3>
            <p className="text-slate-500">아직 추가된 일정이 없습니다. 새 일정을 추가해보세요!</p>
        </div>
    )
  }
    
  // Create a sorted copy to avoid mutating props and ensure re-renders.
  const sortedItems = [...items].sort((a, b) => {
    const timeA = a.type === ScheduleItemType.SCHEDULE ? a.startTime : a.time;
    const timeB = b.type === ScheduleItemType.SCHEDULE ? b.startTime : b.time;
    return timeA.localeCompare(timeB);
  });

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-slate-700 mb-4">일정 목록</h3>
        <ul className="space-y-3">
            {sortedItems.map(item => (
            <li 
                key={item.id} 
                className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors border-l-4"
                style={{ borderLeftColor: item.color }}
            >
                <div>
                    <p className="font-semibold" style={{ color: item.color }}>{item.title}</p>
                    {item.type === ScheduleItemType.SCHEDULE ? (
                        <p className="text-sm text-slate-500">{item.startTime} ~ {item.endTime} (기간 일정)</p>
                    ) : (
                        <p className="text-sm text-slate-500">{item.time} (시점 이벤트)</p>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => onEdit(item)} className="text-slate-500 hover:text-brand-primary transition-colors" title="수정">
                        <EditIcon />
                    </button>
                    <button onClick={() => onDelete(item.id)} className="text-slate-500 hover:text-red-500 transition-colors" title="삭제">
                        <DeleteIcon />
                    </button>
                </div>
            </li>
            ))}
        </ul>
    </div>
  );
};

export default ScheduleList;
