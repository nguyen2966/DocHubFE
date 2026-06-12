import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { workspaceService } from '../services/workspace.service';
import { CreateWorkspaceFormValues } from '../schemas/workspace.schema';

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
    } catch {
      setServerError('Could not create workspace. Please try again.')
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