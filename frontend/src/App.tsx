import React, { useState, useEffect } from 'react';
import { 
  Power, Home, ArrowLeft, Menu, 
  ChevronUp, ChevronDown, ChevronLeft, ChevronRight,
  Volume2, Volume1, VolumeX,
  Keyboard, MousePointer2
} from 'lucide-react';
import { remoteApi } from './api/client';
import StatusIndicator from './components/StatusIndicator';
import TouchPad from './components/TouchPad';
import TextInput from './components/TextInput';

const KEYCODES = {
  POWER: 26,
  HOME: 3,
  BACK: 4,
  MENU: 82,
  UP: 19,
  DOWN: 20,
  LEFT: 21,
  RIGHT: 22,
  OK: 23,
  VOL_UP: 24,
  VOL_DOWN: 25,
  MUTE: 164,
};

const App: React.FC = () => {
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'remote' | 'touchpad' | 'keyboard'>('remote');

  const checkStatus = async () => {
    try {
      const response = await remoteApi.getStatus();
      setConnected(response.data.connected);
    } catch (error) {
      setConnected(false);
    }
  };

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleAction = async (action: () => Promise<any>) => {
    setLoading(true);
    try {
      await action();
    } catch (error) {
      console.error('Action failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendKey = (keycode: number) => handleAction(() => remoteApi.sendKey(keycode));
  const sendText = (text: string) => handleAction(() => remoteApi.sendText(text));
  const sendSwipe = (x1: number, y1: number, x2: number, y2: number, duration: number) => 
    handleAction(() => remoteApi.sendSwipe(x1, y1, x2, y2, duration));

  const handleReconnect = () => handleAction(async () => {
    await remoteApi.connect();
    await checkStatus();
  });

  return (
    <div className="min-h-screen flex flex-col items-center p-4 md:p-8">
      <header className="w-full max-w-md flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-tv-primary">TV Remote</h1>
        <StatusIndicator connected={connected} loading={loading} onReconnect={handleReconnect} />
      </header>

      <main className="w-full max-w-md bg-tv-card/50 backdrop-blur-md rounded-[3rem] p-8 shadow-2xl border border-gray-800">
        {/* Navigation Tabs */}
        <div className="flex justify-around mb-8 bg-black/20 p-1 rounded-2xl">
          <button 
            onClick={() => setMode('remote')}
            className={`flex-1 flex justify-center py-2 rounded-xl transition-all ${mode === 'remote' ? 'bg-tv-primary text-tv-bg shadow-lg' : 'text-gray-400'}`}
          >
            <Power size={20} />
          </button>
          <button 
            onClick={() => setMode('touchpad')}
            className={`flex-1 flex justify-center py-2 rounded-xl transition-all ${mode === 'touchpad' ? 'bg-tv-primary text-tv-bg shadow-lg' : 'text-gray-400'}`}
          >
            <MousePointer2 size={20} />
          </button>
          <button 
            onClick={() => setMode('keyboard')}
            className={`flex-1 flex justify-center py-2 rounded-xl transition-all ${mode === 'keyboard' ? 'bg-tv-primary text-tv-bg shadow-lg' : 'text-gray-400'}`}
          >
            <Keyboard size={20} />
          </button>
        </div>

        {mode === 'remote' && (
          <div className="space-y-8">
            {/* Top Buttons */}
            <div className="flex justify-between items-center px-4">
              <button onClick={() => sendKey(KEYCODES.POWER)} className="remote-btn text-red-500">
                <Power size={24} />
              </button>
              <button onClick={() => sendKey(KEYCODES.MENU)} className="remote-btn text-gray-400">
                <Menu size={24} />
              </button>
            </div>

            {/* D-Pad */}
            <div className="flex justify-center">
              <div className="relative w-48 h-48 bg-tv-card rounded-full shadow-inner flex items-center justify-center border border-gray-800">
                <button onClick={() => sendKey(KEYCODES.UP)} className="absolute top-2 d-pad-btn rounded-t-full w-12 h-12">
                  <ChevronUp size={28} />
                </button>
                <button onClick={() => sendKey(KEYCODES.DOWN)} className="absolute bottom-2 d-pad-btn rounded-b-full w-12 h-12">
                  <ChevronDown size={28} />
                </button>
                <button onClick={() => sendKey(KEYCODES.LEFT)} className="absolute left-2 d-pad-btn rounded-l-full w-12 h-12">
                  <ChevronLeft size={28} />
                </button>
                <button onClick={() => sendKey(KEYCODES.RIGHT)} className="absolute right-2 d-pad-btn rounded-r-full w-12 h-12">
                  <ChevronRight size={28} />
                </button>
                <button 
                  onClick={() => sendKey(KEYCODES.OK)}
                  className="w-20 h-20 bg-tv-primary rounded-full text-tv-bg font-bold text-xl shadow-lg active:scale-95 transition-transform"
                >
                  OK
                </button>
              </div>
            </div>

            {/* Back & Home */}
            <div className="flex justify-center gap-8">
              <button onClick={() => sendKey(KEYCODES.BACK)} className="remote-btn w-16 h-16">
                <ArrowLeft size={24} />
              </button>
              <button onClick={() => sendKey(KEYCODES.HOME)} className="remote-btn w-16 h-16">
                <Home size={24} />
              </button>
            </div>

            {/* Volume Controls */}
            <div className="flex flex-col items-center bg-black/20 p-4 rounded-3xl gap-4">
              <div className="flex items-center gap-6">
                <button onClick={() => sendKey(KEYCODES.VOL_DOWN)} className="p-3 hover:text-tv-primary transition-colors">
                  <Volume1 size={28} />
                </button>
                <button onClick={() => sendKey(KEYCODES.MUTE)} className="p-3 hover:text-tv-primary transition-colors">
                  <VolumeX size={24} />
                </button>
                <button onClick={() => sendKey(KEYCODES.VOL_UP)} className="p-3 hover:text-tv-primary transition-colors">
                  <Volume2 size={28} />
                </button>
              </div>
              <span className="text-xs uppercase tracking-widest text-gray-500 font-bold">Volume</span>
            </div>
          </div>
        )}

        {mode === 'touchpad' && (
          <div className="space-y-6">
            <TouchPad 
              onSwipe={sendSwipe} 
              onTap={() => sendKey(KEYCODES.OK)} 
            />
            <div className="flex justify-center gap-4">
              <button onClick={() => sendKey(KEYCODES.BACK)} className="remote-btn flex-1 py-3 rounded-2xl">
                Back
              </button>
              <button onClick={() => sendKey(KEYCODES.HOME)} className="remote-btn flex-1 py-3 rounded-2xl">
                Home
              </button>
            </div>
          </div>
        )}

        {mode === 'keyboard' && (
          <div className="space-y-6">
            <TextInput onSend={sendText} disabled={!connected || loading} />
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => sendKey(KEYCODES.UP)} className="remote-btn py-3 rounded-xl col-span-2">Up</button>
              <button onClick={() => sendKey(KEYCODES.LEFT)} className="remote-btn py-3 rounded-xl">Left</button>
              <button onClick={() => sendKey(KEYCODES.RIGHT)} className="remote-btn py-3 rounded-xl">Right</button>
              <button onClick={() => sendKey(KEYCODES.DOWN)} className="remote-btn py-3 rounded-xl col-span-2">Down</button>
              <button onClick={() => sendKey(KEYCODES.OK)} className="remote-btn py-3 rounded-xl col-span-2 bg-tv-primary text-tv-bg">Enter</button>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-8 text-gray-600 text-xs">
        &copy; 2026 ADB TV Remote &bull; Tailscale Edition
      </footer>
    </div>
  );
};

export default App;
