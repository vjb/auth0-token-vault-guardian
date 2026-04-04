# 🎬 Auth0 Hackathon Video Script: "LangGraph x Token Vault"
**Target:** Auth0 "Authorized to Act" Judges
**Estimated Time:** ~2:45

### Scene 1: Introduction & Architecture (0:00 - 0:45)
*(Screen: Dashboard running on `localhost:3000`. Show the codebase IDE focused on `src/agent/graph.ts`)*

**Voiceover:** 
"Hello, I'm presenting DeFi Guardian. A major problem in autonomous trading agents is the reliance on highly vulnerable static API keys. If the LLM goes rogue, it drains the wallet. 
To solve this, we pivoted to LangGraph.js and secured the entire pipeline horizontally with the Auth0 Token Vault. Notice our architecture has two explicit Human-in-the-Loop constraints: first, the Agent must negotiate an out-of-band CIBA mobile push, and second, our Graph uses `interruptBefore` to securely break state execution before signing Web3 transactions."

### Scene 2: The Attack Simulation & Hardware Push (0:45 - 1:30)
*(Screen: The Next.js UI. Click 'Initialize High-Value Rebalance' button. Have your phone mirrored to the screen or physically hold it up to your webcam so the judge sees the Auth0 Guardian Pop-up!)*

**Voiceover:** 
"Let's simulate a massive delta variance where the agent realizes it must execute a high-value rebalance. The moment it decides to act, execution halts seamlessly. 
Because the Vault is locked, the Auth0 AI SDK automatically routes a strict OpenID CIBA backchannel request. As you can see right here on my phone, the Auth0 Guardian app physically prompts me to explicitly authorize the transaction from out of band."

### Scene 3: User Control & Cryptographic Execution (1:30 - 2:30)
*(Screen: Tap 'Approve' on your phone. Then instantly switch back to the screen as the Next.js UI unblocks the "Sign & Broadcast Intent" button. Click it. The Ledger populates with the green signature.)*

**Voiceover:** 
"With a simple physical tap, the Vault releases the token to the LangGraph node. Our React frontend receives the webhook indicating the Vault is unblocked, securely satisfying the hardware constraint.
Finally, satisfying our second software constraint, the human hits 'Sign & Broadcast Protocol'. The agent instantly unblocks the thread, connects to Viem via Base L2, and generates an EIP-712 cryptographic signature exactly aligned down to the exact scope allowed by Auth0! Thank you."
