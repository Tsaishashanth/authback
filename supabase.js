const { createClient} = require('@supabase/supabase-js');

const SUPABASE_URL = "https://wbebrfxugmvudnxydzgx.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndiZWJyZnh1Z212dWRueHlkemd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2MDg3MzIsImV4cCI6MjA2NzE4NDczMn0.thupLVkS4LzI-pvMztkAtvdWA9MNfhL-7Cl1GmtNwz8";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

module.exports = supabase;