import spanish from "@/i18n/es.json";
import english from "@/i18n/en.json";

const LANGUAGES = {
  SPANISH: "es",
  ENGLISH: "en",
};

export const getI18N = ({
  currentLocale = "es",
}: {
  currentLocale: string | undefined;
}) => {
  if (currentLocale === LANGUAGES.SPANISH) return spanish;
  if (currentLocale === LANGUAGES.ENGLISH) return english;

  return spanish;
};
