'use server'

import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "../supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/**
 * createCompanion Server Action
 * Creates a new learning companion inside Supabase and sets the author to the current user's clerk ID.
 */
export const createCompanion = async (formData: CreateCompanion) => {
    const {userId: author} = await auth();
    const supabase = createSupabaseClient();
    const { data, error } = await supabase.from('companions').insert({...formData, author}).select()

    if (error || !data) throw new Error(error?.message || 'Failed to create companion')
    return data[0]
}

/**
 * getAllCompanions Server Action
 * Retrieves companions from Supabase with support for pagination, and search filters (by subject and/or topic).
 * Also appends a transient `bookmarked` Boolean status for each companion returned.
 */
export const getAllCompanions = async ({limit=10, page=1, subject, topic}:GetAllCompanions) => {
    const { userId } = await auth();
    if (!userId) redirect('/sign-in');
    
    const supabase = createSupabaseClient();

    // Query builder initialization
    let query = supabase.from('companions').select()
    
    // Apply ilike case-insensitive filters depending on provided parameters
    if (subject && topic){
        query = query.ilike('subject',`%${subject}%`).or(`topic.ilike('%${topic}%')`)
    } else if (subject){
        query = query.ilike('subject',`%${subject}%`)
    } else if (topic){
        query = query.ilike('topic',`%${topic}%`)
    }
    
    // Apply offset range pagination limits
    query = query.range((page-1)*limit, page*limit-1)
    const { data: companions,  error } = await query 

    // Retrieve active bookmarks for the current user
    const bookmarkedCompanions = await getBookmarkedCompanions(userId);
    const bookmarkedCompanionIds = bookmarkedCompanions?.filter(Boolean).map((companion_row: any) => companion_row.id);

    // Map through results and append matching `bookmarked` Boolean flags
    companions?.forEach((companion: any) => {
        companion.bookmarked = bookmarkedCompanionIds.includes(companion.id)
    })

    if (error) throw new Error(error.message);
    return companions;
}

/**
 * getCompanion Server Action
 * Fetches a single companion profile record by its primary ID.
 */
export const getCompanion = async(id:string) => {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase.from('companions').select().eq('id', id)

    if (error) console.log(error.message);
    return data?.[0];
}

/**
 * addToSessionHistory Server Action
 * Upserts a session history item. If the companion was accessed previously, updates last_accessed timestamp.
 * Otherwise, inserts a new entry into session_history.
 */
export const addToSessionHistory = async(companionId:string) => {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");
    const supabase = createSupabaseClient();

    // Query if record exists for this user and companion combination
    const { data: existing, error: fetchError } = await supabase
        .from('session_history')
        .select('companion_id')
        .eq('companion_id', companionId)
        .eq('user_id', userId);
    if (fetchError) throw new Error(fetchError.message);

    let result;
    if (existing && existing.length > 0) {
        // Record exists, update the last_accessed field to now
        const { data, error } = await supabase
            .from('session_history')
            .update({ last_accessed: new Date().toISOString() })
            .eq('companion_id', companionId)
            .eq('user_id', userId)
            .select();
        if (error) throw new Error(error.message);
        result = data;
    } else {
        // No prior record, insert a new session entry
        const { data, error } = await supabase
            .from('session_history')
            .insert({ companion_id: companionId, user_id: userId })
            .select();
        if (error) throw new Error(error.message);
        result = data;
    }
    return result;
}

/**
 * deleteCompanion Server Action
 * Deletes a companion. Restricts deleting only to the companion's creator (author).
 */
export const deleteCompanion = async(companionId: string) => {
    const {userId} = await auth();
    if (!userId) throw new Error("Unauthorized");

    const supabase = createSupabaseClient();
    const { data, error } = await supabase.from('companions').delete().eq('id', companionId).eq('author', userId)

    if (error) throw new Error(error.message);
    return data;
}

/**
 * getRecentSessions Server Action
 * Fetches the user's recently accessed companion sessions, ordered by last_accessed descending.
 */
export const getRecentSessions = async(limit=10) => {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase.from('session_history')
        .select(`companions:companion_id (*)`)
        .order('last_accessed', { ascending: false })
        .limit(limit)

    if(error) throw new Error(error.message);
    return data.map(({ companions }) => companions);
}
 
/**
 * getUserSessions Server Action
 * Fetches companion sessions for a specified user, ordered by creation date.
 */
export const getUserSessions = async(userId: string, limit=10) => {
    const supabase = createSupabaseClient();

    const { data, error } = await supabase.from('session_history')
        .select(`companions:companion_id (*)`)
        .order('created_at', { ascending: false })
        .eq('user_id', userId)
        .limit(limit)

    if(error) throw new Error(error.message);
    return data.map(({ companions }) => companions);
}

/**
 * getUserCompanions Server Action
 * Fetches all companions authored/created by the specified user.
 */
export const getUserCompanions = async (userId: string) => {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
        .from('companions')
        .select()
        .eq('author', userId)

    if(error) throw new Error(error.message);

    return data;
}

/**
 * addBookmark Server Action
 * Adds a companion record to the user's bookmarks list and triggers route path cache revalidation.
 */
export const addBookmark = async (companionId: string, path: string) => {
  const { userId } = await auth();
  if (!userId) return;
  const supabase = createSupabaseClient();
  const { data, error } = await supabase.from("bookmarks").insert({
    companion_id: companionId,
    user_id: userId,
  });
  if (error) {
    throw new Error(error.message);
  }

  // Clear path cache to force dynamic server-side update of bookmark badges
  revalidatePath(path);
  return data;
};

/**
 * removeBookmark Server Action
 * Deletes a companion record from the user's bookmarks list and triggers route path cache revalidation.
 */
export const removeBookmark = async (companionId: string, path: string) => {
  const { userId } = await auth();
  if (!userId) return;
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("companion_id", companionId)
    .eq("user_id", userId);
  if (error) {
    throw new Error(error.message);
  }
  revalidatePath(path);
  return data;
};

/**
 * getBookmarkedCompanions Server Action
 * Retrieves all companions bookmarked by a specified user.
 */
export const getBookmarkedCompanions = async (userId: string) => {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("bookmarks")
    .select(`companions:companion_id (*)`)
    .eq("user_id", userId);
  if (error) {
    throw new Error(error.message);
  }
  // Return only the mapped companion objects
  return data.map(({ companions }) => companions);
};