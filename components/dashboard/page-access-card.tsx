"use client"

import { useState } from "react"
import { Eye, EyeOff, Globe, Users, UserCog, Save } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { UserSelector } from "@/components/dashboard/user-selector"
import { cn } from "@/lib/utils"

interface PageAccessCardProps {
    pageName: string
    pagePath: string
    category: "Main" | "Dashboard" | "Auth" | "Products"
    initialVisible?: boolean
    initialRole?: "client" | "admin" | "both"
    initialSelectedUsers?: string[]
}

export function PageAccessCard({
    pageName,
    pagePath,
    category,
    initialVisible = true,
    initialRole = "both",
    initialSelectedUsers = [],
}: PageAccessCardProps) {
    const [isVisible, setIsVisible] = useState(initialVisible)
    const [selectedRole, setSelectedRole] = useState<"client" | "admin" | "both">(initialRole)
    const [selectedUsers, setSelectedUsers] = useState<string[]>(initialSelectedUsers)
    const [hasChanges, setHasChanges] = useState(false)

    const handleVisibilityChange = (checked: boolean) => {
        setIsVisible(checked)
        setHasChanges(true)
    }

    const handleRoleChange = (role: "client" | "admin" | "both") => {
        setSelectedRole(role)
        setHasChanges(true)
    }

    const handleUsersChange = (userIds: string[]) => {
        setSelectedUsers(userIds)
        setHasChanges(true)
    }

    const handleSave = () => {
        // Here you would save to your backend/database
        console.log("Saving:", { pagePath, isVisible, selectedRole, selectedUsers })
        setHasChanges(false)
        // TODO: Add API call to save settings
    }

    const getCategoryColor = (cat: string) => {
        switch (cat) {
            case "Main":
                return "bg-blue-500/10 text-blue-500"
            case "Dashboard":
                return "bg-purple/10 text-purple"
            case "Auth":
                return "bg-emerald-500/10 text-emerald-500"
            case "Products":
                return "bg-orange-500/10 text-orange-500"
            default:
                return "bg-gray-500/10 text-gray-500"
        }
    }

    return (
        <div
            className={cn(
                "rounded-lg border border-border bg-card p-5 transition-all",
                !isVisible && "opacity-60",
                hasChanges && "ring-2 ring-purple/30"
            )}
        >
            {/* Header */}
            <div className="mb-4 flex items-start justify-between">
                <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                        <h3 className="text-base font-semibold text-foreground">{pageName}</h3>
                        <span
                            className={cn(
                                "rounded-full px-2 py-0.5 text-xs font-medium",
                                getCategoryColor(category)
                            )}
                        >
                            {category}
                        </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{pagePath}</p>
                </div>

                {/* Visibility Switch */}
                <div className="flex items-center gap-2">
                    {isVisible ? (
                        <Eye className="size-4 text-emerald-500" />
                    ) : (
                        <EyeOff className="size-4 text-red-500" />
                    )}
                    <Switch checked={isVisible} onCheckedChange={handleVisibilityChange} />
                </div>
            </div>

            {/* Role Selection */}
            <div className="mb-4">
                <label className="mb-2 block text-xs font-medium text-muted-foreground">
                    ACCESS CONTROL
                </label>
                <div className="flex gap-2">
                    <button
                        onClick={() => handleRoleChange("client")}
                        className={cn(
                            "flex flex-1 items-center justify-center gap-2 rounded-lg border py-2 text-sm font-medium transition-all",
                            selectedRole === "client"
                                ? "border-purple bg-purple/10 text-purple"
                                : "border-border bg-background text-muted-foreground hover:border-purple/50"
                        )}
                    >
                        <Users className="size-4" />
                        Client
                    </button>

                    <button
                        onClick={() => handleRoleChange("admin")}
                        className={cn(
                            "flex flex-1 items-center justify-center gap-2 rounded-lg border py-2 text-sm font-medium transition-all",
                            selectedRole === "admin"
                                ? "border-purple bg-purple/10 text-purple"
                                : "border-border bg-background text-muted-foreground hover:border-purple/50"
                        )}
                    >
                        <UserCog className="size-4" />
                        Admin
                    </button>

                    <button
                        onClick={() => handleRoleChange("both")}
                        className={cn(
                            "flex flex-1 items-center justify-center gap-2 rounded-lg border py-2 text-sm font-medium transition-all",
                            selectedRole === "both"
                                ? "border-purple bg-purple/10 text-purple"
                                : "border-border bg-background text-muted-foreground hover:border-purple/50"
                        )}
                    >
                        <Globe className="size-4" />
                        Both
                    </button>
                </div>
            </div>

            {/* User-Specific Selection */}
            <div className="mb-4">
                <UserSelector
                    selectedUsers={selectedUsers}
                    onUsersChange={handleUsersChange}
                    filterRole={selectedRole}
                />
            </div>

            {/* Save Button */}
            {hasChanges && (
                <button
                    onClick={handleSave}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-purple px-4 py-2 text-sm font-semibold text-purple-foreground transition-all hover:bg-purple/90"
                >
                    <Save className="size-4" />
                    Save Changes
                </button>
            )}

            {/* Status Indicator */}
            {!hasChanges && (
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <div className="size-2 rounded-full bg-emerald-500" />
                    Settings saved
                </div>
            )}
        </div>
    )
}
