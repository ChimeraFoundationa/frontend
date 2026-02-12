import { useState } from "react";
import { ethers } from "ethers";
import { getAgentLaunchpadContract } from "../contracts/moltbook";

export default function Launchpad() {
  const [agentId, setAgentId] = useState("");
  const [amount, setAmount] = useState("");
  const [txStatus, setTxStatus] = useState("");

  const buyTokens = async () => {
    try {
      setTxStatus("Processing...");
      const launchpadContract = await getAgentLaunchpadContract();
      const tx = await launchpadContract.buyTokens(agentId, {
        value: ethers.parseEther(amount),
      });
      setTxStatus("Transaction submitted...");
      await tx.wait();
      setTxStatus("Transaction confirmed!");
    } catch (err) {
      console.error(err);
      setTxStatus("Transaction failed");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Agent Token Launchpad</h1>
      <input
        type="text"
        placeholder="Agent ID"
        value={agentId}
        onChange={(e) => setAgentId(e.target.value)}
        className="border p-2 rounded mt-2 w-full"
      />
      <input
        type="text"
        placeholder="Amount (AVAX)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="border p-2 rounded mt-2 w-full"
      />
      <button onClick={buyTokens} className="bg-green-600 text-white px-4 py-2 rounded mt-2">
        Buy Tokens
      </button>
      <p className="mt-2">{txStatus}</p>
    </div>
  );
}
