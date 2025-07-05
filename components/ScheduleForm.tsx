import React, { useState, useEffect, useRef, Dispatch, SetStateAction } from 'react';
import { ScheduleItem, ScheduleItemType, ScheduleItemSubmit } from '../types';
import { PlusIcon } from './icons';

interface CustomTimeInputProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
}

const CustomTimeInput: React.FC<CustomTimeInputProps> = ({ value, onChange, id }) => {
  const [hour, setHour] = useState('09');
  const [minute, setMinute] = useState('00');
  const [period, setPeriod] = useState<'오전' | '오후'>('오전');
  
  const periodSelectRef = useRef<HTMLSelectElement>(null);
  const hourSelectRef = useRef<HTMLSelectElement>(null);
  const minuteSelectRef = useRef<HTMLSelectElement>(null);
  const isInitialMount = useRef(true);

  const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
  const periods: ('오전' | '오후')[] = ['오전', '오후'];

  // Sync state from parent prop
  useEffect(() => {
    if (value) {
      const [h, m] = value.split(':').map(Number);
      let newHour12 = h;
      let newPeriod: '오전' | '오후' = '오전';

      if (h === 0) {
        newHour12 = 12; // 12 AM
      } else if (h === 12) {
        newPeriod = '오후'; // 12 PM
      } else if (h > 12) {
        newHour12 = h - 12;
        newPeriod = '오후';
      }
      
      setHour(String(newHour12).padStart(2, '0'));
      setMinute(String(m).padStart(2, '0'));
      setPeriod(newPeriod);
    }
  }, [value]);

  // Propagate state changes to parent
  useEffect(() => {
    if (isInitialMount.current) {
        isInitialMount.current = false;
        return;
    }

    let h24 = Number(hour);
    if (period === '오후' && h24 !== 12) {
      h24 += 12;
    }
    if (period === '오전' && h24 === 12) { // 12 AM is 00 hours
      h24 = 0;
    }
    const newValue = `${String(h24).padStart(2, '0')}:${minute}`;
    onChange(newValue);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hour, minute, period]);

  // Add wheel event listeners to prevent page scroll and update time
  useEffect(() => {
    const addWheelListener = <T extends string>(
      element: HTMLSelectElement | null,
      options: readonly T[],
      currentValue: T,
      updateFunction: Dispatch<SetStateAction<T>>
    ) => {
      if (!element) return () => {};

      const handleWheel = (e: WheelEvent) => {
        e.preventDefault();
        
        const currentIndex = options.indexOf(currentValue);
        if (currentIndex === -1) return;

        const direction = e.deltaY > 0 ? 1 : -1;
        let nextIndex = currentIndex + direction;

        if (nextIndex >= options.length) {
          nextIndex = 0;
        } else if (nextIndex < 0) {
          nextIndex = options.length - 1;
        }
        updateFunction(options[nextIndex]);
      };
      
      element.addEventListener('wheel', handleWheel, { passive: false });
      return () => {
        element.removeEventListener('wheel', handleWheel);
      };
    };

    const cleanupPeriod = addWheelListener(periodSelectRef.current, periods, period, setPeriod);
    const cleanupHour = addWheelListener(hourSelectRef.current, hours, hour, setHour);
    const cleanupMinute = addWheelListener(minuteSelectRef.current, minutes, minute, setMinute);

    return () => {
      cleanupPeriod();
      cleanupHour();
      cleanupMinute();
    };
  }, [hour, minute, period, hours, minutes, periods]);


  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => setPeriod(e.target.value as '오전' | '오후');
  const handleHourChange = (e: React.ChangeEvent<HTMLSelectElement>) => setHour(e.target.value);
  const handleMinuteChange = (e: React.ChangeEvent<HTMLSelectElement>) => setMinute(e.target.value);

  const selectBaseClasses = "bg-transparent text-white focus:outline-none appearance-none cursor-pointer";
  const optionClasses = "bg-slate-800 text-white";

  return (
    <div className="flex items-center gap-1 bg-slate-800 border border-slate-600 rounded-md shadow-sm focus-within:ring-2 focus-within:ring-brand-primary focus-within:border-transparent px-2 py-1.5">
      <select 
        id={id} 
        ref={periodSelectRef}
        value={period} 
        onChange={handlePeriodChange} 
        className={`${selectBaseClasses} pl-1 pr-2`}
      >
        {periods.map(p => <option key={`p-${p}`} value={p} className={optionClasses}>{p}</option>)}
      </select>
      <select 
        ref={hourSelectRef}
        value={hour} 
        onChange={handleHourChange}
        className={selectBaseClasses}
      >
        {hours.map(h => <option key={`h-${h}`} value={h} className={optionClasses}>{h}</option>)}
      </select>
      <span className="text-slate-400">:</span>
      <select 
        ref={minuteSelectRef}
        value={minute} 
        onChange={handleMinuteChange}
        className={selectBaseClasses}
      >
        {minutes.map(m => <option key={`m-${m}`} value={m} className={optionClasses}>{m}</option>)}
      </select>
    </div>
  );
};


interface ScheduleFormProps {
  onSave: (item: ScheduleItemSubmit) => void;
  editingItem: ScheduleItem | null;
  onCancelEdit: () => void;
}

const ScheduleForm: React.FC<ScheduleFormProps> = ({ onSave, editingItem, onCancelEdit }) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ScheduleItemType>(ScheduleItemType.SCHEDULE);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [time, setTime] = useState('12:00');

  useEffect(() => {
    if (editingItem) {
      setTitle(editingItem.title);
      setType(editingItem.type);
      if (editingItem.type === ScheduleItemType.SCHEDULE) {
        setStartTime(editingItem.startTime);
        setEndTime(editingItem.endTime);
      } else {
        setTime(editingItem.time);
      }
    } else {
      // Reset form when not editing
      setTitle('');
      setType(ScheduleItemType.SCHEDULE);
      setStartTime('09:00');
      setEndTime('10:00');
      setTime('12:00');
    }
  }, [editingItem]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
        alert("일정 제목을 입력해주세요.");
        return;
    }
    
    let itemData;
    if (type === ScheduleItemType.SCHEDULE) {
        if (startTime >= endTime) {
            alert("시작 시간은 종료 시간보다 빨라야 합니다.");
            return;
        }
        itemData = { title, type, startTime, endTime };
    } else {
        itemData = { title, type, time };
    }

    if (editingItem) {
        onSave({ ...editingItem, ...itemData });
    } else {
        onSave(itemData);
    }

    // Reset form after submission only if not editing
    if (!editingItem) {
        setTitle('');
    }
  };
  
  const textInputClasses = "w-full px-3 py-2 border border-slate-600 bg-slate-800 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent";

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg mb-8 w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-700 mb-4">{editingItem ? '일정 수정' : '새로운 일정 추가'}</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div className="md:col-span-2">
          <label htmlFor="title" className="block text-sm font-medium text-slate-600 mb-1">일정 제목</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="예: 팀 회의"
            className={textInputClasses}
          />
        </div>
        <div>
            <label htmlFor="type" className="block text-sm font-medium text-slate-600 mb-1">유형</label>
            <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value as ScheduleItemType)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary bg-white"
            >
                <option value={ScheduleItemType.SCHEDULE}>기간 일정</option>
                <option value={ScheduleItemType.POINT}>시점 이벤트</option>
            </select>
        </div>
        {type === ScheduleItemType.SCHEDULE ? (
            <div className="flex gap-2">
                <div>
                    <label htmlFor="startTime" className="block text-sm font-medium text-slate-600 mb-1">시작</label>
                    <CustomTimeInput id="startTime" value={startTime} onChange={setStartTime} />
                </div>
                <div>
                    <label htmlFor="endTime" className="block text-sm font-medium text-slate-600 mb-1">종료</label>
                    <CustomTimeInput id="endTime" value={endTime} onChange={setEndTime} />
                </div>
            </div>
        ) : (
             <div>
                <label htmlFor="time" className="block text-sm font-medium text-slate-600 mb-1">시간</label>
                <CustomTimeInput id="time" value={time} onChange={setTime} />
            </div>
        )}
        
        <div className="flex gap-2 md:col-start-4">
            {editingItem && (
                 <button type="button" onClick={onCancelEdit} className="w-full flex justify-center items-center gap-2 px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400">
                    취소
                </button>
            )}
            <button type="submit" className="w-full flex justify-center items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-primary hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary">
                <PlusIcon />
                {editingItem ? '수정하기' : '추가하기'}
            </button>
        </div>
      </form>
    </div>
  );
};

export default ScheduleForm;
