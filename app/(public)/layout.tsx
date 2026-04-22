// app/(public)/layout.tsx
import Navbar from "@/components/navbar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="pt-20"> 
        {children}
      </main>
    </>
  );
}