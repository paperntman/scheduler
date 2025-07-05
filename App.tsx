
import React, { useState } from 'react';
import ScheduleForm from './components/ScheduleForm';
import ScheduleTimeline from './components/ScheduleTimeline';
import ScheduleList from './components/ScheduleList';
import { ScheduleItem, ScheduleItemSubmit } from './types';

const COLORS = [
    '#38bdf8', // sky-400
    '#4ade80', // green-400
    '#facc15', // yellow-400
    '#fb923c', // orange-400
    '#f87171', // red-400
    '#c084fc', // purple-400
    '#fb7185', // rose-400
];

const App: React.FC = () => {
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null);

  const handleSaveItem = (itemData: ScheduleItemSubmit) => {
    if ('id' in itemData) {
      // Update existing item
      setScheduleItems(prevItems =>
        prevItems.map(item => (item.id === itemData.id ? itemData : item))
      );
      setEditingItem(null);
    } else {
      // Add new item
      const newItem: ScheduleItem = {
        ...itemData,
        id: new Date().toISOString() + Math.random(),
        color: COLORS[scheduleItems.length % COLORS.length],
      } as ScheduleItem;
      setScheduleItems(prevItems => [...prevItems, newItem]);
    }
  };

  const handleDeleteItem = (id: string) => {
    // Confirmation dialog removed for a more direct and responsive user experience.
    setScheduleItems(prevItems => prevItems.filter(item => item.id !== id));
    if (editingItem?.id === id) {
        setEditingItem(null);
    }
  };

  const handleEditItem = (item: ScheduleItem) => {
    setEditingItem(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleCancelEdit = () => {
    setEditingItem(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 font-sans">
      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-brand-primary">
          나만의 타임라인 스케줄러
        </h1>
        <p className="text-slate-500 mt-2">하루를 시각적으로 계획하고 관리하세요.</p>
      </header>

      <main className="container mx-auto">
        <ScheduleForm 
            onSave={handleSaveItem} 
            editingItem={editingItem}
            onCancelEdit={handleCancelEdit}
        />
        <ScheduleTimeline items={scheduleItems} />
        <ScheduleList items={scheduleItems} onEdit={handleEditItem} onDelete={handleDeleteItem} />
      </main>

      <footer className="text-center mt-12 py-4">
        <p className="text-sm text-slate-400">
          Created with React & Tailwind CSS
        </p>
      </footer>
    </div>
  );
};

export default App;
