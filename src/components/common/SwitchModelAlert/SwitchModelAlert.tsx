import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle } from "lucide-react";

interface SwitchModelAlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
  isInferenceRunning?: boolean;
  currentModelName?: string;
  targetModelName?: string;
}

export const SwitchModelAlert = ({
  open,
  onOpenChange,
  onConfirm,
  onCancel,
  isInferenceRunning = false,
  currentModelName,
  targetModelName,
}: SwitchModelAlertProps) => {
  const handleCancel = () => {
    onCancel();
    onOpenChange(false);
  };

  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <AlertDialogTitle>Switch Model</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-left space-y-2">
            {isInferenceRunning ? (
              <>
                <p className="font-medium text-destructive">
                  An inference is currently running.
                </p>
                <p>
                  Switching from{" "}
                  <span className="font-medium">{currentModelName}</span> to{" "}
                  <span className="font-medium">{targetModelName}</span> will
                  stop the current inference and you will lose the response.
                </p>
                <p>Are you sure you want to continue?</p>
              </>
            ) : (
              <>
                <p>
                  You are about to switch from{" "}
                  <span className="font-medium">{currentModelName}</span> to{" "}
                  <span className="font-medium">{targetModelName}</span>.
                </p>
                <p>
                  Any ongoing inference will be stopped and results will be
                  lost.
                </p>
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-amber-600 hover:bg-amber-700"
          >
            Switch Model
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};