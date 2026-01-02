import React, { useState, useEffect } from 'react';
import { X, ArrowDown, Loader2 } from './Icons';
import { Asset } from '../types';

interface SwapModalProps {
  isOpen: boolean;
  onClose: () => void;
  assets: Asset[];
  onSwap: (fromId: string, toId: string, amount: number) => Promise<void>;
}

export const SwapModal: React.FC<SwapModalProps> = ({ isOpen, onClose, assets, onSwap }) => {
  // Default: USDT -> TON
  const [fromAssetId, setFromAssetId] = useState('tether');
  const [toAssetId, setToAssetId] = useState('toncoin');
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Reset when opening
  useEffect(() => {
    if (isOpen) {
      setAmount('');
      setIsProcessing(false);
      setFromAssetId('tether');
      setToAssetId('toncoin');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const fromAsset = assets.find(a => a.id === fromAssetId) || assets[0];
  const toAsset = assets.find(a => a.id === toAssetId) || assets[1];

  // Calculate Exchange Rate
  // Rate = Price From / Price To
  const rate = fromAsset.priceUsd / toAsset.priceUsd;
  const receiveAmount = amount && !isNaN(Number(amount)) 
    ? (Number(amount) * rate).toFixed(4) 
    : '0.00';

  const handleSwitch = () => {
    setFromAssetId(toAssetId);
    setToAssetId(fromAssetId);
    setAmount('');
  };

  const handleMax = () => {
    setAmount(fromAsset.balance.toString());
  };

  const handleSwapClick = async () => {
    if (!amount || Number(amount) <= 0 || Number(amount) > fromAsset.balance) return;
    
    setIsProcessing(true);
    await onSwap(fromAssetId, toAssetId, Number(amount));
    // Modal closing is handled by parent usually, but we stop processing here just in case
    setIsProcessing(false);
  };

  const isInsufficientBalance = Number(amount) > fromAsset.balance;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm transition-opacity duration-300">
      <div className="w-full max-w-md bg-[#1e293b] rounded-t-2xl sm:rounded-2xl p-6 shadow-2xl transform transition-all duration-300">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Обмен</h2>
          <button onClick={onClose} disabled={isProcessing} className="p-2 rounded-full hover:bg-slate-700 text-slate-400 transition-colors">
            <X size={24} />
          </button>
        </div>

        {isProcessing ? (
           <div className="flex flex-col items-center justify-center py-10 space-y-6">
              <div className="relative">
                  <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 rounded-full"></div>
                  <Loader2 className="animate-spin text-blue-500" size={56} />
              </div>
              <div className="text-center space-y-1">
                  <p className="text-white font-medium text-lg">Обмен валюты...</p>
                  <p className="text-slate-400 text-sm">Пожалуйста, подождите</p>
              </div>
          </div>
        ) : (
          <div className="space-y-4">
            
            {/* FROM Input */}
            <div className="bg-[#0f172a] p-4 rounded-xl border border-slate-700">
              <div className="flex justify-between mb-2">
                <span className="text-xs text-slate-400">Отдаете</span>
                <span className="text-xs text-slate-400">Баланс: {fromAsset.balance.toFixed(4)} {fromAsset.symbol}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className={`w-full bg-transparent text-2xl font-bold outline-none placeholder:text-slate-600 ${isInsufficientBalance ? 'text-red-400' : 'text-white'}`}
                />
                <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-lg shrink-0">
                  <div className={`w-5 h-5 rounded-full ${fromAsset.iconColor}`}></div>
                  <span className="font-bold text-sm">{fromAsset.symbol}</span>
                </div>
              </div>
              <div className="flex justify-between mt-2">
                 <span className="text-xs text-red-400 h-4 block">{isInsufficientBalance ? 'Недостаточно средств' : ''}</span>
                 <button onClick={handleMax} className="text-xs font-bold text-blue-400 hover:text-blue-300 uppercase tracking-wide">MAX</button>
              </div>
            </div>

            {/* Switch Button */}
            <div className="flex justify-center -my-2 relative z-10">
              <button 
                onClick={handleSwitch}
                className="bg-[#1e293b] border border-slate-700 p-2 rounded-full text-blue-400 hover:text-white hover:bg-slate-700 transition-all shadow-lg"
              >
                <ArrowDown size={20} />
              </button>
            </div>

            {/* TO Input (Read Only) */}
            <div className="bg-[#0f172a] p-4 rounded-xl border border-slate-700">
              <div className="flex justify-between mb-2">
                <span className="text-xs text-slate-400">Получаете (примерно)</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <input 
                  type="text" 
                  readOnly
                  value={receiveAmount}
                  className="w-full bg-transparent text-2xl font-bold outline-none text-slate-300 cursor-default"
                />
                <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-lg shrink-0">
                  <div className={`w-5 h-5 rounded-full ${toAsset.iconColor}`}></div>
                  <span className="font-bold text-sm">{toAsset.symbol}</span>
                </div>
              </div>
               <div className="mt-2 text-xs text-slate-500 text-right">
                1 {fromAsset.symbol} ≈ {rate.toFixed(4)} {toAsset.symbol}
               </div>
            </div>

            <button 
              onClick={handleSwapClick}
              disabled={!amount || Number(amount) <= 0 || isInsufficientBalance}
              className="w-full mt-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg active:scale-[0.98]"
            >
              Обменять
            </button>
          </div>
        )}
      </div>
    </div>
  );
};