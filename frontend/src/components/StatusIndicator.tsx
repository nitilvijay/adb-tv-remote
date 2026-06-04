import React from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

interface StatusIndicatorProps {
  connected: boolean;
  loading: boolean;
  onReconnect: () => void;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ connected, loading, onReconnect }) => {
  return (
    <div className="flex items-center gap-2 p-2 rounded-lg bg-tv-card shadow-md">
      {connected ? (
        <Wifi className="text-tv-secondary" size={20} />
      ) : (
        <WifiOff className="text-red-500" size={20} />
      )}
      <span className="text-sm font-medium">
        {connected ? 'Connected' : 'Disconnected'}
      </span>
      <button 
        onClick={onReconnect}
        disabled={loading}
        className={`ml-2 p-1 rounded-full hover:bg-gray-700 transition-colors ${loading ? 'animate-spin' : ''}`}
      >
        <RefreshCw size={16} />
      </button>
    </div>
  );
};

export default StatusIndicator;
