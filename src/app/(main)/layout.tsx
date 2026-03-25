import Navigation from "@/components/Navigation";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="layout-container">
      <Navigation />
      <main className="main-content animate-fade-in">
        {children}
      </main>
    </div>
  );
}
