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
import { Badge } from "@/components/ui/badge";

import { Technology } from "@/types/technology";
import { fetcher, mutation } from "@/utils/fetcher";

const TableList = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTechnologies() {
      try {
        const response = await fetcher("/api/technologies");
        setTechnologies(response);
      } catch {
        setError("Failed to fetch technologies");
      } finally {
        setIsLoading(false);
      }
    }
    fetchTechnologies();
  }, []);

  const handleDelete = async (id: string | number) => {
    setIsLoading(true);
    try {
      const res = await mutation(`/api/technologies/${id}`, "DELETE");
      if (res.error) {
        toast.error(res.error);
      }
      setTechnologies((prev) =>
        prev.filter((technology) => technology.id !== id)
      );
      toast.success("Technology deleted successfully");
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("Failed to delete technology");
    } finally {
      setIsLoading(false);
    }
  };

  const redirectToEdit = (id: string | number) => {
    router.push(`/admin/technologies/${id}/edit`);
  };

  const handleCopy = (id: string | number) => {
    console.log("Copying technology with id:", id);
  };

  const columns: ColumnDef<Technology>[] = [
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
      accessorKey: "link",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Link" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="max-w-[500px] truncate font-medium">
              {row.getValue("link")}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "tag",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tag" />
      ),
      cell: ({ row }) => {
        const tag = row.getValue("tag") as string;
        return (
          <div className="flex space-x-2">
            <span className="max-w-[500px] truncate font-medium">
              {tag && (
                <Badge className="text-base">
                  <i className={`bx bxl-${tag}`}></i>
                </Badge>
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

  return <DataTable data={technologies} columns={columns} />;
};

export default TableList;
