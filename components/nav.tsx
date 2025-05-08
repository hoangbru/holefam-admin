"use client";

import * as React from "react";
import Link from "next/link";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import { cn } from "@/lib/utils";

type NavLink = {
  type: "link";
  label: string;
  href: string;
};

type NavGroupItem = {
  title: string;
  href: string;
  description: string;
};

type NavGroup = {
  type: "group";
  label: string;
  items: NavGroupItem[];
};

type NavItem = NavLink | NavGroup;

const navItems: NavItem[] = [
  {
    type: "link",
    label: "Overview",
    href: "/",
  },
  {
    type: "group",
    label: "Projects",
    items: [
      {
        title: "List",
        href: "/admin/projects",
        description:
          "List of all projects that you have added to your portfolio.",
      },
      {
        title: "Add",
        href: "/admin/projects/add",
        description: "Add a new project to your portfolio.",
      },
    ],
  },
  {
    type: "group",
    label: "Technologies",
    items: [
      {
        title: "List",
        href: "/admin/technologies",
        description:
          "List of all technologies that you have added to your portfolio.",
      },
      {
        title: "Add",
        href: "/admin/technologies/add",
        description: "Add a new technology to your portfolio.",
      },
    ],
  },
  {
    type: "group",
    label: "Users",
    items: [
      {
        title: "List",
        href: "/admin/users",
        description: "List of all users that you have added to your portfolio.",
      },
      {
        title: "Add",
        href: "/admin/users/add",
        description: "Add a new user to your portfolio.",
      },
    ],
  },
  {
    type: "link",
    label: "Contacts",
    href: "/admin/contacts",
  },
  {
    type: "link",
    label: "Settings",
    href: "/admin/settings",
  },
];

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export function Navigation() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {navItems.map((item, index) => (
          <NavigationMenuItem key={index}>
            {item.type === "link" ? (
              <Link href={item.href} legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  {item.label}
                </NavigationMenuLink>
              </Link>
            ) : (
              <>
                <NavigationMenuTrigger>{item.label}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {item.items.map((subItem, subIndex) => (
                      <ListItem
                        key={subIndex}
                        href={subItem.href}
                        title={subItem.title}
                      >
                        {subItem.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
