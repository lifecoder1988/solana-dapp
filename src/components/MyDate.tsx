import { FC } from "react";
import { format } from "date-fns";
import { es, fr } from "date-fns/locale"; // 导入需要的语言

type Props = {
  timestamp: number;
  locale: "es" | "fr";
};

const formatDate = (timestamp: number, locale: "es" | "fr"): string => {
  const locales = { es, fr }; // 映射到date-fns的语言对象
  return format(new Date(timestamp), "PPpp", { locale: locales[locale] });
};

export const MyDate: FC<Props> = ({ timestamp, locale }) => {
  return <div>{formatDate(timestamp, locale)}</div>;
};
