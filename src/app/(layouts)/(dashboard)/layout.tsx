import Sidebar from "./sidebar";
import TopNavBar from "./top-navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <TopNavBar />
          <main className="xl;py-8 flex-1 overflow-y-auto bg-[#f8f8f8] p-5 xl:px-14">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
