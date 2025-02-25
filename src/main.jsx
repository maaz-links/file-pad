import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './assets/scss/style.scss'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Error from './pages/Error'
import Main from './layouts/Main'
import { GlobalProvider } from './layouts/Context'

import Home from './pages/Home'
import CreatePad from './pages/CreatePad'
import AllPad from './pages/AllPad'
import Preview from './pages/Preview'
import MultipleEntity from './pages/MultipleEntity'
import SingleEntity from './pages/SingleEntity'
import TextEntity from './pages/TextEntity'
import PreviewCall from './pages/PreviewCall'
import Entity from './pages/Entity'

const router = createBrowserRouter([
  {
    path: "",
    element: <Main />,
    errorElement: <Error />,
    children: [
      {
        path: '/',
        element: <CreatePad />
      },
      // {
      //   path: '/create-pad',
      //   element: <CreatePad />
      // },
      // {
      //   path: '/home',
      //   element: <Home />
      // },
      // {
      //   path: '/all-pad',
      //   element: <AllPad />
      // },
      {
        path: '/preview',
        element: <PreviewCall />
      },
      {
        path: "/:dynamicValue",
        element: <Entity />
      },
      // {
      //   path: "/files/:dynamicValue", // Dynamic route to handle paths like `/files/asdf`
      //   element: <MultipleEntity />,
      // },
      // {
      //   path: "/file/:dynamicValue",
      //   element: <SingleEntity />,
      // },
      // {
      //   path: "/text/:dynamicValue",
      //   element: <TextEntity />,
      // },
    ]
  }
])


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GlobalProvider>
      <RouterProvider router={router} />
    </GlobalProvider>
  </StrictMode>,
)
