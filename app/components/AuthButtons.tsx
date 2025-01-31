'use client'
import React from 'react'
import { SignedIn, SignInButton,SignOutButton,UserButton } from '@clerk/nextjs';
function AuthButtons() {
  return (
    <div>
        <header>
            <SignOutButton>
                <SignInButton/>
            </SignOutButton>
        </header>
        <SignedIn>
            <UserButton/>
        </SignedIn>
    </div>
  )
}

export default AuthButtons;