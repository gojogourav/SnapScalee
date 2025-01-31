'use client'
import { SignUp } from '@clerk/nextjs';
import RedirectAfterSignIn from '@/app/components/RedirectAfterSignIn';
export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-700 to-black">
      <SignUp path="/sign-in" routing="path"  />
      <RedirectAfterSignIn/>
    </div>
  );
}
