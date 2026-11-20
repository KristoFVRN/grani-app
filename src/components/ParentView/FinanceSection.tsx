import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { Invoice } from '../../types';
import {
  CreditCard,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  ChevronRight,
  Zap,
  Award,
  Cpu,
  Palette,
  BellRing,
  X,
  Printer
} from 'lucide-react';

export const FinanceSection: React.FC = () => {
  const { currentStudent, invoices, subscriptions, parentAlerts, payInvoice, markAlertRead } = useApp();
  const [activeTab, setActiveTab] = useState<'invoices' | 'subscriptions' | 'receipts'>('invoices');
  const [selectedReceipt, setSelectedReceipt] = useState<Invoice | null>(null);

  const studentInvoices = invoices.filter((inv) => inv.studentId === currentStudent.id);
  const pendingInvoices = studentInvoices.filter((inv) => inv.status !== 'paid');
  const paidInvoices = studentInvoices.filter((inv) => inv.status === 'paid');
  const unreadDebtAlerts = parentAlerts.filter(
    (a) => a.studentId === currentStudent.id && a.type === 'debt' && !a.read
  );

  const getSubIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu':
        return Cpu;
      case 'Award':
        return Award;
      default:
        return Palette;
    }
  };

  return (
    <section className="bg-white rounded-2xl p-4 shadow-sm border border-[#e8e6d9] space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#4e1984] flex items-center justify-center font-bold">
            <CreditCard className="w-5 h-5 text-[#4e1984]" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-[#2d124d]">Оплата и баланс</h2>
            <p className="text-[11px] text-[#6d647a]">Счета, чеки и абонементы на кружки</p>
          </div>
        </div>

        {pendingInvoices.length > 0 ? (
          <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-rose-500" />
            К оплате: {pendingInvoices.reduce((a, b) => a + b.amount, 0).toLocaleString('ru-RU')} ₽
          </span>
        ) : (
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            Всё оплачено
          </span>
        )}
      </div>

      {/* Persistent Reminder Banner if Director reminded or invoice pending */}
      {unreadDebtAlerts.length > 0 && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 flex items-start justify-between gap-2 text-xs">
          <div className="flex items-start gap-2">
            <BellRing className="w-4 h-4 text-amber-600 shrink-0 mt-0.5 animate-bounce" />
            <div>
              <div className="font-bold text-amber-950">{unreadDebtAlerts[0].title}</div>
              <p className="text-[11px] text-amber-900 mt-0.5 leading-snug">{unreadDebtAlerts[0].message}</p>
            </div>
          </div>
          <button
            onClick={() => markAlertRead(unreadDebtAlerts[0].id)}
            className="text-amber-700 hover:text-amber-950 p-1"
            title="Скрыть напоминание"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1.5 p-1 bg-[#f7f8ea] rounded-xl border border-[#eceecc] text-xs">
        <button
          onClick={() => setActiveTab('invoices')}
          className={`flex-1 py-1.5 rounded-lg font-bold transition flex items-center justify-center gap-1 ${
            activeTab === 'invoices' ? 'bg-[#4e1984] text-white shadow-sm' : 'text-[#563b76] hover:bg-white/50'
          }`}
        >
          <span>Счета</span>
          {pendingInvoices.length > 0 && (
            <span className="w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] flex items-center justify-center font-black">
              {pendingInvoices.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('subscriptions')}
          className={`flex-1 py-1.5 rounded-lg font-bold transition ${
            activeTab === 'subscriptions' ? 'bg-[#4e1984] text-white shadow-sm' : 'text-[#563b76] hover:bg-white/50'
          }`}
        >
          Абонементы ({subscriptions.length})
        </button>
        <button
          onClick={() => setActiveTab('receipts')}
          className={`flex-1 py-1.5 rounded-lg font-bold transition ${
            activeTab === 'receipts' ? 'bg-[#4e1984] text-white shadow-sm' : 'text-[#563b76] hover:bg-white/50'
          }`}
        >
          Чеки ({paidInvoices.length})
        </button>
      </div>

      {/* TAB 1: Invoices */}
      {activeTab === 'invoices' && (
        <div className="space-y-2.5">
          {studentInvoices.length === 0 ? (
            <div className="text-xs text-center text-gray-500 py-4">По этому ученику выставленных счетов пока нет</div>
          ) : (
            studentInvoices.map((inv) => (
              <div
                key={inv.id}
                className={`p-3 rounded-xl border transition ${
                  inv.status === 'paid'
                    ? 'bg-[#fbfbf6] border-[#eceecc]'
                    : inv.status === 'overdue'
                    ? 'bg-rose-50/50 border-rose-200 shadow-sm'
                    : 'bg-purple-50/40 border-purple-200 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-[#8e859b]">{inv.invoiceNumber}</span>
                      <span
                        className={`text-[10px] font-black px-1.5 py-0.2 rounded ${
                          inv.category === 'tuition'
                            ? 'bg-purple-100 text-[#4e1984]'
                            : inv.category === 'meals'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {inv.category === 'tuition' ? 'Обучение' : inv.category === 'meals' ? 'Питание' : 'Кружки'}
                      </span>
                    </div>
                    <h3 className="font-bold text-xs text-[#2d124d] mt-0.5">{inv.title}</h3>
                    <div className="text-[11px] text-[#6d647a] mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Срок оплаты: до {inv.dueDate}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-black text-sm text-[#2d124d]">
                      {inv.amount.toLocaleString('ru-RU')} ₽
                    </div>
                    <div className="mt-1">
                      {inv.status === 'paid' ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Оплачено
                        </span>
                      ) : inv.status === 'overdue' ? (
                        <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full inline-block">
                          Просрочен
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full inline-block">
                          Ожидает
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action button if pending */}
                {inv.status !== 'paid' && (
                  <div className="mt-2.5 pt-2 border-t border-purple-100 flex items-center justify-between">
                    <span className="text-[11px] text-[#6d647a]">Оплата через СБП / картой без комиссии</span>
                    <button
                      onClick={() => payInvoice(inv.id)}
                      className="bg-[#4e1984] hover:bg-[#3b1266] text-white text-xs font-bold px-3.5 py-1.5 rounded-lg shadow transition flex items-center gap-1.5"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-300" />
                      Оплатить счет
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: Subscriptions (Остаток занятий) */}
      {activeTab === 'subscriptions' && (
        <div className="space-y-2.5">
          <div className="bg-purple-50/60 p-2.5 rounded-xl border border-purple-100 text-xs text-[#563b76]">
            Остаток оплаченных занятий по кружкам и секциям центра «Грани». Занятия списываются по факту посещения.
          </div>

          {subscriptions.map((sub) => {
            const Icon = getSubIcon(sub.iconName);
            const progress = (sub.remainingLessons / sub.totalLessons) * 100;
            return (
              <div key={sub.id} className="p-3 rounded-xl border border-[#eceecc] bg-[#fbfbf6] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#4e1984] flex items-center justify-center">
                      <Icon className="w-4 h-4 text-[#4e1984]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-[#2d124d]">{sub.title}</h4>
                      <p className="text-[10px] text-[#8e859b]">{sub.scheduleDays} {sub.startTime}–{sub.endTime}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-black text-[#4e1984] bg-white px-2 py-1 rounded-lg border border-purple-200 shadow-xs">
                      {sub.remainingLessons} из {sub.totalLessons} зан.
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        sub.remainingLessons <= 2 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-[#6d647a] mt-1">
                    <span>Осталось занятий: {sub.remainingLessons}</span>
                    <span>Действует до {sub.expiresDate}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 3: Receipts (История чеков) */}
      {activeTab === 'receipts' && (
        <div className="space-y-2">
          {paidInvoices.length === 0 ? (
            <p className="text-xs text-center text-gray-500 py-4">Нет оплаченных чеков</p>
          ) : (
            paidInvoices.map((inv) => (
              <div
                key={inv.id}
                onClick={() => setSelectedReceipt(inv)}
                className="p-2.5 rounded-xl border border-[#eceecc] bg-[#fbfbf6] hover:bg-[#f3f4e2] transition cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-[#2d124d]">{inv.title}</div>
                    <div className="text-[10px] text-[#8e859b]">
                      Оплачено {inv.paidDate} • {inv.invoiceNumber}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-right">
                  <span className="font-black text-xs text-[#2d124d]">
                    {inv.amount.toLocaleString('ru-RU')} ₽
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Fiscal Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-[#eceecc] space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-dashed border-gray-300 pb-3">
              <div>
                <div className="font-black text-sm text-[#4e1984]">КАССОВЫЙ ЧЕК (ОФД)</div>
                <div className="text-[10px] text-gray-500">АНО ОО «Частная школа Грани», Воронеж</div>
              </div>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="p-1 text-gray-400 hover:text-gray-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5 text-[11px] border-b border-dashed border-gray-300 pb-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Номер счета:</span>
                <span className="font-bold">{selectedReceipt.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Ученик:</span>
                <span className="font-bold">{selectedReceipt.studentName} ({selectedReceipt.class})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Дата оплаты:</span>
                <span className="font-bold">{selectedReceipt.paidDate || 'Сегодня'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Способ оплаты:</span>
                <span className="font-bold text-emerald-700">СБП (Безналично)</span>
              </div>
            </div>

            <div className="bg-[#f7f8ea] p-2.5 rounded-xl border border-[#eceecc]">
              <div className="font-semibold text-[#2d124d]">{selectedReceipt.title}</div>
              <div className="flex justify-between items-center mt-1.5 pt-1.5 border-t border-[#e0e2c0]">
                <span className="font-bold text-gray-600">ИТОГО ОПЛАЧЕНО:</span>
                <span className="font-black text-base text-[#4e1984]">
                  {selectedReceipt.amount.toLocaleString('ru-RU')} ₽
                </span>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => window.print()}
                className="flex-1 bg-[#4e1984] text-white py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 hover:bg-[#3b1266]"
              >
                <Printer className="w-3.5 h-3.5" /> Печать / PDF
              </button>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
