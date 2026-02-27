import { LANGUAGE_TO_FLAG } from "../constants";

export const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export function generateRandomAvatar() {
    const idx = Math.floor(Math.random() * 100) + 1;
    return `https://avatar.iran.liara.run/public/${idx}.png`;
}

// helper to render a small flag image for a given language
export function getLanguageFlag(language) {
    if (!language) return null;

    const langLower = language.toLowerCase();
    const countryCode = LANGUAGE_TO_FLAG[langLower];

    if (countryCode) {
        return (
            <img
                src={`https://flagcdn.com/24x18/${countryCode}.png`}
                alt={`${langLower} flag`}
                className="h-3 mr-1 inline-block"
            />
        );
    }
    return null;
}