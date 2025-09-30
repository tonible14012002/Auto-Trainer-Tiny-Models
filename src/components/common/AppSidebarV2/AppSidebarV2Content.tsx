"use client";

import { memo, useState, type PropsWithChildren } from "react";
import { ModelListPanel } from "./ModelListPanel";
import { BuildPanel } from "./BuildPanel";
import { AppHeaderLogo } from "../AppHeader/AppHeaderLogo";
import { Button } from "@/components/ui/button";
import { SparklesIcon, WrenchIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AppSidebarV2ContentProps {
  className?: string;
  isMobile?: boolean;
}

const PANEL_TABS = {
  MODELS: "models",
  BUILD: "Build",
};

export const AppSidebarV2Content = memo((props: AppSidebarV2ContentProps) => {
  const { isMobile } = props;

  const [panelVal, setPanelVal] = useState(PANEL_TABS.MODELS);
  const onPanelChange = (val: string) => {
    setPanelVal(val);
  };

  return (
    <div className="h-full flex flex-col min-h-0">
      {isMobile && (
        <div className="p-4 border-b">
          <AppHeaderLogo />
        </div>
      )}
      <div className="flex flex-1 overflow-hidden">
        <div className="w-[60px] border-r border-border min-w-[60px]">
          <div className="flex flex-col items-center">
            <PanelButton
              isActive={panelVal === PANEL_TABS.MODELS}
              onClick={() =>
                onPanelChange(
                  panelVal === PANEL_TABS.MODELS ? "" : PANEL_TABS.MODELS
                )
              }
            >
              <SparklesIcon className="size-4" />
            </PanelButton>
            <PanelButton
              isActive={panelVal === PANEL_TABS.BUILD}
              onClick={() =>
                onPanelChange(
                  panelVal === PANEL_TABS.BUILD ? "" : PANEL_TABS.BUILD
                )
              }
            >
              <WrenchIcon className="size-4" />
            </PanelButton>
          </div>
        </div>
        {panelVal === PANEL_TABS.MODELS && (
          <ModelListPanel
            isMobile={isMobile}
            className={cn("flex-1", {
              "w-[300px]": !isMobile,
            })}
          />
        )}
        {panelVal === PANEL_TABS.BUILD && (
          <BuildPanel
            isMobile={isMobile}
            className={cn("flex-1", {
              "w-[300px]": !isMobile,
            })}
          />
        )}
      </div>
    </div>
  );
});

AppSidebarV2Content.displayName = "AppSidebarV2Content";

interface PanelButtonProps extends PropsWithChildren {
  isActive?: boolean;
  onClick?: () => void;
}

const PanelButton = (props: PanelButtonProps) => {
  const { isActive, children, onClick } = props;
  return (
    <div
      className={cn(
        "w-full h-[60px] hover:bg-accent flex items-center justify-center"
      )}
    >
      <Button
        size="icon"
        variant={isActive ? "default" : "ghost"}
        onClick={onClick}
      >
        {children}
      </Button>
    </div>
  );
};
