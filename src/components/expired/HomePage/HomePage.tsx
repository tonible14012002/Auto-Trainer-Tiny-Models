"use client";

import { ModelInferenceView } from "@/components/Model/ModelInferenceView";

import { Layout } from "@/components/ui/layout";
import { memo, useEffect, useState } from "react";
import { useModels } from "@/provider/ModelsProvider";
import { AppSidebar } from "@/components/common/AppSidebar";
import { EmptyState } from "@/components/common/EmptyState";
import { SwitchModelAlert } from "@/components/common/SwitchModelAlert";

export const HomePage = memo(() => {
  const { models, isInfering, setIsInfering } = useModels();
  const [selectedModelId, setSelectedModelId] = useState<string>();
  const [isOpen, setIsOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const [willSelectModelId, setWillSelectModelId] = useState(selectedModelId);
  const onChangeModel = (modelId: string) => {
    if (!isInfering) {
      setSelectedModelId(modelId);
    } else {
      setShowAlert(true);
      setWillSelectModelId(modelId);
    }
  };

  const onConfirmAlert = () => {
    setShowAlert(false);
    setSelectedModelId(willSelectModelId);
    setIsInfering(false);
  };

  useEffect(() => {
    if (!selectedModelId) {
      setIsOpen(true);
    }
  }, [models, selectedModelId, setIsInfering]);

  return (
    <Layout container={false} wrapperClassName="h-full overflow-hidden">
      <div className="grid md:grid-cols-[340px_1fr] h-full grid-cols-[52px_1fr] transition-all">
        <AppSidebar
          selectedModelId={selectedModelId}
          models={models}
          onSelectModel={onChangeModel}
          open={isOpen}
          onOpenChange={setIsOpen}
        />
        <div className="h-full min-h-0 min-w-0">
          {selectedModelId ? (
            // Force reload component on change
            <ModelInferenceView
              selectedModelId={selectedModelId}
              key={selectedModelId}
            />
          ) : (
            <EmptyState onOpenSidebar={() => setIsOpen(true)} />
          )}
        </div>
      </div>
      <SwitchModelAlert
        onOpenChange={setShowAlert}
        open={showAlert}
        onConfirm={onConfirmAlert}
        onCancel={() => setShowAlert(false)}
      />
    </Layout>
  );
});

HomePage.displayName = "HomePage";