
/**
 * Whitelist of allowed email domains and suffixes for the platform.
 * Includes major Bangladeshi private universities and professional domains.
 */
export const ALLOWED_DOMAINS = [
    // Specific University Domains mentioned by you
    'diu.edu.bd',
    'northsouth.edu',
    'bracu.ac.bd',
    'g.bracu.ac.bd',
    'iub.edu.bd',
    'aiub.edu',
    'ewubd.edu',
    'uiu.ac.bd',
    'aust.edu',
    'ulab.edu.bd',
    'green.edu.bd',
    'seu.edu.bd',
    'iubat.edu',
    'stamforduniversity.edu.bd',
    'uap-bd.edu',
    'wub.edu.bd',
];

export const ALLOWED_SUFFIXES = [
    '.edu.bd',
    '.ac.bd',
    '.gov.bd',
    '.mil.bd',
];

/**
 * Validates if an email belongs to an allowed academic or professional domain.
 * @param email The email address to validate
 * @returns boolean
 */
export const isAllowedEmail = (email: string): boolean => {
    if (!email) return false;
    
    const domain = email.split('@')[1]?.toLowerCase();
    if (!domain) return false;

    // Check against specific domains (Exact match or sub-domain)
    const isSpecificDomain = ALLOWED_DOMAINS.some(d => domain === d || domain.endsWith('.' + d));
    if (isSpecificDomain) return true;

    // Check against allowed suffixes (.edu.bd, .ac.bd, etc)
    const isAllowedSuffix = ALLOWED_SUFFIXES.some(suffix => domain.endsWith(suffix));
    if (isAllowedSuffix) return true;

    return false;
};
