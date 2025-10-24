# Training UI Integration - Implementation Summary

## Overview
This document summarizes the implementation of the new training UI that integrates training profile selection with the training workflow.

## Changes Made

### 1. Schema Updates (`src/schema/schema_v2.ts`)

#### Added Fields
- **TrainedModelInfo.training_argument_profile**: `TrainingProfile | null`
  - Contains the training profile used for this model (null if default was used)

#### New Interfaces
- **TrainModelRequest**: Request body for training endpoint
  ```typescript
  {
    phase_id: string;
    training_argument_profile_id?: string;  // Optional
    train_mode?: "FROM_SCRATCH" | "CONTINUAL";  // Optional
  }
  ```

### 2. New Components

#### TrainingArgumentProfileSelector (`src/components/training-profile/TrainingArgumentProfileSelector.tsx`)
- Popover-based profile selector
- Features:
  - Searchable dropdown
  - Displays profile name and description
  - Shows key training parameters (LR, epochs, LoRA r) as badges
  - Optional selection (can be cleared)
  - Loading states

#### StartTrainForm (`src/components/training-profile/StartTrainForm.tsx`)
- Complete training configuration form
- Features:
  - **Training Mode Selector** (required): FROM_SCRATCH or CONTINUAL
  - **Training Profile Selector** (optional): Uses TrainingArgumentProfileSelector
  - Form validation
  - Error handling
  - Loading states
  - Cancel and submit actions

### 3. API Updates

#### PipelineService (`src/apis/pipeline.ts`)
- **trainModel()**: Updated to accept `TrainModelRequest` object
  - Sends optional `training_argument_profile_id` in request body
  - Sends optional `train_mode` in request body
- **continualTrainModel()**: Marked as deprecated

#### Hooks (`src/hooks/pipeline/phase/useTrainModel.ts`)
- Updated to accept `TrainModelRequest` instead of just `phaseId`

### 4. TrainingSection Updates (`src/components/pipeline/PhaseDetailView/TrainingSection.tsx`)

#### Replaced Components
- ❌ Removed: "Train from Scratch" button
- ❌ Removed: "Continual Train" button
- ✅ Added: "Start Training" / "Train New Model" button with dialog

#### New Features
- Opens dialog with StartTrainForm
- Unified training flow for both modes
- Displays training profile information in trained models:
  - Profile name and description
  - Key parameters (Learning Rate, Epochs, Batch Size, LoRA r)
  - Visual badges for quick reference

### 5. File Structure
```
src/
├── components/
│   └── training-profile/
│       ├── index.ts (updated exports)
│       ├── TrainingArgumentProfileSelector.tsx (new)
│       ├── StartTrainForm.tsx (new)
│       └── EXAMPLE_USAGE.tsx (new - usage examples)
├── hooks/
│   └── pipeline/
│       └── phase/
│           └── useTrainModel.ts (updated)
├── apis/
│   └── pipeline.ts (updated)
└── schema/
    └── schema_v2.ts (updated)
```

## Usage Example

### Basic Usage in a Component
```tsx
import { StartTrainForm } from "@/components/training-profile";
import { useTrainModel } from "@/hooks/pipeline/phase/useTrainModel";

function YourComponent({ phaseId }: { phaseId: string }) {
  const { mutate: trainModel, isPending, error } = useTrainModel();

  return (
    <StartTrainForm
      phaseId={phaseId}
      onSubmit={trainModel}
      isLoading={isPending}
      error={error?.message}
    />
  );
}
```

### In a Dialog (Current Implementation)
```tsx
<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
  <DialogTrigger asChild>
    <Button>Start Training</Button>
  </DialogTrigger>
  <DialogContent className="max-w-2xl">
    <DialogHeader>
      <DialogTitle>Configure Model Training</DialogTitle>
    </DialogHeader>
    <StartTrainForm
      phaseId={phaseId}
      onSubmit={handleStartTraining}
      onCancel={() => setIsDialogOpen(false)}
      isLoading={isTraining}
      error={error?.message}
    />
  </DialogContent>
</Dialog>
```

## API Request Format

### Training Request Body
```json
{
  "training_argument_profile_id": "uuid-here",  // Optional
  "train_mode": "FROM_SCRATCH"  // or "CONTINUAL"
}
```

### Response Format (GET endpoints)
```json
{
  "trained_models": [
    {
      "id": "...",
      "model_name": "...",
      "model_type": "FROM_SCRATCH",
      "training_params": {...},
      "training_argument_profile": {
        "id": "uuid",
        "name": "profile-name",
        "description": "...",
        "training_config": {...},
        "lora_config": {...}
      }
    }
  ]
}
```

## Backward Compatibility

- ✅ Training profile is **optional** - if not selected, backend uses default configuration
- ✅ Existing API endpoints remain functional
- ✅ Old `continualTrainModel()` function still available (deprecated)
- ✅ `training_argument_profile` field is nullable in responses

## UI Flow

1. User clicks "Start Training" or "Train New Model"
2. Dialog opens with StartTrainForm
3. User selects training mode (required):
   - FROM_SCRATCH: Train from base checkpoint
   - CONTINUAL: Continue from previous checkpoint
4. User optionally selects training profile
5. User clicks "Start Training"
6. Request sent to backend with selected configuration
7. Dialog closes on success
8. Phase data refreshed to show new model

## Benefits

1. **Unified Interface**: Single button/form for all training operations
2. **Profile Support**: Easy selection of pre-configured training profiles
3. **Clear Descriptions**: Each option has clear explanations
4. **Visual Feedback**: Shows which profile was used for each trained model
5. **Backward Compatible**: Works with existing backend without breaking changes
6. **Extensible**: Easy to add more configuration options in the future
