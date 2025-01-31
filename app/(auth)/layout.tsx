
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import AuthButtons from '../components/AuthButtons';




export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html>
     
        <body>
          {children}
        </body>
    </html>
    </ClerkProvider>

  );
}
