"use client"

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2 } from "lucide-react"
import { authService } from "@/services/auth"

const forgotSchema = z.object({
    email: z.string().email("Email invalide"),
})

type ForgotFormValues = z.infer<typeof forgotSchema>

export default function ForgotPasswordPage() {
    const [message, setMessage] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotFormValues>({
        resolver: zodResolver(forgotSchema),
    })

    const onSubmit = async (data: ForgotFormValues) => {
        setMessage(null)
        setIsLoading(true)
        try {
            await authService.forgotPassword(data)
            setMessage("Un code de vérification à 6 chiffres a été envoyé à votre email. Cliquez sur le bouton ci-dessous pour continuer.")
        } catch (err) {
            setMessage("Une erreur est survenue. Réessayez.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen">
            {/* Left Side - Gradient Background */}
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
                        <Image
                            src="/images/cadre.png"
                            alt="Frame"
                            fill
                            className="pointer-events-none object-contain"
                        />
                    </div>
                </div>
                <p className="max-w-md text-lg italic text-amber-600">
                    {'"'}Toutes les offres, les vrais prix et les meilleures décisions au même endroit.{'"'}
                </p>
            </div>

            {/* Right Side - Form */}
            <div className="flex w-full items-center justify-center bg-muted/30 p-8 lg:w-1/2">
                <div className="w-full max-w-md rounded-2xl bg-card p-8 shadow-sm">
                    <div className="mb-8 text-center">
                        <h1 className="mb-2 text-3xl font-bold text-blue-600">
                            Mot de passe oublié
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Entrez votre email pour réinitialiser votre mot de passe.
                        </p>
                    </div>

                    {message && (
                        <div className="mb-4 rounded-md bg-blue-50 p-4 text-sm text-blue-500 space-y-3">
                            <p>{message}</p>
                            <Link
                                href="/reset-password"
                                className="inline-block w-full rounded-lg bg-blue-600 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-blue-700"
                            >
                                Continuer vers la réinitialisation
                            </Link>
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
                                placeholder="Adressecourriel@exemple.com"
                                className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                            />
                            {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full rounded-lg bg-blue-600 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                        >
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin inline" /> : null}
                            {isLoading ? "Envoyer" : "Envoyer"}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-muted-foreground">
                        <Link href="/signin" className="font-medium text-blue-600 hover:underline">
                            Retour à la connexion
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
