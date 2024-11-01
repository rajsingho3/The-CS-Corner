import { BrowserRouter, Routes, Route,} from 'react-router-dom'
import Home from './pages/Home'
import Signin from './pages/Signin'
import Signup from './Pages/Signup'
import Dashboard from './pages/Dashboard'
import About from './pages/About'
import Project from './pages/Project'
import Header from './components/Header'
import Footer from './components/Footer'
import PrivateRoute from './components/PrivateRoute'
import OnlyAdminPrivateRoute from './components/OnlyAdminPrivateRoute'
import CreatePost from './Pages/CreatePost'
import UpdatePost from './Pages/UpdatePost'
import PostPage from './Pages/PostPage'
import ScrollToTop from './components/ScrollToTop'


export default function App() {
  return (
    <BrowserRouter>
    <ScrollToTop/>
    <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<PrivateRoute />}>

        <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route element={<OnlyAdminPrivateRoute />}>

        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/update-post/:postId" element={<UpdatePost />} />
        </Route>
        <Route path="/about" element={<About />} />
        <Route path="/project" element={<Project />} />
        <Route path="/post/:postSlug" element={<PostPage />} />

        
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}
