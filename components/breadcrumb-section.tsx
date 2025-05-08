"use client";

import { FC, Fragment } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { TemplateString } from "next/dist/lib/metadata/types/metadata-types";

interface BreadcrumbSectionProps {
  metaTitle: string | TemplateString | null | undefined;
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const BreadcrumbSection: FC<BreadcrumbSectionProps> = ({ metaTitle }) => {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const pathAcc: string[] = [];

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.map((segment, idx) => {
          pathAcc.push(segment);
          const href = "/" + pathAcc.join("/");
          const isLast = idx === segments.length - 1;

          const title = isLast
            ? metaTitle || capitalize(segment.replace(/-/g, " "))
            : capitalize(segment.replace(/-/g, " "));

          return (
            <Fragment key={idx}>
              {idx > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{String(title)}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={href}>{String(title)}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadcrumbSection;
