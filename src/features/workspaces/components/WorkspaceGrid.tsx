// import { Workspace } from '../types/workspace.type';
// import { WorkspaceCard } from './WorkspaceCard';
// import { PlusIcon } from '@phosphor-icons/react/dist/ssr';

// interface WorkspaceGridProps {
//   workspaces: Workspace[]
//   onCreateClick: () => void
// }

// export function WorkspaceGrid({
//   workspaces,
//   onCreateClick,
// }: WorkspaceGridProps) {
  
//   // Trạng thái Empty State khi chưa có bất kỳ dự án nào
//   if (workspaces.length === 0) {
//     return (
//       <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 py-24 w-full">
//         <h2 className="text-lg font-semibold text-stone-900">
//           No workspaces yet
//         </h2>
//         <p className="mt-1 text-sm text-stone-500">
//           Create your first workspace to start managing documents.
//         </p>

//         <button
//           type="button"
//           onClick={onCreateClick}
//           className="mt-5 flex h-10 items-center justify-center gap-2 rounded-lg bg-stone-950 px-4 text-sm font-medium text-white hover:bg-stone-800 transition-colors shadow-sm"
//         >
//           <PlusIcon className="w-5 h-5" />
//           <span>Create Workspace</span>
//         </button>
//       </div>
//     )
//   }

//   return (
//     <div className="w-full min-h-[704px]">
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
   
//         {workspaces.map((workspace) => (
//           <WorkspaceCard key={workspace._id} workspace={workspace} />
//         ))}

//         <button
//           type="button"
//           onClick={onCreateClick}
//           className="flex h-[192px] w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-stone-200 bg-white p-6 hover:bg-stone-50 hover:border-stone-300 transition-all duration-200 group text-center"
//         >
  
//           <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-stone-100 bg-stone-50 text-stone-500 group-hover:bg-white group-hover:text-stone-700 transition-colors mb-3">
//             <PlusIcon className="w-5 h-5" />
//           </div>

//           <span className="block text-sm font-semibold text-stone-900 leading-none mb-1.5">
//             Create Workspace
//           </span>

//           <span className="block text-xs text-stone-400 font-normal">
//             Click to initialize a new Workspace
//           </span>
//         </button>

//       </div>
//     </div>
//   )
// }

import { Workspace } from '../types/workspace.type';
import { WorkspaceCard } from './WorkspaceCard';
import { PlusIcon } from '@phosphor-icons/react/dist/ssr';

interface WorkspaceGridProps {
  workspaces: Workspace[]
  onCreateClick: () => void
  onInviteClick: (workspaceId: string) => void // Nhận callback từ Page chuyển xuống
}

export function WorkspaceGrid({
  workspaces,
  onCreateClick,
  onInviteClick,
}: WorkspaceGridProps) {
  
  if (workspaces.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 py-24 w-full">
        <h2 className="text-lg font-semibold text-stone-900">
          No workspaces yet
        </h2>
        <p className="mt-1 text-sm text-stone-500">
          Create your first workspace to start managing documents.
        </p>

        <button
          type="button"
          onClick={onCreateClick}
          className="mt-5 flex h-10 items-center justify-center gap-2 rounded-lg bg-stone-950 px-4 text-sm font-medium text-white hover:bg-stone-800 transition-colors shadow-sm\"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Create Workspace</span>
        </button>
      </div>
    )
  }

  return (
    <div className="w-full min-h-[704px]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {workspaces.map((workspace) => (
          <WorkspaceCard 
            key={workspace._id} 
            workspace={workspace} 
            onInviteClick={onInviteClick} // Truyền tiếp xuống Card
          />
        ))}

        <button
          type="button"
          onClick={onCreateClick}
          className="flex h-[192px] w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-stone-200 bg-white p-6 hover:bg-stone-50 hover:border-stone-300 transition-all duration-200 group text-center\"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-stone-100 bg-stone-50 text-stone-500 group-hover:bg-white group-hover:text-stone-700 transition-colors mb-3\">
            <PlusIcon className="w-5 h-5" />
          </div>
          <span className="text-sm font-medium text-stone-600 group-hover:text-stone-900 transition-colors">
            Create Workspace
          </span>
        </button>
      </div>
    </div>
  )
}