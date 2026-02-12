import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import AgentProfile from "./pages/AgentProfile";
import Launchpad from "./pages/Launchpad";
import ErrorBoundary from "./components/ErrorBoundary";
import WalletConnect from "./components/WalletConnect";
import { fetchDashboardStats } from "./services/dashboardService";
import type { DashboardStats } from "./services/dashboardService";

function App() {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    activeAgents: 0,
    totalTokens: "0",
    growthRate: "0%",
    rlmActive: false,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await fetchDashboardStats();
        setDashboardStats(data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        // Set default values on error
        setDashboardStats({
          activeAgents: 0,
          totalTokens: "0",
          growthRate: "0%",
          rlmActive: false,
          recentActivity: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-[#0f172a] text-[#f1f5f9]">
          {/* Top Navbar */}
          <nav className="fixed top-0 left-0 right-0 z-10 h-16 bg-[#1e293b] flex items-center justify-between px-4 sm:px-6 shadow-md">
            <div className="flex items-center space-x-2">
              <div className="text-lg sm:text-xl font-bold text-[#60a5fa]">Moltbook</div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4 sm:space-x-6">
              <Link to="/" className="hover:text-[#60a5fa] transition-colors text-sm sm:text-base">Dashboard</Link>
              <Link to="/profile" className="hover:text-[#60a5fa] transition-colors text-sm sm:text-base">Agent Profile</Link>
              <Link to="/launchpad" className="hover:text-[#60a5fa] transition-colors text-sm sm:text-base">Launchpad</Link>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <WalletConnect />
              
              {/* Mobile Menu Button */}
              <button 
                className="md:hidden text-[#f1f5f9]"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </nav>

          {/* Mobile Menu Overlay */}
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-20 bg-black/70 md:hidden" onClick={() => setMobileMenuOpen(false)}>
              <div 
                className="fixed top-16 left-0 right-0 bg-[#1e293b] p-6 shadow-lg"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex flex-col space-y-4">
                  <Link 
                    to="/" 
                    className="hover:text-[#60a5fa] transition-colors py-2 border-b border-[#334155]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/profile" 
                    className="hover:text-[#60a5fa] transition-colors py-2 border-b border-[#334155]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Agent Profile
                  </Link>
                  <Link 
                    to="/launchpad" 
                    className="hover:text-[#60a5fa] transition-colors py-2 border-b border-[#334155]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Launchpad
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <main className="pt-16 pb-8">
            <Routes>
              <Route path="/" element={
                <div className="p-4 sm:p-6">
                  <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold">Moltbook Dashboard</h1>
                    <p className="text-[#94a3b8] text-sm sm:text-base">Welcome to the decentralized agent economy</p>
                  </div>
                  
                  {loading ? (
                    <div className="flex justify-center items-center h-64">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#60a5fa]"></div>
                    </div>
                  ) : (
                    <>
                      {/* Dashboard Overview Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        <div className="bg-[#334155]/30 backdrop-blur-sm border border-[#334155] rounded-xl p-4 sm:p-6 hover:bg-[#334155]/50 transition-all duration-300">
                          <div className="text-[#60a5fa] mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                          </div>
                          <h3 className="text-xl sm:text-2xl font-bold">{dashboardStats.activeAgents}</h3>
                          <p className="text-[#94a3b8] text-xs sm:text-sm">Active Agents</p>
                        </div>
                        
                        <div className="bg-[#334155]/30 backdrop-blur-sm border border-[#334155] rounded-xl p-4 sm:p-6 hover:bg-[#334155]/50 transition-all duration-300">
                          <div className="text-[#a78bfa] mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <h3 className="text-xl sm:text-2xl font-bold">{dashboardStats.totalTokens}</h3>
                          <p className="text-[#94a3b8] text-xs sm:text-sm">Total Tokens</p>
                        </div>
                        
                        <div className="bg-[#334155]/30 backdrop-blur-sm border border-[#334155] rounded-xl p-4 sm:p-6 hover:bg-[#334155]/50 transition-all duration-300">
                          <div className="text-[#34d399] mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                          </div>
                          <h3 className="text-xl sm:text-2xl font-bold">{dashboardStats.growthRate}</h3>
                          <p className="text-[#94a3b8] text-xs sm:text-sm">Growth Rate</p>
                        </div>
                        
                        <div className="bg-[#334155]/30 backdrop-blur-sm border border-[#334155] rounded-xl p-4 sm:p-6 hover:bg-[#334155]/50 transition-all duration-300">
                          <div className="text-[#fbbf24] mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                          </div>
                          <h3 className="text-xl sm:text-2xl font-bold">{dashboardStats.rlmActive ? 'AI Ready' : 'AI Offline'}</h3>
                          <p className="text-[#94a3b8] text-xs sm:text-sm">RLM Active</p>
                        </div>
                      </div>
                      
                      {/* Recent Activity Section */}
                      <div className="mt-6 sm:mt-8 bg-[#334155]/30 backdrop-blur-sm border border-[#334155] rounded-xl p-4 sm:p-6">
                        <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Recent Activity</h2>
                        <div className="space-y-3 sm:space-y-4">
                          {dashboardStats.recentActivity.length > 0 ? (
                            dashboardStats.recentActivity.map((activity) => (
                              <div key={activity.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 hover:bg-[#334155]/50 rounded-lg transition-colors gap-2">
                                <div className="flex items-center space-x-3">
                                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full ${
                                    activity.type === 'A' ? 'bg-[#60a5fa]/20 text-[#60a5fa]' :
                                    activity.type === 'L' ? 'bg-[#a78bfa]/20 text-[#a78bfa]' :
                                    'bg-[#34d399]/20 text-[#34d399]'
                                  } flex items-center justify-center`}>
                                    <span className="text-sm sm:text-base">{activity.type}</span>
                                  </div>
                                  <div>
                                    <div className="font-medium text-sm sm:text-base">{activity.title}</div>
                                    <div className="text-xs sm:text-sm text-[#94a3b8]">{activity.time}</div>
                                  </div>
                                </div>
                                {activity.amount ? (
                                  <div className={`text-right sm:text-left ${
                                    activity.status === 'success' ? 'text-[#34d399]' :
                                    activity.status === 'info' ? 'text-[#fbbf24]' :
                                    'text-[#60a5fa]'
                                  } text-sm sm:text-base`}>
                                    {activity.amount}
                                  </div>
                                ) : (
                                  <div className="text-[#60a5fa] text-sm sm:text-base">AI Processed</div>
                                )}
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-6 sm:py-8 text-[#94a3b8]">
                              No recent activity
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
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
          
          {/* Footer */}
          <footer className="py-6 px-6 border-t border-[#1e293b] text-center text-[#94a3b8] text-sm">
            <div className="container mx-auto">
              © {new Date().getFullYear()} Moltbook Protocol. All rights reserved.
            </div>
          </footer>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
