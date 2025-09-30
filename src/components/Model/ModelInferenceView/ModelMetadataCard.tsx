import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import type { ModelDetail } from "@/schema/model";

interface ModelMetadataCardProps {
  model: ModelDetail;
}

export const ModelMetadataCard = ({ model }: ModelMetadataCardProps) => {
  if (!model.metadata) {
    return null;
  }

  return (
    <Card className="w-full p-3">
      <CardContent className="p-0 space-y-2">
        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          {model.metadata.description}
        </p>

        {/* HuggingFace URL */}
        {model.metadata.huggingfaceUrl && (
          <a
            href={model.metadata.huggingfaceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors hover:underline"
          >
            <ExternalLink className="h-3 w-3" />
            View on HuggingFace
          </a>
        )}
      </CardContent>
    </Card>
  );
};
