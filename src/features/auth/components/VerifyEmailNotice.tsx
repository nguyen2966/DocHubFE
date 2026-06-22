import { useEffect, useRef, useState } from 'react'
import { isAxiosError } from 'axios'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { authService } from '../services/auth.service'
import { Header } from '../../../shared/components/Header'
import { useAuthStore } from '../../../shared/hooks/useAuthStore'
import MailVerification from '../../../assets/mail_verification.png'

type ResendStatus = 'idle' | 'loading' | 'sent' | 'error'
type VerificationStatus =
  | 'idle'
  | 'verifying'
  | 'security-error'
  | 'invalid-token'
  | 'error'

function readTokenFromHash() {
  const hash = window.location.hash.replace(/^#/, '')
  const params = new URLSearchParams(hash)

  return params.get('token')
}

export function VerifyEmailPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const setAuth = useAuthStore((s) => s.setAuth)
  const hasVerifiedRef = useRef(false)

  const email = location.state?.email ?? searchParams.get('email') ?? ''
  const reason = searchParams.get('reason')
  const [verificationToken] = useState(() => {
    const token = readTokenFromHash()

    if (token) {
      window.history.replaceState(null, '', '/verify-email')
    }

    return token
  })
  const [verificationStatus, setVerificationStatus] =
    useState<VerificationStatus>(verificationToken ? 'verifying' : 'idle')
  const [resendStatus, setResendStatus] = useState<ResendStatus>('idle')
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    if (cooldown <= 0) return

    const timer = window.setInterval(() => {
      setCooldown((current) => current - 1)
    }, 1000)

    return () => window.clearInterval(timer)
  }, [cooldown])

  useEffect(() => {
    if (!verificationToken || hasVerifiedRef.current) return

    hasVerifiedRef.current = true

    async function verifyEmail() {
      setVerificationStatus('verifying')

      try {
        const { data } = await authService.verifyEmail(verificationToken)

        setAuth(data.user)
        navigate(data.redirectTo, { replace: true })
      } catch (error) {
        if (isAxiosError(error)) {
          if (error.response?.status === 403) {
            setVerificationStatus('security-error')
            return
          }

          if ([400, 404, 410].includes(error.response?.status ?? 0)) {
            setVerificationStatus('invalid-token')
            return
          }
        }

        setVerificationStatus('error')
      }
    }

    verifyEmail()
  }, [navigate, setAuth, verificationToken])

  const handleResend = async () => {
    if (!email || cooldown > 0) return

    setResendStatus('loading')

    try {
      await authService.resendVerificationEmail(email)
      setResendStatus('sent')
      setCooldown(60)
    } catch {
      setResendStatus('error')
    }
  }

  const isVerifyRequired = reason === 'verify_required'
  const isVerifying = verificationStatus === 'verifying'
  const canResend = Boolean(email) && cooldown <= 0

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header showFunctions={false} />

      <div className="-mt-12 flex flex-1 flex-col items-center justify-center gap-6 px-4">
        <img
          src={MailVerification}
          alt="Email illustration"
          className="h-100 w-100 object-contain"
        />

        <div className="flex max-w-xl flex-col items-center gap-2 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            {isVerifying ? 'Verifying your account...' : 'Verify your email address'}
          </h1>

          {verificationStatus === 'idle' && (
            <p className="text-[15px] text-gray-500">
              {isVerifyRequired
                ? 'Please verify your email before signing in.'
                : "We've just sent a verification email"}
              {email ? (
                <>
                  {' '}
                  to <span className="font-semibold text-gray-900">{email}</span>
                </>
              ) : null}
              . Please check your inbox.
            </p>
          )}

          {verificationStatus === 'verifying' && (
            <p className="text-[15px] text-gray-500">
              Please wait while we confirm your verification link.
            </p>
          )}

          {verificationStatus === 'security-error' && (
            <p className="text-[15px] text-red-600">
              For security, please open this verification link in the same
              browser where you signed up, or sign in after verifying manually.
            </p>
          )}

          {verificationStatus === 'invalid-token' && (
            <p className="text-[15px] text-red-600">
              This verification link is invalid or expired.
            </p>
          )}

          {verificationStatus === 'error' && (
            <p className="text-[15px] text-red-600">
              Something went wrong while verifying your account. Please try
              again.
            </p>
          )}
        </div>

        {!isVerifying && (
          <div className="flex flex-col items-center gap-2">
            <p className="text-[15px] text-gray-500">
              Didn't receive an email?{' '}
              {cooldown > 0 ? (
                <span className="text-gray-400">
                  Resend in{' '}
                  <span className="tabular-nums font-medium text-gray-600">
                    {cooldown}s
                  </span>
                </span>
              ) : (
                <button
                  onClick={handleResend}
                  disabled={!canResend || resendStatus === 'loading'}
                  className="font-medium text-gray-900 underline underline-offset-2 transition-colors hover:text-gray-600 disabled:cursor-not-allowed disabled:text-gray-400"
                >
                  {resendStatus === 'loading'
                    ? 'Sending...'
                    : 'Resend verification link'}
                </button>
              )}
            </p>

            {!email && (
              <p className="text-sm text-gray-400">
                Sign up again or use the latest email to request another link.
              </p>
            )}

            {resendStatus === 'sent' && (
              <p className="text-sm text-green-600">
                Verification email sent. Please check your inbox.
              </p>
            )}

            {resendStatus === 'error' && (
              <p className="text-sm text-red-500">
                Something went wrong. Please try again later.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
