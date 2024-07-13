import { writable } from 'svelte/store';
import { setLanguageTag } from '$paraglide/runtime';
// Define the type for supported languages
export type SupportedLang = 'en' | 'ja';

// Create a writable store with 'en' as the initial value
const langStore = writable<SupportedLang>('en');

// Export the store
export default langStore;

// Helper function to update the language
export function updateLang(newLang: SupportedLang) {
    langStore.set(newLang);
    console.log('updateLang: ' + newLang);
    setLanguageTag(newLang);
}

// Helper function to toggle between 'en' and 'ja'
export function toggleLang() {
    langStore.update(currentLang => currentLang === 'en' ? 'ja' : 'en');
}
