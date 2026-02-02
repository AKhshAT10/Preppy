import React from 'react';
import {BrowserRouter as Router , Routes , Route , Navigate} from 'react-router-dom';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import DashBoard from './pages/dashboard/DashBoard'
import DocumentListPage from './pages/documents/DocumentListPage'
import DocumentDetailPage from './pages/documents/DocumentDetailPage'
import FlashCardListPage from './pages/flashcards/FlashCardListPage'
import FlashCardPage from './pages/flashcards/FlashCardPage'
import QuizTakePage from './pages/quizzes/QuizTakePage'
import QuizResultPage from './pages/quizzes/QuizResultPage'
import ProfilePage from './pages/profile/ProfilePage'
import ProtectedRoute from './components/auth/ProtectedRoute'

const App = () => {
  const isAuthenticated = false
  const isLoading = false

  if(isLoading){
    return(
        <div className='flex items-center justify-center h-screen'><p>Loading...</p></div>
    );
  }

  return(
    <Router>
      <Routes>
        <Route path='/' element={isAuthenticated ? <Navigate to="/dashboard" replace/> : <Navigate to="/login" replace/>}/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/register' element={<RegisterPage/>}/>

        {/*ProtectedRoute*/}
        <Route element={<ProtectedRoute/>}>
        <Route path='/dashboard' element={<DashBoard/>}/>
        <Route path='/documents' element={<DocumentListPage/>}/>
        <Route path='/documents/:id' element={<DocumentDetailPage/>}/>
        <Route path='/flashcards' element={<FlashCardListPage/>}/>
        <Route path='/documents/:id/flashcards' element={<FlashCardPage/>}/>
        <Route path='quizzes/:quizId' element={<QuizTakePage/>}/>
        <Route path='/quizzes/:quizId/results' element={<QuizResultPage/>}/>
        <Route path='/profile' element={<ProfilePage/>}/>
        </Route>

        <Route path='*' element={<NotFoundPage/>}/>
      </Routes>
    </Router>
  )
}

export default App