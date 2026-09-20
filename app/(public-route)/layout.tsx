import { Toaster } from "sonner";
import { Providers } from "@/app/providers";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";

export default function PublicRouteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Header />
      <Providers>{children}</Providers>
      <Toaster richColors position="top-center" />
      <Footer />
    </div>
  );
}
