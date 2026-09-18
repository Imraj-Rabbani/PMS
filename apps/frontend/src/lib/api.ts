const API_URL = "http://localhost:3000"

export async function signup(data: { name: string; email: string; password: string }) {
    const res = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error ?? "Signup failed")
    return json as { user: { id: string; name: string; email: string }; token: string }
}

export async function signin(data: { email: string; password: string }) {
    const res = await fetch(`${API_URL}/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error ?? "Signin failed")
    return json as { user: { id: string; name: string; email: string }; token: string }
}