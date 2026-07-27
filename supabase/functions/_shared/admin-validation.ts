import{AdminError}from'./admin-errors.ts';
export const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export function email(value:unknown){if(typeof value!=='string')throw new AdminError('INVALID_EMAIL');const clean=value.trim().toLowerCase();if(clean.length>254||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean))throw new AdminError('INVALID_EMAIL');return clean}
export function displayName(value:unknown){if(value==null)return'';if(typeof value!=='string')throw new AdminError('INVALID_REQUEST');const clean=value.trim();if(clean.length>80||/[<>\u0000-\u001f\u007f]/.test(clean))throw new AdminError('INVALID_REQUEST');return clean}
export function role(value:unknown){if(value!=='user'&&value!=='admin')throw new AdminError('INVALID_REQUEST');return value}
export function userId(value:unknown){if(typeof value!=='string'||!UUID.test(value))throw new AdminError('INVALID_REQUEST');return value}

