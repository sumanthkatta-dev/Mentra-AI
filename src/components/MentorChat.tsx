import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Send, Loader2, Bot, AlertCircle, CornerDownLeft, RotateCcw } from 'lucide-react';
import { auth } from '../lib/firebase';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  createdAt?: string;
}

interface MentorChatProps {
  roadmapId?: string;
  targetRole: string;
}

export const MentorChat: React.FC<MentorChatProps> = ({ roadmapId, targetRole }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingHistory, setIsFetchingHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const chatScrollContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isInitialMount = useRef(true);
  const prevMessagesCountRef = useRef(0);

  // Scroll ONLY the internal chat container, NEVER the window or page
  const scrollToBottom = (smooth = true) => {
    if (chatScrollContainerRef.current) {
      chatScrollContainerRef.current.scrollTo({
        top: chatScrollContainerRef.current.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto',
      });
    }
  };

  // Fetch past conversation history from Firestore sub-collection via GET /api/chat
  useEffect(() => {
    if (!roadmapId) return;

    let isMounted = true;
    const loadHistory = async () => {
      try {
        setIsFetchingHistory(true);
        setError(null);
        const user = auth.currentUser;
        if (!user) return;

        const token = await user.getIdToken();
        const res = await fetch(`/api/chat?roadmapId=${encodeURIComponent(roadmapId)}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          if (res.status === 404 || res.status === 403) {
            return;
          }
          throw new Error('Failed to load past chat history.');
        }

        const data = await res.json();
        if (isMounted && Array.isArray(data.messages)) {
          setMessages(data.messages);
        }
      } catch (err: any) {
        console.warn('Could not fetch chat history:', err);
      } finally {
        if (isMounted) {
          setIsFetchingHistory(false);
        }
      }
    };

    loadHistory();
    return () => {
      isMounted = false;
    };
  }, [roadmapId]);

  // Only auto-scroll the internal container when new messages are actively received/sent, never on initial mount
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevMessagesCountRef.current = messages.length;
      return;
    }

    if (messages.length > prevMessagesCountRef.current || isLoading) {
      scrollToBottom(true);
    }
    prevMessagesCountRef.current = messages.length;
  }, [messages.length, isLoading]);

  const handleSendMessage = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const textToSend = (customText || inputValue).trim();
    if (!textToSend || isLoading) return;

    if (!roadmapId) {
      setError('Please save or generate a roadmap document before initiating chat.');
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      setError('You must be signed in with Google to chat with your AI Mentor.');
      return;
    }

    // Optimistic user message addition
    const tempUserMsgId = `temp-user-${Date.now()}`;
    const optimisticUserMessage: ChatMessage = {
      id: tempUserMsgId,
      role: 'user',
      content: textToSend,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticUserMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          roadmapId,
          message: textToSend,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${response.status}`);
      }

      const result = await response.json();
      const aiContent = result.response || result.aiMessage?.content;

      if (!aiContent) {
        throw new Error('Received empty response from AI Mentor.');
      }

      const aiMessage: ChatMessage = {
        id: result.aiMessage?.id || `ai-${Date.now()}`,
        role: 'model',
        content: aiContent,
        createdAt: result.aiMessage?.createdAt || new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setError(err.message || 'Failed to send message to AI Mentor. Please try again.');
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const quickPrompts = [
    'How should I break down Week 1 into daily 2-hour study blocks?',
    'Provide a minimal coding example for the Week 1 milestone project.',
    'What are 3 critical interview questions tested on these skill gaps?',
  ];

  return (
    <section
      id="ai-mentor-chat-section"
      aria-label="Chat with your AI Mentor"
      className="rounded-2xl bg-[#1e293b] border border-slate-700/60 p-6 sm:p-8 shadow-xl text-slate-100 transition-all"
    >
      {/* Header matching Lunar Chrome Design System */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-700/40">
        <div className="flex items-center gap-3">
          {/* Small Neon Mint AI Icon */}
          <div className="w-10 h-10 rounded-xl bg-[#00F5A0]/10 border border-[#00F5A0]/30 flex items-center justify-center flex-shrink-0 shadow-sm">
            <Sparkles className="w-5 h-5 text-[#00F5A0]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                Chat with your AI Mentor
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold tracking-wide uppercase bg-[#00F5A0]/10 text-[#00F5A0] border border-[#00F5A0]/30">
                Gemini 1.5 Flash
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Multi-turn roadmap clarification and technical deep-dives for {targetRole}
            </p>
          </div>
        </div>

        {messages.length > 0 && (
          <button
            type="button"
            onClick={() => setMessages([])}
            className="self-start sm:self-auto text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 transition cursor-pointer"
            title="Clear visible view"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset View</span>
          </button>
        )}
      </div>

      {/* Chat Messages Container */}
      <div
        ref={chatScrollContainerRef}
        className="py-5 min-h-[220px] max-h-[480px] overflow-y-auto space-y-4 pr-1 scrollbar-thin scrollbar-thumb-slate-700"
      >
        {isFetchingHistory && messages.length === 0 && (
          <div className="flex items-center justify-center py-8 text-xs text-slate-400 gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-[#00F5A0]" />
            <span>Synchronizing previous conversation context...</span>
          </div>
        )}

        {messages.length === 0 && !isFetchingHistory && (
          <div className="py-6 px-4 rounded-xl bg-[#172033] border border-slate-700/40 text-center space-y-3">
            <div className="w-10 h-10 mx-auto rounded-full bg-[#00F5A0]/10 flex items-center justify-center border border-[#00F5A0]/20">
              <Bot className="w-5 h-5 text-[#00F5A0]" />
            </div>
            <div className="max-w-md mx-auto">
              <h4 className="text-sm font-bold text-white mb-1">
                Your AI Career Strategist is Ready
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Have questions about specific daily items, architecture trade-offs, or hands-on projects in this 4-week plan? Ask anything below to retain context across your journey.
              </p>
            </div>

            {/* Suggested quick prompt chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(undefined, prompt)}
                  className="text-[11px] px-3 py-1.5 rounded-lg bg-[#0f172a] hover:bg-[#1e293b] border border-slate-700/60 hover:border-[#00F5A0]/50 text-slate-300 hover:text-white transition cursor-pointer text-left"
                >
                  &ldquo;{prompt}&rdquo;
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Rendered History: User in muted gray text, AI in crisp white text with Neon Mint AI icon */}
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-7 h-7 rounded-lg bg-[#00F5A0]/10 border border-[#00F5A0]/30 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-[#00F5A0]" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed border ${
                  isUser
                    ? 'bg-[#0f172a]/80 border-slate-700/60 text-slate-400'
                    : 'bg-[#131d2e] border-slate-700/50 text-white shadow-sm'
                }`}
              >
                {!isUser && (
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#00F5A0] mb-1.5 flex items-center gap-1">
                    <span>AI Mentor</span>
                  </div>
                )}
                <div className="whitespace-pre-wrap select-text">{msg.content}</div>
              </div>

              {isUser && (
                <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold text-slate-400">
                  You
                </div>
              )}
            </div>
          );
        })}

        {/* Loading State with Neon Mint Spinner & Indicator */}
        {isLoading && (
          <div className="flex items-start gap-3 justify-start animate-in fade-in">
            <div className="w-7 h-7 rounded-lg bg-[#00F5A0]/10 border border-[#00F5A0]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Sparkles className="w-3.5 h-3.5 text-[#00F5A0] animate-spin" />
            </div>
            <div className="rounded-xl px-4 py-3 bg-[#131d2e] border border-slate-700/50 text-white text-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-[#00F5A0]" />
              <span className="text-slate-300 text-xs">AI Mentor is analyzing roadmap context...</span>
            </div>
          </div>
        )}
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Text Input Field & Submit Button */}
      <form onSubmit={handleSendMessage} className="pt-2">
        <div className="relative flex items-center rounded-xl bg-[#0f172a] border border-slate-700/70 focus-within:border-[#00F5A0]/60 transition shadow-inner">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
            placeholder="Ask for clarification on this roadmap..."
            className="w-full bg-transparent px-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="m-1.5 px-4 py-2 rounded-lg bg-[#00F5A0] hover:bg-[#00e092] active:scale-95 disabled:opacity-40 disabled:hover:bg-[#00F5A0] disabled:cursor-not-allowed text-slate-950 font-black text-xs flex items-center gap-1.5 transition cursor-pointer shadow-sm"
          >
            {isLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <>
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
        <div className="flex items-center justify-between mt-2 px-1 text-[11px] text-slate-500">
          <span>Context: 4-week roadmap &amp; verified Firestore history</span>
          <span className="hidden sm:inline">Press Enter to send</span>
        </div>
      </form>
    </section>
  );
};
