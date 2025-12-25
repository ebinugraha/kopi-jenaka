import { Navbar } from "../components/navbar";

export const DashboardLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <main className="w-full">
      <Navbar />
      <div className="p-6">{children}</div>
    </main>
  );
};
