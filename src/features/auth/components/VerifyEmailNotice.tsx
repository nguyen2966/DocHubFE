import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { authService } from '../services/auth.service'
import { Header } from '../../../shared/components/Header'
import Mail_Verification from "../../../assets/mail_verification.png";

type ResendStatus = 'idle' | 'loading' | 'sent' | 'error'

export function VerifyEmailPage() {
  const location = useLocation()
  const email = location.state?.email ?? ''

  const [resendStatus, setResendStatus] = useState<ResendStatus>('idle')
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000)
    return () => clearInterval(timer)
  }, [cooldown])

  const handleResend = async () => {
    setResendStatus('loading')
    try {
      await authService.resendVerificationEmail(email)
      setResendStatus('sent')
      setCooldown(60)
    } catch {
      setResendStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <Header showFunctions={false}/>

      {/* Content */}
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4 -mt-12">
        {/* Illustration */}
        <img
          src={Mail_Verification}
          alt="Email illustration"
          className="w-100 h-100 object-contain"
        />

        {/* Text */}
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Verify your email address</h1>
          <p className="text-gray-500 text-[15px]">
            We've just sent a verification email to{' '}
            <span className="font-semibold text-gray-900">{email}</span>.
            {' '}Please check your inbox.
          </p>
        </div>

        {/* Resend section */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-gray-500 text-[15px]">
            Didn't receive an email?{' '}
            {cooldown > 0 ? (
              <span className="text-gray-400">
                Resend in <span className="tabular-nums font-medium text-gray-600">{cooldown}s</span>
              </span>
            ) : (
              <button
                onClick={handleResend}
                disabled={resendStatus === 'loading'}
                className="underline font-medium text-gray-900 hover:text-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {resendStatus === 'loading' ? 'Sending...' : 'Resend Verification Link'}
              </button>
            )}
          </p>

          {/* Feedback messages */}
          {resendStatus === 'sent' && (
            <p className="text-sm text-green-600">
              ✓ Verification email sent — please check your inbox.
            </p>
          )}
          {resendStatus === 'error' && (
            <p className="text-sm text-red-500">
              Something went wrong. Please try again later.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}