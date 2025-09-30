import type { FileLoadInfo } from "@/schema/model";
import { formatReadableDurationInMs } from "@/utils/format";
import type { ReactNode } from "react";

type InfoItem =
  | {
      type: "text";
      label: string;
      value: string | ReactNode;
    }
  | {
      type: "react-node";
      node: ReactNode;
    };

interface ModelInfoProps {
  infos: InfoItem[];
  title?: string;
}

export const ModelInfoCard = (props: ModelInfoProps) => {
  const { infos } = props;

  const isEmpty = infos.length === 0;

  return (
    <div className="p-3 rounded-xl border flex flex-col">
      <div className="mb-3">
        <h3 className="font-semibold text-xs md:text-sm">{props.title}</h3>
      </div>
      <div className="flex flex-col gap-1 flex-1">
        {isEmpty ? (
          <span className="text-muted-foreground text-xs">
            No information available
          </span>
        ) : null}
        {infos.map((info, index) => {
          if (info.type === "react-node") {
            return info.node;
          }
          return (
            <div key={index} className="flex justify-between gap-4">
              <span className="text-xs shrink-0">{info.label}</span>
              {typeof info.value === "string" ? (
                <span className="text-muted-foreground text-xs truncate">
                  {info.value}
                </span>
              ) : (
                info.value
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const convertFileInfosToDisplay = (
  fileLoadInfo: Record<string, FileLoadInfo>
) => {
  return Object.entries(fileLoadInfo).map(([file, fileInfo]) => ({
    label: file,
    value: formatReadableDurationInMs(fileInfo.duration),
    type: "text" as const,
  }));
};
