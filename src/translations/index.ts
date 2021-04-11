const currentLanguage = 'mk';
const languages = {
    'mk': require('./mk.json')
};
export function get(string) {
    return languages[currentLanguage][string]
}