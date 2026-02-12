import { useState, useEffect } from "react";
import { getAgentTokenContract } from "../contracts/moltbook";
import { IdentityRegistry, ReputationRegistry } from "../contracts/erc8004";

export interface Agent {
  agentId: string;
  owner: string;
  tokenBalance: string;
  reputation: string;
}

export function useAgents(userAddress: string) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgents = async () => {
      setLoading(true);
      try {
        // Check if we have a valid user address
        if (!userAddress) {
          setAgents([]);
          return;
        }
        
        // Ambil semua agent yang dimiliki user
        const totalAgents = await IdentityRegistry.balanceOf(userAddress);
        const agentList: Agent[] = [];

        for (let i = 0; i < totalAgents; i++) {
          const agentId = await IdentityRegistry.tokenOfOwnerByIndex(userAddress, i);
          const agentTokenContract = await getAgentTokenContract();
          const tokenBalance = await agentTokenContract.balanceOf(userAddress, agentId);
          const reputation = await ReputationRegistry.getReputation(agentId);

          agentList.push({
            agentId: agentId.toString(),
            owner: userAddress,
            tokenBalance: tokenBalance.toString(),
            reputation: reputation.toString(),
          });
        }

        setAgents(agentList);
      } catch (err) {
        console.error("Error fetching agents:", err);
        // Set empty array on error to prevent blank UI
        setAgents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents(); // Call regardless of userAddress to ensure loading state updates
  }, [userAddress]);

  return { agents, loading };
}
