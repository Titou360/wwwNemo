import type { RouteRecord } from 'vite-react-ssg'
import Home from './pages/Home'

export const routes: RouteRecord[] = [
  {
    path: '/',
    index: true,
    element: <Home />,
    entry: 'src/pages/Home.tsx',
  },
]
