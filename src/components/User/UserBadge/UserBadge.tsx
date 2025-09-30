"use client";

import { forwardRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { type VariantProps } from "class-variance-authority";
import { buttonVariants } from "@/components/ui/button";

export interface UserBadgeProps extends
  Omit<React.ComponentProps<"button">, 'children'>,
  VariantProps<typeof buttonVariants> {
  userName: string;
  avatarUrl?: string;
  asChild?: boolean;
  isMobile?: boolean;
}

export const UserBadge = forwardRef<HTMLButtonElement, UserBadgeProps>(
  ({ userName, avatarUrl, isMobile, ...buttonProps }, ref) => {
    // Generate a stable random avatar URL based on userName
    const generatedAvatarUrl = useMemo(() => {
      if (avatarUrl) return avatarUrl;

      // Use userName as seed for consistent avatar generation
      const seed = userName.toLowerCase().replace(/\s+/g, '');
      return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
    }, [userName, avatarUrl]);

    const getAvatarDisplay = () => {
      if (avatarUrl) {
        return (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt={userName}
            className="w-8 h-8 rounded-full object-cover"
          />
        );
      }

      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={generatedAvatarUrl}
          alt={userName}
          className="w-6 h-6 rounded-full"
        />
      );
    };

    if (isMobile) {
      return (
        <button
          ref={ref}
          size="icon"
          variant="secondary"
          {...buttonProps}
        > 
          {getAvatarDisplay()}
        </button>
      );
    }

    return (
      <Button
        ref={ref}
        className="flex items-center gap-2 px-3 py-1 rounded-lg"
        size="sm"
        variant="secondary"
        {...buttonProps}
      >
        {getAvatarDisplay()}
        <span className="text-sm font-mediu">{userName}</span>
      </Button>
    );
  }
);

UserBadge.displayName = "UserBadge";