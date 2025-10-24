# Guide: Adding New Endpoints and Hooks

This guide explains the step-by-step process for adding new API endpoints and creating React hooks (queries and mutations) in this project.

## Table of Contents
- [Folder Conventions](#folder-conventions)
- [Step 1: Define TypeScript Types](#step-1-define-typescript-types)
- [Step 2: Create API Service Method](#step-2-create-api-service-method)
- [Step 3: Create React Query Hook](#step-3-create-react-query-hook)
- [Step 4: Use the Hook in Components](#step-4-use-the-hook-in-components)
- [Complete Examples](#complete-examples)

---

## Folder Conventions

```
src/
├── apis/                    # API service classes
│   ├── pipeline.ts          # Pipeline-related API methods
│   ├── trainer.ts           # Trainer-related API methods
│   └── index.ts             # Export all services
├── hooks/                   # React hooks for data fetching and mutations
│   ├── pipeline/            # Pipeline-related hooks
│   │   ├── phase/          # Phase-related hooks (nested resource)
│   │   │   ├── useFetchPhase.ts
│   │   │   └── useFetchPhaseDatasetStatus.ts
│   │   ├── useFetchPipeline.ts
│   │   ├── useFetchPipelines.ts
│   │   └── useFetchPipelineTestset.ts
│   ├── trainer/            # Trainer-related hooks
│   │   ├── useCreateTrainer.tsx    # Mutation hook
│   │   ├── useFetchTrainers.tsx    # Query hook
│   │   └── useStartTrainer.tsx     # Mutation hook
│   └── inference/          # Inference-related hooks
├── schema/                  # TypeScript type definitions
│   ├── schema.ts           # V1 schemas
│   ├── schema_v2.ts        # V2 schemas
│   └── response.ts         # Response wrapper types
└── lib/
    ├── client.ts           # Base API client class
    └── fetcher.ts          # Custom fetch wrapper

```

### Conventions:
- **APIs**: Group by domain (pipeline, trainer, inference)
- **Hooks**: Mirror the API structure - organize by domain and resource hierarchy
- **Nested Resources**: Create subdirectories (e.g., `hooks/pipeline/phase/`)
- **Naming**: Use camelCase for files and functions

---

## Step 1: Define TypeScript Types

First, define your request/response types in the appropriate schema file.

**File**: `src/schema/schema_v2.ts` (or create a new schema file)

```typescript
// Response type (what the API returns)
export interface MyResourceDetail {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  // ... other fields
}

// Request type (for mutations)
export interface CreateMyResourceRequest {
  name: string;
  description: string;
  // ... other fields
}

// Optional: Query parameters
export interface ListMyResourceQuery {
  limit?: number;
  offset?: number;
  status?: string;
}
```

**Update**: `src/schema/response.ts` (if needed)

The `ResponseWithData` wrapper is already defined:

```typescript
export interface ResponseWithData<T> {
  data: T;
  message?: string;
}
```

---

## Step 2: Create API Service Method

Add methods to the appropriate service class in `src/apis/`.

### For GET Requests (Query)

**File**: `src/apis/pipeline.ts` (or create a new service file)

```typescript
import { Client } from "@/lib/client";
import fetcher from "@/lib/fetcher";
import { ResponseWithData } from "@/schema/response";
import { MyResourceDetail, ListMyResourceQuery } from "@/schema/schema_v2";
import QueryString from "qs";

class PipelineService extends Client {
  // List resources (GET /v2/resources)
  listMyResources(query?: ListMyResourceQuery) {
    const queryString = query ? `?${QueryString.stringify(query)}` : "";
    return fetcher<ResponseWithData<MyResourceDetail[]>>(
      `${this.baseUrl}/v2/resources${queryString}`,
      {
        headers: this.privateHeaders,
      }
    );
  }

  // Get single resource (GET /v2/resources/:id)
  getMyResource(resourceId: string) {
    return fetcher<ResponseWithData<MyResourceDetail>>(
      `${this.baseUrl}/v2/resources/${resourceId}`,
      {
        headers: this.privateHeaders,
      }
    );
  }
}

const pipelineService = new PipelineService();
pipelineService.setApiAuthToken(AI_SERVICE_API_KEY);

export { pipelineService };
```

### For POST/PUT/DELETE Requests (Mutation)

**File**: `src/apis/trainer.ts`

```typescript
import { Client } from "@/lib/client";
import fetcher from "@/lib/fetcher";
import { ResponseWithData } from "@/schema/response";
import { MyResourceDetail, CreateMyResourceRequest } from "@/schema/schema";

class TrainerService extends Client {
  // Create resource (POST /v1/resources)
  createMyResource(input: CreateMyResourceRequest) {
    return fetcher<ResponseWithData<MyResourceDetail>>(
      `${this.baseUrl}/v1/resources`,
      {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify(input),
      }
    );
  }

  // Update resource (PUT /v1/resources/:id)
  updateMyResource(resourceId: string, input: Partial<CreateMyResourceRequest>) {
    return fetcher<ResponseWithData<MyResourceDetail>>(
      `${this.baseUrl}/v1/resources/${resourceId}`,
      {
        method: "PUT",
        headers: this.headers,
        body: JSON.stringify(input),
      }
    );
  }

  // Delete resource (DELETE /v1/resources/:id)
  deleteMyResource(resourceId: string) {
    return fetcher<ResponseWithData<void>>(
      `${this.baseUrl}/v1/resources/${resourceId}`,
      {
        method: "DELETE",
        headers: this.headers,
      }
    );
  }
}

export const trainerService = new TrainerService();
```

### Creating a New Service File

If creating a new service (e.g., `src/apis/myservice.ts`):

```typescript
import { Client } from "@/lib/client";
import fetcher from "@/lib/fetcher";
import { AI_SERVICE_API_KEY } from "@/constants/envs";

class MyService extends Client {
  // Add your methods here
}

const myService = new MyService();
myService.setApiAuthToken(AI_SERVICE_API_KEY);

export { myService };
```

Then export from `src/apis/index.ts`:

```typescript
export * from "./pipeline";
export * from "./trainer";
export * from "./myservice";
```

---

## Step 3: Create React Query Hook

Create hooks in `src/hooks/` following the folder structure conventions.

### Query Hook (GET requests - useQuery)

**File**: `src/hooks/pipeline/useFetchPipelines.ts`

```typescript
import { pipelineService } from "@/apis/pipeline";
import { useQuery } from "@tanstack/react-query";

// Export the query key for cache invalidation
export const MY_RESOURCE_QUERY_KEY = "myResource";

export const useFetchMyResources = () => {
  return useQuery({
    queryKey: [MY_RESOURCE_QUERY_KEY],
    queryFn: () => pipelineService.listMyResources(),
  });
};
```

**With Parameters and Options**:

**File**: `src/hooks/pipeline/phase/useFetchPhase.ts`

```typescript
import { pipelineService } from "@/apis/pipeline";
import { useQuery } from "@tanstack/react-query";

export const PHASE_DETAIL_QUERY_KEY = "PhaseDetail";

interface Options {
  ignoreRefetch?: boolean;
}

export const useFetchPhase = (phaseId: string, options: Options = {}) => {
  return useQuery({
    queryKey: [PHASE_DETAIL_QUERY_KEY, phaseId],
    queryFn: () => pipelineService.getPhase(phaseId),
    ...(options
      ? {
          enabled: !options.ignoreRefetch,
        }
      : null),
  });
};
```

### Mutation Hook (POST/PUT/DELETE - useMutation)

**File**: `src/hooks/trainer/useCreateTrainer.tsx`

```typescript
import { useMutation } from "@tanstack/react-query";
import { trainerService } from "@/apis/trainer";

const CREATE_TRAINER_KEY = ["trainer", "create"];

export const useCreateTrainer = () => {
  return useMutation({
    mutationKey: CREATE_TRAINER_KEY,
    mutationFn: trainerService.createTrainer.bind(trainerService),
  });
};
```

**With Custom Options**:

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { trainerService } from "@/apis/trainer";
import { TRAINER_QUERY_KEY } from "./useFetchTrainers";

const CREATE_TRAINER_KEY = ["trainer", "create"];

export const useCreateTrainer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: CREATE_TRAINER_KEY,
    mutationFn: trainerService.createTrainer.bind(trainerService),
    onSuccess: () => {
      // Invalidate and refetch queries after successful mutation
      queryClient.invalidateQueries({ queryKey: [TRAINER_QUERY_KEY] });
    },
  });
};
```

---

## Step 4: Use the Hook in Components

### Using a Query Hook

```typescript
import { useFetchPipelines } from "@/hooks/pipeline/useFetchPipelines";

export function PipelineList() {
  const { data, isLoading, error, refetch } = useFetchPipelines();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.data.map((pipeline) => (
        <div key={pipeline.id}>{pipeline.name}</div>
      ))}
      <button onClick={() => refetch()}>Refresh</button>
    </div>
  );
}
```

### Using a Mutation Hook

```typescript
import { useCreateTrainer } from "@/hooks/trainer/useCreateTrainer";
import { useState } from "react";

export function CreateTrainerForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const { mutate, isPending, isError, error } = useCreateTrainer();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    mutate(
      { name, description },
      {
        onSuccess: (data) => {
          console.log("Trainer created:", data.data);
          // Reset form or redirect
          setName("");
          setDescription("");
        },
        onError: (err) => {
          console.error("Failed to create trainer:", err);
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
      />
      <button type="submit" disabled={isPending}>
        {isPending ? "Creating..." : "Create Trainer"}
      </button>
      {isError && <div>Error: {error.message}</div>}
    </form>
  );
}
```

---

## Complete Examples

### Example: Adding a "Comments" Feature

#### 1. Define Types (`src/schema/schema_v2.ts`)

```typescript
export interface CommentDetail {
  id: string;
  phaseId: string;
  content: string;
  author: string;
  createdAt: string;
}

export interface CreateCommentRequest {
  phaseId: string;
  content: string;
}
```

#### 2. Add API Methods (`src/apis/pipeline.ts`)

```typescript
class PipelineService extends Client {
  // ... existing methods

  getPhaseComments(phaseId: string) {
    return fetcher<ResponseWithData<CommentDetail[]>>(
      `${this.baseUrl}/v2/workflow/phase/${phaseId}/comments`,
      {
        headers: this.privateHeaders,
      }
    );
  }

  createPhaseComment(input: CreateCommentRequest) {
    return fetcher<ResponseWithData<CommentDetail>>(
      `${this.baseUrl}/v2/workflow/phase/comments`,
      {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify(input),
      }
    );
  }
}
```

#### 3. Create Query Hook (`src/hooks/pipeline/phase/useFetchPhaseComments.ts`)

```typescript
import { pipelineService } from "@/apis/pipeline";
import { useQuery } from "@tanstack/react-query";

export const PHASE_COMMENTS_QUERY_KEY = "PhaseComments";

export const useFetchPhaseComments = (phaseId: string) => {
  return useQuery({
    queryKey: [PHASE_COMMENTS_QUERY_KEY, phaseId],
    queryFn: () => pipelineService.getPhaseComments(phaseId),
  });
};
```

#### 4. Create Mutation Hook (`src/hooks/pipeline/phase/useCreatePhaseComment.tsx`)

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { pipelineService } from "@/apis/pipeline";
import { PHASE_COMMENTS_QUERY_KEY } from "./useFetchPhaseComments";

const CREATE_PHASE_COMMENT_KEY = ["phase", "comment", "create"];

export const useCreatePhaseComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: CREATE_PHASE_COMMENT_KEY,
    mutationFn: pipelineService.createPhaseComment.bind(pipelineService),
    onSuccess: (data) => {
      // Invalidate comments for this phase
      queryClient.invalidateQueries({
        queryKey: [PHASE_COMMENTS_QUERY_KEY, data.data.phaseId]
      });
    },
  });
};
```

#### 5. Use in Component

```typescript
import { useFetchPhaseComments } from "@/hooks/pipeline/phase/useFetchPhaseComments";
import { useCreatePhaseComment } from "@/hooks/pipeline/phase/useCreatePhaseComment";
import { useState } from "react";

export function PhaseComments({ phaseId }: { phaseId: string }) {
  const [content, setContent] = useState("");

  const { data, isLoading } = useFetchPhaseComments(phaseId);
  const { mutate, isPending } = useCreatePhaseComment();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ phaseId, content }, {
      onSuccess: () => setContent(""),
    });
  };

  if (isLoading) return <div>Loading comments...</div>;

  return (
    <div>
      <h3>Comments</h3>
      {data?.data.map((comment) => (
        <div key={comment.id}>
          <strong>{comment.author}</strong>
          <p>{comment.content}</p>
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add a comment"
        />
        <button type="submit" disabled={isPending}>
          {isPending ? "Posting..." : "Post Comment"}
        </button>
      </form>
    </div>
  );
}
```

---

## Key Patterns to Follow

1. **Query Keys**: Always export query keys as constants for cache invalidation
2. **Service Binding**: Use `.bind(service)` in mutation hooks to preserve `this` context
3. **Type Safety**: Use TypeScript generics with `fetcher<ResponseWithData<T>>`
4. **Headers**: Use `this.privateHeaders` for authenticated endpoints, `this.headers` for public ones
5. **Query Parameters**: Use `qs` library for complex query string serialization
6. **Folder Structure**: Group by domain, nest by resource hierarchy
7. **Naming Conventions**:
   - Queries: `useFetch[Resource]` or `useFetch[Resources]`
   - Mutations: `useCreate[Resource]`, `useUpdate[Resource]`, `useDelete[Resource]`
   - Query Keys: `[RESOURCE]_QUERY_KEY` or `[RESOURCE]_[DETAIL]_QUERY_KEY`

---

## Reference Files

- **Query Hook Example**: `src/hooks/pipeline/phase/useFetchPhase.ts`
- **Mutation Hook Example**: `src/hooks/trainer/useCreateTrainer.tsx`
- **API Service Example**: `src/apis/pipeline.ts`
- **Base Client**: `src/lib/client.ts`
- **Fetcher Utility**: `src/lib/fetcher.ts`
