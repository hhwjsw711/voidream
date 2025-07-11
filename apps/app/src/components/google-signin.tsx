"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@v1/ui/button";

export function GoogleSignin() {
  const { signIn } = useAuthActions();

  return (
    <Button
      onClick={() => signIn("google")}
      variant="default"
      className="bg-primary px-6 py-4 text-secondary font-medium h-[40px] w-full"
    >
      Sign in with Google
    </Button>
  );
}
