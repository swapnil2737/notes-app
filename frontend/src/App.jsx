import React from 'react'
import {Route, Routes} from "react-router";
import HomePage from "./pages/HomePage.jsx";
import NotePage from "./pages/NotePage.jsx";
import CreateNotePage from "./pages/CreateNotePage.jsx";
import toast from "react-hot-toast";
const App = () => {
    return (
        <div data-theme="halloween" >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/create" element={<CreateNotePage />} />
            <Route path="/note/:id" element={<NotePage />} />
          </Routes>
        </div>
    )
}
export default App
