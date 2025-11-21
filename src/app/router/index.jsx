 import { createBrowserRouter } from 'react-router-dom'
import RootLayout from '../../layouts/RootLayout'
import DiaryListPage from '../../pages/diary/diary-List/DiaryListPage'
import DiaryCreatePage from '../../pages/diary/diary-create/DiaryCreatePage'
import DiaryDetailPage from '../../pages/diary/diary-detail/DiaryDetailPage'
import MyPage from '../../pages/my/MyPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <DiaryListPage /> },
      { path: 'diary/new', element: <DiaryCreatePage /> },
      { path: 'diary/:id', element: <DiaryDetailPage /> },
      { path: 'my', element: <MyPage /> }
    ]
  }
])
