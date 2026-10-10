import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  User, 
  Sparkles, 
  Lightbulb, 
  CornerDownLeft,
  CheckCircle2,
  Cpu
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
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    // Simulate Strands Agent / AWS Bedrock inference latency
    setTimeout(() => {
      const response = getAiAgronomistResponse(text, currentLang);
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <div className="card chat-card">
      <div className="card-header-row">
        <div className="title-with-badge">
          <h2 className="card-title">
            <Bot className="card-title-icon text-cyan" size={20} />
            {t.tabAiAdvisor}
          </h2>
          <span className="live-badge">Strands Agents SDK • AWS Bedrock Model</span>
        </div>

        <div className="agent-status-pill">
          <Cpu size={14} className="text-emerald" />
          <span>PAU Ludhiana Agronomy Fine-Tuned</span>
        </div>
      </div>

      {/* Suggested Quick Prompt Pills */}
      <div className="quick-prompts-row">
        <span className="prompts-label">
          <Lightbulb size={14} className="text-amber" />
          {currentLang === 'pa' ? 'ਤੁਰੰਤ ਸਵਾਲ ਪੁੱਛੋ:' : 'Common Farmer Inquiries:'}
        </span>
        <div className="prompts-list">
          <button
            type="button"
            className="prompt-pill"
            onClick={() => handleSend('I have 4 acres in Ludhiana, tube-well depth 18 m, and rain expected Thursday—when should I irrigate?')}
          >
            🌧️ 4 acres in Ludhiana, 18m tube-well, rain Thursday—when should I irrigate?
          </button>
          <button
            type="button"
            className="prompt-pill"
            onClick={() => handleSend('Can I transplant PR-126 on June 12 in Ludhiana?')}
          >
            ⚖️ Can I transplant PR-126 on June 12 in Ludhiana?
          </button>
          <button
            type="button"
            className="prompt-pill"
            onClick={() => handleSend('How much diesel will I save shifting from Pusa-44 to PR-126 with AWD?')}
          >
            🛢️ How much diesel saved shifting from Pusa-44 to PR-126 with AWD?
          </button>
          <button
            type="button"
            className="prompt-pill"
            onClick={() => handleSend('How to make an AWD Pani-Pipe?')}
          >
            🔧 How to make an AWD Pani-Pipe?
          </button>
        </div>
      </div>

      {/* Chat Messages Feed */}
      <div className="chat-messages-container">
        {messages.map(msg => (
          <div 
            key={msg.id} 
            className={`chat-bubble-row ${msg.sender === 'user' ? 'bubble-user' : 'bubble-agent'}`}
          >
            <div className="chat-avatar">
              {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>

            <div className="chat-bubble-content">
              <div className="chat-bubble-header">
                <span className="sender-name font-bold">
                  {msg.sender === 'user' ? 'You (Punjab Farmer)' : 'JalFaasla AI Agronomist'}
                </span>
                <span className="chat-time text-xs text-muted">{msg.timestamp}</span>
              </div>

              <div className="chat-text-markdown">
                {msg.text.split('\n\n').map((para, i) => (
                  <p key={i}>
                    {para.split('**').map((part, pIdx) => (
                      pIdx % 2 === 1 ? <strong key={pIdx}>{part}</strong> : part
                    ))}
                  </p>
                ))}
              </div>

              {msg.metricsHighlight && (
                <div className="chat-metric-highlight">
                  <CheckCircle2 size={16} className="text-emerald" />
                  <span className="metric-hl-label">{msg.metricsHighlight.label}:</span>
                  <span className="metric-hl-val font-mono font-bold text-emerald">{msg.metricsHighlight.value}</span>
                </div>
              )}

              {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                <div className="sub-suggestions-list">
                  {msg.suggestedActions.map((sug, sIdx) => (
                    <button
                      key={sIdx}
                      type="button"
                      className="sub-sug-btn"
                      onClick={() => handleSend(sug)}
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="chat-bubble-row bubble-agent">
            <div className="chat-avatar">
              <Bot size={16} />
            </div>
            <div className="chat-bubble-content typing-bubble">
              <div className="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span className="typing-text">AI Agronomist is analyzing PAU guidelines and weather models...</span>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Input Form */}
      <form 
        onSubmit={e => {
          e.preventDefault();
          handleSend(inputQuery);
        }}
        className="chat-input-bar"
      >
        <input
          type="text"
          className="chat-input-field"
          placeholder={currentLang === 'pa' 
            ? 'ਲੁਧਿਆਣਾ, ਸਿੰਚਾਈ, ਪੀ.ਆਰ.-126 ਜਾਂ ਕਾਨੂੰਨੀ ਮਿਤੀ ਬਾਰੇ ਕੋਈ ਵੀ ਸਵਾਲ ਪੁੱਛੋ...' 
            : currentLang === 'hi' 
            ? 'लुधियाना, सिंचाई, पीआर-126 या कानूनी नियमों के बारे में प्रश्न पूछें...' 
            : 'Ask about tube-well hours, AWD, weather rain skips, or legal sowing dates...'}
          value={inputQuery}
          onChange={e => setInputQuery(e.target.value)}
        />
        <button 
          type="submit" 
          className="btn btn-primary chat-send-btn"
          disabled={!inputQuery.trim() || isTyping}
        >
          <Send size={16} />
          <span>Send</span>
        </button>
      </form>
    </div>
  );
};
