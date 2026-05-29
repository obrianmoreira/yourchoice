'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const inputStyle = {
  width: '100%', padding: '13px 16px', borderRadius: 13,
  border: '1px solid rgba(255,255,255,0.06)', background: 'var(--bg-card2)',
  color: 'var(--text)', fontFamily: 'inherit', fontSize: 15, outline: 'none',
  marginBottom: 16, display: 'block',
}
const labelStyle = {
  display: 'block', fontSize: 12, fontWeight: 600,
  textTransform: 'uppercase', letterSpacing: 1,
  color: 'var(--text-muted)', marginBottom: 8,
}

export default function ProfilePage() {
  const supabase = createClient()
  const router = useRouter()

  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [bio, setBio] = useState('')
  const [gender, setGender] = useState('female')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/auth'); return }
      const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
      if (data) {
        setName(data.name || '')
        setAge(data.age?.toString() || '')
        setBio(data.bio || '')
        setGender(data.gender || 'female')
      }
    }
    load()
  }, [supabase, router])

  async function save() {
    setLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    await supabase.from('profiles').update({ name, age: age ? parseInt(age) : null, bio, gender }).eq('id', session.user.id)
    setLoading(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', padding: 24 }}>
      <div style={{ maxWidth: 430, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
          <button onClick={() => router.push('/dashboard')} style={{ background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '50%', width: 40, height: 40, cursor: 'pointer', fontSize: 18, color: 'var(--text)' }}>←</button>
          <div style={{ fontSize: 20, fontWeight: 700 }}>My profile</div>
        </div>

        <div style={{ background: 'var(--bg-card)', borderRadius: 24, padding: 24, border: '1px solid rgba(255,255,255,0.05)' }}>
          <label style={labelStyle}>Name</label>
          <input value={name} onChange={e => setName(e.target.value)} style={inputStyle} placeholder="Your name" />

          <label style={labelStyle}>Age</label>
          <input value={age} onChange={e => setAge(e.target.value)} style={inputStyle} placeholder="Your age" type="number" />

          <label style={labelStyle}>I am</label>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
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

          <label style={labelStyle}>Bio (optional)</label>
          <textarea value={bio} onChange={e => setBio(e.target.value)} style={{ ...inputStyle, height: 90, resize: 'none' }} placeholder="A little about you..." />

          <button onClick={save} disabled={loading} style={{
            width: '100%', padding: 15, borderRadius: 14, border: 'none',
            background: saved ? '#6fcf97' : 'var(--accent)',
            color: '#fff', fontFamily: 'inherit', fontSize: 15, fontWeight: 700, cursor: 'pointer',
          }}>
            {loading ? '...' : saved ? '✓ Saved' : 'Save profile'}
          </button>
        </div>
      </div>
    </div>
  )
}
