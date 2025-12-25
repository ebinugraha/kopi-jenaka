// src/app/(dashboard)/layout.tsx
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { DashboardLayout } from "@/features/dashboard/layout/dashboard-layout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <DashboardLayout>{children}</DashboardLayout>
    </SidebarProvider>
  );
}
