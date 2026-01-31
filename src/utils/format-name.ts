export function formatUserName(name: string | undefined): string {
    if (!name) return "";

    const words = name.trim().split(/\s+/); // split by one or more spaces

    if (words.length < 2) return words[0][0]?.toUpperCase() || "";

    const firstInitial = words[0][0];
    const secondInitial = words[1][0];

    return (firstInitial + secondInitial).toUpperCase();
}
