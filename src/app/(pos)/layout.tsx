// src/app/(pos)/layout.tsx
const POSLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen w-screen bg-gray-50 overflow-hidden">
      {children}
    </div>
  );
};

export default POSLayout;
