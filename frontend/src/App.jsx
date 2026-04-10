import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Login from "./pages/auth/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import Explore from "./pages/Explore";
import WriteArticle from "./pages/WriteArticle";
import Article from "./pages/Article";
import Signup from "./pages/auth/Signup";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import EditArticle from "./pages/EditArticle";
import EditProfile from "./pages/EditProfile";
import SearchArticle from "./pages/SearchArticle";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      {/* Stays at top no matter what pages */}
      <Navbar />
      <main className="min-h-screen bg-white">
        <Routes>
          {/* If someone goes to root URL, redir to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/feed" element={<Home />} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/edit/profile" element={<EditProfile />} />
          <Route path="/articles/search" element={<SearchArticle />} />

          <Route path="/article/:article_id" element={<Article />} />
          <Route path="/edit/article/:article_id" element={<EditArticle />} />

          <Route path="/explore" element={<Explore />} />
          <Route path="/new/article" element={<WriteArticle />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
