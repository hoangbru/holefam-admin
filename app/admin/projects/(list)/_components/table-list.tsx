"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import toast from "react-hot-toast";

import {
  DataTable,
  DataTableColumnHeader,
  DataTableRowActions,
} from "@/components/data-table";
import { Checkbox } from "@/components/ui/checkbox";
import SkeletonSection from "@/components/skeleton-section";

import { Project } from "@/types/project";
import { fetcher, mutation } from "@/utils/fetcher";
import Link from "next/link";
import Image from "next/image";

const TableList = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTechnologies() {
      try {
        const response = await fetcher("/api/projects");
        setProjects(response);
      } catch {
        setError("Failed to fetch projects");
      } finally {
        setIsLoading(false);
      }
    }
    fetchTechnologies();
  }, []);

  const handleDelete = async (id: string | number) => {
    setIsLoading(true);
    try {
      const res = await mutation(`/api/projects/${id}`, "DELETE");
      if (res.error) {
        toast.error(res.error);
      }
      setProjects((prev) => prev.filter((project) => project.id !== id));
      toast.success("Project deleted successfully");
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("Failed to delete project");
    } finally {
      setIsLoading(false);
    }
  };

  const redirectToEdit = (id: string | number) => {
    router.push(`/admin/projects/${id}/edit`);
  };

  const handleCopy = (id: string | number) => {
    console.log("Copying project with id:", id);
  };

  const columns: ColumnDef<Project>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: true,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="max-w-[500px] truncate font-medium">
              {row.getValue("name")}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "image",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Image" />
      ),
      cell: ({ row }) => {
        const image = row.getValue("image") as string;
        return (
          <div className="flex space-x-2">
            <span className="max-w-[500px] truncate font-medium">
              {image ? (
                <Image
                  src={image}
                  alt="Project Image"
                  width={100}
                  height={100}
                  className="rounded-md object-cover"
                />
              ) : (
                "No Image"
              )}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "description",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Description" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="max-w-[500px] truncate font-medium">
              {row.getValue("description")}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "link",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Link" />
      ),
      cell: ({ row }) => {
        const link = row.getValue("link") as string;
        return (
          <div className="flex space-x-2">
            <span className="max-w-[500px] truncate font-medium">
              {link ? (
                <Link
                  href={link}
                  target="blank"
                  rel="noopener noreferrer"
                  className="text-[#0066CC]"
                >
                  {link}
                </Link>
              ) : (
                "No Link"
              )}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "githubLink",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Github Link" />
      ),
      cell: ({ row }) => {
        const githubLink = row.getValue("githubLink") as string;

        return (
          <div className="flex space-x-2">
            <span className="max-w-[500px] truncate font-medium">
              {githubLink ? (
                <Link
                  href={githubLink}
                  target="blank"
                  rel="noopener noreferrer"
                  className="text-[#0066CC]"
                >
                  {githubLink}
                </Link>
              ) : (
                "No Github Link"
              )}
            </span>
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <DataTableRowActions
            row={row}
            callbackEdit={() => redirectToEdit(row.original.id)}
            callbackCopy={() => handleCopy(row.original.id)}
            callbackDelete={() => handleDelete(row.original.id)}
          />
        );
      },
    },
  ];

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (isLoading) return <SkeletonSection />;

  return <DataTable data={projects} columns={columns} />;
};

export default TableList;
