import { Account, RpcProvider } from 'starknet';
import * as dotenv from 'dotenv';

dotenv.config();

// Infura node rpc 0.5.1 for Mainnet:
// const providerInfuraMainnet = new RpcProvider({
//   nodeUrl: 'https://starknet-mainnet.infura.io/v3/' + infuraKey,
// });
// Blast node rpc 0.7.0 for Mainnet (0.4, 0.5 & 0_6 also available):
// const providerBlastKeyMainnet = new RpcProvider({
//   nodeUrl: 'https://starknet-mainnet.blastapi.io/' + blastKey + '/rpc/v0_7',
// });
// Lava node rpc 0.6.0 for Mainnet:
// const providerMainnetLava = new RpcProvider({
//   nodeUrl: 'https://g.w.lavanet.xyz:443/gateway/strk/rpc-http/' + lavaMainnetKey,
// });
// Alchemy node rpc 0.6.0 for Mainnet:
// const providerAlchemyMainnet = new RpcProvider({
//   nodeUrl: 'https://starknet-mainnet.g.alchemy.com/starknet/version/rpc/v0_6/' + alchemyKey,
// });
// Public Nethermind node rpc 0.7.0 for Mainnet (0_6 also available):
const providerMainnetNethermindPublic = new RpcProvider({
  nodeUrl: 'https://free-rpc.nethermind.io/mainnet-juno/v0_7',
});
// Public Blast node rpc 0.7.0 for Mainnet (0.4, 0.5 & 0_6 also available) :
const providerBlastMainnet = new RpcProvider({
  nodeUrl: 'https://starknet-mainnet.public.blastapi.io/rpc/v0_7',
});
// Public Lava node rpc 0.6.0 for Mainnet:
const providerLavaMainnet = new RpcProvider({
  nodeUrl: 'https://json-rpc.starknet-mainnet.public.lavanet.xyz',
});

// Infura node rpc 0.5.1 for Sepolia Testnet :
// const providerInfuraSepoliaTestnet = new RpcProvider({
//   nodeUrl: 'https://starknet-sepolia.infura.io/v3/' + infuraKey,
// });
// Public Nethermind node rpc 0.7.0 for Sepolia Testnet (0_6 also available) :
const providerSepoliaTestnetNethermindPublic = new RpcProvider({
  nodeUrl: 'https://free-rpc.nethermind.io/sepolia-juno/v0_7',
});
// Public Blast node rpc 0.7.0 for Sepolia Testnet (0_6 also available) :
const providerSepoliaTestnetBlastPublic = new RpcProvider({
  nodeUrl: 'https://starknet-sepolia.public.blastapi.io/rpc/v0_7',
});


const myNodeUrl = "https://starknet-sepolia.public.blastapi.io/rpc/v0_7";
const privateKey = process.env.PRIVATE_KEY;
const accountAddress = "0x0682a6b082e08d46a0d38481ffc1f6053b6e02ad586a3a3244828783a2df67fd";

// initialize provider
const provider = new RpcProvider({ nodeUrl: `${myNodeUrl}` });

const account = new Account(provider, accountAddress, privateKey);

export { provider, myNodeUrl };