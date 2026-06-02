import { Sidebar } from "@/components/cyberdeck/sidebar";
import { StatusBar } from "@/components/cyberdeck/status-bar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-16 lg:ml-56 min-w-0">
        <StatusBar
          items={[
            { label: "STATUS", value: "ONLINE", status: "ok" },
            { label: "ENV", value: "DEV", status: "warn" },
            { label: "DB", value: "CONNECTED", status: "ok" },
          ]}
        />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
