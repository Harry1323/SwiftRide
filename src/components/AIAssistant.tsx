import { useState, useRef, useEffect } from "react";
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { Send, Bot, User, X, MapPin, Navigation, Sparkles, Loader2 } from "lucide-react";
import { cn } from "../lib/utils";
import { VehicleType } from "../types";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIAssistantProps {
  onBookRide?: (pickup: string, dropoff: string, vehicleType: VehicleType) => void;
}

export default function AIAssistant({ onBookRide }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! I'm your SwiftRide AI assistant. I can help you find routes, estimate prices, or even book a ride for you. Where would you like to go today?",
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const bookRideTool: FunctionDeclaration = {
    name: "bookRide",
    description: "Book a ride from a pickup location to a dropoff location with a specific vehicle type.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        pickup: { type: Type.STRING, description: "The pickup location address" },
        dropoff: { type: Type.STRING, description: "The destination address" },
        vehicleType: { 
          type: Type.STRING, 
          enum: ['bike', 'auto', 'car', 'premium'],
          description: "The type of vehicle requested" 
        }
      },
      required: ["pickup", "dropoff", "vehicleType"]
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            role: "user",
            parts: [{ text: input }]
          }
        ],
        config: {
          systemInstruction: `You are a helpful ride-hailing assistant for SwiftRide. 
          Your goal is to help users find routes, estimate prices, and book rides.
          If a user mentions a pickup and dropoff location, use the bookRide tool to book a ride for them.
          Always be polite, concise, and helpful.
          Use Google Maps grounding for accurate location information.`,
          tools: [
            { googleMaps: {} },
            { functionDeclarations: [bookRideTool] }
          ],
          toolConfig: { includeServerSideToolInvocations: true }
        }
      });

      // Check for function calls
      const functionCalls = response.functionCalls;
      if (functionCalls) {
        for (const call of functionCalls) {
          if (call.name === "bookRide" && onBookRide) {
            const { pickup, dropoff, vehicleType } = call.args as any;
            onBookRide(pickup, dropoff, vehicleType as VehicleType);
            
            setMessages(prev => [...prev, {
              role: 'assistant',
              content: `I've initiated a booking from ${pickup} to ${dropoff} using a ${vehicleType}. You can see the details in the booking panel!`,
              timestamp: new Date()
            }]);
          }
        }
      } else {
        const assistantMessage: Message = {
          role: 'assistant',
          content: response.text || "I'm sorry, I couldn't process that request. How else can I help you?",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm having trouble connecting to my brain right now. Please try again in a moment.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      {isOpen ? (
        <div className="bg-white dark:bg-gray-900 w-[350px] md:w-[400px] h-[500px] rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-black dark:bg-black p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">SwiftRide AI</h3>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-white/60 text-[10px] font-medium uppercase tracking-wider">Online</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-gray-900/50">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  "flex items-start gap-3 max-w-[85%]",
                  msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm",
                  msg.role === 'user' ? "bg-black dark:bg-white" : "bg-white dark:bg-gray-800"
                )}>
                  {msg.role === 'user' ? (
                    <User className="w-4 h-4 text-white dark:text-black" />
                  ) : (
                    <Bot className="w-4 h-4 text-black dark:text-white" />
                  )}
                </div>
                <div className={cn(
                  "p-3 rounded-2xl text-sm shadow-sm",
                  msg.role === 'user' 
                    ? "bg-black dark:bg-white text-white dark:text-black rounded-tr-none" 
                    : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-tl-none"
                )}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-3 mr-auto max-w-[85%]">
                <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shrink-0 shadow-sm">
                  <Bot className="w-4 h-4 text-black dark:text-white" />
                </div>
                <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-3 rounded-2xl rounded-tl-none shadow-sm">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me anything..."
                className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded-2xl py-3 pl-4 pr-12 text-sm focus:ring-2 focus:ring-black dark:focus:ring-white text-gray-900 dark:text-white transition-all"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black dark:bg-white text-white dark:text-black rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 disabled:bg-gray-300 dark:disabled:bg-gray-700 transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-black dark:bg-white text-white dark:text-black rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform active:scale-95 group"
        >
          <Sparkles className="w-7 h-7 group-hover:animate-pulse" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white dark:border-gray-900" />
        </button>
      )}
    </div>
  );
}
