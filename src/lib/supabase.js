// lib/supabase.js — All Supabase interactions

const SB_URL = import.meta.env.VITE_SUPABASE_URL;
const SB_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export async function sbAuth(path,body){const r=await fetch(SB_URL+'/auth/v1/'+path,{method:'POST',headers:{'apikey':SB_KEY,'Content-Type':'application/json'},body:JSON.stringify(body)});return r.json();}

export async function sbGetUser(token){const r=await fetch(SB_URL+'/auth/v1/user',{headers:{'apikey':SB_KEY,'Authorization':'Bearer '+token}});return r.ok?r.json():null;}

export async function sbSessions(method,path,token,body){const r=await fetch(SB_URL+'/rest/v1/'+path,{method,headers:{'apikey':SB_KEY,'Authorization':'Bearer '+token,'Content-Type':'application/json','Prefer':'return=representation'},body:body?JSON.stringify(body):undefined});const t=await r.text();return t?JSON.parse(t):null;}
