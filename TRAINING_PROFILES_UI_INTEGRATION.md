# Training Profiles UI Integration

This document describes how the Training Profiles feature has been integrated into the existing UI.

## Integration Points

The Training Profiles dialog has been added to two main screens:

### 1. Phase Detail Page
**File:** `src/app/(app)/pipeline/[pipelineId]/phases/[phaseId]/page.tsx`

**Location:** Top header section, alongside other action buttons

**Button Position:**
```
┌─────────────────────────────────────────────────────────────┐
│  Pipeline Name                                               │
│  [Label Config] [Test Dataset] [Training Profiles] <-- HERE │
└─────────────────────────────────────────────────────────────┘
```

**Implementation:**
- Added "Training Profiles" button in the header actions area
- Button positioned after "Test Dataset" button
- Opens a full-width dialog (max-w-7xl) containing ProfileListView
- Uses Settings2 icon for consistency

**Code Changes:**
```tsx
// Added imports
import { ProfileListView } from "@/components/training-profile";
import { Settings2 } from "lucide-react";

// Added state
const [showTrainingProfiles, setShowTrainingProfiles] = useState(false);

// Added dialog in header actions
<Dialog open={showTrainingProfiles} onOpenChange={setShowTrainingProfiles}>
  <DialogTrigger asChild>
    <Button variant="outline" size="sm" className="gap-2">
      <Settings2 className="w-4 h-4" />
      Training Profiles
    </Button>
  </DialogTrigger>
  <DialogContent className="!max-w-[95vw] md:!max-w-7xl w-full max-h-[90vh]">
    <ProfileListView />
  </DialogContent>
</Dialog>
```

### 2. Pipeline Detail Page
**File:** `src/components/pipeline/PipelineDetailView/PipelineDetailView.tsx`

**Location:** Top header section, right side opposite the pipeline name

**Button Position:**
```
┌─────────────────────────────────────────────────────────────┐
│  Pipeline Name                      [Training Profiles]     │
└─────────────────────────────────────────────────────────────┘
│  Label Configuration                                        │
│  [Experiments]                                              │
│  [Evaluation Dataset]                                       │
└─────────────────────────────────────────────────────────────┘
```

**Implementation:**
- Converted header from simple h1 to flex container
- Added "Training Profiles" button on the right side
- Opens same full-width dialog as phase detail page
- Maintains consistent styling across both pages

**Code Changes:**
```tsx
// Added imports
import { ProfileListView } from "@/components/training-profile";
import { Button } from "@/components/ui/button";
import { Dialog, ... } from "@/components/ui/dialog";
import { Settings2 } from "lucide-react";

// Added state
const [showTrainingProfiles, setShowTrainingProfiles] = useState(false);

// Modified header structure
<div className="flex items-center justify-between gap-4 mt-4">
  <h1 className="text-2xl font-bold">{pipelineDetail.name}</h1>

  <Dialog open={showTrainingProfiles} onOpenChange={setShowTrainingProfiles}>
    <DialogTrigger asChild>
      <Button variant="outline" size="sm" className="gap-2">
        <Settings2 className="w-4 h-4" />
        Training Profiles
      </Button>
    </DialogTrigger>
    <DialogContent className="!max-w-[95vw] md:!max-w-7xl w-full max-h-[90vh]">
      <ProfileListView />
    </DialogContent>
  </Dialog>
</div>
```

## User Flow

### From Phase Detail Page:
1. User navigates to a phase detail page
2. Clicks "Training Profiles" button in header
3. Dialog opens showing ProfileListView
4. User can:
   - Browse existing profiles in left sidebar
   - Click on a profile to view details in right panel
   - Click "Create" button to add new profile
   - Close dialog to return to phase detail page

### From Pipeline Detail Page:
1. User navigates to a pipeline detail page
2. Clicks "Training Profiles" button in top-right header
3. Dialog opens showing ProfileListView
4. Same interaction as above

## Dialog Specifications

### Size & Layout
- **Desktop:** `max-w-7xl` (very wide to accommodate master-detail layout)
- **Mobile:** `max-w-[95vw]` (full width with small margins)
- **Height:** `max-h-[90vh]` (90% viewport height)
- **Scroll:** Enabled with `overflow-y-auto`

### Content Structure
```
┌─────────────────────────────────────────────────────────────┐
│  Training Profiles                                    [X]   │
│  Manage training and LoRA configuration profiles            │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────┬─────────────────────────────────────┐ │
│  │ Profile List     │ Profile Details                     │ │
│  │                  │                                     │ │
│  │ [+ Create]       │ (Selected profile configuration)    │ │
│  │                  │                                     │ │
│  │ • Profile 1      │                                     │ │
│  │ • Profile 2      │                                     │ │
│  │ • Profile 3      │                                     │ │
│  └──────────────────┴─────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Styling Consistency

Both integrations maintain consistency with:
- **Button Style:** `variant="outline"` `size="sm"`
- **Icon:** Settings2 from lucide-react
- **Dialog:** Same width and height constraints
- **Content:** Identical ProfileListView component

## Benefits

1. **Accessibility:** Training profiles accessible from two key workflow entry points
2. **Consistency:** Same UX in both locations
3. **Non-intrusive:** Dialog pattern keeps users in context
4. **Full-featured:** Complete profile management without leaving current page
5. **Responsive:** Works well on both mobile and desktop

## Testing Checklist

- [ ] Phase detail page: Button appears in header
- [ ] Phase detail page: Dialog opens and shows profile list
- [ ] Phase detail page: Can create, view, and select profiles
- [ ] Pipeline detail page: Button appears in header
- [ ] Pipeline detail page: Dialog opens and shows profile list
- [ ] Pipeline detail page: Can create, view, and select profiles
- [ ] Dialog closes properly on both pages
- [ ] Responsive behavior works on mobile screens
- [ ] Button styling matches existing UI patterns
- [ ] Dialog scrolling works when content is tall
