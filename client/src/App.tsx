import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { clearData, addData } from "./features/blogSlice"
import { login, logout } from "./features/authSlice"

import axios from "axios";

import Home from "./pages/Home"
import AllBlogs from "./pages/AllBlogs"
import About from "./pages/About"
import Register from "./pages/Register"
import Login from "./pages/Login"
import Layout from "./Layout"
import MainLoader from "./components/MainLoader"
import Profile from "./pages/Profile"
import BlogPage from "./pages/BlogPage"
import SearchResults from "./pages/SearchResults"
import PublishBlog from "./pages/PublishBlog"
import AdminDashboard from "./pages/AdminDashboard"
import NotFound from "./pages/NotFound"
import AllBlogsCategory from "./pages/AllBlogsCategory"


function App() {

  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response: any = await axios.get(
        "/api/v1/users/my-account",
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.data?.statusCode === 200) {
        dispatch(login(response.data))
      } else {
        dispatch(logout())
      }

    } catch (error: any) {

      dispatch(logout())

    } finally {

      setLoading(false)
    }
  }

  const fetchAllBlogs = async () => {
    try {
      setLoading(true);
      const response: any = await axios.get(
        "/api/v1/blogs/all",
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.data?.statusCode === 200) {
        dispatch(addData(response.data.data));
      }

    } catch (error: any) {
      console.log(error)
      clearData();

    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUserData();
    fetchAllBlogs();
  }, [])

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<Layout />}>
        <Route path="" element={<Home />} />
        <Route path="blogs" element={<AllBlogs />} />
        <Route path="blog/search" element={<SearchResults />} />
        <Route path="blog/:blogId" element={<BlogPage />} />
        <Route path="blog/c/:category" element={<AllBlogsCategory />} />
        <Route path="about" element={<About />} />
        <Route path="sign-up" element={<Register />} />
        <Route path="sign-in" element={<Login />} />
        <Route path="my-profile" element={<Profile />} />
        <Route path="publish-blog" element={<PublishBlog />} />
        <Route path="admin/dashboard" element={<AdminDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    )
  )

  return loading ? (
    <MainLoader />
  ) : (
    <RouterProvider router={router} />
  )


}

export default App
