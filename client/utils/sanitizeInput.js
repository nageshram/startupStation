export function sanitizeInput(input)
{
    if(typeof input != "string") return input;

    const disallowedChars = /["':;?]/g;
    let sanitized = input.replace(disallowedChars, "");

    sanitized = sanitized.replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/\//g,"&#47;");

    sanitized = sanitized.replace(/script/gi, "");

    return sanitized.trim();
    
}