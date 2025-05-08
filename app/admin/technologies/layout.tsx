import { ReactNode } from "react";

export default async function TechnologiesManagementLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="flex-1 space-y-4 p-16 pt-6">
      {children}
    </div>
  );
}
