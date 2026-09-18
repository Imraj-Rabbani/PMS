import { useState } from "react"
import { signup } from "../lib/api"

export default function SignUp() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError("")
        try {
            const { user, token } = await signup({ name, email, password })
            localStorage.setItem("token", token)
            console.log("Signed up:", user)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong")
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-md space-y-5"
            >
                <h2 className="text-2xl font-semibold text-gray-900 text-center">
                    Create an account
                </h2>

                {error && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                        {error}
                    </p>
                )}

                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-black text-white py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                >
                    Sign Up
                </button>

                <p className="text-sm text-gray-500 text-center">
                    Already have an account?{" "}
                    <a href="/signin" className="text-black font-medium hover:underline">
                        Sign in
                    </a>
                </p>
            </form>
        </div>
    )
}