import LocalizedStrings from 'react-native-localization';
import en from './en';
import es from './es';

let strings = new LocalizedStrings({
  en: en,
  es: es,
});


export const changeLaguage = (languageKey) => {
  strings.setLanguage(languageKey);
};
export default strings;
