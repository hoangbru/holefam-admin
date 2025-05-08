import Link from "next/link";
import { Metadata } from "next";

import { Button } from "@/components/ui/button";
import BreadcrumbSection from "@/components/breadcrumb-section";
import TableList from "./_components/table-list";

export const metadata: Metadata = {
  title: "Projects Management",
};

export default function ProjectsManagement() {
  return (
    <div className="h-full flex-1 flex-col space-y-8 md:flex">
      <BreadcrumbSection metaTitle={metadata.title} />

      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Projects List
          </h2>
          <p className="text-muted-foreground">
            Here&apos;s a list of all projects that you have added to your
            portfolio.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button>
            <Link href={"/admin/projects/add"}>Add New</Link>
          </Button>
        </div>
      </div>

      <TableList />
    </div>
  );
}
