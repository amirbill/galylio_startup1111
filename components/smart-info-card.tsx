"use client"

import { ArrowDown } from "lucide-react"

interface SmartInfoCardProps {
    className?: string
    videoSrc?: string
}

export function SmartInfoCard({
    className = "",
    videoSrc
}: SmartInfoCardProps) {
    return (
        <article className={`relative overflow-hidden sm:rounded-[2rem] col-span-1 min-h-[200px] sm:min-h-[240px] md:min-h-[350px] flex flex-col bg-zinc-950 border-zinc-900 border rounded-2xl p-5 w-full transition-all duration-500 hover:scale-[1.02] group ${className}`}>
            {/* Video Background */}
            {videoSrc && (
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="none"
                    poster="https://hoirqrkdgbmvpwutwuwj-all.supabase.co/storage/v1/object/public/assets/assets/d30527df-7416-4ead-affa-cf9a2d9e3729_800w.jpg"
                    className="absolute inset-0 w-full h-full object-cover opacity-80 transition-opacity duration-700"
                >
                    <source src={videoSrc} type="video/mp4" />
                </video>
            )}

            {/* Static Fallback or Overlay Background if no video */}
            {!videoSrc && (
                <div className="absolute inset-0 bg-[url(https://hoirqrkdgbmvpwutwuwj-all.supabase.co/storage/v1/object/public/assets/assets/d30527df-7416-4ead-affa-cf9a2d9e3729_800w.jpg)] bg-cover bg-center opacity-60" />
            )}

            {/* Gradient Overlay for text readability */}
            <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10 transition-opacity duration-500 ${videoSrc ? 'opacity-80' : 'opacity-100'}`} />

            <div className="relative z-20 flex items-center justify-between text-zinc-300">
                <div className="p-3 bg-zinc-900/40 backdrop-blur-md rounded-full border border-white/10 transition-transform duration-500 group-hover:-translate-y-1">
                    <ArrowDown className="w-4 h-4 text-white" />
                </div>
            </div>
        </article>
    )
}
