import { useState, useEffect } from "react";

declare global {
  interface Window {
    ethereum?: {
      request<T = any>(args: { method: string; params?: any[] }): Promise<T>;
    };
  }
}

export default function WalletConnect() {
  const [account, setAccount] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    // Check if already connected on component mount
    const checkExistingConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
          }
        } catch (error) {
          console.error("Error checking existing connection:", error);
        }
      }
    };

    checkExistingConnection();
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask or a compatible wallet to use this application.");
      return;
    }

    setConnecting(true);
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      if (accounts && accounts.length > 0) {
        setAccount(accounts[0]);
      }
    } catch (error: any) {
      console.error("Error connecting wallet:", error);
      if (error.code === 4001) {
        // User rejected request
        console.log("User rejected wallet connection request");
      }
    } finally {
      setConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
  };

  return (
    <div>
      {account ? (
        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-[#1e293b] border border-[#334155] rounded-lg px-3 py-2">
            <div className="w-2 h-2 rounded-full bg-[#34d399] mr-2"></div>
            <span className="text-sm text-[#f1f5f9]">
              {account.substring(0, 6)}...{account.substring(account.length - 4)}
            </span>
          </div>
          <button 
            onClick={disconnectWallet}
            className="text-[#94a3b8] hover:text-[#f1f5f9] text-sm transition-colors"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button 
          onClick={connectWallet}
          disabled={connecting}
          className={`flex items-center bg-[#60a5fa] hover:bg-[#60a5fa]/90 text-white px-4 py-2 rounded-lg transition-colors ${
            connecting ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {connecting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Connecting...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Connect Wallet
            </>
          )}
        </button>
      )}
    </div>
  );
}
