"use client";

import React from "react";

type KPICardProps = {
  title: string;
  value: string | React.ReactNode;
  subtitle?: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  status?: "ok" | "warn" | "err" | "muted";
};

export function KPICard({
  title,
  value,
  subtitle,
  description,
  action,
  icon,
  status,
}: KPICardProps) {
  const statusColor =
    status === "ok"
      ? "text-[var(--ok)]"
      : status === "warn"
        ? "text-[var(--warn)]"
        : status === "err"
          ? "text-[var(--err)]"
          : status === "muted"
            ? "text-[var(--muted)]"
            : "";

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-[var(--muted)]">{title}</p>
          <p className={`mt-1 truncate text-2xl font-semibold tabular-nums ${statusColor}`}>
            {value}
          </p>
          {subtitle != null && (
            <p className="mt-0.5 text-sm text-[var(--muted)]">{subtitle}</p>
          )}
          {description != null && (
            <p className="mt-1 text-xs text-[var(--muted)]/80">{description}</p>
          )}
          {action != null && <div className="mt-1">{action}</div>}
        </div>
        {icon != null && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--background)] text-[var(--accent)]">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
