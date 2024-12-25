import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jjwaolbpfbztzjsmvodd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impqd2FvbGJwZmJ6dHpqc212b2RkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUxNDEwNzYsImV4cCI6MjA1MDcxNzA3Nn0.E-MxuHrykcJLEf0NhrBNdRx-re9KLRqPOTSMsr3qCIo';

export const supabase = createClient(supabaseUrl, supabaseKey);