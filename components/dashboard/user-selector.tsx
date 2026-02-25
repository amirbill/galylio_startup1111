"use client"

import { useState } from "react"
import { Users, X, Search, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface User {
    id: string
    name: string
    email: string
    role: "client" | "admin"
}

interface UserSelectorProps {
    selectedUsers: string[]
    onUsersChange: (userIds: string[]) => void
    filterRole?: "client" | "admin" | "both"
}

// Mock users - in production, fetch from your API
const mockUsers: User[] = [
    { id: "1", name: "Ahmed Ben Ali", email: "ahmed@example.com", role: "client" },
    { id: "2", name: "Fatma Mansour", email: "fatma@example.com", role: "client" },
    { id: "3", name: "Mohamed Trabelsi", email: "mohamed@example.com", role: "admin" },
    { id: "4", name: "Sarah Gharbi", email: "sarah@example.com", role: "admin" },
    { id: "5", name: "Youssef Kacem", email: "youssef@example.com", role: "client" },
    { id: "6", name: "Leila Amri", email: "leila@example.com", role: "client" },
    { id: "7", name: "Amine Bouazizi", email: "amine@example.com", role: "admin" },
    { id: "8", name: "Sonia Mejri", email: "sonia@example.com", role: "client" },
]

export function UserSelector({ selectedUsers, onUsersChange, filterRole = "both" }: UserSelectorProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

    // Filter users based on role and search
    const filteredUsers = mockUsers.filter((user) => {
        const matchesRole = filterRole === "both" || user.role === filterRole
        const matchesSearch =
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesRole && matchesSearch
    })

    const toggleUser = (userId: string) => {
        if (selectedUsers.includes(userId)) {
            onUsersChange(selectedUsers.filter((id) => id !== userId))
        } else {
            onUsersChange([...selectedUsers, userId])
        }
    }

    const removeUser = (userId: string) => {
        onUsersChange(selectedUsers.filter((id) => id !== userId))
    }

    const selectedUserObjects = mockUsers.filter((user) => selectedUsers.includes(user.id))

    return (
        <div className="space-y-2">
            <label className="block text-xs font-medium text-muted-foreground">
                SPECIFIC USERS {filterRole !== "both" && `(${filterRole.toUpperCase()})`}
            </label>

            {/* Selected Users Display */}
            {selectedUsers.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {selectedUserObjects.map((user) => (
                        <div
                            key={user.id}
                            className="flex items-center gap-1.5 rounded-full bg-purple/10 px-3 py-1 text-xs font-medium text-purple"
                        >
                            <span>{user.name}</span>
                            <button
                                onClick={() => removeUser(user.id)}
                                className="hover:text-purple/70"
                            >
                                <X className="size-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Users Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-muted-foreground transition-all hover:border-purple/50 hover:text-foreground"
            >
                <Users className="size-4" />
                {selectedUsers.length > 0 ? "Modify Users" : "Add Specific Users"}
            </button>

            {/* User Selection Dropdown */}
            {isOpen && (
                <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
                    {/* Search */}
                    <div className="relative mb-3">
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple/20"
                        />
                    </div>

                    {/* User List */}
                    <div className="max-h-48 space-y-1 overflow-y-auto">
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => {
                                const isSelected = selectedUsers.includes(user.id)
                                return (
                                    <button
                                        key={user.id}
                                        onClick={() => toggleUser(user.id)}
                                        className={cn(
                                            "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-all",
                                            isSelected
                                                ? "bg-purple/10 text-purple"
                                                : "hover:bg-muted"
                                        )}
                                    >
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">{user.name}</p>
                                            <p className="text-xs text-muted-foreground">{user.email}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={cn(
                                                    "rounded-full px-2 py-0.5 text-xs font-medium",
                                                    user.role === "admin"
                                                        ? "bg-purple/10 text-purple"
                                                        : "bg-blue-500/10 text-blue-500"
                                                )}
                                            >
                                                {user.role}
                                            </span>
                                            {isSelected && <Check className="size-4 text-purple" />}
                                        </div>
                                    </button>
                                )
                            })
                        ) : (
                            <div className="py-4 text-center text-sm text-muted-foreground">
                                No users found
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="mt-3 flex gap-2 border-t border-border pt-3">
                        <button
                            onClick={() => {
                                onUsersChange([])
                                setIsOpen(false)
                            }}
                            className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted"
                        >
                            Clear All
                        </button>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="flex-1 rounded-lg bg-purple px-3 py-1.5 text-xs font-semibold text-purple-foreground hover:bg-purple/90"
                        >
                            Done
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
