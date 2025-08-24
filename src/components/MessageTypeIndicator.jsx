import React from 'react';

const MessageTypeIndicator = ({ type, count, percentage }) => {
  const typeStyles = {
    sent: {
      icon: '📤',
      label: 'Messages Sent',
      color: 'bg-blue-500/20 border-blue-400/50 text-blue-300',
      barColor: 'bg-gradient-to-r from-blue-500 to-blue-400'
    },
    received: {
      icon: '📥',
      label: 'Messages Received',
      color: 'bg-green-500/20 border-green-400/50 text-green-300',
      barColor: 'bg-gradient-to-r from-green-500 to-green-400'
    },
    long: {
      icon: '📝',
      label: 'Long Messages',
      color: 'bg-purple-500/20 border-purple-400/50 text-purple-300',
      barColor: 'bg-gradient-to-r from-purple-500 to-purple-400'
    },
    short: {
      icon: '💬',
      label: 'Short Messages',
      color: 'bg-cyan-500/20 border-cyan-400/50 text-cyan-300',
      barColor: 'bg-gradient-to-r from-cyan-500 to-cyan-400'
    }
  };

  const style = typeStyles[type] || typeStyles.sent;

  return (
    <div className={`p-3 rounded-lg border backdrop-blur-sm ${style.color}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{style.icon}</span>
          <span className="text-sm font-medium">{style.label}</span>
        </div>
        <span className="text-xs font-bold">{count}</span>
      </div>
      <div className="w-full bg-gray-700/50 rounded-full h-2">
        <div 
          className={`h-2 rounded-full ${style.barColor} transition-all duration-1000 ease-out`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="text-xs text-right mt-1 opacity-75">{percentage.toFixed(1)}%</div>
    </div>
  );
};

export default MessageTypeIndicator;
