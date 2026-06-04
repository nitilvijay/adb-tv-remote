import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface TextInputProps {
  onSend: (text: string) => void;
  disabled: boolean;
}

const TextInput: React.FC<TextInputProps> = ({ onSend, disabled }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSend(text);
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type text to send..."
        disabled={disabled}
        className="flex-1 bg-tv-card border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-tv-primary disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={disabled || !text.trim()}
        className="p-2 rounded-lg bg-tv-primary text-tv-bg hover:bg-opacity-80 disabled:opacity-50 transition-colors"
      >
        <Send size={20} />
      </button>
    </form>
  );
};

export default TextInput;
