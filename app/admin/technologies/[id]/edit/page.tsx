import { Metadata } from "next";

import BreadcrumbSection from "@/components/breadcrumb-section";
import FormEdit from "../_components/form-edit";

export const metadata: Metadata = {
  title: "Edit New Technology",
};

export default function EditPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  return (
    <div className="h-full flex-1 flex-col space-y-8 md:flex">
      <BreadcrumbSection metaTitle={metadata.title} />
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Edit New Technology
          </h2>
          <p className="text-muted-foreground">
            Here&apos;s a form to edit a technology with ID: {id}!
          </p>
        </div>
      </div>

      <FormEdit id={id} />
    </div>
  );
}
