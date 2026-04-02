"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import { Pencil, Loader2, CheckCircle2, AlertCircle, ShoppingBag, Pill, LayoutDashboard } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { getMeAction, updateProfileAction, changePasswordAction } from "@/app/auth-actions"
import { useAuth } from "@/contexts/AuthContext"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

export default function ProfilePage() {
    const { user: authUser } = useAuth()
    const [activeTab, setActiveTab] = useState<"profile" | "security">("profile")
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const [profileData, setProfileData] = useState({
        nom: "",
        nomUtilisateur: "",
        email: "",
        dateNaissance: "",
        adresse: "",
    })

    const [securityData, setSecurityData] = useState({
        currentPassword: "",
        newPassword: "",
    })

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Use getMeAction instead of authService.me()
                const response = await getMeAction()
                if (response.success && response.data) {
                    const userData = response.data
                    setProfileData({
                        nom: userData.full_name || "",
                        nomUtilisateur: userData.username || "",
                        email: userData.email || "",
                        dateNaissance: userData.birthdate || "",
                        adresse: userData.address || "",
                    })
                }
            } catch (error) {
                console.error("Failed to fetch user data", error)
            } finally {
                setLoading(false)
            }
        }
        fetchUserData()
    }, [])

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value })
    }

    const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setSecurityData(prev => ({ ...prev, [name]: value }))
    }

    const saveProfile = async () => {
        setSaving(true)
        setMessage(null)
        try {
            const response = await updateProfileAction({
                full_name: profileData.nom,
                username: profileData.nomUtilisateur,
                email: profileData.email,
                birthdate: profileData.dateNaissance,
                address: profileData.adresse
            })

            if (response.success) {
                setMessage({ type: 'success', text: 'Profil mis à jour avec succès' })
                // Optionally refresh user context here if needed, but page reload might be enough or separate context update
            } else {
                setMessage({ type: 'error', text: response.error || 'Échec de la mise à jour du profil' })
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Échec de la mise à jour du profil' })
        } finally {
            setSaving(false)
        }
    }

    const saveSecurity = async () => {
        if (!securityData.currentPassword || !securityData.newPassword) {
            setMessage({ type: 'error', text: 'Veuillez remplir tous les champs' })
            return
        }
        setSaving(true)
        setMessage(null)
        try {
            const response = await changePasswordAction({
                current_password: securityData.currentPassword,
                new_password: securityData.newPassword
            })

            if (response.success) {
                setMessage({ type: 'success', text: 'Mot de passe mis à jour avec succès' })
                setSecurityData({ currentPassword: "", newPassword: "" })
            } else {
                setMessage({ type: 'error', text: response.error || 'Échec de la mise à jour du mot de passe' })
            }
        } catch (error: any) {
            setMessage({ type: 'error', text: 'Une erreur est survenue' })
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <Loader2 className="size-8 animate-spin text-blue-600" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Header />

            <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-12">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                            Mon <span className="text-blue-600">Profil</span>
                        </h1>
                        <p className="text-slate-500 mt-1">Gérez vos informations et votre sécurité</p>
                    </div>
                    {authUser?.role === 'admin' && (
                        <a
                            href="/dashboard"
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 transition-colors"
                        >
                            <LayoutDashboard className="size-4" />
                            Tableau de bord
                        </a>
                    )}
                </div>

                <div className="rounded-3xl bg-white p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
                    {/* Status Message */}
                    {message && (
                        <div className={`mb-8 flex items-center gap-3 rounded-2xl p-4 text-sm font-medium animate-in fade-in slide-in-from-top-2 ${message.type === 'success' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'
                            }`}>
                            {message.type === 'success' ? <CheckCircle2 className="size-5" /> : <AlertCircle className="size-5" />}
                            {message.text}
                        </div>
                    )}

                    {/* Tabs */}
                    <div className="mb-10 flex gap-8 border-b border-slate-100">
                        <button
                            onClick={() => { setActiveTab("profile"); setMessage(null); }}
                            className={`relative pb-4 text-sm font-bold transition-all ${activeTab === "profile"
                                ? "text-slate-900"
                                : "text-slate-400 hover:text-slate-600"
                                }`}
                        >
                            Informations Personnelles
                            {activeTab === "profile" && (
                                <span className="absolute bottom-0 left-0 h-1 w-full bg-blue-600 rounded-t-full" />
                            )}
                        </button>
                        <button
                            onClick={() => { setActiveTab("security"); setMessage(null); }}
                            className={`relative pb-4 text-sm font-bold transition-all ${activeTab === "security"
                                ? "text-slate-900"
                                : "text-slate-400 hover:text-slate-600"
                                }`}
                        >
                            Sécurité & Mot de passe
                            {activeTab === "security" && (
                                <span className="absolute bottom-0 left-0 h-1 w-full bg-blue-600 rounded-t-full" />
                            )}
                        </button>
                    </div>

                    {/* Profile Tab */}
                    {activeTab === "profile" && (
                        <div className="flex flex-col lg:flex-row gap-12">
                            {/* Avatar Section */}
                            <div className="flex flex-col items-center gap-6 lg:w-48">
                                <div className="relative group">
                                    <div className="size-32 overflow-hidden rounded-3xl bg-slate-100 ring-4 ring-white shadow-lg transition-transform group-hover:scale-105">
                                        <Image
                                            src="/avatar.jpg"
                                            alt="Profil"
                                            width={128}
                                            height={128}
                                            className="size-full object-cover"
                                        />
                                    </div>
                                    <button className="absolute -bottom-2 -right-2 flex size-10 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-xl hover:bg-blue-700 transition-colors border-2 border-white">
                                        <Pencil className="size-4" />
                                    </button>
                                </div>
                                <div className="text-center">
                                    <p className="font-bold text-slate-900">{profileData.nom || "Utilisateur"}</p>
                                    <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-black">Membre</p>
                                </div>
                            </div>

                            {/* Form Section */}
                            <div className="flex-1 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Nom complet</label>
                                        <input
                                            type="text"
                                            name="nom"
                                            value={profileData.nom}
                                            onChange={handleProfileChange}
                                            className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-5 py-3 text-sm text-slate-900 outline-none transition-all focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/5"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Nom d'utilisateur</label>
                                        <input
                                            type="text"
                                            name="nomUtilisateur"
                                            value={profileData.nomUtilisateur}
                                            onChange={handleProfileChange}
                                            className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-5 py-3 text-sm text-slate-900 outline-none transition-all focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/5"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={profileData.email}
                                            onChange={handleProfileChange}
                                            disabled
                                            className="w-full rounded-2xl border border-slate-200 bg-slate-100/50 px-5 py-3 text-sm text-slate-400 cursor-not-allowed"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Date de naissance</label>
                                        <input
                                            type="date"
                                            name="dateNaissance"
                                            value={profileData.dateNaissance}
                                            onChange={handleProfileChange}
                                            className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-5 py-3 text-sm text-slate-900 outline-none transition-all focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/5"
                                        />
                                    </div>

                                    <div className="col-span-full space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Adresse</label>
                                        <input
                                            type="text"
                                            name="adresse"
                                            value={profileData.adresse}
                                            onChange={handleProfileChange}
                                            className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-5 py-3 text-sm text-slate-900 outline-none transition-all focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/5"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <button
                                        onClick={saveProfile}
                                        disabled={saving}
                                        className="group inline-flex items-center gap-3 rounded-full bg-slate-900 px-8 py-3 text-sm font-medium text-white shadow-lg transition-all hover:bg-slate-800 hover:shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50"
                                    >
                                        {saving && <Loader2 className="size-4 animate-spin" />}
                                        <span>Enregistrer les modifications</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Security Tab */}
                    {activeTab === "security" && (
                        <div className="max-w-xl space-y-10">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 mb-6">Changer le mot de passe</h3>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Mot de passe actuel</label>
                                        <input
                                            type="password"
                                            name="currentPassword"
                                            value={securityData.currentPassword}
                                            onChange={handleSecurityChange}
                                            placeholder="••••••••"
                                            className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-5 py-3 text-sm text-slate-900 outline-none transition-all focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/5"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Nouveau mot de passe</label>
                                        <input
                                            type="password"
                                            name="newPassword"
                                            value={securityData.newPassword}
                                            onChange={handleSecurityChange}
                                            placeholder="••••••••"
                                            className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-5 py-3 text-sm text-slate-900 outline-none transition-all focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/5"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button
                                    onClick={saveSecurity}
                                    disabled={saving}
                                    className="group inline-flex items-center gap-3 rounded-full bg-blue-600 px-8 py-3 text-sm font-medium text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50"
                                >
                                    {saving && <Loader2 className="size-4 animate-spin" />}
                                    Mettre à jour le mot de passe
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    )
}
