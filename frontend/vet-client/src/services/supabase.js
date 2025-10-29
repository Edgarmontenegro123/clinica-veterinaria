import {createClient} from '@supabase/supabase-js'

export const supabase = createClient('https://vpzpbnftuwmienyciczg.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwenBibmZ0dXdtaWVueWNpY3pnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwNzg0NjksImV4cCI6MjA3NjY1NDQ2OX0.M6EvT9ePkRBobiJFk-ZefQhCd4SlmYZUvzggLOfQpi8')