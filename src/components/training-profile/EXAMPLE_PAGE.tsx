/**
 * Example page demonstrating how to use the ProfileListView component
 *
 * This is a reference implementation showing how to integrate the
 * ProfileListView into your application.
 *
 * You can copy this to your pages directory and adjust as needed.
 */

"use client";

import { ProfileListView } from "@/components/training-profile";

export default function TrainingProfilesPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Training Profiles</h1>
        <p className="text-muted-foreground mt-1">
          Manage your training and LoRA configuration profiles
        </p>
      </div>

      <ProfileListView />
    </div>
  );
}

/**
 * Alternative: Using ProfileListView in a dialog/modal
 *
 * If you want to show the profile list in a dialog instead of a full page:
 */

/*
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProfileListView } from "@/components/training-profile";
import { Settings2 } from "lucide-react";

export function TrainingProfilesModal() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Settings2 className="w-4 h-4" />
          Manage Profiles
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Training Profiles</DialogTitle>
        </DialogHeader>
        <ProfileListView />
      </DialogContent>
    </Dialog>
  );
}
*/
