import { getI18n } from "@/locales/server";
import Link from "next/link";
import { GoogleSignin } from "./google-signin";

export default async function Login() {
  const t = await getI18n();

  return (
    <div className="flex min-h-screen flex-col justify-center -mt-16 sm:mt-0 max-w-xl px-4 sm:px-0">
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-normal">{t("login.title")}</h2>
        <p className="text-secondary">{t("login.description")}</p>
        <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto mt-4">
          <div className="w-full sm:w-auto">
            <GoogleSignin />
          </div>
          <div className="w-full sm:w-auto">
            <GoogleSignin />
          </div>
        </div>
      </div>

      <div className="fixed bottom-0  hidden sm:flex flex-col w-full max-w-xl mx-auto space-y-4 mb-8">
        <div className="bg-dotted h-9 w-full" />
        <p className="text-secondary text-xs">
          {t("login.terms.text")}{" "}
          <Link
            href="https://voidream.com/terms"
            className="text-primary underline"
          >
            {t("login.terms.termsOfService")}
          </Link>{" "}
          {t("login.terms.and")}{" "}
          <Link
            href="https://voidream.com/policy"
            className="text-primary underline"
          >
            {t("login.terms.privacyPolicy")}
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
