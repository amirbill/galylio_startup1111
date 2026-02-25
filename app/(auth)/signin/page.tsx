"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Eye, EyeOff, Loader2, Clock, Rocket } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useAuth } from "@/contexts/AuthContext"
import { GoogleAuthButton } from "@/components/GoogleAuthButton"

const signInSchema = z.object({
    email: z.string().email("Email invalide"),
    password: z.string().min(1, "Mot de passe requis"),
})

type SignInFormValues = z.infer<typeof signInSchema>

// Countdown target: 30 days from first visit (shared with signup)
function useCountdown() {
    const [target] = useState(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem("countdown_target_1111")
            if (stored) return parseInt(stored, 10)
            const t = Date.now() + 30 * 24 * 60 * 60 * 1000
            localStorage.setItem("countdown_target_1111", t.toString())
            return t
        }
        return Date.now() + 30 * 24 * 60 * 60 * 1000
    })

    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

    useEffect(() => {
        const tick = () => {
            const diff = Math.max(0, target - Date.now())
            setTimeLeft({
                days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((diff / (1000 * 60)) % 60),
                seconds: Math.floor((diff / 1000) % 60),
            })
        }
        tick()
        const id = setInterval(tick, 1000)
        return () => clearInterval(id)
    }, [target])

    return timeLeft
}

export default function SignInPage() {
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [mounted, setMounted] = useState(false)
    const { login } = useAuth()
    const countdown = useCountdown()

    useEffect(() => {
        setMounted(true)
    }, [])

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignInFormValues>({
        resolver: zodResolver(signInSchema),
    })

    const onSubmit = async (data: SignInFormValues) => {
        setError(null)
        setIsLoading(true)
        try {
            await login(data)
        } catch (err: any) {
            setError(err.response?.data?.detail || "Email ou mot de passe incorrect")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="relative flex min-h-screen overflow-hidden">
            {/* Video background */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover z-0"
            >
                <source src="/videos/1111_vid.mp4" type="video/mp4" />
            </video>
            {/* Overlay for readability */}
            <div className="absolute inset-0 bg-black/15 z-[1]" />

            {/* Left Side - Branding + Countdown */}
            <div className="relative hidden w-1/2 flex-col justify-between p-10 lg:flex z-10">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <Image
                        src="/images/Logo 1111.svg"
                        alt="1111.tn"
                        width={140}
                        height={48}
                        className="h-12 w-auto object-contain drop-shadow-lg animate-float hover:scale-110 transition-transform duration-500 cursor-pointer"
                        priority
                    />
                </div>

                {/* Center: Mascot + Countdown */}
                <div className="flex flex-1 flex-col items-center justify-center gap-8">
                    <div className="relative h-72 w-72 animate-fade-in-up">
                        <Image
                            src="/images/1.png"
                            alt="1111 Mascot"
                            fill
                            className="object-contain drop-shadow-2xl"
                        />
                        <Image
                            src="/images/cadre.png"
                            alt="Frame"
                            fill
                            className="pointer-events-none object-contain"
                        />
                    </div>

                    {/* Countdown */}
                    <div className="animate-fade-in-up-delay text-center" suppressHydrationWarning>
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <Rocket className="size-5 text-blue-600 animate-pulse" />
                            <span className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
                                Disponible bientôt
                            </span>
                            <Rocket className="size-5 text-blue-600 animate-pulse" />
                        </div>

                        {mounted && <div className="flex items-center gap-3">
                            {[
                                { value: countdown.days, label: "Jours" },
                                { value: countdown.hours, label: "Heures" },
                                { value: countdown.minutes, label: "Min" },
                                { value: countdown.seconds, label: "Sec" },
                            ].map((item, i) => (
                                <React.Fragment key={item.label}>
                                    {i > 0 && <span className="text-2xl font-bold text-blue-400 animate-pulse">:</span>}
                                    <div className="flex flex-col items-center">
                                        <div className="relative w-[72px] h-[72px] rounded-2xl bg-white/80 backdrop-blur-md border-2 border-blue-200/60 shadow-lg flex items-center justify-center overflow-hidden group hover:scale-105 transition-transform duration-300">
                                            <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent" />
                                            <span className="relative text-3xl font-black text-blue-700 tabular-nums">
                                                {String(item.value).padStart(2, "0")}
                                            </span>
                                        </div>
                                        <span className="mt-2 text-[11px] font-bold uppercase tracking-wider text-blue-500/80">
                                            {item.label}
                                        </span>
                                    </div>
                                </React.Fragment>
                            ))}
                        </div>}
                    </div>
                </div>

                {/* Tagline */}
                <p className="max-w-md text-base italic text-blue-600/70 font-medium">
                    {'"'}Toutes les offres, les vrais prix et les meilleures décisions au même endroit.{'"'}
                </p>
            </div>

            {/* Right Side - Floating Sign In Form */}
            <div className="relative flex w-full items-center justify-center p-6 lg:w-1/2 z-10">
                <div className="w-full max-w-md animate-fade-in-up">
                    {/* Mobile countdown */}
                    <div className="mb-6 lg:hidden text-center" suppressHydrationWarning>
                        <div className="flex items-center justify-center gap-2 mb-3">
                            <Rocket className="size-4 text-blue-600 animate-pulse" />
                            <span className="text-xs font-bold uppercase tracking-[0.15em] text-blue-600">
                                Disponible bientôt
                            </span>
                        </div>
                        {mounted && <div className="flex items-center justify-center gap-2">
                            {[
                                { value: countdown.days, label: "J" },
                                { value: countdown.hours, label: "H" },
                                { value: countdown.minutes, label: "M" },
                                { value: countdown.seconds, label: "S" },
                            ].map((item, i) => (
                                <React.Fragment key={item.label}>
                                    {i > 0 && <span className="text-lg font-bold text-blue-400">:</span>}
                                    <div className="w-12 h-12 rounded-xl bg-white/80 backdrop-blur-sm border border-blue-200/60 shadow flex items-center justify-center">
                                        <span className="text-xl font-black text-blue-700 tabular-nums">
                                            {String(item.value).padStart(2, "0")}
                                        </span>
                                    </div>
                                </React.Fragment>
                            ))}
                        </div>}
                    </div>

                    {/* Mascot above form */}
                    <div className="relative z-10 flex justify-center mb-10">
                        <div className="w-20 h-20 md:w-24 md:h-24">
                            <Image
                                src="/images/1.png"
                                alt="Mascot"
                                width={112}
                                height={112}
                                className="object-contain drop-shadow-lg"
                                priority
                            />
                        </div>
                    </div>

                    {/* Floating form card */}
                    <div className="relative rounded-3xl bg-white/70 backdrop-blur-xl p-8 shadow-2xl shadow-blue-900/10 border border-white/50 hover:shadow-blue-900/15 transition-shadow duration-500">
                        {/* Header */}
                        <div className="mb-8 text-center">
                            <div className="lg:hidden flex justify-center mb-4">
                                <Image
                                    src="/images/Logo 1111.svg"
                                    alt="1111.tn"
                                    width={100}
                                    height={36}
                                    className="h-9 w-auto object-contain animate-float hover:scale-110 transition-transform duration-500 cursor-pointer"
                                />
                            </div>
                            <h1 className="mb-1.5 text-2xl font-extrabold bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent">
                                Bienvenue à 1111
                            </h1>
                            <p className="text-sm text-slate-500">
                                Activez les alertes et suivez les prix en temps réel.
                            </p>
                        </div>

                        {error && (
                            <div className="mb-4 rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-600 font-medium animate-shake">
                                {error}
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            {/* Email */}
                            <div className="space-y-1.5">
                                <label htmlFor="email" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    {...register("email")}
                                    placeholder="vous@exemple.com"
                                    className="w-full rounded-xl border-2 border-slate-200/80 bg-white/60 backdrop-blur-sm px-4 py-3 text-sm outline-none transition-all duration-300 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 focus:bg-white placeholder:text-slate-300"
                                />
                                {errors.email && <span className="text-xs text-red-500 font-medium">{errors.email.message}</span>}
                            </div>

                            {/* Password */}
                            <div className="space-y-1.5">
                                <label htmlFor="password" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Mot de passe
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        {...register("password")}
                                        placeholder="Votre mot de passe"
                                        className="w-full rounded-xl border-2 border-slate-200/80 bg-white/60 backdrop-blur-sm px-4 py-3 pr-12 text-sm outline-none transition-all duration-300 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 focus:bg-white placeholder:text-slate-300"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                                    </button>
                                </div>
                                {errors.password && <span className="text-xs text-red-500 font-medium">{errors.password.message}</span>}
                            </div>

                            {/* Forgot Password */}
                            <div className="text-right">
                                <Link
                                    href="/forgot-password"
                                    className="text-xs font-medium text-slate-400 hover:text-blue-600 transition-colors"
                                >
                                    Mot de passe oublié?
                                </Link>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
                            >
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin inline" /> : null}
                                {isLoading ? "Connexion..." : "Se connecter"}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="my-6 flex items-center gap-4">
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
                            <span className="text-xs font-medium text-slate-400">ou</span>
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
                        </div>

                        {/* Google Sign In */}
                        <GoogleAuthButton />

                        {/* Sign Up Link */}
                        <p className="mt-6 text-center text-sm text-slate-500">
                            Vous n{"'"}avez pas de compte?{" "}
                            <Link href="/signup" className="font-bold text-blue-600 hover:text-blue-700 transition-colors">
                                Inscrivez-vous.
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* CSS animations */}
            <style jsx global>{`
                @keyframes gradient-shift {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                @keyframes float-slow {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    50% { transform: translate(30px, -40px) scale(1.05); }
                }
                @keyframes float-slower {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    50% { transform: translate(-20px, 30px) scale(1.08); }
                }
                @keyframes float-medium {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    50% { transform: translate(40px, -20px) scale(1.03); }
                }
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(24px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    20%, 60% { transform: translateX(-4px); }
                    40%, 80% { transform: translateX(4px); }
                }
                .animate-gradient-shift {
                    background-size: 200% 200%;
                    animation: gradient-shift 8s ease infinite;
                }
                .animate-float-slow {
                    animation: float-slow 12s ease-in-out infinite;
                }
                .animate-float-slower {
                    animation: float-slower 16s ease-in-out infinite;
                }
                .animate-float-medium {
                    animation: float-medium 10s ease-in-out infinite;
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.7s ease-out both;
                }
                .animate-fade-in-up-delay {
                    animation: fade-in-up 0.7s ease-out 0.3s both;
                }
                .animate-shake {
                    animation: shake 0.5s ease-in-out;
                }
            `}</style>
        </div>
    )
}
