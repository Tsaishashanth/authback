const { createClient} = require('@supabase/supabase-js');

const SUPABASE_URL = "https://wbebrfxugmvudnxydzgx.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndiZWJyZnh1Z212dWRueHlkemd4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTYwODczMiwiZXhwIjoyMDY3MTg0NzMyfQ.qciF0nhRNWV8YMKq0LkXrkbwJDb3MS2RuN-KRvG86gY";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

module.exports = supabase;