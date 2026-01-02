import React, { useState, useEffect } from 'react';
import { X, Loader2, Scan } from './Icons';
import { Asset } from '../types';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  assets: Asset[];
  onWithdraw: (assetId: string, amount: number, address: string) => Promise<void>;
}

export const WithdrawModal: React.FC<WithdrawModalProps> = ({ isOpen, onClose, assets, onWithdraw }) => {
  const [selectedAssetId, setSelectedAssetId] = useState('toncoin');
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Reset when opening
  useEffect(() => {
    if (isOpen) {
      setAddress('');
      setAmount('');
      setIsProcessing(false);
      setSelectedAssetId('toncoin');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const selectedAsset = assets.find(a => a.id === selectedAssetId) || assets[1];

  const handleMax = () => {
    setAmount(selectedAsset.balance.toString());
  };

  const handleWithdrawClick = async () => {
    if (!amount || !address || Number(amount) <= 0 || Number(amount) > selectedAsset.balance) return;
    
    setIsProcessing(true);
    await onWithdraw(selectedAssetId, Number(amount), address);
    setIsProcessing(false);
  };

  const isInsufficientBalance = Number(amount) > selectedAsset.balance;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm transition-opacity duration-300">
      <div className="w-full max-w-md bg-[#1e293b] rounded-t-2xl sm:rounded-2xl p-6 shadow-2xl transform transition-all duration-300">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Вывод средств</h2>
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
                  <p className="text-white font-medium text-lg">Отправка средств...</p>
                  <p className="text-slate-400 text-sm">Проверка транзакции в блокчейне</p>
              </div>
          </div>
        ) : (
          <div className="space-y-4">
            
            {/* Asset Selection */}
            <div className="flex gap-2 mb-2">
                {assets.map(asset => (
                    <button
                        key={asset.id}
                        onClick={() => setSelectedAssetId(asset.id)}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-all ${
                            selectedAssetId === asset.id 
                            ? 'bg-blue-600 border-blue-500 text-white shadow-lg' 
                            : 'bg-[#0f172a] border-slate-700 text-slate-400 hover:bg-slate-800'
                        }`}
                    >
                         <div className={`w-5 h-5 rounded-full ${asset.iconColor} flex items-center justify-center text-[10px] text-white`}>
                           {asset.symbol[0]}
                         </div>
                        <span className="font-bold">{asset.symbol}</span>
                    </button>
                ))}
            </div>

            {/* Address Input */}
            <div className="space-y-2">
                <label className="text-sm text-slate-400 ml-1">Адрес кошелька TON</label>
                <div className="relative">
                    <input 
                        type="text" 
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="UQ..."
                        className="w-full bg-[#0f172a] border border-slate-700 rounded-xl p-4 pr-12 text-white outline-none focus:border-blue-500 transition-colors font-mono text-sm placeholder:text-slate-600"
                    />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg">
                        <Scan size={18} />
                    </button>
                </div>
            </div>

            {/* Amount Input */}
            <div className="space-y-2">
                <div className="flex justify-between ml-1">
                     <label className="text-sm text-slate-400">Сумма</label>
                     <span className="text-xs text-slate-500">Доступно: {selectedAsset.balance.toFixed(4)} {selectedAsset.symbol}</span>
                </div>
                
                <div className="relative">
                    <input 
                        type="number" 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className={`w-full bg-[#0f172a] border border-slate-700 rounded-xl p-4 pr-20 text-white text-lg outline-none focus:border-blue-500 transition-colors placeholder:text-slate-600 ${isInsufficientBalance ? 'border-red-500 text-red-400' : ''}`}
                    />
                    <button 
                        onClick={handleMax}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-blue-400 hover:text-blue-300 bg-blue-500/10 px-3 py-1.5 rounded-lg transition-colors"
                    >
                        MAX
                    </button>
                </div>
                 {isInsufficientBalance && (
                    <p className="text-xs text-red-400 ml-1">Недостаточно средств для вывода</p>
                )}
            </div>

            <button 
              onClick={handleWithdrawClick}
              disabled={!amount || !address || Number(amount) <= 0 || isInsufficientBalance}
              className="w-full mt-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg active:scale-[0.98]"
            >
              Отправить
            </button>
          </div>
        )}
      </div>
    </div>
  );
};