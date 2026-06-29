export const maskEmail = (email) => {
    if (!email) return '';
    const parts = email.split('@');
    if (parts.length !== 2) return email;
    const [local, domain] = parts;
    if (local.length <= 3) {
        return local + '@' + domain;
    }
    return `${local.substring(0, 3)}${'x'.repeat(local.length - 3)}@${domain}`;
};

export const maskPhone = (phone) => {
    if (!phone) return '';
    const cleanPhone = String(phone).trim();
    if (cleanPhone.length <= 3) return cleanPhone;
    return cleanPhone.substring(0, 3) + 'x'.repeat(cleanPhone.length - 3);
};
