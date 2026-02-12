import { ethers } from "ethers";
import { MoltbookContracts } from "../addresses";
import AgentTokenABI from "../abis/AgentToken.json";
import AgentLaunchpadABI from "../abis/AgentLaunchpad.json";
import RLMIntegrationABI from "../abis/RLMIntegration.json";
import LivingAgentExtensionABI from "../abis/LivingAgentExtension.json";

declare global {
  interface Window {
    ethereum?: {
      request<T = any>(args: { method: string; params?: any[] }): Promise<T>;
    };
  }
}

// These will be initialized later when needed
let provider: ethers.BrowserProvider | null = null;
let _signer: ethers.Signer | null = null;
let _AgentTokenContract: ethers.Contract | null = null;
let _AgentLaunchpadContract: ethers.Contract | null = null;
let _RLMIntegrationModule: ethers.Contract | null = null;
let _LivingAgentExtension: ethers.Contract | null = null;

const getProvider = (): ethers.BrowserProvider => {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('Ethereum provider not available. Please install MetaMask or use a compatible browser.');
  }
  
  if (!provider) {
    provider = new ethers.BrowserProvider(window.ethereum);
  }
  return provider;
};

export const getAgentTokenContract = async () => {
  const ethProvider = getProvider();
  if (!_signer) _signer = await ethProvider.getSigner();
  if (!_AgentTokenContract) {
    _AgentTokenContract = new ethers.Contract(
      MoltbookContracts.AgentTokenModule,
      AgentTokenABI,
      _signer
    );
  }
  return _AgentTokenContract;
};

export const getAgentLaunchpadContract = async () => {
  const ethProvider = getProvider();
  if (!_signer) _signer = await ethProvider.getSigner();
  if (!_AgentLaunchpadContract) {
    _AgentLaunchpadContract = new ethers.Contract(
      MoltbookContracts.AgentLaunchpadModule,
      AgentLaunchpadABI,
      _signer
    );
  }
  return _AgentLaunchpadContract;
};

export const getRLMIntegrationModule = async () => {
  const ethProvider = getProvider();
  if (!_signer) _signer = await ethProvider.getSigner();
  if (!_RLMIntegrationModule) {
    _RLMIntegrationModule = new ethers.Contract(
      MoltbookContracts.RLMIntegrationModule,
      RLMIntegrationABI,
      _signer
    );
  }
  return _RLMIntegrationModule;
};

export const getLivingAgentExtension = async () => {
  const ethProvider = getProvider();
  if (!_signer) _signer = await ethProvider.getSigner();
  if (!_LivingAgentExtension) {
    _LivingAgentExtension = new ethers.Contract(
      MoltbookContracts.LivingAgentExtension,
      LivingAgentExtensionABI,
      _signer
    );
  }
  return _LivingAgentExtension;
};
