"use client"

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, Eye, EyeOff } from "lucide-react"
import { authService } from "@/services/auth"

const resetSchema = z.object({
    email: z.string().email("Email invalide"),
    code: z.string().length(6, "Le code doit contenir exactement 6 chiffres"),
    password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
})

type ResetFormValues = z.infer<typeof resetSchema>

export default function ResetPasswordPage() {
    const router = useRouter()
    const [message, setMessage] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetFormValues>({
        resolver: zodResolver(resetSchema),
    })

    const onSubmit = async (data: ResetFormValues) => {
        setError(null)
        setMessage(null)
        setIsLoading(true)
        try {
            await authService.resetPassword({
                email: data.email,
                code: data.code,
                new_password: data.password
            })
            setMessage("Mot de passe réinitialisé avec succès! Redirection...")
            setTimeout(() => {
                router.push("/signin")
            }, 2000)
        } catch (err: any) {
            setError(err.response?.data?.detail || "Une erreur est survenue")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen">
            <div className="relative hidden w-1/2 flex-col justify-between bg-gradient-to-br from-blue-200 via-pink-200 to-orange-100 p-8 lg:flex">
                <div className="flex items-center gap-1">
                    <Image
                        src="/images/Logo 1111.svg"
                        alt="1111.tn"
                        width={120}
                        height={40}
                        className="h-10 w-auto object-contain"
                        priority
                    />
                </div>
                <div className="flex flex-1 items-center justify-center">
                    <div className="relative h-80 w-80">
                        <Image
                            src="/images/1.png"
                            alt="1111 Mascot"
                            fill
                            className="object-contain"
                        />
                    </div>
                </div>
            </div>

            <div className="flex w-full items-center justify-center bg-muted/30 p-8 lg:w-1/2">
                <div className="w-full max-w-md rounded-2xl bg-card p-8 shadow-sm">
                    <div className="mb-8 text-center">
                        <h1 className="mb-2 text-3xl font-bold text-blue-600">
                            Nouveau mot de passe
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Entrez le code reçu par email et votre nouveau mot de passe
                        </p>
                    </div>

                    {message && (
                        <div className="mb-4 rounded-md bg-green-50 p-4 text-sm text-green-500">
                            {message}
                        </div>
                    )}
                    {error && (
                        <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-500">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm text-muted-foreground">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                {...register("email")}
                                placeholder="votre@email.com"
                                className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                            />
                            {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="code" className="text-sm text-muted-foreground">
                                Code de vérification
                            </label>
                            <input
                                id="code"
                                type="text"
                                {...register("code")}
                                placeholder="123456"
                                maxLength={6}
                                className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-blue-400 focus:ring-1 focus:ring-blue-400 font-mono text-center text-2xl tracking-widest"
                            />
                            {errors.code && <span className="text-xs text-red-500">{errors.code.message}</span>}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm text-muted-foreground">
                                Nouveau mot de passe
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    {...register("password")}
                                    placeholder="Nouveau mot de passe"
                                    className="w-full rounded-lg border border-border bg-card px-4 py-3 pr-12 text-sm outline-none transition-colors focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-500 hover:text-amber-600"
                                >
                                    {showPassword ? (
                                        <EyeOff className="size-5" />
                                    ) : (
                                        <Eye className="size-5" />
                                    )}
                                </button>
                            </div>
                            {errors.password && <span className="text-xs text-red-500">{errors.password.message}</span>}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="confirmPassword" className="text-sm text-muted-foreground">
                                Confirmer le mot de passe
                            </label>
                            <div className="relative">
                                <input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    {...register("confirmPassword")}
                                    placeholder="Confirmer le mot de passe"
                                    className="w-full rounded-lg border border-border bg-card px-4 py-3 pr-12 text-sm outline-none transition-colors focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-500 hover:text-amber-600"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="size-5" />
                                    ) : (
                                        <Eye className="size-5" />
                                    )}
                                </button>
                            </div>
                            {errors.confirmPassword && <span className="text-xs text-red-500">{errors.confirmPassword.message}</span>}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !!message}
                            className="w-full rounded-lg bg-blue-600 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                        >
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin inline" /> : null}
                            {isLoading ? "Réinitialiser" : "Réinitialiser"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
