# 🎬 Auth0 Hackathon Video Script: "LangGraph x Token Vault"
**Target:** Auth0 "Authorized to Act" Judges
**Estimated Time:** ~2:45

### Scene 1: Introduction & Architecture (0:00 - 0:45)
*(Screen: Dashboard running on `localhost:3000`. Show the codebase IDE focused on `src/agent/graph.ts`)*

**Voiceover:** 
"Hello, I'm presenting DeFi Guardian. A major problem in autonomous trading agents is the reliance on highly vulnerable static API keys. If the LLM goes rogue, it drains the wallet. 
To solve this, we pivoted our architecture to LangGraph.js and secured the entire pipeline horizontally with the Auth0 Token Vault. Here in our source code, notice our LangGraph State Machine is explicitly compiled with an `interruptBefore` tag prior to signing any Web3 transactions. The agent MUST ask for explicit human permission via Auth0."

### Scene 2: The Attack Simulation (0:45 - 1:30)
*(Screen: The Streamlit/Next.js UI. Click the 'Trigger Market Crash' button. The UI immediately shifts to AWAITING OWNER CONSENT)*

**Voiceover:** 
"Let's simulate a massive delta variance where the agent determines it needs to liquidate assets. The moment it decides to act, the execution thread halts. Watch the Token Vault Consent Panel. Our user receives an out-of-band CIBA mobile push notification from Auth0 explicitly detailing the exact scopes the agent is requesting: `execute:liquidate` and `read:portfolio`."

### Scene 3: User Control & Cryptographic Execution (1:30 - 2:30)
*(Screen: Click 'Grant Permission' on the UI UI. The Ledger populates with the green viem signature.)*

**Voiceover:** 
"With a simple click of 'Grant Permission', the Auth0 Token Vault releases the securely bounded scope to the LangGraph node. The agent unblocks, connects to viem via Base Sepolia, and successfully generates the EIP-712 cryptographic signature needed to save the protocol margins. 
And crucially, we maintain ultimate User Control. With the 'Revoke Agent Access' command, the vaulted connection is explicitly killed, revoking the autonomous agent's privileges entirely. Thank you for viewing."
