import { useState, useEffect } from "react";
import WalletConnect from "../components/WalletConnect";
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

  return (
    <div className="p-6">
      <WalletConnect />
      <div className="mt-6">
        <input
          type="text"
          placeholder="Enter your wallet address"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      {loading ? (
        <p className="mt-4">Loading agents...</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((agent) => (
            <div key={agent.agentId} className="border p-4 rounded shadow">
              <h2 className="text-lg font-bold">Agent #{agent.agentId}</h2>
              <p>Owner: {agent.owner}</p>
              <p>Token Balance: {agent.tokenBalance}</p>
              <p>Reputation: {agent.reputation}</p>
              <p>AI Recommendation: {agentAIData[agent.agentId]?.recommendation}</p>
              <p>Agent State: {agentAIData[agent.agentId]?.state}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
