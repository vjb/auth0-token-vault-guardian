import { Auth0AI, getAsyncAuthorizationCredentials } from "@auth0/ai-langchain";
import { AccessDeniedInterrupt } from "@auth0/ai/interrupts";

// Instantiate the official Auth0 AI SDK client
export const auth0AI = new Auth0AI();

/**
 * CIBA / Token Vault Wrapper
 * 
 * This creates a securely bound asynchronous authorization hook. 
 * Any LangGraph node or tool wrapped in this will trigger a Human-in-the-Loop
 * push notification via Auth0 Guardian. 
 * Execution will physically hit a breakpoint until the user approves the scopes.
 */
export const requestAsynchronousVaultConsent = auth0AI.withAsyncAuthorization({
  // In a full production app, this is retrieved from dynamic NextAuth/Auth0 session state.
  // For the hackathon, we statically bind to our demo test user ID.
  userID: process.env.AUTH0_DEMO_USER_ID || "auth0|65f1eb21b83d8e5f2...", 

  // The explicit message sent to Auth0 Guardian for the Human-in-the-loop review
  bindingMessage: async () =>
    `DeFi Vault: Authorize high-value agent transaction.`,
  
  // The dynamic, tightly scoped permissions requested by the Agent
  scopes: ["openid", "execute_transfer", "read:portfolio"],
  
  // The exact secure resource server audience
  audience: process.env.AUTH0_AUDIENCE || "https://api.risk-router-demo.com",

  onAuthorizationRequest: async (_authReq, creds) => {
    console.log("🔒 [AUTH0] Token Vault Consent Push Notification sent to user's device.");
    await creds; // Blocks execution until the mobile push is approved
    console.log("✅ [AUTH0] Token Vault Consent explicitly approved. Resuming execution.");
  },

  onUnauthorized: async (e: Error) => {
    if (e instanceof AccessDeniedInterrupt) {
      console.error("❌ [AUTH0] The user manually revoked the request.");
      throw new Error("User Denied Authorization");
    }
    throw e;
  },
});

/**
 * Helper to retrieve the ephemeral token inside subsequent execution nodes
 */
export function getActiveVaultToken() {
  const credentials = getAsyncAuthorizationCredentials();
  return credentials?.accessToken || null;
}
