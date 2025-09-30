"use client";

import { memo } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { SettingsIcon, DownloadIcon, GraduationCap } from "lucide-react";
import { useUserConfig } from "@/hooks/useUserConfig";

interface UserSettingDropdownProps {
  triggerEl: React.ReactNode;
}

export const UserSettingDropdown = memo(
  ({ triggerEl }: UserSettingDropdownProps) => {
    const { config, updateConfig, isLoading } = useUserConfig();

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{triggerEl}</DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <SettingsIcon className="w-4 h-4 mr-2 inline" />
            Settings
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <GraduationCap />
            Expert Mode
            <Switch
              checked={config?.expertMode ?? false}
              onCheckedChange={(checked) =>
                updateConfig({ expertMode: checked })
              }
              disabled={isLoading}
              className="ml-auto"
            />
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <DownloadIcon />
            Auto Load Model on Inference
            <Switch
              checked={config?.autoLoadModel ?? true}
              onCheckedChange={(checked) =>
                updateConfig({ autoLoadModel: checked })
              }
              disabled={true || isLoading}
              className="ml-auto"
            />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
);

UserSettingDropdown.displayName = "UserSettingDropdown";
