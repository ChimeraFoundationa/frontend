import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AgentProfile from "./pages/AgentProfile";
import Launchpad from "./pages/Launchpad";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <nav className="p-4 bg-gray-800 text-white flex space-x-4">
            <Link to="/" className="hover:underline">Home</Link>
            <Link to="/profile" className="hover:underline">Agent Profile</Link>
            <Link to="/launchpad" className="hover:underline">Launchpad</Link>
          </nav>
          <main>
            <Routes>
              <Route path="/" element={
                <div className="p-6">
                  <h1 className="text-2xl font-bold mb-4">Welcome to Moltbook Dashboard</h1>
                  <p>This is the homepage of the Moltbook application.</p>
                </div>
              } />
              <Route path="/profile" element={
                <ErrorBoundary>
                  <AgentProfile />
                </ErrorBoundary>
              } />
              <Route path="/launchpad" element={
                <ErrorBoundary>
                  <Launchpad />
                </ErrorBoundary>
              } />
            </Routes>
          </main>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
