'use client';

import { forwardRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavLinkCompatProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "className"> {
  className?: string;
  activeClassName?: string;
  pendingClassName?: string;
  href: string;
  to?: string;
}

import React from "react";

const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ className, activeClassName, pendingClassName, href, to, ...props }, ref) => {
    const pathname = usePathname();
    const resolvedHref = href || to || '/';
    const isActive = pathname === resolvedHref || (resolvedHref !== '/' && pathname.startsWith(resolvedHref));
    return (
      <Link
        ref={ref}
        href={resolvedHref}
        className={cn(className, isActive && activeClassName)}
        {...props}
      />
    );
  },
);

NavLink.displayName = "NavLink";

export { NavLink };
