import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BellRing, DollarSign, Filter, Send, PlusCircle, X } from 'lucide-react';

export const FinanceSummary: React.FC = () => {
  const { students, invoices, sendDebtorReminder, sendAllDebtorsReminder, addInvoice } = useApp();
  const [filter, setFilter] = useState<'all' | 'debtors' | 'paid'>('all');
  const [showNewInvoice, setShowNewInvoice] = useState(false);

  const [invStudentId, setInvStudentId] = useState(students[0]?.id || 's1');
  const [invCategory, setInvCategory] = useState<'tuition' | 'meals' | 'clubs'>('clubs');
  const [invTitle, setInvTitle] = useState('');
  const [invAmount, setInvAmount] = useState('4500');
  const [invDueDate, setInvDueDate] = useState('25.11.2026');

  const totalBilled = invoices.reduce((acc, cur) => acc + cur.amount, 0);
  const totalPaid = invoices
    .filter((inv) => inv.status === 'paid')
    .reduce((acc, cur) => acc + cur.amount, 0);
  const totalDebt = invoices
    .filter((inv) => inv.status !== 'paid')
    .reduce((acc, cur) => acc + cur.amount, 0);

  const overdueInvoices = invoices.filter((inv) => inv.status === 'overdue' || inv.status === 'pending');
  const collectionRate = Math.round((totalPaid / totalBilled) * 100) || 0;

  const filteredInvoices = invoices.filter((inv) => {
    if (filter === 'debtors') return inv.status === 'overdue' || inv.status === 'pending';
    if (filter === 'paid') return inv.status === 'paid';
    return true;
  });

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find((s) => s.id === invStudentId);
    const numAmount = Number(invAmount);
    if (!st || !invTitle.trim() || !numAmount) return;

    addInvoice({
      studentId: st.id,
      studentName: st.name,
      class: st.class.replace(' класс', ''),
      title: invTitle.trim(),
      category: invCategory,
      amount: numAmount,
      dueDate: invDueDate
    });
    setInvTitle('');
    setShowNewInvoice(false);
  };

  return (
    <div className="space-y-4">
      {/* Financial KPI Dashboard */}
      <div className="bg-gradient-to-r from-[#1f0f33] via-[#3d1566] to-[#4e1984] text-white p-4 rounded-2xl shadow-lg border border-purple-400/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-amber-200 uppercase tracking-wider">
                Финансовый дашборд школы
              </div>
              <div className="font-extrabold text-base">Сборы за ноябрь 2026</div>
            </div>
          </div>
          <span className="text-xs bg-amber-400 text-black px-2.5 py-1 rounded-full font-black">
            {collectionRate}% собрано
          </span>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/15 text-center">
          <div className="bg-black/25 p-2 rounded-xl">
            <div className="text-xs text-white/80">Собрано</div>
            <div className="text-sm font-black text-emerald-300 mt-0.5">
              {(totalPaid / 1000).toFixed(1)}k ₽
            </div>
            <div className="text-[9px] text-emerald-400/80">Оплачено</div>
          </div>

          <div className="bg-black/25 p-2 rounded-xl">
            <div className="text-xs text-white/80">Остаток долга</div>
            <div className="text-sm font-black text-rose-300 mt-0.5">
              {(totalDebt / 1000).toFixed(1)}k ₽
            </div>
            <div className="text-[9px] text-rose-400/80">{overdueInvoices.length} счетов</div>
          </div>

          <div className="bg-black/25 p-2 rounded-xl">
            <div className="text-xs text-white/80">Всего к сбору</div>
            <div className="text-sm font-black text-amber-200 mt-0.5">
              {(totalBilled / 1000).toFixed(1)}k ₽
            </div>
            <div className="text-[9px] text-amber-300/80">План месяца</div>
          </div>
        </div>

        {/* 1-Click Batch Reminder for all debtors */}
        {overdueInvoices.length > 0 && (
          <div className="mt-3 pt-2 border-t border-white/15 flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] text-purple-200">
              Неоплаченных счетов: <strong>{overdueInvoices.length}</strong>
            </span>
            <button
              onClick={sendAllDebtorsReminder}
              className="bg-amber-400 hover:bg-amber-300 text-purple-950 font-black text-xs px-3 py-1.5 rounded-xl shadow-md flex items-center gap-1.5 transition"
            >
              <BellRing className="w-3.5 h-3.5" />
              <span>Напомнить всем должникам в 1 клик</span>
            </button>
          </div>
        )}
      </div>

      {/* Add Invoice Action */}
      <div className="flex items-center justify-between px-1">
        <h3 className="font-bold text-xs text-[#2d124d] flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-[#4e1984]" />
          <span>Реестр счетов и должников</span>
        </h3>
        <button
          onClick={() => setShowNewInvoice(!showNewInvoice)}
          className="text-xs font-bold bg-[#4e1984] text-white px-2.5 py-1.5 rounded-xl flex items-center gap-1 hover:bg-[#3b1266] transition"
        >
          <PlusCircle className="w-3.5 h-3.5 text-amber-300" />
          <span>Выставить счет</span>
        </button>
      </div>

      {/* New Invoice Modal Form */}
      {showNewInvoice && (
        <form
          onSubmit={handleCreateInvoice}
          className="bg-white p-4 rounded-2xl border-2 border-[#4e1984] shadow-md space-y-2.5 text-xs"
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#4e1984]">Выставление нового счета</span>
            <button type="button" onClick={() => setShowNewInvoice(false)} className="text-gray-400">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-gray-500 block mb-0.5">Ученик:</label>
              <select
                value={invStudentId}
                onChange={(e) => setInvStudentId(e.target.value)}
                className="w-full p-2 rounded-xl border border-gray-300 bg-white font-semibold"
              >
                {students.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] text-gray-500 block mb-0.5">Категория:</label>
              <select
                value={invCategory}
                onChange={(e) => setInvCategory(e.target.value as 'tuition' | 'meals' | 'clubs')}
                className="w-full p-2 rounded-xl border border-gray-300 bg-white font-semibold"
              >
                <option value="tuition">Обучение</option>
                <option value="meals">Питание</option>
                <option value="clubs">Кружки</option>
              </select>
            </div>
          </div>

          <input
            type="text"
            required
            placeholder="Назначение счета (например: Кружок Гончарное дело, ноябрь)"
            value={invTitle}
            onChange={(e) => setInvTitle(e.target.value)}
            className="w-full p-2 rounded-xl border border-gray-300"
          />

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-gray-500 block mb-0.5">Сумма (₽):</label>
              <input
                type="number"
                required
                min={100}
                value={invAmount}
                onChange={(e) => setInvAmount(e.target.value)}
                className="w-full p-2 rounded-xl border border-gray-300 font-bold"
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-500 block mb-0.5">Срок оплаты:</label>
              <input
                type="text"
                required
                value={invDueDate}
                onChange={(e) => setInvDueDate(e.target.value)}
                className="w-full p-2 rounded-xl border border-gray-300"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#4e1984] text-white py-2 rounded-xl font-bold hover:bg-[#3b1266]"
          >
            Выставить счет и уведомить родителя
          </button>
        </form>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-1 bg-white p-1 rounded-xl border border-[#eceecc] text-xs">
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 py-1.5 rounded-lg font-bold transition ${
            filter === 'all' ? 'bg-[#4e1984] text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Все ({invoices.length})
        </button>
        <button
          onClick={() => setFilter('debtors')}
          className={`flex-1 py-1.5 rounded-lg font-bold transition flex items-center justify-center gap-1 ${
            filter === 'debtors' ? 'bg-rose-600 text-white' : 'text-rose-700 bg-rose-50 hover:bg-rose-100'
          }`}
        >
          <span>Должники</span>
          <span className="w-4 h-4 bg-white/20 rounded-full text-[10px] flex items-center justify-center font-black">
            {overdueInvoices.length}
          </span>
        </button>
        <button
          onClick={() => setFilter('paid')}
          className={`flex-1 py-1.5 rounded-lg font-bold transition ${
            filter === 'paid' ? 'bg-emerald-600 text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Оплачено
        </button>
      </div>

      {/* Invoices List */}
      <div className="space-y-2">
        {filteredInvoices.map((inv) => (
          <div
            key={inv.id}
            className={`p-3 rounded-2xl border transition ${
              inv.status === 'paid'
                ? 'bg-white border-[#eceecc]'
                : inv.status === 'overdue'
                ? 'bg-rose-50/50 border-rose-200'
                : 'bg-amber-50/50 border-amber-200'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-extrabold text-xs text-[#2d124d]">{inv.studentName}</span>
                  <span className="text-[10px] text-gray-500">({inv.class})</span>
                  <span
                    className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded ${
                      inv.status === 'paid'
                        ? 'bg-emerald-100 text-emerald-800'
                        : inv.status === 'overdue'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {inv.status === 'paid' ? 'Оплачено' : inv.status === 'overdue' ? 'Долг' : 'Ожидает'}
                  </span>
                </div>
                <div className="text-xs text-[#563b76] mt-0.5 font-medium">{inv.title}</div>
                <div className="text-[10px] text-[#8e859b] mt-0.5">
                  Срок: до {inv.dueDate} • {inv.invoiceNumber}
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="font-black text-sm text-[#2d124d]">
                  {inv.amount.toLocaleString('ru-RU')} ₽
                </div>
                {inv.status !== 'paid' && (
                  <button
                    onClick={() => sendDebtorReminder(inv.id)}
                    className="mt-1 text-[11px] font-bold text-[#4e1984] hover:text-[#3b1266] bg-purple-50 hover:bg-purple-100 border border-purple-200 px-2 py-1 rounded-lg flex items-center gap-1 transition ml-auto"
                    title="Отправить пуш-напоминание родителю"
                  >
                    <Send className="w-3 h-3 text-[#4e1984]" />
                    <span>Напомнить</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
