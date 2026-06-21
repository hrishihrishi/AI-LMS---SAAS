import Vapi from "@vapi-ai/web";

/**
 * Global singleton instance of the Vapi client SDK.
 * Initialized with the public Vapi web token from environment variables.
 * This instance is shared across components to manage active calls and event listeners.
 */
export const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN!)