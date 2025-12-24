// src/app/(dashboard)/layout.tsx
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        {/* Navbar kecil di atas konten untuk trigger sidebar di mobile */}
        <div className="flex items-center p-4 border-b">
          <SidebarTrigger />
          <span className="ml-4 font-semibold text-gray-700">Admin Area</span>
        </div>
        <div className="p-6">{children}</div>
      </main>
    </SidebarProvider>
  );
}
