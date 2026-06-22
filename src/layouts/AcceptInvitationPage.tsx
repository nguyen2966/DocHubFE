// src/pages/invitation/AcceptInvitationPage.tsx

import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../shared/lib/axios'
import { authService } from '../features/auth/services/auth.service'
import { useAuthStore } from '../shared/hooks/useAuthStore'

export function AcceptInvitationPage() {
  const { token } = useParams()
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)

  const [message, setMessage] = useState('Accepting invitation...')

  useEffect(() => {
    const handleAccept = async () => {
      if (!token) {
        navigate('/invitations/invalid', { replace: true })
        return
      }

      try {
        // 1. Kiểm tra user hiện đang login không
        const meRes = await authService.meNoRefresh();
        setAuth(meRes.data.user);

        // 2. Nếu login rồi thì gọi API accept dành cho authenticated user
        const { data } = await api.post<{ workspaceId: string }>(
          `/workspaces/invitations/${token}/accept-authenticated`,
        );

        // 3. Redirect vào document list
        navigate(`/workspaces/${data.workspaceId}/documents`, {
          replace: true,
        });
      } catch (error: any) {
        const status = error.response?.status

        // Chưa login
        if (status === 401) {
          navigate(
            `/login?next=${encodeURIComponent(`/invitations/${token}/accept`)}`,
            { replace: true },
          )
          return
        }

        // Token sai / hết hạn / đã dùng / không đúng email
        if ([400, 403, 404, 409, 410].includes(status)) {
          navigate('/invitations/invalid', { replace: true })
          return
        }

        setMessage('Something went wrong. Please try again.')
      }
    }

    handleAccept()
  }, [token, navigate, setAuth])

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <p className="text-sm text-stone-500">{message}</p>
    </div>
  )
}