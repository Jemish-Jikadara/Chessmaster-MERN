import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SetupProfile from './pages/SetupProfile';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Play from './pages/Play';
import Leaderboard from './pages/Leaderboard';
import Friends from './pages/Friends';
import About from './pages/About';
import EditProfile from './pages/EditProfile';
import OnlinePlay from './pages/OnlinePlay';
import Online from './pages/Online';
import Replay from './pages/Replay';
import Status from './pages/Status';

function HomeWrapper() {
  const { user } = useAuth(); 
  return <Home currentUser={user} />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Layout ke andar saari routes */}
          <Route element={<Layout />}>
            <Route path="/" element={<HomeWrapper />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="setup-profile" element={<SetupProfile />} />
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="about" element={<About />} />

            {/* Protected Routes — PrivateRoute ke andar */}
            <Route element={<PrivateRoute />}>
              <Route path="play" element={<Play />} />
              <Route path="online" element={<Online />} />
              <Route path="online/play" element={<OnlinePlay />} />
              <Route path="profile" element={<Profile />} />
              <Route path="profile/status" element={<Status />} />
              <Route path="edit-profile" element={<EditProfile />} />
              <Route path="settings" element={<Settings />} />
              <Route path="friends" element={<Friends />} />
              <Route path="game/:id" element={<Replay />} />
            </Route>

            <Route path="*" element={<Navigate to="/" />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;