import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createWorkspaceSchema,
  CreateWorkspaceFormValues,
} from '../schemas/workspace.schema';
import { useCreateWorkspace } from '../hooks/useCreateWorkspace';
import { Input } from '../../auth/components/ui/input';
import { Button } from '../../auth/components/ui/button';
import { FormError } from '../../auth/components/ui/FormError';

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
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-stone-900">
            Create Workspace
          </h2>
          <p className="mt-1 text-sm text-stone-500">
            Organize your documents and collaborate with your team.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormError message={serverError} />

          <Input
            label="Workspace name"
            placeholder="e.g. Product Team"
            required
            error={errors.name?.message}
            {...register('name')}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-stone-700">
              Description
            </label>
            <textarea
              rows={4}
              placeholder="Optional"
              className="w-full resize-none rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-stone-900"
              {...register('description')}
            />
          </div>

          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100"
            >
              Cancel
            </button>

            <Button type="submit" loading={isLoading}>
              {!isLoading && 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}