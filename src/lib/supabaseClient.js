import { createClient } from "@supabase/supabase-js";

const url = 'https://zcwavzonfrfgvmtbpgig.supabase.co'
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpjd2F2em9uZnJmZ3ZtdGJwZ2lnIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODI1NDczODQsImV4cCI6MTk5ODEyMzM4NH0.bD4KjlSvlFOQJp77Oe3O4_DpIb_ldhFbF5Ikmq5_MyQ'

export const supabase = createClient(url, key)