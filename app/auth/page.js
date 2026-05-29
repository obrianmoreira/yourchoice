'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const inputStyle = {
  width: '100%', padding: '13px 16px',
  borderRadius: 13, border: '1px solid rgba(255,255,255,0.06)',
  background: 'var(--bg-card2)', color: 'var(--text)',
  fontFamily: 'inherit', fontSize: 15, outline: 'none',
}

export default function AuthPage() {
  const supabase = createClient()
  const router = useRouter()

  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [gender, setGender] = useState('female')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit() {
    setLoading(true)
    setError('')
    setSuccess('')

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { data: { name, gender } },
      })
      if (error) {
        setError(error.message)
      } else {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          await supabase.from('profiles').update({ name, gender }).eq('id', session.user.id)
          router.push('/profile')
        } else {
          setSuccess('Check your email to confirm your account.')
        }
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
      else router.push('/dashboard')
    }

    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100dvh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: 24, background: 'var(--bg)',
    }}>
      <div style={{ position: 'fixed', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'var(--accent-glow)', filter: 'blur(100px)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 380, position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: -1 }}>
            choice<span style={{ color: 'var(--accent)' }}>.</span>
          </div>
          <div style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 6 }}>
            You choose who approaches you.
          </div>
        </div>

        <div style={{ background: 'var(--bg-card)', borderRadius: 24, padding: '28px 24px', border: '1px solid rgba(255,255,255,0.05)' }}>

          {/* Mode toggle */}
          <div style={{ display: 'flex', background: 'var(--bg-card2)', borderRadius: 14, padding: 4, marginBottom: 24 }}>
            {['login', 'signup'].map(m => (
              <button key={m} onClick={() => { setMode(m); setError(''); setSuccess('') }} style={{
                flex: 1, padding: 10, borderRadius: 11, border: 'none',
                background: mode === m ? 'var(--accent)' : 'transparent',
                color: mode === m ? '#fff' : 'var(--text-muted)',
                fontFamily: 'inherit', fontSize: 14, fontWeight: 600, cursor: 'pointer',
              }}>
                {m === 'login' ? 'Sign in' : 'Sign up'}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {mode === 'signup' && (
              <>
                <input placeholder="Your name" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
                <div style={{ display: 'flex', gap: 8 }}>
                  {['female', 'male', 'other'].map(g => (
                    <button key={g} onClick={() => setGender(g)} style={{
                      flex: 1, padding: '10px 6px', borderRadius: 12,
                      border: gender === g ? '1px solid var(--accent)' : '1px solid rgba(255,255,255,0.06)',
                      background: gender === g ? 'rgba(184,92,122,0.12)' : 'var(--bg-card2)',
                      color: gender === g ? 'var(--accent-light)' : 'var(--text-muted)',
                      fontFamily: 'inherit', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                    }}>
                      {g === 'female' ? '👩 Female' : g === 'male' ? '👨 Male' : '🙂 Other'}
                    </button>
                  ))}
                </div>
              </>
            )}
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()} style={inputStyle} />
          </div>

          {error && <div style={{ marginTop: 12, fontSize: 13, color: '#e57373', textAlign: 'center' }}>{error}</div>}
          {success && <div style={{ marginTop: 12, fontSize: 13, color: 'var(--green)', textAlign: 'center' }}>{success}</div>}

          <button onClick={handleSubmit} disabled={loading} style={{
            width: '100%', marginTop: 20, padding: 15, borderRadius: 14, border: 'none',
            background: loading ? 'rgba(184,92,122,0.5)' : 'var(--accent)',
            color: '#fff', fontFamily: 'inherit', fontSize: 15, fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}>
            {loading ? '...' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </div>
      </div>
    </div>
  )
}
