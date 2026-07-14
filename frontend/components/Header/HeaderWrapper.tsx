import Header from "./Header";
import { currentUser } from "@clerk/nextjs/server";
import { API_URL } from "@/lib/constants";

export default async function HeaderWrapper() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return (
      <Header signedIn={false} role="" />
    );
  }
  const response = await fetch(
    `${API_URL}/users/${clerkUser.id}`,
    {
      cache: "no-store",
    }
  );

  // const user = await response.json();
  console.log(response.status);
  const text = await response.text();
  console.log(text);
  const user = text ? JSON.parse(text) : null;

  // <Header signedIn role={user.role} />
    return (
    <Header
      signedIn={true}
      role={user?.role ?? "user"}
    />
  );
}