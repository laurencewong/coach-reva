const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Initialize Supabase admin client with service role key
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

module.exports = supabaseAdmin;
