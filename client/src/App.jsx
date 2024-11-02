import { BrowserRouter, Routes, Route,} from 'react-router-dom'
import Home from './pages/Home.jsx'
import Signin from './pages/Signin.jsx'
import Signup from './Pages/Signup.jsx'
import Dashboard from './pages/Dashboard.jsx'
import About from './pages/About.jsx'
import Project from './pages/Project.jsx'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import PrivateRoute from './components/PrivateRoute.jsx'
import OnlyAdminPrivateRoute from './components/OnlyAdminPrivateRoute.jsx'
import CreatePost from './Pages/CreatePost.jsx'
import UpdatePost from './Pages/UpdatePost.jsx'
import PostPage from './Pages/PostPage.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import Search from './Pages/Search.jsx' 


export default function App() {
  return (
    <BrowserRouter>
    <ScrollToTop/>
    <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/search" element={<Search />} />        
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
