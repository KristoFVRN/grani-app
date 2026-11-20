import React, { useState } from 'react';
import { DayOverview } from './DayOverview';
import { SuperAdminManager } from './SuperAdminManager';
import { PresenceMonitor } from './PresenceMonitor';
import { FinanceSummary } from './FinanceSummary';
import { ScheduleAndMenuUploader } from './ScheduleAndMenuUploader';
import { LayoutDashboard, ShieldCheck, Shield, DollarSign, CalendarCheck } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'superadmin' | 'presence' | 'finance' | 'schedule'>('overview');

  const tabs = [
    { id: 'overview', label: 'Сводка за день', icon: LayoutDashboard },
    { id: 'superadmin', label: 'Конструктор', icon: ShieldCheck },
    { id: 'presence', label: 'Монитор СКУД', icon: Shield },
    { id: 'finance', label: 'Финансы', icon: DollarSign },
    { id: 'schedule', label: 'Расписание', icon: CalendarCheck },
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
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-150 ${
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
        {activeTab === 'overview' && <DayOverview />}
        {activeTab === 'superadmin' && <SuperAdminManager />}
        {activeTab === 'presence' && <PresenceMonitor />}
        {activeTab === 'finance' && <FinanceSummary />}
        {activeTab === 'schedule' && <ScheduleAndMenuUploader />}
      </div>
    </div>
  );
};
