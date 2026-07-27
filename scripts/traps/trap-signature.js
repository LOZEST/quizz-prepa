const stable=value=>Array.isArray(value)?`[${value.map(stable).join(',')}]`:value&&typeof value==='object'?`{${Object.keys(value).sort().map(key=>`${key}:${stable(value[key])}`).join(',')}}`:JSON.stringify(value);
export const createTrapSignature=(templateId,parameters,formulation)=>`${templateId}|${formulation}|${stable(parameters)}`;
