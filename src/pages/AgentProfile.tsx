import { useState, useEffect } from "react";
import { useAgents } from "../hooks/useAgentContract";
import { getRLMIntegrationModule, getLivingAgentExtension } from "../contracts/moltbook";

interface AgentAI {
  recommendation: string;
  state: string;
}

export default function AgentProfile() {
  const [user, setUser] = useState("");
  const { agents, loading } = useAgents(user);
  const [agentAIData, setAgentAIData] = useState<Record<string, AgentAI>>({});
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'inactive'>('all');

  const fetchAgentAI = async (agentId: string) => {
    try {
      const rlmModule = await getRLMIntegrationModule();
      const laeModule = await getLivingAgentExtension();
      
      const recommendation = await rlmModule.getPricingRecommendation(agentId);
      const state = await laeModule.getAgentState(agentId);
      return { recommendation, state };
    } catch (error) {
      console.error(`Error fetching AI data for agent ${agentId}:`, error);
      return { recommendation: "N/A", state: "N/A" };
    }
  };

  // Fetch AI data for each agent when agents list changes
  useEffect(() => {
    const loadAgentAI = async () => {
      if (agents.length > 0) {
        const aiData: Record<string, AgentAI> = {};
        for (const agent of agents) {
          const data = await fetchAgentAI(agent.agentId);
          aiData[agent.agentId] = data;
        }
        setAgentAIData(aiData);
      }
    };

    loadAgentAI();
  }, [agents]);

  // Filter agents based on active tab
  const filteredAgents = agents.filter(agent => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return parseInt(agent.tokenBalance) > 0;
    if (activeTab === 'inactive') return parseInt(agent.tokenBalance) === 0;
    return true;
  });

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold">Agent Profiles</h1>
        <p className="text-[#94a3b8] text-sm sm:text-base">Manage your autonomous agents and their activities</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
        <button 
          className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-colors text-sm sm:text-base ${
            activeTab === 'all' 
              ? 'bg-[#60a5fa] text-white' 
              : 'bg-[#334155] text-[#94a3b8] hover:bg-[#334155]/70'
          }`}
          onClick={() => setActiveTab('all')}
        >
          All Agents
        </button>
        <button 
          className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-colors text-sm sm:text-base ${
            activeTab === 'active' 
              ? 'bg-[#60a5fa] text-white' 
              : 'bg-[#334155] text-[#94a3b8] hover:bg-[#334155]/70'
          }`}
          onClick={() => setActiveTab('active')}
        >
          Active
        </button>
        <button 
          className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-colors text-sm sm:text-base ${
            activeTab === 'inactive' 
              ? 'bg-[#60a5fa] text-white' 
              : 'bg-[#334155] text-[#94a3b8] hover:bg-[#334155]/70'
          }`}
          onClick={() => setActiveTab('inactive')}
        >
          Inactive
        </button>
      </div>

      {/* Search and Filter */}
      <div className="mb-4 sm:mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search agents..."
            value={user}
            onChange={(e) => setUser(e.target.value)}
            className="w-full bg-[#334155] border border-[#334155] rounded-lg py-2.5 px-3 sm:py-3 sm:px-4 text-[#f1f5f9] focus:outline-none focus:ring-2 focus:ring-[#60a5fa] focus:border-transparent text-sm sm:text-base"
          />
          <svg 
            className="absolute right-2.5 sm:right-3 top-2.5 sm:top-3.5 h-4 sm:h-5 w-4 sm:w-5 text-[#94a3b8]" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#60a5fa]"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredAgents.length > 0 ? (
            filteredAgents.map((agent) => (
              <div 
                key={agent.agentId} 
                className="bg-[#334155]/30 backdrop-blur-sm border border-[#334155] rounded-xl p-4 sm:p-6 hover:bg-[#334155]/50 transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 sm:mb-4 gap-2">
                  <div>
                    <h2 className="text-base sm:text-lg font-bold">Agent #{agent.agentId}</h2>
                    <div className="flex items-center mt-1">
                      <span className={`inline-block w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full mr-1.5 sm:mr-2 ${
                        parseInt(agent.tokenBalance) > 0 ? 'bg-[#34d399]' : 'bg-[#94a3b8]'
                      }`}></span>
                      <span className="text-xs text-[#94a3b8]">
                        {parseInt(agent.tokenBalance) > 0 ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  <div className="bg-[#60a5fa]/10 text-[#60a5fa] text-xs px-2 py-1 rounded-full text-xs sm:text-sm">
                    ID: {agent.agentId}
                  </div>
                </div>

                <div className="space-y-2.5 sm:space-y-3">
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <span className="text-[#94a3b8] text-sm">Owner:</span>
                    <span className="text-sm truncate max-w-[100px] sm:max-w-[120px] text-right">{agent.owner.substring(0, 6)}...{agent.owner.substring(agent.owner.length - 4)}</span>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <span className="text-[#94a3b8] text-sm">Token Balance:</span>
                    <span className="text-sm">{agent.tokenBalance}</span>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <span className="text-[#94a3b8] text-sm">Reputation:</span>
                    <span className="text-sm">{agent.reputation}</span>
                  </div>
                  
                  <div className="pt-2.5 sm:pt-3 border-t border-[#334155]/50">
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <span className="text-[#94a3b8] text-sm">AI Recommendation:</span>
                      <span className="text-[#a78bfa] text-sm">{agentAIData[agent.agentId]?.recommendation || 'N/A'}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between mt-1">
                      <span className="text-[#94a3b8] text-sm">Agent State:</span>
                      <span className="text-[#60a5fa] text-sm">{agentAIData[agent.agentId]?.state || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-[#334155]/50 flex flex-col sm:flex-row gap-2 sm:gap-2">
                  <button className="flex-1 bg-[#60a5fa] hover:bg-[#60a5fa]/90 text-white py-1.5 sm:py-2 px-3 sm:px-4 rounded-lg text-sm transition-colors">
                    Manage
                  </button>
                  <button className="flex-1 bg-[#334155] hover:bg-[#334155]/70 text-[#f1f5f9] py-1.5 sm:py-2 px-3 sm:px-4 rounded-lg text-sm transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8 sm:py-12">
              <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#334155]/50 flex items-center justify-center mb-3 sm:mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 sm:h-8 w-6 sm:w-8 text-[#94a3b8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-medium text-[#f1f5f9] mb-1">No agents found</h3>
              <p className="text-[#94a3b8] text-sm sm:text-base">Get started by launching a new agent on the launchpad</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
