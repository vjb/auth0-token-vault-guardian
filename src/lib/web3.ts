import { createWalletClient, http, LocalAccount } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { baseSepolia } from 'viem/chains';

// Explicit constants required by the hackathon rubric
const CHAIN_ID = 84532; // Base Sepolia
const VERIFYING_CONTRACT = (process.env.RISK_ROUTER_ADDRESS as `0x${string}`) || "0x000000000000000000000000000000000000dEaD";

// Strict EIP-712 Domain definition for "DeFi Guardian"
const domain = {
  name: 'DeFiGuardian',
  version: '1',
  chainId: CHAIN_ID,
  verifyingContract: VERIFYING_CONTRACT,
} as const;

// Primary Type Definition for the signature payload
const types = {
  TradeIntent: [
    { name: 'action', type: 'string' },
    { name: 'threshold', type: 'uint256' },
    { name: 'timestamp', type: 'uint256' },
  ],
} as const;

export class Web3CryptographyManager {
  private account: LocalAccount;
  
  constructor() {
    const rawPk = process.env.PRIVATE_KEY || "fb466a6f0ea5f2ce83b52e22f4f80fccd13964d9d25ad18b5646e68fbc95e7e1";
    // Ensure standard 0x prefix formatting
    const formattedPk = rawPk.startsWith("0x") ? rawPk : `0x${rawPk}`;
    this.account = privateKeyToAccount(formattedPk as `0x${string}`);
  }

  /**
   * Generates an EIP-712 Typed Signature representing the agent's absolute
   * and final execution intent. This must ONLY be invoked after Auth0 Token Vault
   * CIBA consent is officially granted.
   */
  async signTradeIntent(action: string, threshold: bigint, timestamp: bigint): Promise<string> {
    const walletClient = createWalletClient({
      account: this.account,
      chain: baseSepolia,
      transport: http(process.env.WEB3_RPC_URL || "https://sepolia.base.org"),
    });

    console.log(`📝 [WEB3] Generating EIP-712 Signature for [${action}] intent...`);
    if (!process.env.PRIVATE_KEY) {
      console.warn("⚠️ [MOCKED: Hardware Private Key] Using fallback demo key for signature generation.");
    }
    
    // viem's native implementation of eth_signTypedData_v4, wrapped with resilience
    const pRetry = (await import('p-retry')).default;
    
    const signature = await pRetry(
      async () => {
        return await walletClient.signTypedData({
          domain,
          types,
          primaryType: 'TradeIntent',
          message: {
            action,
            threshold,
            timestamp,
          },
        });
      },
      {
        retries: 3,
        onFailedAttempt: error => {
          console.warn(`[WEB3] Signature attempt ${error.attemptNumber} failed. There are ${error.retriesLeft} retries left.`);
        }
      }
    );

    return signature;
  }
}
