import React from 'react'
import { Route, Routes, Navigate } from "react-router";
import HomePage from "./pages/HomePage.jsx";
import NotePage from "./pages/NotePage.jsx";
import CreateNotePage from "./pages/CreateNotePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import GroupsPage from "./pages/GroupsPage.jsx";
import GroupDetailPage from "./pages/GroupDetailPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import useAuthStore from "./store/useAuthStore.js";

const App = () => {
    const { isAuthenticated } = useAuthStore();

    return (
        <div data-theme="halloween">
            <Routes>
                {/* Public routes */}
                <Route
                    path="/login"
                    element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
                />
                <Route
                    path="/register"
                    element={isAuthenticated ? <Navigate to="/" replace /> : <RegisterPage />}
                />

                {/* Protected routes */}
                <Route
                    path="/"
                    element={<ProtectedRoute><HomePage /></ProtectedRoute>}
                />
                <Route
                    path="/create"
                    element={<ProtectedRoute><CreateNotePage /></ProtectedRoute>}
                />
                <Route
                    path="/note/:id"
                    element={<ProtectedRoute><NotePage /></ProtectedRoute>}
                />
                <Route
                    path="/groups"
                    element={<ProtectedRoute><GroupsPage /></ProtectedRoute>}
                />
                <Route
                    path="/groups/:id"
                    element={<ProtectedRoute><GroupDetailPage /></ProtectedRoute>}
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </div>
    )
}
export default App
