import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './assets/scss/style.scss'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Error from './pages/Error'
import Main from './layouts/Main'

import Home from './pages/Home'
import CreatePad from './pages/CreatePad'
import AllPad from './pages/AllPad'
import Preview from './pages/Preview'

const router = createBrowserRouter([
  {
    path: "",
    element: <Main />,
    errorElement: <Error />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path:'/create-pad',
        element:<CreatePad />
      },
      {
        path:'/all-pad',
        element:<AllPad />
      },
      {
        path:'/preview',
        element:<Preview />
      },
      {
        path: "/:dynamicValue", // Dynamic route to handle paths like `/asdf`
        element: <Home />,
      },
    ]
  }
])


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
