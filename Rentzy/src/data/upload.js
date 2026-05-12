import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export const upload = async ({params},event)=>{
const avatarFile = event.target.files[0]
    try {
        const { data, error } = await supabase.storage
        .from('Rentzy_photo')
        .upload(`${params}/avatar1.png`, avatarFile);
        if(!data){
             console.error("Error while uploading the file "+error);
        }
    } catch (error) {
        console.error("Error while uploading the file "+error)
    }
}