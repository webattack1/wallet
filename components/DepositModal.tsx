import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, Loader2 } from './Icons';
import { PaymentMethod } from '../types';
import { DEPOSIT_METHODS } from '../constants';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeposit: (amount: number, method: PaymentMethod) => Promise<void>;
}

export const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose, onDeposit }) => {
  const [step, setStep] = useState<'method' | 'amount' | 'processing'>('method');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [amount, setAmount] = useState('');

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setStep('method');
      setAmount('');
      setSelectedMethod(null);
    }
  }, [isOpen]);

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setStep('amount');
  };

  const handleDepositClick = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0 || !selectedMethod) return;
    
    setStep('processing');
    // Call parent handler
    await onDeposit(Number(amount), selectedMethod);
    // Modal will be closed by parent or we can close it here if onDeposit doesn't close it
    // But usually parent updates state to close modal
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm transition-opacity duration-300">
      <div className="w-full max-w-md bg-[#1e293b] rounded-t-2xl sm:rounded-2xl p-6 shadow-2xl transform transition-all duration-300 translate-y-0">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            {step === 'amount' && (
                <button onClick={() => setStep('method')} className="p-1 -ml-2 text-slate-400 hover:text-white transition-colors">
                    <ChevronLeft size={24} />
                </button>
            )}
            <h2 className="text-xl font-bold text-white">
                {step === 'method' ? 'Пополнить баланс' : step === 'amount' ? 'Введите сумму' : 'Обработка'}
            </h2>
          </div>
          <button onClick={onClose} disabled={step === 'processing'} className="p-2 rounded-full hover:bg-slate-700 text-slate-400 transition-colors disabled:opacity-50">
            <X size={24} />
          </button>
        </div>

        {/* Step 1: Method Selection */}
        {step === 'method' && (
          <div className="space-y-3">
            {DEPOSIT_METHODS.map((method) => (
              <button
                key={method.id}
                onClick={() => handleMethodSelect(method)}
                className="w-full flex items-center p-4 bg-[#0f172a] hover:bg-slate-700 rounded-xl transition-all duration-200 border border-slate-700 group"
              >
                <span className="text-2xl mr-4 bg-slate-800 p-2 rounded-full h-12 w-12 flex items-center justify-center shadow-sm">
                  {method.icon}
                </span>
                <div className="text-left">
                  <p className="font-semibold text-white group-hover:text-blue-400 transition-colors">{method.name}</p>
                  <p className="text-xs text-slate-400">Мгновенное зачисление</p>
                </div>
              </button>
            ))}
            <div className="mt-6 text-center text-xs text-slate-500">
              Комиссия может взиматься вашим банком.
            </div>
          </div>
        )}

        {/* Step 2: Amount Input */}
        {step === 'amount' && (
            <div className="space-y-6">
                <div className="flex flex-col gap-2">
                    <label className="text-sm text-slate-400">Сумма пополнения (USD)</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">$</span>
                        <input 
                            type="number" 
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full bg-[#0f172a] border border-slate-700 rounded-xl p-4 pl-8 text-white text-lg focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-600"
                            placeholder="0.00"
                            autoFocus
                        />
                    </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <span className="text-2xl flex-shrink-0">{selectedMethod?.icon}</span>
                    <div>
                        <p className="text-sm font-medium text-blue-400">{selectedMethod?.name}</p>
                        <p className="text-xs text-slate-400">Конвертация по курсу ЦБ</p>
                    </div>
                </div>

                <button 
                    onClick={handleDepositClick}
                    disabled={!amount || Number(amount) <= 0}
                    className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg active:scale-[0.98]"
                >
                    Пополнить
                </button>
            </div>
        )}

        {/* Step 3: Processing */}
        {step === 'processing' && (
            <div className="flex flex-col items-center justify-center py-10 space-y-6">
                <div className="relative">
                    <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 rounded-full"></div>
                    <Loader2 className="animate-spin text-blue-500" size={56} />
                </div>
                <div className="text-center space-y-1">
                    <p className="text-white font-medium text-lg">Обработка платежа...</p>
                    <p className="text-slate-400 text-sm">Пожалуйста, не закрывайте окно</p>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};