import { AdminPlansClient } from "./plans-client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Plans",
};

export default function AdminPlansPage() {
  return <AdminPlansClient />;
}
