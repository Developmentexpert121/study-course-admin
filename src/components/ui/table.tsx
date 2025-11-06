import { cn } from "@/lib/utils";
import * as React from "react";

export function Table({
  className,
  onClick,
  ...props
}: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/50">
      <div className="overflow-x-auto">
        <table
          className={cn(
            "min-w-full divide-y divide-gray-200 dark:divide-gray-700",
            className,
          )}
          {...props}
          onClick={onClick}
        />
      </div>
    </div>
  );
}

export function TableHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn("bg-gray-50 dark:bg-gray-900/50", className)} {...props} />;
}

export function TableBody({
  className,
  onClick,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody
      className={cn("divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-transparent", className)}
      {...props}
      onClick={onClick}
    />
  );
}

export function TableFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tfoot
      className={cn(
        "border-t bg-neutral-100/50 font-medium dark:bg-neutral-800/50 [&>tr]:last:border-b-0",
        className,
      )}
      {...props}
    />
  );
}

export function TableRow({
  className,
  onClick,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn(
        "cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/30",
        className,
      )}
      {...props}
      onClick={onClick}
    />
  );
}

export function TableHead({
  className,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        "px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300",
        className,
      )}
      {...props}
    />
  );
}

export function TableCell({
  className,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={cn(
        " px-6 py-4 text-sm text-gray-900 dark:text-gray-300",
        className,
      )}
      {...props}
    />
  );
}
