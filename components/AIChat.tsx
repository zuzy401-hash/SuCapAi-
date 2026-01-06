
import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Loader2, User, Bot, StopCircle, Waves, Volume2, Sparkles } from 'lucide-react';
import { getGeminiResponse, startLiveVoiceSession } from '../services/geminiService';
import { ChatMessage } from '../types';
import { LiveServerMessage } from '@google/genai';

// Audio Helpers
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [transcription, setTranscription] = useState('');
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const outAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const suggestions = [
    "Refina mi prompt actual",
    "Consejos de iluminación 3D",
    "Estilos visuales tendencia 2024",
    "Cómo organizar mis archivos"
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, transcription]);

  const stopVoiceSession = () => {
    if (sessionRef.current) {
      sessionRef.current.then((s: any) => s.close());
      sessionRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (outAudioContextRef.current) {
      outAudioContextRef.current.close();
      outAudioContextRef.current = null;
    }
    setIsVoiceActive(false);
    setTranscription('');
  };

  const startVoice = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      setIsVoiceActive(true);

      const sessionPromise = startLiveVoiceSession({
        onopen: () => {
          const source = audioContextRef.current!.createMediaStreamSource(stream);
          const scriptProcessor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
          
          scriptProcessor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            const l = inputData.length;
            const int16 = new Int16Array(l);
            for (let i = 0; i < l; i++) {
              int16[i] = inputData[i] * 32768;
            }
            const pcmBlob = {
              data: encode(new Uint8Array(int16.buffer)),
              mimeType: 'audio/pcm;rate=16000',
            };
            sessionPromise.then((session) => {
              session.sendRealtimeInput({ media: pcmBlob });
            });
          };

          source.connect(scriptProcessor);
          scriptProcessor.connect(audioContextRef.current!.destination);
        },
        onmessage: async (message: LiveServerMessage) => {
          const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
          if (base64Audio && outAudioContextRef.current) {
            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outAudioContextRef.current.currentTime);
            const audioBuffer = await decodeAudioData(decode(base64Audio), outAudioContextRef.current, 24000, 1);
            const source = outAudioContextRef.current.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(outAudioContextRef.current.destination);
            source.start(nextStartTimeRef.current);
            nextStartTimeRef.current += audioBuffer.duration;
            sourcesRef.current.add(source);
            source.onended = () => sourcesRef.current.delete(source);
          }

          if (message.serverContent?.interrupted) {
            sourcesRef.current.forEach(s => s.stop());
            sourcesRef.current.clear();
            nextStartTimeRef.current = 0;
          }

          if (message.serverContent?.outputTranscription) {
            setTranscription(prev => prev + message.serverContent!.outputTranscription!.text);
          }

          if (message.serverContent?.turnComplete) {
            setMessages(prev => [...prev, {
              id: Date.now().toString(),
              role: 'model',
              text: transcription || "Respuesta de voz completada.",
              timestamp: new Date()
            }]);
            setTranscription('');
          }
        },
        onerror: (e: any) => console.error('Error en sesión live:', e),
        onclose: () => stopVoiceSession(),
      });

      sessionRef.current = sessionPromise;

    } catch (err) {
      console.error("No se pudo iniciar la voz:", err);
      setIsVoiceActive(false);
    }
  };

  const handleSend = async (text: string = input) => {
    const messageText = text || input;
    if (!messageText.trim() || isLoading) return;
    
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: messageText, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    const responseText = await getGeminiResponse(messageText);
    setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'model', text: responseText, timestamp: new Date() }]);
    setIsLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-100px)] flex flex-col p-6">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-1 tracking-tight">Asistente Creativo de IA</h1>
          <p className="text-gray-400 text-sm">Guía por voz y texto en tiempo real.</p>
        </div>
        <div className={`px-4 py-2 rounded-full border transition-all flex items-center gap-2 ${isVoiceActive ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.2)]' : 'bg-[#1a1a1a] border-white/10 text-gray-400 shadow-inner'}`}>
          <div className={`w-2 h-2 rounded-full ${isVoiceActive ? 'bg-indigo-400 animate-ping' : 'bg-gray-600'}`}></div>
          <span className="text-xs font-bold uppercase tracking-widest">{isVoiceActive ? 'Audio en Vivo' : 'Inactivo'}</span>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-6 pr-4 custom-scrollbar mb-6">
        {messages.length === 0 && !isVoiceActive && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6 opacity-80">
            <div className="w-20 h-20 bg-indigo-600/10 rounded-[2.5rem] flex items-center justify-center border border-indigo-500/20 shadow-2xl">
              <Bot className="w-10 h-10 text-indigo-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">¿Cómo puedo ayudarte hoy?</h3>
              <p className="max-w-xs text-sm text-gray-500 leading-relaxed">Pregúntame sobre estilos visuales, ayuda con prompts o teoría del diseño.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 max-w-md">
              {suggestions.map((suggestion, idx) => (
                <button 
                  key={idx} 
                  onClick={() => handleSend(suggestion)}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-gray-400 hover:text-white hover:bg-indigo-600/20 hover:border-indigo-500/30 transition-all"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-indigo-600 shadow-lg shadow-indigo-600/20' : 'bg-[#222] border border-white/5'}`}>
              {msg.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-indigo-400" />}
            </div>
            <div className={`max-w-[80%] rounded-2xl px-5 py-4 ${msg.role === 'user' ? 'bg-indigo-600/10 border border-indigo-500/20 text-gray-100' : 'bg-[#1a1a1a] border border-white/5 text-gray-300 shadow-xl'}`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        
        {isVoiceActive && (
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-2xl bg-[#222] flex items-center justify-center border border-white/5 shadow-inner">
              <Bot className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-2xl px-5 py-4 text-indigo-400 italic text-sm shadow-xl flex items-center gap-3">
              <div className="flex gap-1">
                <span className="w-1 h-3 bg-indigo-500/50 rounded-full animate-[bounce_1s_infinite]"></span>
                <span className="w-1 h-4 bg-indigo-500 rounded-full animate-[bounce_1s_infinite_0.2s]"></span>
                <span className="w-1 h-2 bg-indigo-500/30 rounded-full animate-[bounce_1s_infinite_0.4s]"></span>
              </div>
              {transcription ? `${transcription}...` : "Escuchando tu voz..."}
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-2xl bg-[#222] flex items-center justify-center border border-white/5 shadow-inner"><Loader2 className="w-5 h-5 animate-spin text-indigo-400" /></div>
            <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl px-5 py-4"><span className="text-gray-500 text-sm italic">Sintetizando respuesta...</span></div>
          </div>
        )}
      </div>

      <div className="bg-[#1a1a1a] border border-white/5 rounded-[2rem] p-4 flex items-end gap-3 shadow-2xl">
        <button 
          onClick={isVoiceActive ? stopVoiceSession : startVoice}
          className={`p-5 rounded-2xl transition-all duration-300 ${isVoiceActive ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/30' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}
          title={isVoiceActive ? "Detener voz" : "Iniciar chat de voz"}
        >
          {isVoiceActive ? <StopCircle className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
        </button>
        <div className="flex-1 relative">
          <textarea
            className="w-full bg-[#121212] border border-white/10 rounded-2xl pl-5 pr-14 py-5 text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none max-h-32"
            placeholder={isVoiceActive ? "Habla con la IA..." : "Escribe tu consulta creativa..."}
            rows={1}
            value={input}
            disabled={isVoiceActive}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          />
          {!isVoiceActive && (
            <button onClick={() => handleSend()} disabled={!input.trim() || isLoading} className="absolute right-4 bottom-4 p-2 text-indigo-500 hover:text-indigo-400 disabled:opacity-50 transition-colors">
              <Send className="w-7 h-7" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIChat;
