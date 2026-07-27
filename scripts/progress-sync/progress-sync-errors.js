const SECRET=/(access_token|refresh_token|authorization|password|apikey|sb_secret_|service_role|eyJ[A-Za-z0-9_-]+)/gi;
export function safeSyncError(error){const raw=typeof error==='string'?error:error?.message||'Erreur de transport';return raw.replace(SECRET,'[confidentiel]').slice(0,240)}

