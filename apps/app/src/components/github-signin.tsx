"use client";

import { useI18n } from "@/locales/client";
import { useAuthActions } from "@convex-dev/auth/react";
import { OutlinedButton } from "@v1/ui/outlined-button";
import { FaGithub } from "react-icons/fa";

export function GithubSignin() {
  const t = useI18n();
  const { signIn } = useAuthActions();

  return (
    <OutlinedButton
      onClick={() => signIn("github")}
      variant="secondary"
      className="w-full text-center sm:w-auto flex items-center gap-2"
    >
      <div className="flex items-center gap-2 w-full justify-center sm:w-auto sm:justify-start">
        <FaGithub className="h-4 w-4" />
        {t("login.github")}
      </div>
    </OutlinedButton>
  );
}
