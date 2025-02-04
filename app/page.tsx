// app/page.tsx
import { auth } from "@clerk/nextjs/server";

export  default async function Home() {
  const { userId } = await auth();
  
  return (
    <div className="text-white font-sans text-sm font-medium">
      {userId && (
        <div className="">Welcome back, User!</div>
      )}
      {/* rest of your existing content */}
    </div>
  );
}
