'use server'

import { API_URL } from "@/lib/api"
import { cookies } from "next/headers"

export async function signinAction(formData: any) {
    try {
        const res = await fetch(`${API_URL}/auth/signin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
            cache: 'no-store'
        });

        const data = await res.json();

        if (!res.ok) {
            return { success: false, error: data.detail || 'Signin failed' };
        }

        // Set cookie on server side
        if (data.access_token) {
            const cookieStore = await cookies();
            cookieStore.set('token', data.access_token, {
                httpOnly: false, // Keeping false for compatibility as discussed
                secure: process.env.NODE_ENV === 'production',
                path: '/',
                maxAge: 60 * 60 * 24 * 7 // 1 week
            });

            // Fetch user profile server-side to avoid client call
            try {
                const meRes = await fetch(`${API_URL}/auth/me`, {
                    headers: {
                        'Authorization': `Bearer ${data.access_token}`
                    },
                    cache: 'no-store'
                });

                if (meRes.ok) {
                    const userData = await meRes.json();
                    return { success: true, user: userData, role: userData.role };
                }
            } catch (err) {
                console.error("Error fetching user profile in signinAction:", err);
            }
        }

        return { success: true, data };
    } catch (error) {
        console.error("Signin Action Error:", error);
        return { success: false, error: "Network error" };
    }
}

export async function signupAction(formData: any) {
    try {
        const res = await fetch(`${API_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
            cache: 'no-store'
        });

        const data = await res.json();

        if (!res.ok) {
            return { success: false, error: data.detail || 'Signup failed' };
        }

        return { success: true, data };
    } catch (error) {
        console.error("Signup Action Error:", error);
        return { success: false, error: "Network error" };
    }
}

export async function googleLoginAction(credential: string) {
    try {
        const res = await fetch(`${API_URL}/auth/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ credential }),
            cache: 'no-store'
        });

        const data = await res.json();

        if (!res.ok) {
            return { success: false, error: data.detail || 'Google login failed' };
        }

        if (data.access_token) {
            const cookieStore = await cookies();
            cookieStore.set('token', data.access_token, {
                secure: process.env.NODE_ENV === 'production',
                path: '/',
                maxAge: 60 * 60 * 24 * 7
            });
        }

        return { success: true, data };
    } catch (error) {
        console.error("Google Login Action Error:", error);
        return { success: false, error: "Network error" };
    }
}

export async function verifyEmailAction(email: string, code: string) {
    try {
        const res = await fetch(`${API_URL}/auth/verify-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, code }),
            cache: 'no-store'
        });

        const data = await res.json();

        if (!res.ok) {
            return { success: false, error: data.detail || 'Verification failed' };
        }

        // If verification returns a token (auto-login), set it
        if (data.access_token) {
            const cookieStore = await cookies();
            cookieStore.set('token', data.access_token, {
                secure: process.env.NODE_ENV === 'production',
                path: '/',
                maxAge: 60 * 60 * 24 * 7
            });
        }

        return { success: true, data };
    } catch (error) {
        console.error("Verify Action Error:", error);
        return { success: false, error: "Network error" };
    }
}

export async function resendVerificationAction(email: string) {
    try {
        const res = await fetch(`${API_URL}/auth/resend-verification`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
            cache: 'no-store'
        });

        const data = await res.json();

        if (!res.ok) {
            return { success: false, error: data.detail || 'Resend failed' };
        }

        return { success: true, data };
    } catch (error) {
        console.error("Resend Verification Action Error:", error);
        return { success: false, error: "Network error" };
    }
}

export async function forgotPasswordAction(email: string) {
    try {
        const res = await fetch(`${API_URL}/auth/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
            cache: 'no-store'
        });

        const data = await res.json();

        if (!res.ok) {
            return { success: false, error: data.detail || 'Request failed' };
        }

        return { success: true, data };
    } catch (error) {
        console.error("Forgot Password Action Error:", error);
        return { success: false, error: "Network error" };
    }
}

export async function resetPasswordAction(data: any) {
    try {
        const res = await fetch(`${API_URL}/auth/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            cache: 'no-store'
        });

        const resData = await res.json();

        if (!res.ok) {
            return { success: false, error: resData.detail || 'Reset failed' };
        }

        return { success: true, data: resData };
    } catch (error) {
        console.error("Reset Password Action Error:", error);
        return { success: false, error: "Network error" };
    }
}

export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete('token');
    return { success: true };
}

export async function updateProfileAction(data: any) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        if (!token) return { success: false, error: "Not authenticated" };

        const res = await fetch(`${API_URL}/auth/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data),
            cache: 'no-store'
        });

        const resData = await res.json();

        if (!res.ok) {
            return { success: false, error: resData.detail || 'Update failed' };
        }

        return { success: true, data: resData };
    } catch (error) {
        console.error("Update Profile Action Error:", error);
        return { success: false, error: "Network error" };
    }
}

export async function changePasswordAction(data: any) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        if (!token) return { success: false, error: "Not authenticated" };

        const res = await fetch(`${API_URL}/auth/change-password`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data),
            cache: 'no-store'
        });

        const resData = await res.json();

        if (!res.ok) {
            return { success: false, error: resData.detail || 'Change password failed' };
        }

        return { success: true, data: resData };
    } catch (error) {
        console.error("Change Password Action Error:", error);
        return { success: false, error: "Network error" };
    }
}

export async function getMeAction() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        if (!token) return { success: false, error: "Not authenticated" };

        const res = await fetch(`${API_URL}/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}` },
            cache: 'no-store'
        });

        if (res.ok) {
            const data = await res.json();
            return { success: true, data };
        }
        return { success: false, error: "Failed to fetch profile" };
    } catch (error) {
        console.error("Get Me Action Error:", error);
        return { success: false, error: "Network error" };
    }
}

