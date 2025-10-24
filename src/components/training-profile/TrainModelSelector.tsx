"use client";

import { useState } from "react";
import { Check, ChevronsUpDown, Brain, Loader2 } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { TrainedModelInfo } from "@/schema/schema_v2";
import { useFetchPhase } from "@/hooks/pipeline/phase/useFetchPhase";

interface TrainModelSelectorProps {
  value?: string;
  onValueChange: (modelId: string | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  previousPhaseId?: string;
}

export function TrainModelSelector({
  value,
  onValueChange,
  placeholder = "Select previous model...",
  disabled = false,
  previousPhaseId,
}: TrainModelSelectorProps) {
  const [open, setOpen] = useState(false);
  
  // Fetch previous phase data to get trained models
  const { data: { data: previousPhase } = {}, isLoading } = useFetchPhase(
    previousPhaseId || "",
    { ignoreRefetch: !previousPhaseId }
  );

  const trainedModels = previousPhase?.trained_models || [];
  const selectedModel = trainedModels.find((model) => model.id === value);

  const handleSelect = (modelId: string) => {
    if (modelId === value) {
      onValueChange(undefined);
    } else {
      onValueChange(modelId);
    }
    setOpen(false);
  };

  const formatModelName = (model: TrainedModelInfo) => {
    const date = new Date(model.created_at).toLocaleDateString();
    return `${model.model_name} (${date})`;
  };

  const getModelTypeBadge = (modelType: "FROM_SCRATCH" | "CONTINUAL") => {
    return modelType === "FROM_SCRATCH" ? "From Scratch" : "Continual";
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled || !previousPhaseId}
          className="w-full justify-between"
        >
          {selectedModel ? (
            <div className="flex items-center gap-2 truncate">
              <Brain className="w-4 h-4 shrink-0" />
              <span className="truncate">{formatModelName(selectedModel)}</span>
              <Badge variant="secondary" className="text-xs shrink-0">
                {getModelTypeBadge(selectedModel.model_type)}
              </Badge>
            </div>
          ) : (
            <span className="text-muted-foreground">
              {!previousPhaseId ? "No previous phase available" : placeholder}
            </span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search models..." />
          <CommandList>
            {isLoading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              </div>
            ) : trainedModels.length === 0 ? (
              <CommandEmpty>No trained models found in previous phase.</CommandEmpty>
            ) : (
              <>
                <CommandEmpty>No models found.</CommandEmpty>
                <CommandGroup>
                  {trainedModels.map((model) => (
                    <CommandItem
                      key={model.id}
                      value={model.id}
                      onSelect={() => handleSelect(model.id)}
                      className="cursor-pointer"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === model.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium truncate">
                            {model.model_name}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {getModelTypeBadge(model.model_type)}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                          Created: {new Date(model.created_at).toLocaleDateString()}
                        </p>
                        {model.training_argument_profile && (
                          <div className="flex gap-1 mt-1 flex-wrap">
                            <Badge variant="secondary" className="text-xs">
                              Profile: {model.training_argument_profile.name}
                            </Badge>
                          </div>
                        )}
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
