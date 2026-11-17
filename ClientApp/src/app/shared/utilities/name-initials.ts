export function getNameInitials(fullName?: string | null): string {
    if (!fullName?.trim()) return 'U';

    const parts = fullName.trim().split(/\s+/);

    if (parts.length === 1) {
        return parts[0].substring(0, 2).toUpperCase();
    }

    return (
        parts[0][0] + parts[parts.length - 1][0]
    ).toUpperCase();
}