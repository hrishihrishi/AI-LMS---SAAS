'use server'
import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "../supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const createCompanion = async (formData: CreateCompanion) => {
    const {userId: author} = await auth();
    const supabase = createSupabaseClient();
    const { data, error } = await supabase.from('companions').insert({...formData, author}).select()

    if (error || !data) throw new Error(error?.message || 'Failed to create companion')
    return data[0]
}

export const getAllCompanions = async ({limit=10, page=1, subject, topic}:GetAllCompanions) => {
    const { userId } = await auth();
    if (!userId) redirect('/sign-in');
    
    const supabase = createSupabaseClient();

    // Search for companions
    let query = supabase.from('companions').select()
    if (subject && topic){
        query = query.ilike('subject',`%${subject}%`).or(`topic.ilike('%${topic}%')`)
    } else if (subject){
        query = query.ilike('subject',`%${subject}%`)
    } else if (topic){
        query = query.ilike('topic',`%${topic}%`)
    }
    query = query.range((page-1)*limit, page*limit-1)
    const { data: companions,  error } = await query 

    // Search and add bookmarked status
    const bookmarkedCompanions = await getBookmarkedCompanions(userId);

    const bookmarkedCompanionIds = bookmarkedCompanions?.filter(Boolean).map((companion_row: any) => companion_row.id);

    companions?.forEach((companion: any) => {
        companion.bookmarked = bookmarkedCompanionIds.includes(companion.id)
    })

    if (error) throw new Error(error.message);
    return companions;
}

export const getCompanion = async(id:string) => {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase.from('companions').select().eq('id', id)

    if (error) console.log(error.message);
    return data?.[0];
}

// export const addToSessionHistory = async(companionId:string) => {
//     const { userId } = await auth();
//     const supabase = createSupabaseClient();
//     const { data, error } = await supabase.from('session_history').insert({
//         companion_id: companionId, user_id: userId
//     })

//     if (error) throw new Error(error.message);
//     return data;
// }

export const addToSessionHistory = async(companionId:string) => {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");
    const supabase = createSupabaseClient();

    // Check if the record already exists for this user and companion
    const { data: existing, error: fetchError } = await supabase
        .from('session_history')
        .select('companion_id')
        .eq('companion_id', companionId)
        .eq('user_id', userId);
    if (fetchError) throw new Error(fetchError.message);

    let result;
    if (existing && existing.length > 0) {
        // Update the timestamp to bring it to the top
        const { data, error } = await supabase
            .from('session_history')
            .update({ last_accessed: new Date().toISOString() })
            .eq('companion_id', companionId)
            .eq('user_id', userId)
            .select();
        if (error) throw new Error(error.message);
        result = data;
    } else {
        // Insert a new record if it doesn't exist
        const { data, error } = await supabase
            .from('session_history')
            .insert({ companion_id: companionId, user_id: userId })
            .select();
        if (error) throw new Error(error.message);
        result = data;
    }
    return result;
}


export const getRecentSessions = async(limit=10) => {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase.from('session_history')
        .select(`companions:companion_id (*)`)
        .order('last_accessed', { ascending: false })
        .limit(limit)

    if(error) throw new Error(error.message);
    return data.map(({ companions }) => companions);
}
 
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

export const getUserCompanions = async (userId: string) => {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
        .from('companions')
        .select()
        .eq('author', userId)

    if(error) throw new Error(error.message);

    return data;
}


// Bookmarks
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
  // Revalidate the path to force a re-render of the page

  revalidatePath(path);
  return data;
};

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


export const getBookmarkedCompanions = async (userId: string) => {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("bookmarks")
    .select(`companions:companion_id (*)`) // Notice the (*) to get all the companion data
    .eq("user_id", userId);
  if (error) {
    throw new Error(error.message);
  }
  // We don't need the bookmarks data, so we return only the companions
  return data.map(({ companions }) => companions);
};