import { useState } from "react";

declare global {
  interface Window {
    ethereum?: {
      request<T = any>(args: { method: string; params?: any[] }): Promise<T>;
    };
  }
}

export default function WalletConnect() {
  const [account, setAccount] = useState<string>("");

  const connectWallet = async () => {
    if (!window.ethereum) return alert("Install MetaMask");
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      if (accounts && accounts.length > 0) {
        setAccount(accounts[0]);
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  return (
    <div>
      {account ? (
        <span>Connected: {account.substring(0, 6)}...{account.substring(account.length - 4)}</span>
      ) : (
        <button onClick={connectWallet} className="bg-blue-600 text-white px-4 py-2 rounded">
          Connect Wallet
        </button>
      )}
    </div>
  );
}
