// app/page.tsx
import { auth } from "@clerk/nextjs/server";

export  default async function Home() {
  const { userId } = await auth();
  
  return (
    <div className="...">
      {userId && (
        <h1 className="text-2xl font-bold">Welcome back, User!</h1>
      )}
      {/* rest of your existing content */}
    </div>
  );
}