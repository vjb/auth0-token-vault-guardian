# 🎬 Auth0 Hackathon Video Script: "LangGraph x Token Vault"
**Target:** Auth0 "Authorized to Act" Judges
**Estimated Time:** ~2:45

### Scene 1: Introduction & Architecture (0:00 - 0:45)
*(Screen: The "Bloomberg Terminal" style Next.js UI on `localhost:3000`. Show the codebase IDE focused on `src/agent/graph.ts`)*

**Voiceover:** 
"Hello, I'm presenting DeFi Guardian—an Institutional Risk Engine. A major problem in autonomous trading is reliance on highly vulnerable static `.env` API keys. If the LLM goes rogue, it drains the wallet. 
To solve this, we decoupled our execution privileges by binding LangGraph.js to the Auth0 Token Vault. Notice our architecture has two explicit Human-in-the-Loop constraints: first, the Agent must securely negotiate an out-of-band CIBA mobile push, and second, our Graph uses `interruptBefore` to physically break state execution before signing Web3 intents."

### Scene 2: User Control & The Hardware Push (0:45 - 1:30)
*(Screen: Click 'Initialize High-Value Rebalance' button. Point out the Consent Panel. Have your phone physically held up to your webcam so the judge sees the Auth0 Guardian Pop-up!)*

**Voiceover:** 
"Let's simulate a massive market crash. The agent realizes it must execute a high-value rebalance. The moment it decides to act, execution securely halts. 
Look at our Consent Panel: it provides real-time lifecycle transparency. You can see the exact scopes the agent is demanding—`execute_transfer` and `read:portfolio`. 
Simultaneously, the Auth0 Token Vault routes a strict CIBA backchannel constraint. As you can see on my phone, the Auth0 Guardian app physically prompts me to explicitly authorize the transaction from out of band."

### Scene 3: Cryptographic Execution & Revocation (1:30 - 2:30)
*(Screen: Tap 'Approve' on your phone. Then instantly switch back to the screen as the Next.js UI unblocks the "Sign & Broadcast Intent" button. Click it. The Ledger populates with the green signature. Then highlight the Revoke button.)*

**Voiceover:** 
"With a simple physical tap, the Vault releases the ephemeral token into the LangGraph node. Our React frontend receives the webhook indicating the Vault is unblocked.
But notice we don't instantly sign the transaction! We explicitly engineered a **Four-Eyes Principle**. Our second software constraint requires the active terminal trader to physically press 'Sign & Broadcast' before the agent is permitted to connect to Viem via Base L2 and generate the EIP-712 cryptographic signature exactly bounded by Auth0! 
And crucially, we maintain ultimate User Control. With this 'Revoke Agent Access' command, the vaulted connection can be explicitly killed, revoking the autonomous agent's privileges entirely. Thank you for viewing."
