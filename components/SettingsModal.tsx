import React, { useState } from 'react';
import { X, Copy, Check, Wallet } from './Icons';
import { USER_NICKNAME, USER_WALLET_ADDRESS } from '../constants';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(USER_WALLET_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm transition-opacity duration-300">
      <div className="w-full max-w-md bg-[#1e293b] rounded-t-2xl sm:rounded-2xl p-6 shadow-2xl transform transition-all duration-300">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Настройки</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-700 text-slate-400 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Profile Section */}
        <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-3xl font-bold mb-3 shadow-lg">
                {USER_NICKNAME[0].toUpperCase()}
            </div>
            <h3 className="text-xl font-bold text-white">@{USER_NICKNAME}</h3>
            <p className="text-slate-400 text-sm">Личный кошелек</p>
        </div>

        {/* Wallet Address Section */}
        <div className="bg-[#0f172a] p-4 rounded-xl border border-slate-700 space-y-2">
            <div className="flex items-center gap-2 text-blue-400 mb-1">
                <Wallet size={18} />
                <span className="text-sm font-semibold">Ваш адрес TON</span>
            </div>
            <div className="break-all font-mono text-sm text-slate-300 leading-relaxed bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                {USER_WALLET_ADDRESS}
            </div>
            <button 
                onClick={handleCopy}
                className="w-full flex items-center justify-center gap-2 py-3 mt-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white font-medium transition-colors"
            >
                {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
                {copied ? 'Скопировано' : 'Копировать адрес'}
            </button>
        </div>

        <div className="mt-8">
            <button 
                onClick={onClose}
                className="w-full py-4 bg-slate-800 hover:bg-slate-700 rounded-xl text-white font-medium transition-colors"
            >
                Закрыть
            </button>
        </div>
      </div>
    </div>
  );
};