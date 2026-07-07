import { Navigate, Route, Routes } from 'react-router'
import DashboardLayout from '../layouts/DashboardLayout'
import MainLayout from '../layouts/MainLayout'
import AuthPage from '../pages/auth/AuthPage'
import Dashboard from '../pages/dashboard/Dashboard'
import HomePage from '../pages/home/HomePage'
import ListeningListPage from '../pages/listening/ListeningListPage'
import ListeningResultPage from '../pages/listening/ListeningResultPage'
import ListeningTestPage from '../pages/listening/ListeningTestPage'
import ProfilePage from '../pages/profile/ProfilePage'
import ReadingListPage from '../pages/reading/ReadingListPage'
import ReadingResultPage from '../pages/reading/ReadingResultPage'
import ReadingTestPage from '../pages/reading/ReadingTestPage'
import SpeakingFeedbackPage from '../pages/speaking/SpeakingFeedbackPage'
import SpeakingListPage from '../pages/speaking/SpeakingListPage'
import SpeakingPracticePage from '../pages/speaking/SpeakingPracticePage'
import WritingFeedbackPage from '../pages/writing/WritingFeedbackPage'
import WritingListPage from '../pages/writing/WritingListPage'
import WritingTaskPage from '../pages/writing/WritingTaskPage'
import type { User } from '../services/api'

type AppRoutesProps = {
  user: User | null
  onAuthenticated: (user: User) => void
  onSignOut: () => void
}

function AppRoutes({ onAuthenticated, onSignOut, user }: AppRoutesProps) {
  const dashboardShell = user ? (
    <DashboardLayout onSignOut={onSignOut} user={user} />
  ) : (
    <Navigate replace to="/auth" />
  )

  return (
    <Routes>
      <Route element={<MainLayout />} path="/">
        <Route index element={<HomePage user={user} />} />
      </Route>

      <Route
        element={
          user ? (
            <Navigate replace to="/dashboard" />
          ) : (
            <AuthPage onAuthenticated={onAuthenticated} />
          )
        }
        path="/auth"
      />

      <Route
        element={
          user ? (
            <Dashboard onSignOut={onSignOut} user={user} />
          ) : (
            <Navigate replace to="/auth" />
          )
        }
        path="/dashboard"
      />

      <Route element={dashboardShell}>
        <Route
          element={
            user ? (
              <ProfilePage onSignOut={onSignOut} user={user} />
            ) : (
              <Navigate replace to="/auth" />
            )
          }
          path="/profile"
        />
        <Route element={<ReadingListPage />} path="/reading" />
        <Route element={<ListeningListPage />} path="/listening" />
        <Route element={<WritingListPage />} path="/writing" />
        <Route element={<SpeakingListPage />} path="/speaking" />
      </Route>

      <Route
        element={user ? <ReadingTestPage /> : <Navigate replace to="/auth" />}
        path="/reading/:testId"
      />
      <Route
        element={user ? <ReadingResultPage /> : <Navigate replace to="/auth" />}
        path="/reading/:testId/result"
      />
      <Route
        element={user ? <ListeningTestPage /> : <Navigate replace to="/auth" />}
        path="/listening/:testId"
      />
      <Route
        element={
          user ? <ListeningResultPage /> : <Navigate replace to="/auth" />
        }
        path="/listening/:testId/result"
      />
      <Route
        element={user ? <WritingTaskPage /> : <Navigate replace to="/auth" />}
        path="/writing/:taskId"
      />
      <Route
        element={
          user ? <WritingFeedbackPage /> : <Navigate replace to="/auth" />
        }
        path="/writing/:taskId/feedback"
      />
      <Route
        element={
          user ? <SpeakingPracticePage /> : <Navigate replace to="/auth" />
        }
        path="/speaking/:topicId"
      />
      <Route
        element={
          user ? <SpeakingFeedbackPage /> : <Navigate replace to="/auth" />
        }
        path="/speaking/:topicId/feedback"
      />

      <Route element={<Navigate replace to="/" />} path="*" />
    </Routes>
  )
}

export default AppRoutes
