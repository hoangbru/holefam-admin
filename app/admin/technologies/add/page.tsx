import { Metadata } from "next";

import BreadcrumbSection from "@/components/breadcrumb-section";
import FormAddNew from "./_components/form-add";

export const metadata: Metadata = {
  title: "Add New Technology",
};

export default function ProjectAddPage() {
  return (
    <div className="h-full flex-1 flex-col space-y-8 md:flex">
      <BreadcrumbSection metaTitle={metadata.title} />
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Add New Technology
          </h2>
          <p className="text-muted-foreground">
            Here&apos;s a form to add a new technology!
          </p>
        </div>
      </div>

      <FormAddNew />
    </div>
  );
}
