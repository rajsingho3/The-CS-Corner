import { BrowserRouter, Routes, Route,} from 'react-router-dom'
import { useSelector } from 'react-redux'
import Home from './Pages/Home.jsx'
import Signin from './Pages/Signin.jsx'
import Signup from './Pages/Signup'
import Dashboard from './Pages/Dashboard.jsx'
import About from './Pages/About.jsx'
import Project from './Pages/Project.jsx'
import OtpVerify from './Pages/OtpVerify.jsx'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import PrivateRoute from './components/PrivateRoute'
import OnlyAdminPrivateRoute from './components/OnlyAdminPrivateRoute'
import CreatePost from './Pages/CreatePost'
import UpdatePost from './Pages/UpdatePost'
import PostPage from './Pages/PostPage'
import ScrollToTop from './components/ScrollToTop'
import Search from './Pages/Search'
import CreatePYQ from './Pages/CreatePYQ'
import UpdatePYQ from './Pages/UpdatePYQ'
import PYQBrowser from './Pages/PYQBrowser'
import ThemeProvider from './components/ThemeProvider'

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <div className="min-h-screen bg-slate-900">
          <ScrollToTop/>
          <Header />          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/otp-verify" element={<OtpVerify />} />
            <Route path="/search" element={<Search />} />            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
            <Route path="/pyq-browser" element={<PYQBrowser />} />
            <Route element={<OnlyAdminPrivateRoute />}>
              <Route path="/create-post" element={<CreatePost />} />
              <Route path="/update-post/:postId" element={<UpdatePost />} />
              <Route path="/create-pyq" element={<CreatePYQ />} />
              <Route path="/update-pyq/:pyqId" element={<UpdatePYQ />} />
            </Route>
            <Route path="/about" element={<About />} />
            <Route path="/project" element={<Project />} />
            <Route path="/post/:postSlug" element={<PostPage />} />
            <Route path="/otp-verify" element={<OtpVerify />} />
          </Routes>
          <Footer />
        </div>
      </ThemeProvider>
    </BrowserRouter>
  )
}
