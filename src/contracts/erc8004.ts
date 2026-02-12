import { ethers } from "ethers";
import { ERC8004Contracts } from "../addresses";
import IdentityRegistryABI from "../abis/IdentityRegistry.json";
import ReputationRegistryABI from "../abis/ReputationRegistry.json";

const provider = new ethers.JsonRpcProvider("https://api.avax-test.network/ext/bc/C/rpc");

export const IdentityRegistry = new ethers.Contract(
  ERC8004Contracts.IdentityRegistry,
  IdentityRegistryABI,
  provider
);

export const ReputationRegistry = new ethers.Contract(
  ERC8004Contracts.ReputationRegistry,
  ReputationRegistryABI,
  provider
);
