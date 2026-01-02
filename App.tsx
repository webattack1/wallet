import React, { useState, useEffect } from 'react';
import { 
  Scan, 
  Settings, 
  Sun, 
  Eye, 
  EyeOff, 
  ArrowDownLeft, 
  ArrowUpRight, 
  ArrowRightLeft, 
  RefreshCw,
  ChevronRight,
  CheckCircle2,
  X
} from './components/Icons';
import { INITIAL_ASSETS, USER_NICKNAME } from './constants';
import { Asset, PaymentMethod } from './types';
import { getLatestMarketData } from './services/marketService';
import { DepositModal } from './components/DepositModal';
import { SwapModal } from './components/SwapModal';
import { WithdrawModal } from './components/WithdrawModal';
import { SettingsModal } from './components/SettingsModal';

const App: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);
  
  // Modal States
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isSwapOpen, setIsSwapOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [rubRate, setRubRate] = useState(92.5); // Mock USD/RUB rate
  const [notification, setNotification] = useState<{ message: string; visible: boolean } | null>(null);

  // Main currency display (RUB)
  const totalBalanceUsd = assets.reduce((acc, asset) => acc + (asset.balance * asset.priceUsd), 0);
  const totalBalanceRub = totalBalanceUsd * rubRate;

  // Notification Timer
  useEffect(() => {
    if (notification?.visible) {
      const timer = setTimeout(() => {
        setNotification(prev => prev ? { ...prev, visible: false } : null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Refresh market data every 10 seconds
  useEffect(() => {
    const fetchData = async () => {
      try {
        const updatedAssets = await getLatestMarketData(assets);
        setAssets(updatedAssets);
        // Simulate RUB rate fluctuation slightly
        setRubRate(prev => prev + (Math.random() - 0.5) * 0.5);
      } catch (error) {
        console.error("Failed to fetch market data", error);
      }
    };

    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [assets]);

  const handleDeposit = async (amount: number, method: PaymentMethod) => {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Update USDT balance
    setAssets(prevAssets => prevAssets.map(asset => {
      if (asset.symbol === 'USDT') {
        return { ...asset, balance: asset.balance + amount };
      }
      return asset;
    }));

    setIsDepositOpen(false);
    
    // Show notification
    const formattedAmount = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    setNotification({ 
      message: `Пополнение на: ${formattedAmount}`, 
      visible: true 
    });
  };

  const handleSwap = async (fromId: string, toId: string, amount: number) => {
    // Find prices to calculate exactly how much is received at transaction time
    const fromAsset = assets.find(a => a.id === fromId);
    const toAsset = assets.find(a => a.id === toId);

    if (!fromAsset || !toAsset) return;

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const rate = fromAsset.priceUsd / toAsset.priceUsd;
    const receivedAmount = amount * rate;

    setAssets(prevAssets => prevAssets.map(asset => {
      if (asset.id === fromId) {
        return { ...asset, balance: asset.balance - amount };
      }
      if (asset.id === toId) {
        return { ...asset, balance: asset.balance + receivedAmount };
      }
      return asset;
    }));

    setIsSwapOpen(false);
    setNotification({
      message: `Обмен ${amount} ${fromAsset.symbol} на ${receivedAmount.toFixed(4)} ${toAsset.symbol} успешен`,
      visible: true
    });
  };

  const handleWithdraw = async (assetId: string, amount: number, address: string) => {
    const asset = assets.find(a => a.id === assetId);
    if (!asset) return;

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    setAssets(prevAssets => prevAssets.map(a => {
        if (a.id === assetId) {
            return { ...a, balance: a.balance - amount };
        }
        return a;
    }));

    setIsWithdrawOpen(false);
    setNotification({
        message: `Вывод ${amount} ${asset.symbol} на ${address.slice(0, 4)}...${address.slice(-4)} успешно выполнен`,
        visible: true
    });
  };

  const formatCurrency = (value: number, currency: 'USD' | 'RUB') => {
    if (isBalanceHidden) return '••••••';
    
    if (currency === 'RUB') {
      return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(value);
    }
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex justify-center font-sans">
      <div className="w-full max-w-md bg-[#0f172a] flex flex-col relative">
        
        {/* Header */}
        <header className="flex justify-between items-center p-4 pt-6">
          <button className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition">
            <Scan size={20} />
          </button>

          <div className="flex items-center gap-2 bg-slate-800/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700/50">
             {/* Placeholder Avatar */}
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-[10px] font-bold">
               {USER_NICKNAME[0].toUpperCase()}
            </div>
            <span className="text-sm font-medium tracking-wide text-slate-200 uppercase">{USER_NICKNAME}</span>
          </div>

          <div className="flex gap-3">
            <button className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition">
              <Sun size={20} />
            </button>
            <button 
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <Settings size={20} />
            </button>
          </div>
        </header>

        {/* Main Balance Section */}
        <div className="flex flex-col items-center mt-6 mb-8">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-bold tracking-tight text-white">
              {formatCurrency(totalBalanceRub, 'RUB')}
            </h1>
            <button 
              onClick={() => setIsBalanceHidden(!isBalanceHidden)}
              className="text-slate-500 hover:text-slate-300 transition"
            >
              {isBalanceHidden ? <EyeOff size={24} /> : <Eye size={24} />}
            </button>
          </div>
          <p className="text-slate-400 mt-2 text-sm font-medium">Total balance in RUB</p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-4 gap-4 px-4 mb-8">
          <ActionButton 
            icon={<ArrowDownLeft size={24} />} 
            label="Deposit" 
            onClick={() => setIsDepositOpen(true)} 
          />
          <ActionButton 
            icon={<ArrowUpRight size={24} />} 
            label="Withdraw" 
            onClick={() => setIsWithdrawOpen(true)} 
          />
          <ActionButton 
            icon={<ArrowRightLeft size={24} />} 
            label="Swap" 
            onClick={() => setIsSwapOpen(true)} 
          />
          <ActionButton 
            icon={<RefreshCw size={24} />} 
            label="Exchange" 
            onClick={() => {}} 
          />
        </div>

        {/* Banner */}
        <div className="px-4 mb-8">
          <div className="bg-[#1e293b] rounded-2xl p-4 flex items-center justify-between border-l-4 border-yellow-500 shadow-lg relative overflow-hidden group cursor-pointer hover:bg-slate-800 transition">
             {/* Decorative element */}
             <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/10 rounded-full -mr-10 -mt-10 blur-xl"></div>

            <div className="flex items-center gap-4 z-10">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg text-black font-black text-xl">
                B
              </div>
              <div>
                <h3 className="font-bold text-yellow-500">Instant swaps</h3>
                <p className="text-xs text-slate-300 mt-0.5 leading-tight max-w-[180px]">
                  Swap cryptocurrency in a few clicks.
                </p>
              </div>
            </div>
            <ChevronRight className="text-slate-500 group-hover:text-yellow-500 transition-colors z-10" size={20} />
          </div>
          
          {/* Pagination dots (static visual) */}
          <div className="flex justify-center gap-2 mt-4">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-600"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-slate-600"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-slate-600"></div>
          </div>
        </div>

        {/* Assets List */}
        <div className="flex-1 bg-[#0f172a] px-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-slate-300">Assets</h2>
            <button className="text-sm text-blue-400 hover:text-blue-300 transition">
              Hide small balances
            </button>
          </div>

          <div className="space-y-1">
            {assets.map((asset) => (
              <AssetRow 
                key={asset.id} 
                asset={asset} 
                rubRate={rubRate} 
                isHidden={isBalanceHidden} 
              />
            ))}
          </div>
        </div>

        {/* Notification Toast */}
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[60] transition-all duration-500 ${notification?.visible ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0'}`}>
          <div className="bg-[#1e293b] border border-green-500/30 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3">
            <div className="bg-green-500/20 p-2 rounded-full text-green-500">
               <CheckCircle2 size={24} />
            </div>
            <div>
              <h4 className="font-bold text-sm text-green-400">Успешно!</h4>
              <p className="text-sm">{notification?.message}</p>
            </div>
          </div>
        </div>

        {/* Modals */}
        <DepositModal 
          isOpen={isDepositOpen} 
          onClose={() => setIsDepositOpen(false)} 
          onDeposit={handleDeposit} 
        />
        
        <SwapModal 
          isOpen={isSwapOpen}
          onClose={() => setIsSwapOpen(false)}
          assets={assets}
          onSwap={handleSwap}
        />

        <WithdrawModal
          isOpen={isWithdrawOpen}
          onClose={() => setIsWithdrawOpen(false)}
          assets={assets}
          onWithdraw={handleWithdraw}
        />

        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />

      </div>
    </div>
  );
};

// Sub-components for cleaner App.tsx

const ActionButton: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void }> = ({ icon, label, onClick }) => (
  <button onClick={onClick} className="flex flex-col items-center gap-2 group">
    <div className="w-14 h-14 rounded-full bg-blue-500/10 sm:bg-[#1e293b] flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300 shadow-md border border-slate-700/50 group-hover:border-blue-500">
      {icon}
    </div>
    <span className="text-xs font-medium text-blue-400 group-hover:text-blue-300 transition-colors">{label}</span>
  </button>
);

const AssetRow: React.FC<{ asset: Asset; rubRate: number; isHidden: boolean }> = ({ asset, rubRate, isHidden }) => {
  const valueUsd = asset.balance * asset.priceUsd;
  const valueRub = valueUsd * rubRate;

  return (
    <div className="flex items-center justify-between p-3 py-4 hover:bg-slate-800/50 rounded-xl transition-colors cursor-pointer group">
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div className={`w-10 h-10 rounded-full ${asset.iconColor} flex items-center justify-center text-white shadow-lg`}>
          {asset.symbol === 'USDT' ? (
             <span className="font-bold text-sm">₮</span>
          ) : asset.symbol === 'TON' ? (
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M12 2L3 7L12 22L21 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
             </svg>
          ) : (
            <span className="font-bold text-xs">{asset.symbol[0]}</span>
          )}
        </div>
        
        {/* Name & Price */}
        <div>
          <h4 className="font-bold text-white text-sm">{asset.name}</h4>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>${asset.priceUsd.toFixed(2)}</span>
            <span className={asset.change24h >= 0 ? 'text-green-400' : 'text-red-400'}>
              {asset.change24h >= 0 ? '+' : ''}{asset.change24h}%
            </span>
          </div>
        </div>
      </div>

      {/* Balance */}
      <div className="text-right">
        <p className="font-bold text-white text-sm">
          {isHidden ? '••••' : `${asset.balance.toFixed(2)} ${asset.symbol}`}
        </p>
        <p className="text-xs text-slate-500 mt-0.5">
          {isHidden ? '••••' : `${Math.round(valueRub).toLocaleString('ru-RU')} ₽`}
        </p>
      </div>
    </div>
  );
};

export default App;