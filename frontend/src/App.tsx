import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AddTaskPage, DashboardPage, EditTaskPage, LoginPage, RegisterPage } from './pages'

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/dashboard' element={<DashboardPage />} />
          <Route path='/addTask' element={<AddTaskPage />} />
          <Route path='/editTask/:id' element={<EditTaskPage />} />
        </Routes>
      </Router >
    </>
  )
}

export default App
