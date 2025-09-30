"use client";

import { memo } from "react";
import { AppHeaderLogo } from "./AppHeaderLogo";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/useIsMobile";
import { GraduationCap, MenuIcon } from "lucide-react";
import { useAppSidebarContextV2 } from "../AppSidebarV2/AppSidebarProviderV2";
import { UserBadge } from "@/components/User/UserBadge";
import { UserSettingDropdown } from "@/components/User/UserSettingDropdown";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export const AppHeader = memo(() => {
  const isMobile = useIsMobile();
  const { toggleSidebar } = useAppSidebarContextV2();
  return (
    <header className="h-full flex items-center justify-between px-4">
      {/* Left side - Logo and branding text */}
      {isMobile ? (
        <Button
          size="icon"
          variant="ghost"
          className="w-fit h-fit shrink-0"
          onClick={toggleSidebar}
        >
          <MenuIcon className="!w-5 !h-5" />
        </Button>
      ) : (
        <AppHeaderLogo />
      )}

      {/* Right side - User badge */}
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.EXPIRED} target="_blank">
            <GraduationCap />
            Expert Mode
          </Link>
        </Button>
        <UserSettingDropdown
          triggerEl={<UserBadge isMobile={isMobile} userName="Guest User" />}
        />
      </div>
    </header>
  );
});

AppHeader.displayName = "AppHeader";
