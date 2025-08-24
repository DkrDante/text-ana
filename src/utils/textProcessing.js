// Text processing utilities for conversation analysis

export const detectSpeakers = (text) => {
  // Common patterns that indicate different speakers
  const speakerPatterns = [
    /^Me:/i,
    /^Them:/i,
    /^Him:/i,
    /^Her:/i,
    /^[A-Z][a-z]+:/,  // Name patterns like "John:", "Sarah:"
    /^You:/i,
    /^\d{1,2}:\d{2}\s*(AM|PM)?/i, // Time stamps
    /^\[\d{1,2}:\d{2}\]/i, // Bracketed timestamps
  ];

  const lines = text.split('\n').filter(line => line.trim());
  const messages = [];
  let currentSpeaker = 'unknown';
  let messageCount = { user: 0, other: 0, unknown: 0 };

  lines.forEach((line, index) => {
    let speaker = currentSpeaker;
    let content = line.trim();

    // Check for speaker indicators
    for (const pattern of speakerPatterns) {
      if (pattern.test(line)) {
        const match = line.match(pattern);
        if (match) {
          speaker = match[0].replace(':', '').trim();
          content = line.replace(match[0], '').trim();
          currentSpeaker = speaker;
          break;
        }
      }
    }

    // Classify speaker type
    const isUser = /^(me|you)$/i.test(speaker);
    const isOther = !isUser && speaker !== 'unknown';
    
    if (isUser) messageCount.user++;
    else if (isOther) messageCount.other++;
    else messageCount.unknown++;

    messages.push({
      index,
      speaker,
      content,
      type: isUser ? 'user' : isOther ? 'other' : 'unknown',
      length: content.length,
      timestamp: extractTimestamp(line)
    });
  });

  return { messages, messageCount };
};

export const extractTimestamp = (text) => {
  const timePatterns = [
    /\d{1,2}:\d{2}\s*(AM|PM)?/i,
    /\[\d{1,2}:\d{2}\]/i,
    /\d{1,2}\/\d{1,2}\/\d{2,4}/
  ];

  for (const pattern of timePatterns) {
    const match = text.match(pattern);
    if (match) return match[0];
  }
  return null;
};

export const analyzeTextMetrics = (text) => {
  const words = text.trim().split(/\s+/).length;
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, '').length;
  const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length;
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim()).length;
  const emojis = (text.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu) || []).length;
  
  const averageWordsPerSentence = sentences > 0 ? (words / sentences).toFixed(1) : 0;
  const readingTime = Math.max(1, Math.ceil(words / 200)); // Average reading speed
  
  return {
    words,
    characters,
    charactersNoSpaces,
    sentences,
    paragraphs,
    emojis,
    averageWordsPerSentence,
    readingTime
  };
};

export const preserveFormatting = (text) => {
  // Preserve line breaks, emojis, and special characters
  return text
    .replace(/\n/g, '<br>')
    .replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;')
    .trim();
};

export const highlightSpeakers = (text, speakerData) => {
  if (!speakerData || !speakerData.messages) return text;

  let highlightedText = text;
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
  const speakerColors = {};
  let colorIndex = 0;

  speakerData.messages.forEach(message => {
    if (message.speaker !== 'unknown' && !speakerColors[message.speaker]) {
      speakerColors[message.speaker] = colors[colorIndex % colors.length];
      colorIndex++;
    }
  });

  // Apply highlighting
  Object.entries(speakerColors).forEach(([speaker, color]) => {
    const regex = new RegExp(`^${speaker}:`, 'gmi');
    highlightedText = highlightedText.replace(regex, 
      `<span style="color: ${color}; font-weight: bold;">${speaker}:</span>`
    );
  });

  return highlightedText;
};

export const getConversationStats = (speakerData) => {
  if (!speakerData || !speakerData.messages) return null;

  const { messages, messageCount } = speakerData;
  const totalMessages = messages.length;
  
  const stats = {
    totalMessages,
    messageDistribution: {
      user: messageCount.user,
      other: messageCount.other,
      unknown: messageCount.unknown
    },
    percentages: {
      user: totalMessages > 0 ? (messageCount.user / totalMessages) * 100 : 0,
      other: totalMessages > 0 ? (messageCount.other / totalMessages) * 100 : 0,
      unknown: totalMessages > 0 ? (messageCount.unknown / totalMessages) * 100 : 0
    },
    averageMessageLength: {
      user: 0,
      other: 0,
      overall: 0
    }
  };

  // Calculate average message lengths
  const userMessages = messages.filter(m => m.type === 'user');
  const otherMessages = messages.filter(m => m.type === 'other');
  
  if (userMessages.length > 0) {
    stats.averageMessageLength.user = userMessages.reduce((sum, m) => sum + m.length, 0) / userMessages.length;
  }
  
  if (otherMessages.length > 0) {
    stats.averageMessageLength.other = otherMessages.reduce((sum, m) => sum + m.length, 0) / otherMessages.length;
  }
  
  if (totalMessages > 0) {
    stats.averageMessageLength.overall = messages.reduce((sum, m) => sum + m.length, 0) / totalMessages;
  }

  return stats;
};
