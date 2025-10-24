"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { useCreateTrainingProfile } from "@/hooks/training-profile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Loader2, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CreateTrainingProfileRequest } from "@/schema/schema_v2";

interface CreateTrainingProfileDialogProps {
  trigger: React.ReactNode;
  onSuccess?: () => void;
}

export function CreateTrainingProfileDialog({
  trigger,
  onSuccess,
}: CreateTrainingProfileDialogProps) {
  const [open, setOpen] = useState(false);
  const { mutate: createProfile, isPending, error } = useCreateTrainingProfile();

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // Training config state with defaults
  const [learningRate, setLearningRate] = useState("2e-5");
  const [trainBatchSize, setTrainBatchSize] = useState("8");
  const [evalBatchSize, setEvalBatchSize] = useState("16");
  const [gradientAccumSteps, setGradientAccumSteps] = useState("4");
  const [numEpochs, setNumEpochs] = useState("3");
  const [warmupRatio, setWarmupRatio] = useState("0.15");
  const [weightDecay, setWeightDecay] = useState("0.01");
  const [maxGradNorm, setMaxGradNorm] = useState("1.0");
  const [loggingSteps, setLoggingSteps] = useState("10");
  const [saveSteps, setSaveSteps] = useState("500");
  const [evalSteps, setEvalSteps] = useState("100");
  const [saveStrategy, setSaveStrategy] = useState("steps");
  const [evalStrategy, setEvalStrategy] = useState("no");
  const [seed, setSeed] = useState("42");

  // LoRA config state with defaults
  const [loraR, setLoraR] = useState("16");
  const [loraAlpha, setLoraAlpha] = useState("32");
  const [loraDropout, setLoraDropout] = useState("0.1");
  const [loraBias, setLoraBias] = useState<"none" | "all" | "lora_only">("none");
  const [targetModules, setTargetModules] = useState<string[]>([
    "query",
    "value",
    "dense",
  ]);
  const [newModule, setNewModule] = useState("");

  const handleAddModule = () => {
    if (newModule.trim() && !targetModules.includes(newModule.trim())) {
      setTargetModules([...targetModules, newModule.trim()]);
      setNewModule("");
    }
  };

  const handleRemoveModule = (module: string) => {
    setTargetModules(targetModules.filter((m) => m !== module));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const request: CreateTrainingProfileRequest = {
      name,
      description: description || undefined,
      training_config: {
        learning_rate: parseFloat(learningRate),
        per_device_train_batch_size: parseInt(trainBatchSize),
        per_device_eval_batch_size: parseInt(evalBatchSize),
        gradient_accumulation_steps: parseInt(gradientAccumSteps),
        num_train_epochs: parseInt(numEpochs),
        warmup_ratio: parseFloat(warmupRatio),
        weight_decay: parseFloat(weightDecay),
        max_grad_norm: parseFloat(maxGradNorm),
        logging_steps: parseInt(loggingSteps),
        save_steps: parseInt(saveSteps),
        eval_steps: parseInt(evalSteps),
        save_strategy: saveStrategy,
        eval_strategy: evalStrategy,
        seed: parseInt(seed),
      },
      lora_config: {
        r: parseInt(loraR),
        lora_alpha: parseInt(loraAlpha),
        lora_dropout: parseFloat(loraDropout),
        bias: loraBias,
        target_modules: targetModules,
      },
    };

    createProfile(request, {
      onSuccess: () => {
        setOpen(false);
        // Reset form
        setName("");
        setDescription("");
        onSuccess?.();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create Training Profile
          </DialogTitle>
          <DialogDescription>
            Configure training and LoRA parameters for your model training
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>
                Failed to create profile. Please check your inputs and try again.
              </AlertDescription>
            </Alert>
          )}

          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Basic Information</h3>
            <div className="space-y-2">
              <Label htmlFor="name">
                Profile Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., default-config"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description for this profile"
                rows={2}
              />
            </div>
          </div>

          {/* Training Configuration */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Training Configuration</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="learningRate">Learning Rate</Label>
                <Input
                  id="learningRate"
                  type="text"
                  value={learningRate}
                  onChange={(e) => setLearningRate(e.target.value)}
                  placeholder="2e-5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="trainBatchSize">Train Batch Size</Label>
                <Input
                  id="trainBatchSize"
                  type="number"
                  value={trainBatchSize}
                  onChange={(e) => setTrainBatchSize(e.target.value)}
                  min="1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="evalBatchSize">Eval Batch Size</Label>
                <Input
                  id="evalBatchSize"
                  type="number"
                  value={evalBatchSize}
                  onChange={(e) => setEvalBatchSize(e.target.value)}
                  min="1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gradientAccumSteps">
                  Gradient Accumulation Steps
                </Label>
                <Input
                  id="gradientAccumSteps"
                  type="number"
                  value={gradientAccumSteps}
                  onChange={(e) => setGradientAccumSteps(e.target.value)}
                  min="1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="numEpochs">Number of Epochs</Label>
                <Input
                  id="numEpochs"
                  type="number"
                  value={numEpochs}
                  onChange={(e) => setNumEpochs(e.target.value)}
                  min="1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="warmupRatio">Warmup Ratio</Label>
                <Input
                  id="warmupRatio"
                  type="text"
                  value={warmupRatio}
                  onChange={(e) => setWarmupRatio(e.target.value)}
                  placeholder="0.15"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weightDecay">Weight Decay</Label>
                <Input
                  id="weightDecay"
                  type="text"
                  value={weightDecay}
                  onChange={(e) => setWeightDecay(e.target.value)}
                  placeholder="0.01"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxGradNorm">Max Gradient Norm</Label>
                <Input
                  id="maxGradNorm"
                  type="text"
                  value={maxGradNorm}
                  onChange={(e) => setMaxGradNorm(e.target.value)}
                  placeholder="1.0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="loggingSteps">Logging Steps</Label>
                <Input
                  id="loggingSteps"
                  type="number"
                  value={loggingSteps}
                  onChange={(e) => setLoggingSteps(e.target.value)}
                  min="1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="saveSteps">Save Steps</Label>
                <Input
                  id="saveSteps"
                  type="number"
                  value={saveSteps}
                  onChange={(e) => setSaveSteps(e.target.value)}
                  min="1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="evalSteps">Eval Steps</Label>
                <Input
                  id="evalSteps"
                  type="number"
                  value={evalSteps}
                  onChange={(e) => setEvalSteps(e.target.value)}
                  min="1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seed">Seed</Label>
                <Input
                  id="seed"
                  type="number"
                  value={seed}
                  onChange={(e) => setSeed(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* LoRA Configuration */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">LoRA Configuration</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="loraR">
                  r (Rank) <span className="text-muted-foreground">(1-256)</span>
                </Label>
                <Input
                  id="loraR"
                  type="number"
                  value={loraR}
                  onChange={(e) => setLoraR(e.target.value)}
                  min="1"
                  max="256"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="loraAlpha">
                  Alpha <span className="text-muted-foreground">(1-256)</span>
                </Label>
                <Input
                  id="loraAlpha"
                  type="number"
                  value={loraAlpha}
                  onChange={(e) => setLoraAlpha(e.target.value)}
                  min="1"
                  max="256"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="loraDropout">
                  Dropout <span className="text-muted-foreground">(0.0-1.0)</span>
                </Label>
                <Input
                  id="loraDropout"
                  type="text"
                  value={loraDropout}
                  onChange={(e) => setLoraDropout(e.target.value)}
                  placeholder="0.1"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="loraBias">Bias</Label>
                <select
                  id="loraBias"
                  value={loraBias}
                  onChange={(e) =>
                    setLoraBias(e.target.value as "none" | "all" | "lora_only")
                  }
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="none">none</option>
                  <option value="all">all</option>
                  <option value="lora_only">lora_only</option>
                </select>
              </div>
            </div>

            {/* Target Modules */}
            <div className="space-y-2">
              <Label>Target Modules</Label>
              <div className="flex gap-2">
                <Input
                  value={newModule}
                  onChange={(e) => setNewModule(e.target.value)}
                  placeholder="Add module (e.g., attention, mlp)"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddModule();
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleAddModule}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {targetModules.map((module) => (
                  <Badge
                    key={module}
                    variant="secondary"
                    className="gap-1.5 pr-1"
                  >
                    {module}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => handleRemoveModule(module)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || !name}>
              {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Create Profile
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
