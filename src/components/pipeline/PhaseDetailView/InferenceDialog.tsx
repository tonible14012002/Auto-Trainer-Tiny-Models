"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertCircle,
  Loader2,
  Play,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useRunInference } from "@/hooks/pipeline/phase/useRunInference";
import { InferencePrediction } from "@/schema/schema_v2";
import { Textarea } from "@/components/ui/textarea";

interface InferenceDialogProps {
  modelPath: string;
  pipelineId: string;
  modelName: string;
  trigger?: React.ReactNode;
}

export function InferenceDialog({
  modelPath,
  pipelineId,
  modelName,
  trigger,
}: InferenceDialogProps) {
  const [open, setOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [results, setResults] = useState<InferencePrediction[] | null>(null);

  const { mutate: runInference, isPending, error } = useRunInference();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputText.trim()) return;

    // Split by newlines to support multiple texts
    const text = inputText
      .split("\n")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    runInference(
      {
        model_path: modelPath,
        texts: text,
        pipeline_id: pipelineId,
      },
      {
        onSuccess: (response) => {
          setResults(response.predictions);
        },
      }
    );
  };

  const handleClear = () => {
    setInputText("");
    setResults(null);
  };

  const handleClose = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      // Reset form when closing
      setTimeout(() => {
        handleClear();
      }, 200);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <Sparkles className="w-4 h-4" />
            Inference
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Run Inference
          </DialogTitle>
          <DialogDescription>
            Test your model with custom text inputs. Enter one or more texts
            (one per line) to get predictions.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Model Info */}
          <div className="bg-muted/50 rounded-lg p-3 space-y-1">
            <p className="text-sm font-medium">Model: {modelName}</p>
            <code className="text-xs text-muted-foreground break-all">
              {modelPath}
            </code>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error.message || "Failed to run inference. Please try again."}
              </AlertDescription>
            </Alert>
          )}

          {/* Input Section */}
          <div className="space-y-2">
            <Label htmlFor="input-text">
              Input Text
              <span className="text-muted-foreground text-xs ml-2">
                (One text per line for batch inference)
              </span>
            </Label>
            <Textarea
              id="input-text"
              placeholder="Enter text to classify...&#10;You can enter multiple texts (one per line)"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isPending}
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleClear}
              disabled={isPending || (!inputText && !results)}
            >
              Clear
            </Button>
            <Button type="submit" disabled={isPending || !inputText.trim()}>
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Run Inference
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Results Section */}
        {results && results.length > 0 && (
          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Results ({results.length})
              </h4>
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {results.map((result, index) => (
                <Card key={index} className="shadow-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-sm font-medium">
                        Text {index + 1}
                      </CardTitle>
                      <Badge className="shrink-0">
                        {result.label}
                      </Badge>
                    </div>
                    <CardDescription className="text-sm">
                      {result.text}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Confidence:
                        </span>
                        <span className="font-medium">
                          {(result.probability * 100).toFixed(2)}%
                        </span>
                      </div>

                      {/* All Probabilities */}
                      <div className="space-y-1.5">
                        <p className="text-xs text-muted-foreground">
                          All Probabilities:
                        </p>
                        <div className="space-y-1">
                          {Object.entries(result.all_probabilities)
                            .sort(([, a], [, b]) => b - a)
                            .map(([label, prob]) => (
                              <div
                                key={label}
                                className="flex items-center gap-2"
                              >
                                <Badge
                                  variant={
                                    label === result.label
                                      ? "default"
                                      : "outline"
                                  }
                                  className="w-24 justify-center text-xs"
                                >
                                  {label}
                                </Badge>
                                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-primary transition-all"
                                    style={{
                                      width: `${prob * 100}%`,
                                    }}
                                  />
                                </div>
                                <span className="text-xs text-muted-foreground w-12 text-right">
                                  {(prob * 100).toFixed(1)}%
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
