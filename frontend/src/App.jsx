import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Login from "./pages/auth/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import Explore from "./pages/Explore";
import WriteArticle from "./pages/WriteArticle";
import Article from "./pages/Article";

function App() {
  return (
    <BrowserRouter>
      {/* Stays at top no matter what pages */}
      <Navbar />
      <main className="min-h-screen bg-white">
        <Routes>
          {/* If someone goes to root URL, redir to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/feed" element={<Home />} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/article/:article_id" element={<Article />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/new/article" element={<WriteArticle />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
