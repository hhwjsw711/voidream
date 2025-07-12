import { Sidebar } from "@/components/sidebar";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { api } from "@v1/backend/convex/_generated/api";
import { fetchQuery, preloadQuery } from "convex/nextjs";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: { children: React.ReactNode }) {
  const user = await fetchQuery(
    api.users.getUser,
    {},
    { token: await convexAuthNextjsToken() },
  );
  if (!user?.username) {
    return redirect("/onboarding");
  }
  const preloadedUser = await preloadQuery(
    api.users.getUser,
    {},
    { token: await convexAuthNextjsToken() },
  );
  const preloadedProducts = await preloadQuery(
    api.subscriptions.listAllProducts,
    {},
    { token: await convexAuthNextjsToken() },
  );
  return (
    <div className="relative">
      <Sidebar />
      <div className="md:ml-[70px] pb-8">
        <div className="px-6">{children}</div>
      </div>
    </div>
  );
}
