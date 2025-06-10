import "~/styles/globals.css";

import { type Metadata } from "next";
import { SideNav } from "./_components/SideNav";

import { TRPCReactProvider } from "~/trpc/react";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "Twitter clone",
  description: "This is Twitter clone by Priyanshu",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="inter.className">
        <SessionProvider>
          <TRPCReactProvider>
            <div className="container mx-auto flex items-start sm:pr-4">
              <SideNav/>
              <div className="min-h-screen flex-grow border-l">
                {children}
              </div>
            </div>
          </TRPCReactProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
