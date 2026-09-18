import { Routes, Route, Navigate } from "react-router-dom"
import SignUp from "./pages/Signup"
import SignIn from "./pages/Signin"


function App() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/signin" replace />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
        </Routes>
    )
}

export default App