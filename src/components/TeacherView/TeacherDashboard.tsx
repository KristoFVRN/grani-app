import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { AttendanceManager } from './AttendanceManager';
import { HomeworkClubManager } from './HomeworkClubManager';
import { ClubsManager } from './ClubsManager';
import { TeacherShifts } from './TeacherShifts';
import { EventsFeedSection } from '../ParentView/EventsFeedSection';
import { Users, BookOpen, Sparkles, Calendar, Camera } from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
  const { role } = useApp();
  const [activeTab, setActiveTab] = useState<'attendance' | 'homework' | 'clubs' | 'shifts' | 'events'>(
    role === 'extended_teacher' ? 'homework' : 'attendance'
  );

  useEffect(() => {
    if (role === 'extended_teacher' && activeTab === 'attendance') {
      setActiveTab('homework');
    }
  }, [role]);

  const tabs = [
    { id: 'attendance', label: 'Посещаемость', icon: Users },
    { id: 'homework', label: 'ДЗ Продленки', icon: BookOpen },
    { id: 'clubs', label: 'Кружки', icon: Sparkles },
    { id: 'shifts', label: 'Смены и табель', icon: Calendar },
    { id: 'events', label: 'Фотоотчеты', icon: Camera },
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#fbf9f4]">
      {/* Sticky Tabs */}
      <div className="bg-white/95 backdrop-blur-md px-3 py-2 border-b border-purple-100 sticky top-0 z-20 shadow-xs">
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-[#241738] text-amber-200 shadow-sm shadow-purple-900/30'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : 'text-purple-700'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="p-3.5 pb-24">
        {activeTab === 'attendance' && <AttendanceManager />}
        {activeTab === 'homework' && <HomeworkClubManager />}
        {activeTab === 'clubs' && <ClubsManager />}
        {activeTab === 'shifts' && <TeacherShifts />}
        {activeTab === 'events' && <EventsFeedSection allowPublish />}
      </div>
    </div>
  );
};
