import { Brain } from "lucide-react";

export const AppHeaderLogo = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="p-1 rounded-lg bg-primary">
        <Brain className="w-6 h-6 text-primary-foreground" />
      </div>
      <div className="flex flex-col">
        <h1 className="text-md font-semibold">Choose your brain</h1>
        <p className="text-xs text-muted-foreground -mt-1">
          Tiny models that run in your browser
        </p>
      </div>
    </div>
  );
};
