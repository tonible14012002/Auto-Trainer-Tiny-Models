# Development Conventions

## React Query Hooks

### Query Hooks (Fetching Data)
```tsx
// src/hooks/[entity]/useFetch[Entity].tsx
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { [entity]Service } from "@/apis/[entity]";
import { useCallback } from "react";

const FETCH_[ENTITY]_KEY = "[entity]";

export const useFetch[Entity] = (params?: QueryParams) => {
  return useQuery({
    queryKey: [FETCH_[ENTITY]_KEY, params],
    queryFn: () => [entity]Service.get[Entity](params),
  });
};

export const useInvalidate[Entity] = () => {
  const queryClient = useQueryClient();
  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: [FETCH_[ENTITY]_KEY],
    });
  }, [queryClient]);

  return invalidate;
};
```

### Mutation Hooks (Creating/Updating Data)
```tsx
// src/hooks/[entity]/useCreate[Entity].tsx
import { useMutation } from "@tanstack/react-query";
import { [entity]Service } from "@/apis/[entity]";

const CREATE_[ENTITY]_KEY = ["[entity]", "create"];

export const useCreate[Entity] = () => {
  return useMutation({
    mutationKey: CREATE_[ENTITY]_KEY,
    mutationFn: [entity]Service.create[Entity].bind([entity]Service),
  });
};
```

**Key Points:**
- Define query/mutation keys **directly in the hook file** (no separate key.ts)
- Use descriptive constant names: `FETCH_[ENTITY]_KEY`, `CREATE_[ENTITY]_KEY`
- Always provide invalidation hook with query hooks
- Use `useCallback` for invalidation functions

## API Service Layer

```tsx
// src/apis/[entity].ts
import { Client } from "@/lib/client";
import fetcher from "@/lib/fetcher";
import QueryString from "qs";
import { ResponseWithData } from "@/schema/response";

export interface [Entity]Detail {
  id: number;
  // ... fields
}

export interface List[Entity]Query {
  limit?: number;
  offset?: number;
}

class [Entity]Service extends Client {
  get[Entity]s(q?: List[Entity]Query) {
    const queryString = q ? `?${QueryString.stringify(q)}` : "";
    return fetcher<ResponseWithData<[Entity]Detail[]>>(
      `${this.baseUrl}/v1/[entity]${queryString}`
    );
  }

  get[Entity](id: number) {
    return fetcher<ResponseWithData<[Entity]Detail>>(
      `${this.baseUrl}/v1/[entity]/${id}`
    );
  }

  create[Entity](input: CreateInput) {
    return fetcher<ResponseWithData<[Entity]Detail>>(
      `${this.baseUrl}/v1/[entity]`,
      {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify(input),
      }
    );
  }
}

export const [entity]Service = new [Entity]Service();
```

## Form Components with Dialog

### Dialog Popup Pattern
```tsx
// src/components/[Feature]/[Entity]CreatePopup.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { ReactNode, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { FormInput } from "@/components/common/Form/FormInput";
import { FormTextArea } from "@/components/common/Form/FormTextArea";
import { useCreate[Entity], useInvalidate[Entity]s } from "@/hooks/[entity]";
import { toast } from "sonner";

interface [Entity]CreatePopupProps {
  trigger?: ReactNode;
  onSuccess?: (id: number) => void;
}

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
});

export const [Entity]CreatePopup = (props: [Entity]CreatePopupProps) => {
  const { trigger, onSuccess } = props;
  const [isOpen, setIsOpen] = useState(false);
  const { mutateAsync, isPending } = useCreate[Entity]();
  const invalidate[Entity]s = useInvalidate[Entity]s();

  const formInstance = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: "", description: "" },
    disabled: isPending,
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    try {
      const { data: newEntity } = await mutateAsync(data);

      toast.success("[Entity] created successfully");
      setIsOpen(false);
      formInstance.reset();
      invalidate[Entity]s();

      onSuccess?.(newEntity.id);
    } catch (error) {
      toast.error("Failed to create [entity]", {
        description: error instanceof Error ? error.message : "Please try again later.",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <FormProvider {...formInstance}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className="!max-w-[420px]" loading={isPending}>
          <form onSubmit={formInstance.handleSubmit(onSubmit)} className="grid gap-4">
            <DialogHeader>
              <DialogTitle>New [Entity]</DialogTitle>
              <DialogDescription>Create a new [entity].</DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4">
              <FormInput name="name" label="Name" placeholder="Untitled" />
              <FormTextArea name="description" label="Description" />
            </div>

            <DialogFooter>
              <DialogTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </DialogTrigger>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Creating..." : "Submit"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
};
```

**Key Points:**
- Use `react-hook-form` + `zod` for validation
- Wrap form in `FormProvider` for context
- Always invalidate queries after successful mutation
- Use `toast` for user feedback
- Handle loading states with `isPending`
- Reset form after successful submission
- Optional `onSuccess` callback for custom behavior

## Form Input Components

Available form components:
- `<FormInput />` - Text input
- `<FormTextArea />` - Multi-line text
- `<FormProjectSelector />` - Project dropdown (if applicable)

All form inputs automatically connect to `react-hook-form` via `name` prop.

## Backend API Patterns

### Request Schema and Types

**IMPORTANT: JSON Fields in Request Types**
- JSON fields (objects/arrays) MUST be typed as `string` in request type definitions
- This is required because `JSONSchemaType` from Ajv cannot parse `any` types
- Client must serialize these fields to JSON strings before sending (e.g., `JSON.stringify()`)
- Endpoint handlers must parse these fields before passing to controllers (e.g., `JSON.parse()`)

Example:
```typescript
// ❌ WRONG - Ajv cannot validate `any` type
export type StartTrainerRequest = {
  labelsConfig: any;
};

// ✅ CORRECT - Use string and parse in endpoint
export type StartTrainerRequest = {
  labelsConfig: string; // JSON serialized as string
};

// In endpoint handler:
const postData = (await req.json()) as StartTrainerRequest;
const labelsConfig = JSON.parse(postData.labelsConfig); // Parse before using
await Controller.create({ ...postData, labelsConfig });
```

### Schema Structure

- Request TypeScript types defined in `src/schema/schema.ts`
- Request validation schemas defined inline in endpoint files using `JSONSchemaType<RequestType>`
- Entity detail types use `Detail` postfix (e.g., `TrainerDetail`, `TrainerConfigDetail`) to distinguish from Prisma-generated types
- Responses use `ResponseWithData<T>` wrapper and typed inline:
  ```typescript
  return Response.json(
    { data: result } as ResponseWithData<TrainerDetail>,
    { status: 200 }
  );
  ```

### Controller Patterns

- Controller methods accept optional `tx?: PrismaTx` parameter for transaction support
- Default to `prisma` if no transaction provided:
  ```typescript
  async createEntity(input: CreateInput, tx?: PrismaTx) {
    if (!tx) {
      tx = prisma;
    }
    // ... use tx
  }
  ```
- Include mapper functions to transform Prisma types to Detail types:
  ```typescript
  const mapPrismaEntityToSchema = (entity: any): EntityDetail => {
    return { /* transform fields */ };
  };
  ```