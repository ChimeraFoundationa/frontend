import { useState } from "react";
import { ethers } from "ethers";
import { getAgentLaunchpadContract } from "../contracts/moltbook";

export default function Launchpad() {
  const [agentId, setAgentId] = useState("");
  const [amount, setAmount] = useState("");
  const [txStatus, setTxStatus] = useState<{status: string, type: 'success' | 'error' | 'info'} | null>(null);

  const buyTokens = async () => {
    try {
      setTxStatus({status: "Processing transaction...", type: 'info'});
      const launchpadContract = await getAgentLaunchpadContract();
      const tx = await launchpadContract.buyTokens(agentId, {
        value: ethers.parseEther(amount),
      });
      setTxStatus({status: "Transaction submitted...", type: 'info'});
      await tx.wait();
      setTxStatus({status: "Transaction confirmed!", type: 'success'});
    } catch (err: any) {
      console.error(err);
      setTxStatus({status: `Transaction failed: ${err.message || 'Unknown error'}`, type: 'error'});
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold">Agent Token Launchpad</h1>
        <p className="text-[#94a3b8] text-sm sm:text-base">Purchase tokens for autonomous agents in the Moltbook ecosystem</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:gap-8">
        {/* Purchase Form */}
        <div className="bg-[#334155]/30 backdrop-blur-sm border border-[#334155] rounded-xl p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Buy Agent Tokens</h2>
          
          <div className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-[#94a3b8] mb-1 sm:mb-2">Agent ID</label>
              <input
                type="text"
                placeholder="Enter agent ID"
                value={agentId}
                onChange={(e) => setAgentId(e.target.value)}
                className="w-full bg-[#1e293b] border border-[#334155] rounded-lg py-2.5 px-3 sm:py-3 sm:px-4 text-[#f1f5f9] focus:outline-none focus:ring-2 focus:ring-[#60a5fa] focus:border-transparent text-sm sm:text-base"
              />
            </div>
            
            <div>
              <label className="block text-xs sm:text-sm font-medium text-[#94a3b8] mb-1 sm:mb-2">Amount (AVAX)</label>
              <input
                type="text"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-[#1e293b] border border-[#334155] rounded-lg py-2.5 px-3 sm:py-3 sm:px-4 text-[#f1f5f9] focus:outline-none focus:ring-2 focus:ring-[#60a5fa] focus:border-transparent text-sm sm:text-base"
              />
            </div>
            
            <div className="pt-3 sm:pt-4">
              <button 
                onClick={buyTokens}
                disabled={!agentId || !amount}
                className={`w-full py-2.5 sm:py-3 px-4 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                  !agentId || !amount 
                    ? 'bg-[#334155] text-[#94a3b8] cursor-not-allowed' 
                    : 'bg-[#60a5fa] hover:bg-[#60a5fa]/90 text-white'
                }`}
              >
                Buy Tokens
              </button>
            </div>
            
            {txStatus && (
              <div className={`mt-3 sm:mt-4 p-2.5 sm:p-3 rounded-lg text-sm ${
                txStatus.type === 'success' ? 'bg-[#34d399]/20 text-[#34d399]' :
                txStatus.type === 'error' ? 'bg-[#f87171]/20 text-[#f87171]' :
                'bg-[#fbbf24]/20 text-[#fbbf24]'
              }`}>
                {txStatus.status}
              </div>
            )}
          </div>
        </div>
        
        {/* Info Panel - Stack on mobile, side-by-side on larger screens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-[#334155]/30 backdrop-blur-sm border border-[#334155] rounded-xl p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">About the Launchpad</h2>
            <p className="text-[#94a3b8] text-sm mb-3 sm:mb-4">
              The Agent Token Launchpad enables you to purchase tokens for autonomous agents in the Moltbook ecosystem. 
              Each agent has its own token that represents ownership and voting rights.
            </p>
            <div className="space-y-2.5 sm:space-y-3">
              <div className="flex items-start">
                <div className="mr-2 sm:mr-3 mt-0.5 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#60a5fa]/20 flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 sm:h-4 w-3 sm:w-4 text-[#60a5fa]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-[#f1f5f9] text-sm sm:text-base">Decentralized governance</span>
              </div>
              <div className="flex items-start">
                <div className="mr-2 sm:mr-3 mt-0.5 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#60a5fa]/20 flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 sm:h-4 w-3 sm:w-4 text-[#60a5fa]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-[#f1f5f9] text-sm sm:text-base">AI-powered recommendations</span>
              </div>
              <div className="flex items-start">
                <div className="mr-2 sm:mr-3 mt-0.5 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#60a5fa]/20 flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 sm:h-4 w-3 sm:w-4 text-[#60a5fa]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-[#f1f5f9] text-sm sm:text-base">Revenue sharing mechanisms</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-[#60a5fa]/10 to-[#a78bfa]/10 border border-[#60a5fa]/30 rounded-xl p-4 sm:p-6">
            <div className="flex items-start mb-2.5 sm:mb-3">
              <div className="mr-2 sm:mr-3 mt-0.5 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#60a5fa]/20 flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 sm:h-5 w-4 sm:w-5 text-[#60a5fa]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold">AI-Powered Insights</h3>
                <p className="text-[#94a3b8] text-xs sm:text-sm mt-1">
                  Our RLM (Reinforcement Learning Module) analyzes market conditions to provide optimal pricing recommendations 
                  for agent tokens, helping you make informed investment decisions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Market Stats */}
      <div className="mt-6 sm:mt-8">
        <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Market Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-[#334155]/30 backdrop-blur-sm border border-[#334155] rounded-xl p-3 sm:p-4">
            <div className="text-[#60a5fa] text-xl sm:text-2xl font-bold">24.8K</div>
            <div className="text-[#94a3b8] text-xs sm:text-sm">Total Volume</div>
          </div>
          <div className="bg-[#334155]/30 backdrop-blur-sm border border-[#334155] rounded-xl p-3 sm:p-4">
            <div className="text-[#a78bfa] text-xl sm:text-2xl font-bold">+12.4%</div>
            <div className="text-[#94a3b8] text-xs sm:text-sm">24h Change</div>
          </div>
          <div className="bg-[#334155]/30 backdrop-blur-sm border border-[#334155] rounded-xl p-3 sm:p-4">
            <div className="text-[#34d399] text-xl sm:text-2xl font-bold">1,240</div>
            <div className="text-[#94a3b8] text-xs sm:text-sm">Active Agents</div>
          </div>
        </div>
      </div>
    </div>
  );
}
