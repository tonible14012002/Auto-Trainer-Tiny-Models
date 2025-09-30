"use client";

import type { ReactNode } from "react";
import { memo } from "react";

interface ModelGroupProps {
  title: string;
  listEl?: ReactNode;
}

export const ModelGroup = memo((props: ModelGroupProps) => {
  const { title, listEl } = props;
  return (
    <div className="space-y-2">
      <h4 className="text-xs text-muted-foreground truncate">{title}</h4>
      {listEl}
    </div>
  );
});

ModelGroup.displayName = "ModelGroup";
