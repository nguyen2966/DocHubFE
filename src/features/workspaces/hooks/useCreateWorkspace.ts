import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { workspaceService } from '../services/workspace.service';
import { CreateWorkspaceFormValues } from '../schemas/workspace.schema';
import { errorToast, successToast } from '../../../shared/components/ui/Toast';

export function useCreateWorkspace() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const createWorkspace = async (values: CreateWorkspaceFormValues) => {
    setServerError(null);
    setIsLoading(true);

    try {
      const { data } = await workspaceService.createWorkspace(values);

      navigate(`/workspaces/${data._id}/documents`, {
        replace: true,
      })
      successToast('Workspace created successfully')
    } catch {
      const message = 'Could not create workspace. Please try again.'
      setServerError(message)
      errorToast(message)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    createWorkspace,
    serverError,
    isLoading,
  }
}
