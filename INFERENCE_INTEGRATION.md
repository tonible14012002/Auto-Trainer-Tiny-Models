# Inference Integration - Implementation Summary

## Overview
This document summarizes the implementation of the model inference feature integrated into the Training Section UI.

## New Endpoint Integration

### Endpoint Details
```
POST /v2/workflow/inference
```

**Request Body:**
```json
{
  "model_path": ".checkpoints/pipeline-uuid/0/1",
  "texts": [
    "Send $100 to John",
    "Can you pay me back?",
    "Hello how are you?"
  ],
  "pipeline_id": "abc-123-pipeline-id"
}
```

**Response:**
```json
{
  "message": "Inference completed successfully",
  "predictions": [
    {
      "text": "Send $100 to John",
      "label": "payment_intent",
      "probability": 0.95,
      "all_probabilities": {
        "payment_intent": 0.95,
        "payment_request": 0.03,
        "open_intent": 0.02
      }
    }
  ],
  "model_info": {
    "model_path": ".checkpoints/pipeline-uuid/0/1",
    "labels": {
      "0": "payment_request",
      "1": "payment_intent",
      "2": "open_intent"
    },
    "total_predictions": 3
  }
}
```

## Changes Made

### 1. Schema Updates (`src/schema/schema_v2.ts`)

#### New Interfaces
```typescript
// Request interface
interface InferenceRequest {
  model_path: string;
  texts: string[];  // Array of texts to classify
  pipeline_id: string;
}

// Prediction for a single text
interface InferencePrediction {
  text: string;
  label: string;
  probability: number;
  all_probabilities: Record<string, number>;
}

// Model information
interface InferenceModelInfo {
  model_path: string;
  labels: Record<string, string>;
  total_predictions: number;
}

// Response from the inference endpoint
interface InferenceResponse {
  message: string;
  predictions: InferencePrediction[];
  model_info: InferenceModelInfo;
}
```

### 2. API Service (`src/apis/pipeline.ts`)

Added new method:
```typescript
runInference(request: InferenceRequest): Promise<ResponseWithData<InferenceResponse>>
```

### 3. New Hook (`src/hooks/pipeline/phase/useRunInference.ts`)

Created a React Query mutation hook for running inference:
```typescript
export const useRunInference = () => {
  return useMutation({
    mutationKey: ["pipeline", "inference"],
    mutationFn: (request: InferenceRequest) => pipelineService.runInference(request),
  });
};
```

### 4. InferenceDialog Component (`src/components/pipeline/PhaseDetailView/InferenceDialog.tsx`)

**Features:**
- Dialog-based UI for running inference
- Multi-line textarea for batch inference (one text per line)
- Real-time results display
- Visual probability distribution for each result
- Clear and submit buttons
- Loading states and error handling

**UI Components:**
1. **Input Section:**
   - Multi-line textarea
   - Supports batch inference (multiple texts separated by newlines)
   - Placeholder guidance

2. **Results Panel:**
   - Displays all inference results
   - Shows predicted label as a badge
   - Confidence percentage
   - Visual probability bars for all labels
   - Sorted by probability (highest first)
   - Color-coded predicted label vs. other labels

**Props:**
```typescript
interface InferenceDialogProps {
  modelPath: string;      // Path to the trained model
  pipelineId: string;     // Pipeline ID for label configuration
  modelName: string;      // Display name of the model
  trigger?: React.ReactNode; // Optional custom trigger button
}
```

### 5. Updated Components

#### TrainedModelInfo (`src/components/pipeline/PhaseDetailView/TrainedModelInfo.tsx`)
- Added `pipelineId` prop
- Integrated InferenceDialog button next to Evaluate button
- Button shows Sparkles icon with "Inference" label

#### TrainingSection (`src/components/pipeline/PhaseDetailView/TrainingSection.tsx`)
- Added `pipelineId` prop
- Passes `pipelineId` to TrainedModelInfo components

#### PhaseDetailCard (`src/components/pipeline/PhaseDetailView/PhaseDetailCard.tsx`)
- Passes `phase.pipeline_id` to TrainingSection

## File Structure

```
src/
├── components/
│   └── pipeline/
│       └── PhaseDetailView/
│           ├── InferenceDialog.tsx (new)
│           ├── TrainedModelInfo.tsx (updated)
│           ├── TrainingSection.tsx (updated)
│           └── PhaseDetailCard.tsx (updated)
├── hooks/
│   └── pipeline/
│       └── phase/
│           └── useRunInference.ts (new)
├── apis/
│   └── pipeline.ts (updated)
└── schema/
    └── schema_v2.ts (updated)
```

## Usage Flow

1. User opens a phase detail view with trained models
2. Each trained model displays an "Inference" button
3. Click "Inference" opens the InferenceDialog
4. User enters one or more texts (one per line) in the textarea
5. Click "Run Inference" to submit
6. Results appear below the input:
   - Each result shows the input text
   - Predicted label as a badge
   - Confidence percentage
   - All label probabilities as visual bars
7. User can clear results and run more inferences
8. Dialog closes when user is done

## UI Example

```
┌─────────────────────────────────────────────┐
│ Run Inference                          [X]  │
├─────────────────────────────────────────────┤
│ Model: my-trained-model                     │
│ .checkpoints/pipeline-uuid/0/1              │
│                                             │
│ Input Text (One per line):                  │
│ ┌─────────────────────────────────────────┐ │
│ │ Send $100 to John                       │ │
│ │ Can you pay me back?                    │ │
│ │ Hello how are you?                      │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│              [Clear]  [Run Inference]       │
│                                             │
│ ─────────── Results (3) ──────────────      │
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │ Text 1                   [payment]      │ │
│ │ Send $100 to John                       │ │
│ │ Confidence: 95.00%                      │ │
│ │                                         │ │
│ │ All Probabilities:                      │ │
│ │ [payment] ████████████████████ 95.0%   │ │
│ │ [greeting] █ 3.0%                       │ │
│ │ [other] █ 2.0%                          │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ [Additional results...]                     │
└─────────────────────────────────────────────┘
```

## Key Features

1. **Batch Inference Support:**
   - Submit multiple texts at once
   - Automatically splits by newlines
   - Shows results for all inputs

2. **Visual Probability Display:**
   - Progress bars for each label
   - Sorted by probability
   - Highlighted predicted label

3. **Clean UX:**
   - Clear separation of input and results
   - Easy to run multiple inferences
   - Clear button to reset form

4. **Error Handling:**
   - Displays API errors in alert
   - Validates input before submission
   - Graceful loading states

5. **Accessibility:**
   - Proper labels and descriptions
   - Keyboard navigation support
   - Clear visual hierarchy

## Benefits

- **Quick Testing:** Test models directly from the UI without writing code
- **Batch Processing:** Run multiple inferences simultaneously
- **Visual Feedback:** Clear probability distributions help understand model confidence
- **Integrated Experience:** No need to leave the phase detail view
- **Debug Friendly:** See all probabilities to understand model behavior

## Technical Notes

- Uses React Query for state management and caching
- Textarea allows unlimited text input (split by newlines)
- Results are scrollable for many inferences
- Dialog auto-resets on close for clean state
- Fully responsive design
