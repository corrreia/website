import React, { useState, useRef, useEffect } from "react";
import { EnhancedWindow } from "@/components/EnhancedWindow";
import type { WindowState } from "@/lib/useWindowManager";
import { useChat, type ChatMessage } from "@/lib/useChat";
import { Send, Users, Wifi, WifiOff } from "lucide-react";

interface ChatCardProps {
  windowState: WindowState;
  onMouseDown: (e: React.MouseEvent) => void;
  onDragStart: (startX: number, startY: number) => void;
  onResizeStart: (direction: string, startX: number, startY: number) => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onClose: () => void;
}

export function ChatCard({
  windowState,
  onMouseDown,
  onDragStart,
  onResizeStart,
  onMinimize,
  onMaximize,
  onClose,
}: ChatCardProps) {
  const {
    messages,
    isConnected,
    isConnecting,
    username,
    sendMessage,
    connect,
    error,
  } = useChat();

  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when connected
  useEffect(() => {
    if (isConnected && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isConnected]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && isConnected) {
      sendMessage(inputMessage);
      setInputMessage("");
    }
  };

  const formatTime = (timestamp?: number) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getMessageTypeStyle = (message: ChatMessage) => {
    switch (message.type) {
      case "welcome":
        return "text-blue-600 dark:text-blue-400 font-medium";
      case "join":
        return "text-green-600 dark:text-green-400 text-sm";
      case "quit":
        return "text-red-600 dark:text-red-400 text-sm";
      default:
        return "text-foreground";
    }
  };

  const isSystemMessage = (message: ChatMessage) => {
    return ["welcome", "join", "quit"].includes(message.type);
  };

  return (
    <EnhancedWindow
      windowState={windowState}
      onMouseDown={onMouseDown}
      onDragStart={onDragStart}
      onResizeStart={onResizeStart}
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      onClose={onClose}
      variant="windows"
    >
      <div className="h-full flex flex-col bg-background">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-border bg-muted/50">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium text-sm">Global Chat</span>
            {username && (
              <span className="text-xs text-muted-foreground">
                ({username})
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isConnecting ? (
              <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                Connecting...
              </div>
            ) : isConnected ? (
              <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                <Wifi className="h-3 w-3" />
                Connected
              </div>
            ) : (
              <div className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
                <WifiOff className="h-3 w-3" />
                Disconnected
              </div>
            )}
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0">
          {!isConnected && !isConnecting && (
            <div className="text-center py-8">
              <div className="text-muted-foreground mb-4">
                {error ? `Error: ${error}` : "Chat is disconnected"}
              </div>
              <button
                onClick={connect}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Connect to Chat
              </button>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={`${message.timestamp}-${index}`}
              className={`${
                isSystemMessage(message)
                  ? "text-center italic"
                  : "flex flex-col"
              }`}
            >
              {isSystemMessage(message) ? (
                <div className={`text-xs ${getMessageTypeStyle(message)}`}>
                  {message.message}
                </div>
              ) : (
                <>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-medium text-sm text-primary">
                      {message.username || "Unknown"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                  <div className="text-sm text-foreground break-words">
                    {message.message || ""}
                  </div>
                </>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        {isConnected && (
          <div className="p-3 border-t border-border">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type a message..."
                maxLength={500}
                className="flex-1 px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={!isConnected}
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || !isConnected}
                className="px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </EnhancedWindow>
  );
}
