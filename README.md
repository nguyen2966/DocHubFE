# FOLIO

## 1. Overview

### Goal

The frontend is a React application for authentication, workspace collaboration, document management, shared documents, PDF viewing/editing, and document comments.

The app is organized around feature modules. Route pages are kept as entry points, while reusable business UI and logic live inside `features`.

### Main Technologies

```txt
React
TypeScript
Vite
React Router
TanStack Query
Axios
Zustand
Tailwind CSS
Apryse WebViewer
Sonner toast
```

### Main Responsibilities

```txt
Authentication UI
Workspace dashboard
Workspace document list
Workspace members/settings/activity pages
Document detail page
Shared-with-me document list
Shared document detail page
PDF viewing and editing through Apryse
Comment and annotation UI
Permission-aware UI actions
```

---

## 2. Project Organization

### Goal

The frontend uses a feature-based structure.

The common rule is:

```txt
pages:
  route-level wrappers

features:
  domain logic, components, hooks, services, types, utils

shared:
  reusable cross-feature UI and utilities

layouts:
  route layout shells
```

This keeps route files small and makes feature code reusable.

---

### 2.1 Top-level Structure

```txt
src/
  App.tsx
  features/
  pages/
  layouts/
  shared/
```

#### App.tsx

`App.tsx` defines the route tree.

It connects:

```txt
Guest routes
Protected routes
Workspace routes
Document detail routes
Shared-with-me routes
Error routes
```

#### features/

Feature modules contain domain-specific code.

Example:

```txt
features/auth
features/workspaces
features/documents
features/comments
```

#### pages/

Pages are route-level components.

A page should mainly:

```txt
Read route params
Call page-level query hooks
Handle loading/error/not-found states
Pass data into feature components
```

A page should avoid owning large reusable business logic when that logic is shared by multiple routes.

#### layouts/

Layouts define reusable route shells.

Example:

```txt
WorkspaceLayout
```

It renders common workspace navigation and nested workspace pages.

#### shared/

The shared folder contains reusable infrastructure UI and utilities.

Examples:

```txt
Header
Pagination
ProtectedRoute
GuestRoute
RequireWorkspacePermission
Axios instance
Auth store
Reusable UI components
```

---

## 3. Feature Module Organization

### Goal

Each feature module groups all code related to one domain.

A module commonly uses this structure:

```txt
features/<module>/
  components/
  hooks/
  service/
  types/
  utils/
  constants/
```

Not every module needs every folder.

---

### 3.1 components/

Contains UI components for the feature.

Examples:

```txt
features/documents/components/details-page/
features/documents/components/shared-with-me/
features/comments/components/
features/auth/components/
```

Components should receive data through props and should avoid direct API calls when possible.

---

### 3.2 hooks/

Contains TanStack Query hooks and local feature hooks.

Examples:

```txt
useDocumentDetail
useSharedDocuments
useSharedDocumentDetail
useUploadPdfDocument
useCommentThreads
useCreateCommentThread
```

Query hooks should hide service calls from components.

Typical pattern:

```txt
Component
-> hook
-> service
-> API
```

---

### 3.3 service/

Contains API client methods for the feature.

Service methods use the shared Axios instance.

Example responsibilities:

```txt
Fetch document detail
Upload PDF
Edit PDF
Fetch shared documents
Search documents
Create comments
```

Services should not contain UI state.

---

### 3.4 types/

Contains TypeScript types for the feature.

Examples:

```txt
Document
SharedDocument
SharedDocumentDetail
DocumentPermission
CommentThread
AprysePdfViewerProps
AprysePdfViewerRef
```

Types help keep API responses and component props consistent.

---

### 3.5 utils/

Contains pure helper functions.

Examples:

```txt
Permission utility functions
Apryse DOM helpers
Apryse geometry helpers
Apryse content-edit helpers
Comment annotation helpers
```

Utilities should be reusable and independent from React state when possible.

---

### 3.6 constants/

Contains stable constants.

Examples:

```txt
Apryse zoom constants
Apryse annotation custom data keys
Document status labels
Role labels
```

---

## 4. Page Structure and Functionalities

### 4.1 Auth Pages

#### Routes

```txt
/login
/signup
/verify-email
/welcome
```

#### Functionality

Auth pages handle:

```txt
User login
User signup
Email verification
Welcome screen after first successful verification
```

`/login` and `/signup` are guest routes, so they are only intended for unauthenticated users.

---

### 4.2 Invitation Accept Page

#### Route

```txt
/invitations/:token/accept
```

#### Functionality

This page handles workspace invitation entry.

It supports cases such as:

```txt
User already logged in
User needs to log in
User needs to register
User needs to verify email
Invalid or expired invitation
```

The page works as a bridge between email invitation links and the correct auth/workspace flow.

---

### 4.3 Workspace List Page

#### Route

```txt
/
```

inside protected routes.

#### Functionality

This is the main dashboard after login.

It shows the workspaces that the current user can access.

Typical actions:

```txt
View owned/joined workspaces
Open a workspace
Create workspace
Access shared-with-me documents
```

---

### 4.4 Workspace Layout

#### Route

```txt
/workspaces/:workspaceId
```

#### Functionality

`WorkspaceLayout` wraps workspace sub-pages and provides the workspace-level shell.

Nested pages include:

```txt
/workspaces/:workspaceId/documents
/workspaces/:workspaceId/members
/workspaces/:workspaceId/activity
/workspaces/:workspaceId/settings
```

The layout keeps workspace navigation consistent across tabs.

---

### 4.5 Workspace Documents Page

#### Route

```txt
/workspaces/:workspaceId/documents
```

#### Required Permission

```txt
workspace:view
```

#### Functionality

This page shows the document list inside one workspace.

Typical actions:

```txt
View documents
Create markdown document
Upload PDF
Open document detail
Rename document
Delete document
Open share modal
Handle upload progress/cancel state
Paginate documents
```

---

### 4.6 Workspace Members Page

#### Route

```txt
/workspaces/:workspaceId/members
```

#### Required Permission

```txt
workspace:view
```

#### Functionality

This page shows workspace members and member management UI.

Typical actions:

```txt
View workspace members
Invite members
Change member role
Remove member
View pending invitations
```

Actual available actions depend on workspace permissions.

---

### 4.7 Workspace Activity Page

#### Route

```txt
/workspaces/:workspaceId/activity
```

#### Required Permission

```txt
workspace:view_activity_log
```

#### Functionality

This page shows workspace activity logs.

Example activities:

```txt
Document created
Document renamed
Document deleted
Document shared
Member invited
Member removed
Role changed
```

---

### 4.8 Workspace Settings Page

#### Route

```txt
/workspaces/:workspaceId/settings
```

#### Required Permission

```txt
workspace:manage_settings
```

#### Functionality

This page handles workspace settings.

Typical actions:

```txt
Update workspace information
Change banner or metadata
Delete workspace
```

---

### 4.9 Workspace Document Detail Page

#### Route

```txt
/workspaces/:workspaceId/documents/:documentId
```

#### Functionality

This page fetches document detail by `workspaceId` and `documentId`.

After loading the document, it renders the reusable:

```txt
DocumentDetailExperience
```

The page itself should only handle:

```txt
Route params
Document detail query
Loading state
Not found/error state
Back button source
```

It should not duplicate Apryse, comments, edit PDF, or popover logic.

---

### 4.10 Shared With Me Page

#### Route

```txt
/shared-with-me
```

#### Functionality

This page shows documents directly shared with the current user.

It uses the shared-with-me API, which returns paginated data.

Frontend behavior:

```txt
Call useSharedDocuments({ page, limit })
Read documents from data.data
Read pagination metadata from data.meta
Render SharedDocumentTable
Render shared Pagination component
Show total from meta.totalItems
```

This page is different from workspace document list because shared documents come from explicit document permissions, not workspace membership.

---

### 4.11 Shared Document Detail Page

#### Route

```txt
/shared-with-me/documents/:documentId
```

#### Functionality

This page fetches a shared document detail by `documentId`.

The backend response should include:

```txt
workspaceId
documentId
title
pdfFileUrl
processingStatus
role
permissions
```

After loading, this page also renders:

```txt
DocumentDetailExperience
```

This avoids duplicating the workspace document detail implementation.

The user's actions are controlled by `document.permissions`:

```txt
viewer:
  view only

commenter:
  view and comment

editor:
  view, comment, and edit PDF
```

---

### 4.12 Error Pages

#### Routes

```txt
/401
/403
/404
*
```

#### Functionality

Error pages handle:

```txt
Unauthorized
Forbidden
Not found
Unknown routes
```

Detailed feature components should not deeply handle global auth errors. Route wrappers and global API/auth handling should handle most `401` behavior.

---

## 5. Routing and Permission-aware UI

### Protected Routes

Authenticated areas are wrapped by:

```txt
ProtectedRoute
```

This prevents unauthenticated users from opening private pages.

### Guest Routes

Login and signup are wrapped by:

```txt
GuestRoute
```

This prevents already-authenticated users from using guest-only pages unnecessarily.

### Workspace Route Permission

Workspace tabs use:

```txt
RequireWorkspacePermission
```

Example:

```txt
workspace:view
workspace:view_activity_log
workspace:manage_settings
```

This controls route-level access for workspace pages.

### Document UI Permission

Document actions are controlled by `document.permissions`.

Examples:

```txt
document:view:
  allow viewer

document:edit:
  show Edit PDF button

document:comment:
  enable comments

document:manage_access:
  show Share button

document:rename:
  show Rename action

document:delete:
  show Delete action
```

The frontend permission checks are for user experience only. The backend remains the source of truth.

---

## 6. Document Detail Experience

### Goal

`DocumentDetailExperience` is the reusable document detail UI used by both:

```txt
WorkspaceDocumentDetailPage
SharedDocumentDetailPage
```

### Responsibilities

It owns the full interactive document experience:

```txt
Header and document detail layout
Document toolbar
Document title bar
Apryse PDF viewer
PDF edit mode state
PDF save flow
Comment thread loading
Comment sidebar
Comment popovers
Hover previews
Pending comment composer
Reply/edit/delete comment handlers
Delete confirmation modals
```

### Props

```ts
interface DocumentDetailExperienceProps {
  workspaceId: string
  documentId: string
  document: Document
  backElement: React.ReactNode
}
```

### Why This Component Exists

Without this component, the app would need to duplicate the full document page logic for:

```txt
/workspaces/:workspaceId/documents/:documentId
/shared-with-me/documents/:documentId
```

That would duplicate complex code around Apryse, comments, edit state, and mutations.

Instead, route pages only fetch data and pass it into `DocumentDetailExperience`.

### Permission-driven Behavior

`DocumentDetailExperience` does not need to know whether the document came from a workspace route or a shared route.

It only checks the document permissions.

Example:

```txt
canCommentDocument(document)
canEditDocument(document)
canManageDocumentAccess(document)
```

This makes the UI route-independent.

---

## 7. Apryse PDF Viewer

### 7.1 Overview

#### Goal

`AprysePdfViewer` wraps Apryse WebViewer and adapts it to FOLIO's document system.

It is responsible for:

```txt
Loading PDF files
Displaying PDF pages
Locking/customizing viewer UI
Entering/exiting content edit mode
Exporting edited PDF files
Rendering comment highlights
Rendering comment point markers
Creating temporary comment anchors from text selection
Synchronizing Apryse annotations with backend comment threads
```

The component is implemented with `forwardRef` so parent components can call imperative viewer actions.

---

### 7.2 Main Props

```ts
interface AprysePdfViewerProps {
  fileUrl: string
  isPdfEditing: boolean

  commentThreads?: CommentThread[]
  selectedCommentAnnotationId?: string | null
  hiddenCommentAvatarMarkerId?: string | null

  commentsDisabled?: boolean
  showCommentAvatarMarkers?: boolean

  onCommentAnnotationClick?: (...args: unknown[]) => void
  onCommentMarkerHover?: (...args: unknown[]) => void
  onCommentMarkerLeave?: (...args: unknown[]) => void
  onPendingCommentAnchorCreated?: (...args: unknown[]) => void
}
```

#### fileUrl

The PDF URL loaded into Apryse.

When `fileUrl` changes, the viewer reloads the document.

#### isPdfEditing

Controls Apryse content edit mode.

```txt
true:
  Enable content edit tools and disable comment behavior.

false:
  Exit content edit mode and restore comments.
```

#### commentThreads

The comment threads that should be rendered on the PDF.

Each thread contains annotation data such as:

```txt
pageNumber
position
xfdf
apryseAnnotationId
visualState
status
```

#### commentsDisabled

Disables comment creation and comment UI behavior.

This is usually true during PDF edit mode or when the user does not have `document:comment`.

#### showCommentAvatarMarkers

Controls whether point markers are shown in the overlay.

This is usually disabled when the comment sidebar is open to avoid duplicate UI focus.

---

### 7.3 Ref API

The viewer exposes an imperative API to parent components.

```ts
interface AprysePdfViewerRef {
  exportEditedPdf(): Promise<EditedPdfExport | null>
  reloadOriginalPdf(): void
  renderCommentThreads?(threads: CommentThread[]): void | Promise<void>
  scrollToCommentAnnotation?(annotationId: string): void | Promise<void>
  highlightCommentAnnotation?(annotationId: string): void
  removeTemporaryCommentAnchor?(): void
}
```

#### exportEditedPdf

Used when the user clicks Save after editing PDF content.

It returns:

```txt
file:
  edited PDF Blob

editedRects:
  touched Apryse content boxes

degradedAnnotationIds:
  comment annotation IDs that should be degraded from highlight to point
```

#### reloadOriginalPdf

Reloads the original PDF URL.

Useful for cancel/reset behavior.

#### renderCommentThreads

Re-renders comment annotations inside Apryse.

#### scrollToCommentAnnotation

Scrolls the viewer to a comment annotation or fallback position.

#### highlightCommentAnnotation

Selects/highlights a comment annotation in Apryse.

#### removeTemporaryCommentAnchor

Removes a temporary highlight created before the user submits a comment.

---

## 8. Apryse Initialization

### Goal

The viewer initializes Apryse WebViewer once when the component mounts.

Configuration:

```txt
path: /webviewer/lib
licenseKey: VITE_APRYSE_LICENSE_KEY
initialDoc: fileUrl
fullAPI: true
```

### UI Customization

After initialization, the viewer customizes the Apryse UI:

```txt
Remove default top modular header items
Remove tools header items
Disable floating page navigation header
Disable notes panel
Disable notes panel button
Configure locked zoom UI
Bind zoom blockers
Configure comment UI
Bind document and annotation events
```

The application provides its own page controls through:

```txt
PdfPageControls
```

This keeps the viewer UI closer to the app design instead of using the full default Apryse interface.

---

## 9. Locked Zoom and Page Controls

### Goal

The viewer uses a controlled zoom experience.

The Apryse zoom UI is hidden or disabled.

The component blocks common zoom inputs inside the viewer:

```txt
Ctrl/Cmd + wheel
Ctrl/Cmd + plus/minus/zero
Pinch gesture
Multi-touch zoom
```

Then it enforces the configured zoom level.

This is useful because comment overlays depend on stable coordinate projection between PDF page coordinates and screen coordinates.

### Page Controls

The app renders custom page controls:

```txt
First page
Previous page
Current page
Next page
Last page
```

The component tracks:

```txt
currentPage
pageCount
```

and calls Apryse `documentViewer.setCurrentPage(...)` when navigating.

---

## 10. Comment Annotation System

### 10.1 Why Comments Need Custom Handling

PDF comments are not only normal UI comments.

They must be anchored to PDF content.

The viewer supports two visual states:

```txt
highlight:
  Comment appears as a yellow text highlight.

point:
  Comment appears as a point/avatar marker.
```

A comment may become `point` when PDF content edit makes the original text highlight unreliable.

---

### 10.2 Text Selection and Pending Comment Anchor

When the user selects text, Apryse provides:

```txt
selected text
text quads
page number
```

The viewer caches this selection.

When the user clicks "add comment", the viewer creates a temporary Apryse `TextHighlightAnnotation`.

The temporary annotation contains:

```txt
PageNumber
X
Y
Width
Height
Quads
Subject = Comment
Contents = selected text
DocHub custom data
```

Then the viewer exports the annotation as XFDF.

The parent component receives:

```txt
pageNumber
position
xfdf
apryseAnnotationId
visualState = highlight
temporaryAnchorId
```

The parent opens a comment composer. If the user cancels, the temporary anchor is removed. If the user submits, the data is sent to the backend as a new comment thread.

---

### 10.3 Rendering Existing Comment Threads

When comment threads are loaded from the backend, `AprysePdfViewer` renders them into the PDF viewer.

For each non-deleted thread:

```txt
If visualState = highlight:
  Import XFDF as a visible highlight.
  Apply DocHub comment style.
  Attach custom data with thread ID.

If visualState = point:
  Import XFDF as a hidden anchor if available.
  Use overlay marker as the visible UI.
```

The imported annotations are marked with custom data so the app can identify and clean them later.

---

### 10.4 Embedded Annotation Cleanup

A difficult PDF problem is that Apryse annotations can become embedded in the saved PDF after export.

If old DocHub comment annotations are embedded into the PDF file, Apryse may load them before the frontend renders fresh comment data from the backend.

To avoid stale or duplicated highlights, the viewer runs cleanup after `documentLoaded`:

```txt
Wait for Apryse to populate embedded annotations
Find DocHub-managed comment annotations
Delete stale embedded annotations
Render comment threads from backend
```

This keeps the backend comment state as the source of truth.

---

### 10.5 Overlay Avatar Markers

Point comments are displayed using a React overlay layer, not only native Apryse annotations.

The viewer converts PDF page coordinates into overlay coordinates using Apryse display mode functions.

Flow:

```txt
PDF page point
-> displayMode.pageToWindow(...)
-> subtract scroll offset
-> overlay position
-> render avatar marker
```

The overlay is refreshed when:

```txt
Page changes
Viewer scrolls
Window resizes
Zoom changes
Comment threads change
Selected annotation changes
```

Markers support:

```txt
Hover preview
Click to open full thread
Sidebar selection highlight
Hidden marker when full popover is open
```

---

## 11. Apryse PDF Edit Mode

### 11.1 Entering Edit Mode

When `isPdfEditing` becomes true, the viewer:

```txt
Clears edited rect tracking
Removes temporary comment anchor
Removes rendered comment anchors
Enables Apryse ContentEdit feature
Preloads the ContentEdit worker
Switches to edit text toolbar group
Starts content edit mode
```

Comments and edit mode are mutually exclusive.

When edit mode starts, the parent component closes:

```txt
Comment sidebar
Comment popovers
Pending comment composer
```

---

### 11.2 Tracking Edited Areas

Apryse content edit events can provide content box rectangles.

The viewer listens to:

```txt
contentBoxEditStarted
contentBoxEditEnded
```

When a content box edit starts, the viewer extracts an edited rectangle and stores it in:

```txt
editedRectsRef
```

Important limitation:

```txt
Apryse usually reports the whole content box, not the exact character or word edited.
```

Therefore these rectangles are treated as coarse edit evidence.

---

### 11.3 Exporting Edited PDF

When the parent calls `exportEditedPdf()`, the viewer:

```txt
Blur active content editor
Wait for Apryse to commit text changes
Stop all content box editing
Click inside Apryse shadow root to force blur/commit
Deduplicate touched edit rectangles
Calculate degradedAnnotationIds
End content edit mode
Refresh Apryse view
Remove rendered comment anchors before PDF export
Call doc.getFileData({ downloadType: 'pdf' })
Return edited PDF Blob with degradation data
```

Return value:

```ts
{
  file: Blob
  editedRects: EditedRect[]
  degradedAnnotationIds: string[]
}
```

The parent sends this to the backend edit PDF endpoint.

---

### 11.4 Annotation Degradation

Editing PDF content can make existing text highlights inaccurate.

The frontend tries to identify affected annotations and sends:

```txt
degradedAnnotationIds
```

to the backend.

Expected backend behavior:

```txt
If degradedAnnotationIds is non-empty:
  Degrade only those annotations.
  Skip editedRects fallback.

Else if editedRects is non-empty:
  Use editedRects as fallback.
```

This avoids accidentally degrading unrelated annotations when Apryse returns broad content boxes.

---

## 12. DocumentDetailExperience + Apryse Interaction

### Flow

```txt
User opens document detail page
-> route page fetches document
-> route page renders DocumentDetailExperience
-> DocumentDetailExperience fetches comment threads
-> DocumentViewerShell renders AprysePdfViewer
-> Apryse loads PDF fileUrl
-> Apryse renders comment anchors and overlay markers
```

### Save Edited PDF Flow

```txt
User clicks Edit PDF
-> DocumentDetailExperience sets isPdfEditing = true
-> Apryse enters content edit mode
-> User edits PDF
-> User clicks Save
-> DocumentDetailExperience calls apryseViewerRef.exportEditedPdf()
-> Apryse returns Blob + editedRects + degradedAnnotationIds
-> DocumentDetailExperience calls useEditPdf mutation
-> Backend overwrites PDF and reprocesses document
-> DocumentDetailExperience exits edit mode
```

### Comment Flow

```txt
User selects text
-> Apryse caches text selection and quads
-> User clicks add comment overlay action
-> Apryse creates temporary highlight and exports XFDF
-> DocumentDetailExperience opens CommentComposer
-> User submits comment
-> create comment thread mutation runs
-> comment threads refetch
-> Apryse renders persisted annotation
```

---

## 13. Shared Document Detail Reuse

### Goal

The app uses the same document detail UI for normal workspace documents and shared documents.

```txt
Workspace route:
  WorkspaceDocumentDetailPage
  -> useDocumentDetail
  -> DocumentDetailExperience

Shared route:
  SharedDocumentDetailPage
  -> useSharedDocumentDetail
  -> DocumentDetailExperience
```

This is possible because shared document detail returns:

```txt
workspaceId
documentId
document data
permissions
```

Then `DocumentDetailExperience` can call the same workspace-based APIs for:

```txt
Comments
PDF edit
Document viewer behavior
```

and permissions decide which actions are available.

---

## 14. Frontend Design Rules

### Keep Pages Thin

Pages should mostly handle:

```txt
Route params
Data fetching
Loading state
Error state
Passing props to feature components
```

### Keep Feature Components Reusable

Complex UI should live in feature components.

Example:

```txt
DocumentDetailExperience
```

instead of duplicating logic in multiple pages.

### Keep API Calls in Services

Components should not call Axios directly.

Use:

```txt
service -> hook -> component
```

### Use Permissions from Backend

Do not hardcode route-based UI access.

Prefer:

```txt
document.permissions
workspace permissions
```

### Backend Is Source of Truth

Frontend permission checks improve UX, but backend guards must still enforce actual access.

---

## 15. Summary

### Module Organization

```txt
pages:
  route wrappers

features:
  domain components, hooks, services, types, utils

shared:
  common UI, route guards, axios, auth store

layouts:
  nested route shells
```

### Main Pages

```txt
Auth pages:
  login, signup, verify email, welcome

Workspace pages:
  workspace list, documents, members, activity, settings

Document pages:
  workspace document detail, shared document detail

Shared pages:
  shared with me list, shared document detail

Error pages:
  401, 403, 404
```

### Apryse Viewer

```txt
AprysePdfViewer:
  loads PDFs
  controls custom viewer UI
  handles PDF content edit
  exports edited PDF Blob
  tracks edited rectangles
  renders comment highlights
  renders point markers
  creates temporary comment anchors
  synchronizes annotation UI with backend comment threads
```

### Final Rule

```txt
Route pages fetch data.
Feature components own reusable interaction logic.
AprysePdfViewer owns PDF-specific behavior.
DocumentDetailExperience connects document UI, comments, and PDF editing.
Permissions from the backend control visible actions.
```
