import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

/**
 * Creates a Supabase client configured to authenticate using Clerk's JWT tokens.
 * This integrates Clerk auth session tokens with Supabase Row Level Security (RLS).
 */
export const createSupabaseClient = () => {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!, {
            // Dynamically fetches the current Clerk session token for each database request
            async accessToken() {
                return ((await auth()).getToken())
            }
        }
    )
}