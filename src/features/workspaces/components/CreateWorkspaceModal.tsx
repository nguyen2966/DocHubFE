import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from '@phosphor-icons/react';
import {
  createWorkspaceSchema,
  CreateWorkspaceFormValues,
} from '../schemas/workspace.schema';
import { useCreateWorkspace } from '../hooks/useCreateWorkspace';
import { Input } from '../../auth/components/ui/input';
import { FormError } from '../../auth/components/ui/FormError';
import { SpinnerIcon } from '../../../shared/components/ui/icons';

interface CreateWorkspaceModalProps {
  open: boolean
  onClose: () => void
}

export function CreateWorkspaceModal({
  open,
  onClose,
}: CreateWorkspaceModalProps) {
  const { createWorkspace, serverError, isLoading } = useCreateWorkspace()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateWorkspaceFormValues>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  })

  if (!open) return null

  const onSubmit = async (values: CreateWorkspaceFormValues) => {
    await createWorkspace(values)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between px-5 py-4">
          <h2 className="text-lg font-semibold text-stone-900">
            Create Workspace
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700"
            aria-label="Close create workspace modal"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4 px-5 pb-5">
            <FormError message={serverError} />

            <Input
              label="Workspace name"
              placeholder="e.g Marketing Team"
              required
              error={errors.name?.message}
              {...register('name')}
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-stone-700">
                Description (optional)
              </label>
              <textarea
                rows={3}
                placeholder="What is this Workspace for?"
                className="h-[72px] w-full resize-none rounded-lg border border-stone-200 px-3.5 py-2.5 text-sm text-stone-800 outline-none transition-all duration-150 placeholder:text-stone-400 focus:border-stone-400 focus:ring-2 focus:ring-stone-100"
                {...register('description')}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-stone-200 px-5 py-4">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-9 items-center justify-center rounded-lg border border-stone-200 bg-white px-3.5 text-sm font-medium text-stone-900 transition-colors hover:bg-stone-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-stone-900 px-4 text-sm font-medium text-white transition-colors hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading && <SpinnerIcon />}
              {!isLoading && 'Create Workspace'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
