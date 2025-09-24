---
title: 'Implement Auditable Soft Delete in PayloadCMS'
summary: 'A simple yet effective way to implement soft delete in PayloadCMS, ensuring data integrity and auditability.'
createdAt: 2025-09-24 14:58:39 +0800
publishedAt: 2025-09-24
categories: [payloadcms, javascript, typescript, nodejs]
---

## TLDR

- PayloadCMS has a built-in `trash` feature for soft-deleting
- Enable it with `trash: true` in the collection config
- Add a `beforeDelete` hook to prevent permanent deletions, ensuring data is only ever soft-deleted
- Use custom fields like `deletedAt` and `deletedBy` for a clear audit trail

## Some Context

In any application, data integrity is key. There are times when a user might delete something by accident, or when you need to retain records for auditing purposes even after they are "removed" from the application. Permanent deletion can lead to lost data and broken relationships between documents in the database.

To solve this, we leverage PayloadCMS v3 to implement the soft-delete feature. Instead of destroying records, we simply flag them as "deleted," keeping them safely in the database.

## The Implementation

Our approach combines PayloadCMS's native features with a few custom hooks to create a robust soft-delete system. It's a three-step process:

### 1. Enable the "Trash" Feature

First, we enable the `trash` functionality in the configuration of each collection where we want to prevent permanent data loss.

```typescript
// src/collections/{{ YourCollections }}.ts

export const YourCollections: CollectionConfig = {
  trash: true, // Enable trash to allow soft delete
  // ... other configurations
};
```

With this flag, PayloadCMS automatically treats deleted documents as "trashed" instead of removing them.

### 2. Add Fields for Tracking

To know _who_ deleted _what_ and _when_, we add a few custom fields to our collections using a helper function.

```typescript
// src/collections/{{ YourCollections }}.ts

// ... (collection config definition)
// Add this field definition
{
  name: 'deletedAt',
  type: 'date',
  // ...
},
// ...
```

This automatically adds `deletedAt` and `deletedBy` fields, giving us a clear and useful audit trail for every soft-deleted document.

### 3. Prevent Permanent Deletion

Finally, to make the system truly robust, we add a `beforeDelete` hook. This hook intentionally throws an error if any part of the system attempts to perform a permanent delete, making it impossible to bypass the trash system.

```typescript
// src/hooks/disallowPermenentDelete.ts

export const disallowPermenentDelete: CollectionBeforeDeleteHook = () => {
  throw new APIError('Permanent delete is not allowed.');
};
```

```typescript
// src/collections/{{ YourCollections }}.ts

// ... (collection config definition)
// Add disallowPermenentDelete to hooks definition
hooks: {
  beforeDelete: [disallowPermenentDelete],
},
// ...
```

This hook is then added to the collection's configuration, acting as a final safeguard.

## 4. Bonus: Track Who Deleted What

```typescript
// src/hooks/maybeToggleDeletedBy.ts

export const maybeToggleDeletedBy: FieldHook = async ({ req, operation, data }) => {
  // PayloadCMS uses `update` operation for soft delete, as of v3.53.0, so we check for that
  const isUpdateOperation = operation === 'update';
  const isBeingDeleted = !!data?.deletedAt;

  // Cutomize as needed
  if (isUpdateOperation && isBeingDeleted && req.user) {
    return req.user.id;
  }

  // If not being deleted, or no user in request, return null to clear the field
  return null;
};
```

```typescript
// src/collections/{{ YourCollections }}.ts

// ... (collection config definition)
// Add this field definition
{
  name: 'deletedBy',
  type: 'relationship',
  relationTo: 'users', // Cutomize as needed
  hooks: {
    beforeChange: [maybeToggleDeletedBy],
  },
  // ...
},
// ...
```

## Pour Closure

By combining a native feature with a couple of simple, custom hooks, we've built a reliable soft-delete system. It protects against accidental data loss, ensures referential integrity, and provides a clear audit trail without adding significant complexity to the codebase. It's a simple solution that provides a lot of peace of mind.

---

## Refs

- [New in Payload: Trash Support, Job Scheduling, and DX Enhancements](https://payloadcms.com/posts/releases/new-in-payload-trash-support-job-scheduling-and-dx-enhancements)
