import Header from "./Header";
import { currentUser } from "@clerk/nextjs/server";
import { API_URL } from "@/lib/constants";

export default async function HeaderWrapper() {
  try {
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
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.error(`Failed to fetch user data: ${response.status}`);
      return <Header signedIn={true} role="user" />;
    }

    const text = await response.text();
    // console.log(`User API Response Status: ${response.status}`);
    // console.log(`User API Response: ${text}`);
      
    // Handle empty response
    if (!text) {
      console.warn("Empty response from user API");
      return <Header signedIn={true} role="user" />;
    }

    const user = JSON.parse(text);
      
    // Validate that user has a role property
    const role = user?.role ?? "user";

    return (
      <Header signedIn={true} role={role} />
    );
  } catch (error) {
    console.error("Error in HeaderWrapper:", error);
    return <Header signedIn={true} role="user" />;
  }

}