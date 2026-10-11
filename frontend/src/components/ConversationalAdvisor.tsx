import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  User, 
  Sparkles, 
  CheckCircle2,
  HelpCircle,
  Clock
} from 'lucide-react';
import { 
  ChatMessage, 
  INITIAL_CHAT_MESSAGES, 
  getAiAgronomistResponse 
} from '../utils/conversationalAgent';
import { Language, TRANSLATIONS } from '../data/translations';

interface ConversationalAdvisorProps {
  currentLang: Language;
}

export const ConversationalAdvisor: React.FC<ConversationalAdvisorProps> = ({
  currentLang,
}) => {
  const t = TRANSLATIONS[currentLang];
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Avoid scrolling on initial page load / refresh
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    // Only scroll the internal chat container, never the window
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: currentLang === 'pa' ? 'ਹੁਣੇ' : 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      const response = getAiAgronomistResponse(text, currentLang);
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 600);
  };

  const sampleQuestions = currentLang === 'pa' ? [
    { icon: '🌧️', text: 'ਵੀਰਵਾਰ ਨੂੰ ਮੀਂਹ ਹੈ — ਕੀ ਅੱਜ ਟਿਊਬਵੈੱਲ ਚਲਾਵਾਂ?' },
    { icon: '📅', text: 'ਕੀ ਮੈਂ ਲੁਧਿਆਣੇ ਵਿੱਚ 12 ਜੂਨ ਨੂੰ ਪੀ.ਆਰ.-126 ਲਾ ਸਕਦਾ ਹਾਂ?' },
    { icon: '💰', text: 'ਪੂਸਾ-44 ਛੱਡ ਕੇ ਪੀ.ਆਰ.-126 ਲਾਉਣ ਨਾਲ ਕਿੰਨੇ ਰੁਪਏ ਬਚਣਗੇ?' },
    { icon: '🌾', text: 'ਪਾਣੀ-ਪਾਈਪ (AWD) ਕਿਵੇਂ ਬਣਾਈਏ ਅਤੇ ਖੇਤ ਵਿੱਚ ਕਿਵੇਂ ਲਾਈਏ?' },
  ] : [
    { icon: '🌧️', text: 'Rain expected Thursday — should I irrigate today?' },
    { icon: '📅', text: 'Can I transplant PR-126 on June 12 in Ludhiana?' },
    { icon: '💰', text: 'How much diesel & money saved shifting to PR-126?' },
    { icon: '🌾', text: 'How to make and install an AWD Pani-Pipe?' },
  ];

  return (
    <div className="ai-advisor-card">
      {/* Friendly Header */}
      <div className="ai-advisor-header">
        <div className="ai-header-title-row">
          <div className="ai-bot-avatar">
            <Bot size={22} className="text-field" />
          </div>
          <div>
            <h2 className="ai-card-title">
              {currentLang === 'pa' ? 'ਏ.ਆਈ. ਖੇਤੀਬਾੜੀ ਸਲਾਹਕਾਰ' : 'Ask AI Agronomist'}
            </h2>
            <p className="ai-card-subtitle">
              {currentLang === 'pa' 
                ? 'ਟਿਊਬਵੈੱਲ ਘੰਟੇ, ਬਿਜਲੀ ਬੱਚਤ, ਪੀਏਯੂ ਸਿਫਾਰਸ਼ਾਂ ਅਤੇ ਮੌਸਮ ਬਾਰੇ ਪੰਜਾਬੀ ਜਾਂ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਕੋਈ ਵੀ ਸਵਾਲ ਪੁੱਛੋ।'
                : 'Instant advice on tubewell hours, diesel savings, legal planting dates, and weather rain skips.'}
            </p>
          </div>
        </div>

        <div className="ai-badge-group">
          <span className="ai-verified-badge">
            <Sparkles size={13} className="text-mustard" />
            <span>PAU Ludhiana Guidelines</span>
          </span>
        </div>
      </div>

      {/* Common Questions Chips */}
      <div className="quick-inquiries-box">
        <span className="inquiries-label">
          <HelpCircle size={14} />
          {currentLang === 'pa' ? 'ਅਕਸਰ ਪੁੱਛੇ ਜਾਂਦੇ ਸਵਾਲ (ਕਲਿੱਕ ਕਰੋ):' : 'Common questions (click to ask):'}
        </span>
        <div className="inquiries-chips-row">
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              className="quick-question-chip"
              onClick={() => handleSend(q.text)}
            >
              <span>{q.icon}</span>
              <span>{q.text}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Feed */}
      <div className="ai-chat-thread" ref={chatContainerRef}>
        {messages.map(msg => (
          <div 
            key={msg.id} 
            className={`thread-message-row ${msg.sender === 'user' ? 'from-user' : 'from-bot'}`}
          >
            <div className="message-avatar-circle">
              {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>

            <div className="message-content-bubble">
              <div className="message-meta-header">
                <span className="author-name">
                  {msg.sender === 'user' 
                    ? (currentLang === 'pa' ? 'ਤੁਸੀਂ (ਕਿਸਾਨ)' : 'You (Farmer)') 
                    : 'JalFaasla AI Agronomist'}
                </span>
                <span className="message-timestamp">
                  <Clock size={11} /> {msg.timestamp}
                </span>
              </div>

              <div className="message-body-text">
                {msg.text.split('\n\n').map((para, i) => (
                  <p key={i}>
                    {para.split('**').map((part, pIdx) => (
                      pIdx % 2 === 1 ? <strong key={pIdx}>{part}</strong> : part
                    ))}
                  </p>
                ))}
              </div>

              {msg.metricsHighlight && (
                <div className="chat-key-metric-box">
                  <CheckCircle2 size={16} className="text-field" />
                  <span className="metric-name">{msg.metricsHighlight.label}:</span>
                  <span className="metric-value tabular-nums">{msg.metricsHighlight.value}</span>
                </div>
              )}

              {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                <div className="chat-followup-suggestions">
                  <span className="followup-heading">
                    {currentLang === 'pa' ? 'ਸਬੰਧਤ ਸਵਾਲ:' : 'Suggested follow-up:'}
                  </span>
                  <div className="followup-pills-wrap">
                    {msg.suggestedActions.map((sug, sIdx) => (
                      <button
                        key={sIdx}
                        type="button"
                        className="followup-action-pill"
                        onClick={() => handleSend(sug)}
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="thread-message-row from-bot">
            <div className="message-avatar-circle">
              <Bot size={16} />
            </div>
            <div className="message-content-bubble typing-state">
              <div className="pulse-dots-animation">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span className="typing-notice">
                {currentLang === 'pa' ? 'ਸਲਾਹਕਾਰ ਜਵਾਬ ਤਿਆਰ ਕਰ ਰਿਹਾ ਹੈ...' : 'Analyzing PAU guidelines...'}
              </span>
            </div>
          </div>
        )}

        
      </div>

      {/* Bottom Input Area */}
      <form 
        onSubmit={e => {
          e.preventDefault();
          handleSend(inputQuery);
        }}
        className="ai-chat-input-bar"
      >
        <input
          type="text"
          className="ai-input-field"
          placeholder={currentLang === 'pa' 
            ? 'ਇੱਥੇ ਆਪਣਾ ਸਵਾਲ ਲਿਖੋ (ਜਿਵੇਂ: ਮੀਂਹ ਕਦੋਂ ਪਵੇਗਾ, ਜਾਂ ਪੀਆਰ-126 ਦੇ ਲਾਭ)...' 
            : 'Type your question here (e.g. When will rain come, or PR-126 water savings)...'}
          value={inputQuery}
          onChange={e => setInputQuery(e.target.value)}
        />
        <button 
          type="submit" 
          className="ai-send-action-btn"
          disabled={!inputQuery.trim() || isTyping}
        >
          <Send size={16} />
          <span>{currentLang === 'pa' ? 'ਭੇਜੋ' : 'Send'}</span>
        </button>
      </form>
    </div>
  );
};
