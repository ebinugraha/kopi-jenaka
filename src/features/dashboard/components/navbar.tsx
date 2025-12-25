import { SidebarTrigger } from "@/components/ui/sidebar";

export const Navbar = () => {
  return (
    <div className="flex items-center p-4 border-b">
      <SidebarTrigger />
      <span className="ml-4 font-semibold text-gray-700">Admin Area</span>
    </div>
  );
};
