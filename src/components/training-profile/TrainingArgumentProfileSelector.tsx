"use client";

import { useState } from "react";
import { Check, ChevronsUpDown, Settings2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useFetchTrainingProfiles } from "@/hooks/training-profile";
import { Badge } from "@/components/ui/badge";

interface TrainingArgumentProfileSelectorProps {
  value?: string;
  onValueChange: (profileId: string | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function TrainingArgumentProfileSelector({
  value,
  onValueChange,
  placeholder = "Select training profile...",
  disabled = false,
}: TrainingArgumentProfileSelectorProps) {
  const [open, setOpen] = useState(false);
  const { data: response, isLoading } = useFetchTrainingProfiles();

  const profiles = response?.data || [];
  const selectedProfile = profiles.find((profile) => profile.id === value);

  const handleSelect = (profileId: string) => {
    if (profileId === value) {
      onValueChange(undefined);
    } else {
      onValueChange(profileId);
    }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className="w-full justify-between"
        >
          {selectedProfile ? (
            <div className="flex items-center gap-2 truncate">
              <Settings2 className="w-4 h-4 shrink-0" />
              <span className="truncate">{selectedProfile.name}</span>
              {selectedProfile.description && (
                <Badge variant="secondary" className="text-xs shrink-0">
                  Custom
                </Badge>
              )}
            </div>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search profiles..." />
          <CommandList>
            {isLoading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                <CommandEmpty>No training profiles found.</CommandEmpty>
                <CommandGroup>
                  {profiles.map((profile) => (
                    <CommandItem
                      key={profile.id}
                      value={profile.id}
                      onSelect={() => handleSelect(profile.id)}
                      className="cursor-pointer"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === profile.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium truncate">
                            {profile.name}
                          </span>
                        </div>
                        {profile.description && (
                          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                            {profile.description}
                          </p>
                        )}
                        <div className="flex gap-2 mt-1 flex-wrap">
                          <Badge variant="outline" className="text-xs">
                            LR: {profile.training_config.learning_rate}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Epochs: {profile.training_config.num_train_epochs}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            LoRA r: {profile.lora_config.r}
                          </Badge>
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
