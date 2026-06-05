import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '../../../shared/hooks/useAuthStore'
import { authService } from '../services/auth.service'
import WelcomImg from "../../../assets/welcome.png";
import { Header } from '../../../shared/components/Header';

export function WelcomePage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { setAuth } = useAuthStore()
  const status = searchParams.get('status')

  useEffect(() => {
    if (status !== 'success') return

    // Gọi /me để lấy user từ cookie vừa được set bởi verify-email redirect
    authService.me()
      .then(({ data }) => {
        setAuth(data.user)
        setSearchParams({}, { replace: true })
      })
      .catch(() => navigate('/login', { replace: true }))
  }, [])

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header showFunctions={false}/>

      {/* Content */}
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4 -mt-12">
        <img
          src={WelcomImg}
          alt="Welcome illustration"
          className="w-100 h-100 object-contain"
        />

        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Welcome to Folio!</h1>
          <p className="text-gray-400 text-[15px]">
            Email verified successfully. Your smart, organized document home is ready to explore.
          </p>
        </div>

        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
        >
          Go to Workspaces
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
        </button>
      </div>
    </div>
  )
}