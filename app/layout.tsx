import type { Metadata } from "next";
import { Archivo, Bricolage_Grotesque, IBM_Plex_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { Providers } from "@/app/providers";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "FixItNow — Home services, booked in minutes",
  description:
    "Vetted technicians for plumbing, electrics, AC and more across Dhaka. Fixed prices in taka, booked in minutes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",
        archivo.variable,
        bricolage.variable,
        ibmPlexMono.variable,
        "font-sans",
      )}
    >
      <body className="min-h-full flex flex-col">
        <div>
          <Providers>{children}</Providers>
          <Toaster richColors position="top-center" />
        </div>
      </body>
    </html>
  );
}
