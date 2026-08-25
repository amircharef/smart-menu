import type { Metadata } from "next";
import { TablePicker } from "@/components/customer/TablePicker";

export const metadata: Metadata = {
  title: "Choisis ta table",
};

export default function TablePickerPage() {
  return <TablePicker />;
}
