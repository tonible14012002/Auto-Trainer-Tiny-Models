# Training Profile Components

This directory contains components for managing training profiles with training and LoRA configurations.

## Components

### ProfileListView

A comprehensive list view component that displays all training profiles with a master-detail layout.

**Props:** None

**Example Usage:**

```tsx
import { ProfileListView } from "@/components/training-profile";

function TrainingConfigPage() {
  return (
    <div className="container mx-auto p-6">
      <ProfileListView />
    </div>
  );
}
```

**Features:**
- Lists all training profiles in a scrollable sidebar
- Click on any profile to view full details in the main panel
- Integrated "Create" button that opens the create dialog
- Auto-refreshes list after creating new profiles
- Shows profile name, description, and last updated time
- Responsive grid layout (stacks on mobile, side-by-side on desktop)
- Empty states for no profiles
- Loading and error states
- Highlights selected profile
- Profile details show all training config and LoRA settings

### TrainingProfileViewDialog

A dialog component for viewing training profile details including training configuration and LoRA settings.

**Props:**
- `profileId: string` - The ID of the training profile to display
- `trigger: React.ReactNode` - The element that triggers the dialog (e.g., a button)

**Example Usage:**

```tsx
import { TrainingProfileViewDialog } from "@/components/training-profile";
import { Button } from "@/components/ui/button";

function MyComponent() {
  const profileId = "some-profile-id";

  return (
    <TrainingProfileViewDialog
      profileId={profileId}
      trigger={<Button variant="outline">View Profile</Button>}
    />
  );
}
```

### CreateTrainingProfileDialog

A dialog component with a form for creating new training profiles.

**Props:**
- `trigger: React.ReactNode` - The element that triggers the dialog (e.g., a button)
- `onSuccess?: () => void` - Optional callback called when profile is successfully created

**Example Usage:**

```tsx
import { CreateTrainingProfileDialog } from "@/components/training-profile";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

function MyComponent() {
  const handleSuccess = () => {
    console.log("Profile created successfully!");
    // Refresh your profile list, show toast, etc.
  };

  return (
    <CreateTrainingProfileDialog
      trigger={
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Profile
        </Button>
      }
      onSuccess={handleSuccess}
    />
  );
}
```

## Features

### TrainingProfileViewDialog
- Fetches profile data using `useFetchTrainingProfile` hook
- Displays profile metadata (name, description, timestamps)
- Shows training configuration in an organized grid
- Displays LoRA configuration with all parameters
- Loading and error states
- Responsive design

### CreateTrainingProfileDialog
- Comprehensive form for all training parameters
- Pre-filled with sensible defaults
- LoRA configuration with dynamic target modules
- Add/remove target modules on the fly
- Form validation
- Loading states during submission
- Error handling
- Auto-closes and resets on success

## Default Values

The create form comes pre-filled with these defaults:

**Training Config:**
- Learning Rate: 2e-5
- Train Batch Size: 8
- Eval Batch Size: 16
- Gradient Accumulation Steps: 4
- Epochs: 3
- Warmup Ratio: 0.15
- Weight Decay: 0.01
- Max Gradient Norm: 1.0
- Logging Steps: 10
- Save Steps: 500
- Eval Steps: 100
- Seed: 42

**LoRA Config:**
- r: 16
- Alpha: 32
- Dropout: 0.1
- Bias: none
- Target Modules: query, value, dense
