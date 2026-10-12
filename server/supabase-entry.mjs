import { createSupabaseHandler } from './supabase.mjs';
Deno.serve(createSupabaseHandler(name => Deno.env.get(name)));
