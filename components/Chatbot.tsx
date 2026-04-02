"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { MessageCircle, X, Send, Bot, User } from "lucide-react"
import { API_URL } from "@/lib/api"

interface Message {
    id: number
    text: string
    sender: "user" | "bot"
}

export default function Chatbot() {
    const [open, setOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const idRef = useRef(0)

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    // Focus input when opened
    useEffect(() => {
        if (open) inputRef.current?.focus()
    }, [open])

    // Welcome message on first open
    useEffect(() => {
        if (open && messages.length === 0) {
            setMessages([
                {
                    id: ++idRef.current,
                    text: "Bonjour ! 👋 Je suis l'assistant 1111.tn. Comment puis-je vous aider ?",
                    sender: "bot",
                },
            ])
        }
    }, [open, messages.length])

    // Build history for Groq context
    const buildHistory = useCallback(() => {
        return messages
            .filter((m) => m.id > 0)
            .map((m) => ({
                role: m.sender === "user" ? "user" : "assistant",
                content: m.text,
            }))
    }, [messages])

    const sendMessage = useCallback(
        async (text: string) => {
            if (!text.trim() || loading) return

            const userMsg: Message = {
                id: ++idRef.current,
                text: text.trim(),
                sender: "user",
            }

            setMessages((prev) => [...prev, userMsg])
            setInput("")
            setLoading(true)

            try {
                const history = [
                    ...buildHistory(),
                    { role: "user", content: text.trim() },
                ]
                // Remove the last entry since we pass message separately
                history.pop()

                const res = await fetch(`${API_URL}/chat/message`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        message: text.trim(),
                        history: history.length > 0 ? history : undefined,
                    }),
                })

                if (!res.ok) throw new Error()
                const data = await res.json()

                setMessages((prev) => [
                    ...prev,
                    { id: ++idRef.current, text: data.reply, sender: "bot" },
                ])
            } catch {
                setMessages((prev) => [
                    ...prev,
                    {
                        id: ++idRef.current,
                        text: "Désolé, une erreur est survenue. Réessayez dans un instant.",
                        sender: "bot",
                    },
                ])
            } finally {
                setLoading(false)
            }
        },
        [loading, buildHistory]
    )

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        sendMessage(input)
    }

    const quickSuggestions = [
        "C'est quoi 1111.tn ?",
        "Comment comparer les prix ?",
        "Quels sont vos tarifs ?",
        "Fausses promotions",
    ]

    return (
        <>
            {/* ── Floating Button ── */}
            {!open && (
                <button
                    onClick={() => setOpen(true)}
                    className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-all hover:scale-105 active:scale-95"
                    aria-label="Ouvrir le chat"
                >
                    <MessageCircle className="h-6 w-6" />
                </button>
            )}

            {/* ── Chat Window ── */}
            {open && (
                <div
                    className="fixed bottom-6 right-6 z-50 flex w-[370px] max-w-[calc(100vw-2rem)] flex-col rounded-2xl border bg-white shadow-2xl dark:bg-gray-900 dark:border-gray-700"
                    style={{ height: "min(520px, calc(100vh - 3rem))" }}
                >
                    {/* Header */}
                    <div className="flex items-center gap-3 rounded-t-2xl bg-blue-600 px-4 py-3 text-white">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
                            <Bot className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-sm font-semibold">Assistant 1111.tn</h3>
                            <p className="text-xs text-blue-200">
                                En ligne • Réponse instantanée
                            </p>
                        </div>
                        <button
                            onClick={() => setOpen(false)}
                            className="rounded-full p-1 hover:bg-white/20 transition-colors"
                            aria-label="Fermer le chat"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex gap-2 ${
                                    msg.sender === "user"
                                        ? "justify-end"
                                        : "justify-start"
                                }`}
                            >
                                {msg.sender === "bot" && (
                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40 mt-0.5">
                                        <Bot className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    </div>
                                )}
                                <div
                                    className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                                        msg.sender === "user"
                                            ? "bg-blue-600 text-white rounded-br-md"
                                            : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 rounded-bl-md"
                                    }`}
                                >
                                    {msg.text}
                                </div>
                                {msg.sender === "user" && (
                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 mt-0.5">
                                        <User className="h-4 w-4 text-white" />
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Typing indicator */}
                        {loading && (
                            <div className="flex gap-2 justify-start">
                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40 mt-0.5">
                                    <Bot className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div className="rounded-2xl rounded-bl-md bg-gray-100 dark:bg-gray-800 px-4 py-3">
                                    <div className="flex gap-1">
                                        <span
                                            className="h-2 w-2 rounded-full bg-gray-400 animate-bounce"
                                            style={{ animationDelay: "0ms" }}
                                        />
                                        <span
                                            className="h-2 w-2 rounded-full bg-gray-400 animate-bounce"
                                            style={{ animationDelay: "150ms" }}
                                        />
                                        <span
                                            className="h-2 w-2 rounded-full bg-gray-400 animate-bounce"
                                            style={{ animationDelay: "300ms" }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Suggestions (only on first message) */}
                    {messages.length <= 1 && (
                        <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                            {quickSuggestions.map((s, i) => (
                                <button
                                    key={i}
                                    onClick={() => sendMessage(s)}
                                    className="rounded-full border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 text-xs text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input */}
                    <form
                        onSubmit={handleSubmit}
                        className="flex items-center gap-2 border-t px-3 py-2.5 dark:border-gray-700"
                    >
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Tapez votre message..."
                            className="flex-1 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 dark:text-white"
                            disabled={loading}
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || loading}
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            aria-label="Envoyer"
                        >
                            <Send className="h-4 w-4" />
                        </button>
                    </form>
                </div>
            )}
        </>
    )
}
