export function sanitizeInput(input)
{
    if(typeof input != "string") return input;

    const disallowedChars = /["':;?]/g;
    let sanitized = input.replace(disallowedChars, "");

    sanitized = sanitized.replace(/&/g,"")
    .replace(/</g,"")
    .replace(/>/g,"")
    .replace(/\//g,"");

    sanitized = sanitized.replace(/script/gi, "");

    return sanitized;
    
}