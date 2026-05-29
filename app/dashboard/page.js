'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const OPEN_TO_OPTIONS = ['Open to chat', 'Beach walk', 'Just vibing', 'Coffee']

const cardStyle = { background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 20, padding: 18, marginBottom: 12 }
const avatarStyle = { width: 52, height: 52, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, flexShrink: 0 }
const primaryBtn = { background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 13, padding: '11px 16px', fontFamily: 'inherit', fontSize: 14, fontWeight: 700, cursor: 'pointer' }
const secondaryBtn = { background: 'var(--bg-card2)', color: 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 13, padding: '11px 16px', fontFamily: 'inherit', fontSize: 14, fontWeight: 600, cursor: 'pointer' }
const overlayStyle = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', zIndex: 50, display: 'flex', alignItems: 'flex-end' }
const panelStyle = { width: '100%', maxWidth: 430, margin: '0 auto', background: 'var(--bg-card)', borderRadius: '28px 28px 0 0', padding: '28px 24px 40px', border: '1px solid rgba(184,92,122,0.12)', borderBottom: 'none' }
const statBox = { flex: 1, background: 'var(--bg-card2)', borderRadius: 16, padding: 14, textAlign: 'center', border: '1px solid rgba(255,255,255,0.04)' }

function Badge({ children, color }) {
  const colors = {
    green: { bg: 'rgba(111,207,151,0.1)', border: 'rgba(111,207,151,0.2)', text: '#6fcf97' },
    accent: { bg: 'rgba(184,92,122,0.1)', border: 'rgba(184,92,122,0.2)', text: 'var(--accent-light)' },
    yellow: { bg: 'rgba(242,201,76,0.1)', border: 'rgba(242,201,76,0.2)', text: '#f2c94c' },
  }
  const c = colors[color]
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 100, background: c.bg, border: `1px solid ${c.border}`, color: c.text }}>
      {children}
    </div>
  )
}

function IntentCard({ intent, onAccept, onReject, onViewProfile }) {
  const p = intent.profile
  if (!p) return null
  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
        <div style={{ ...avatarStyle, background: 'linear-gradient(135deg, #2d1f26, #4a2d3a)' }}>{p.name[0].toUpperCase()}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 16 }}>{p.name}{p.age ? `, ${p.age}` : ''}</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>💬 {intent.message || 'Would love to say hi'}</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
        <Badge color="green">✓ ID verified</Badge>
        <Badge color="accent">🛡 Background clear</Badge>
        {p.rating_count > 0 && <Badge color="yellow">★ {Number(p.rating_avg).toFixed(1)}</Badge>}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={onAccept} style={{ ...primaryBtn, flex: 1 }}>Accept</button>
        <button onClick={onViewProfile} style={{ ...secondaryBtn, flex: 1 }}>Profile</button>
        <button onClick={onReject} style={secondaryBtn}>✕</button>
      </div>
    </div>
  )
}

function WomanCard({ woman, onSendIntent, onViewProfile }) {
  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
        <div style={{ ...avatarStyle, background: 'linear-gradient(135deg, #1f2d2a, #2d4a42)' }}>{woman.name[0].toUpperCase()}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 16 }}>{woman.name}{woman.age ? `, ${woman.age}` : ''}</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>☀️ {woman.open_to}</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={onSendIntent} style={{ ...primaryBtn, flex: 1 }}>Show interest</button>
        <button onClick={onViewProfile} style={{ ...secondaryBtn, flex: 1 }}>Profile</button>
      </div>
    </div>
  )
}

function ProfilePanel({ profile, isFemale, onClose, onAccept }) {
  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={panelStyle} onClick={e => e.stopPropagation()}>
        <div style={{ width: 40, height: 4, background: 'var(--bg-card2)', borderRadius: 100, margin: '0 auto 24px' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #2d1f26, #4a2d3a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, border: '2px solid rgba(184,92,122,0.4)' }}>
            {profile.name[0].toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>{profile.name}{profile.age ? `, ${profile.age}` : ''}</div>
            <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>☀️ {profile.open_to}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          <Badge color="green">✓ ID verified</Badge>
          <Badge color="accent">🛡 Background clear</Badge>
        </div>
        <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
          <div style={statBox}>
            <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--yellow)' }}>{profile.rating_count > 0 ? `${Number(profile.rating_avg).toFixed(1)} ★` : '—'}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Rating</div>
          </div>
          <div style={statBox}>
            <div style={{ fontSize: 22, fontWeight: 700 }}>{profile.rating_count}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Interactions</div>
          </div>
        </div>
        {profile.bio && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-muted)', marginBottom: 8 }}>About</div>
            <div style={{ fontSize: 14, lineHeight: 1.6 }}>{profile.bio}</div>
          </div>
        )}
        <div style={{ display: 'flex', gap: 10 }}>
          {onAccept && (
            <button onClick={() => { onAccept(); onClose() }} style={{ ...primaryBtn, flex: 1, padding: 15 }}>
              {isFemale ? 'Accept & share location' : 'Send interest'}
            </button>
          )}
          <button onClick={onClose} style={{ ...secondaryBtn, padding: '15px 20px' }}>✕</button>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const supabase = createClient()
  const router = useRouter()

  const [profile, setProfile] = useState(null)
  const [intents, setIntents] = useState([])
  const [activeWomen, setActiveWomen] = useState([])
  const [selectedProfile, setSelectedProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [ratingTarget, setRatingTarget] = useState(null)
  const [ratingScore, setRatingScore] = useState(5)

  const loadProfile = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { router.push('/auth'); return }
    const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
    if (data) setProfile(data)
    setLoading(false)
  }, [supabase, router])

  const loadIntents = useCallback(async () => {
    if (!profile) return
    const { data } = await supabase
      .from('intents')
      .select('*, profile:from_user(*)')
      .eq('to_user', profile.id)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
    if (data) setIntents(data)
  }, [profile, supabase])

  const loadActiveWomen = useCallback(async () => {
    if (!profile) return
    const { data } = await supabase.from('profiles').select('*').eq('gender', 'female').eq('is_active', true)
    if (data) setActiveWomen(data)
  }, [profile, supabase])

  useEffect(() => { loadProfile() }, [loadProfile])
  useEffect(() => {
    if (!profile) return
    if (profile.gender === 'female') loadIntents()
    else loadActiveWomen()
  }, [profile, loadIntents, loadActiveWomen])

  useEffect(() => {
    if (!profile || profile.gender !== 'female') return
    const channel = supabase.channel('intents')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'intents', filter: `to_user=eq.${profile.id}` }, () => loadIntents())
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [profile, supabase, loadIntents])

  async function toggleActive() {
    if (!profile) return
    const newVal = !profile.is_active
    await supabase.from('profiles').update({ is_active: newVal }).eq('id', profile.id)
    setProfile({ ...profile, is_active: newVal })
  }

  async function setOpenTo(option) {
    if (!profile) return
    await supabase.from('profiles').update({ open_to: option }).eq('id', profile.id)
    setProfile({ ...profile, open_to: option })
  }

  async function acceptIntent(intent) {
    await supabase.from('intents').update({ status: 'accepted' }).eq('id', intent.id)
    setIntents(prev => prev.filter(i => i.id !== intent.id))
  }

  async function rejectIntent(intent) {
    await supabase.from('intents').update({ status: 'rejected' }).eq('id', intent.id)
    setIntents(prev => prev.filter(i => i.id !== intent.id))
  }

  async function sendIntent(toUser) {
    if (!profile) return
    const { error } = await supabase.from('intents').insert({
      from_user: profile.id,
      to_user: toUser.id,
      message: `Hey! I saw you're ${toUser.open_to?.toLowerCase()}. Would love to say hi.`,
    })
    if (!error) alert('Interest sent! Wait for her to accept.')
    else alert('You already sent interest to this person.')
  }

  async function submitRating() {
    if (!profile || !ratingTarget) return
    await supabase.from('ratings').insert({ from_user: profile.id, to_user: ratingTarget.id, score: ratingScore })
    setRatingTarget(null)
    alert('Rating submitted!')
  }

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/auth')
  }

  if (loading) return (
    <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>Loading...</div>
  )
  if (!profile) return null

  const isFemale = profile.gender === 'female'

  return (
    <div style={{ maxWidth: 430, margin: '0 auto', minHeight: '100dvh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <div style={{ position: 'fixed', top: -80, right: -80, width: 350, height: 350, borderRadius: '50%', background: 'var(--accent-glow)', filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0 }} />

      {/* Top bar */}
      <div style={{ padding: '20px 24px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
        <div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Good to see you,</div>
          <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: -0.4 }}>{profile.name} ✨</div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button onClick={() => router.push('/profile')} style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', fontSize: 18 }}>👤</button>
          <button onClick={signOut} style={{ ...secondaryBtn, padding: '8px 14px', fontSize: 12 }}>Sign out</button>
        </div>
      </div>

      {/* Scroll */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px 100px', position: 'relative', zIndex: 1 }}>

        {/* Status card — female only */}
        {isFemale && (
          <div style={{ background: 'var(--bg-card)', borderRadius: 24, padding: 22, marginBottom: 20, border: profile.is_active ? '1px solid rgba(184,92,122,0.25)' : '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>My status</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: profile.is_active ? 'var(--green)' : 'var(--text-muted)' }}>
                  {profile.is_active ? 'Active' : 'Inactive'}
                </span>
                <div onClick={toggleActive} style={{ width: 52, height: 30, background: profile.is_active ? 'var(--accent)' : 'var(--bg-card2)', borderRadius: 100, border: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer', position: 'relative', transition: 'all 0.3s' }}>
                  <div style={{ position: 'absolute', top: 3, left: profile.is_active ? 25 : 3, width: 22, height: 22, borderRadius: '50%', background: '#fff', transition: 'left 0.3s', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }} />
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {OPEN_TO_OPTIONS.map(opt => (
                <button key={opt} onClick={() => setOpenTo(opt)} style={{
                  padding: '8px 14px', borderRadius: 100, fontFamily: 'inherit', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                  border: profile.open_to === opt ? '1px solid rgba(184,92,122,0.4)' : '1px solid rgba(255,255,255,0.06)',
                  background: profile.open_to === opt ? 'rgba(184,92,122,0.12)' : 'var(--bg-card2)',
                  color: profile.open_to === opt ? 'var(--accent-light)' : 'var(--text-muted)',
                }}>{opt}</button>
              ))}
            </div>
          </div>
        )}

        {/* Female: intents */}
        {isFemale && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ fontSize: 16, fontWeight: 700 }}>Interested in you</div>
              {intents.length > 0 && <div style={{ background: 'rgba(184,92,122,0.15)', color: 'var(--accent-light)', fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 100 }}>{intents.length} waiting</div>}
            </div>
            {intents.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>✨</div>
                <div style={{ fontSize: 14, lineHeight: 1.6 }}>{profile.is_active ? 'No one yet — verified men nearby will appear here.' : 'Activate your status to start receiving interest.'}</div>
              </div>
            ) : intents.map(intent => (
              <IntentCard key={intent.id} intent={intent}
                onAccept={() => acceptIntent(intent)}
                onReject={() => rejectIntent(intent)}
                onViewProfile={() => setSelectedProfile(intent.profile)}
              />
            ))}
          </>
        )}

        {/* Male: active women */}
        {!isFemale && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ fontSize: 16, fontWeight: 700 }}>Available nearby</div>
              {activeWomen.length > 0 && <div style={{ background: 'rgba(184,92,122,0.15)', color: 'var(--accent-light)', fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 100 }}>{activeWomen.length} active</div>}
            </div>
            {activeWomen.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>🌊</div>
                <div style={{ fontSize: 14, lineHeight: 1.6 }}>No one nearby right now.<br />Check back soon.</div>
              </div>
            ) : activeWomen.map(woman => (
              <WomanCard key={woman.id} woman={woman}
                onSendIntent={() => sendIntent(woman)}
                onViewProfile={() => setSelectedProfile(woman)}
              />
            ))}
          </>
        )}
      </div>

      {/* Bottom nav */}
      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, padding: '12px 24px 28px', background: 'rgba(15,13,14,0.95)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-around', zIndex: 10 }}>
        {[{ icon: '✨', label: 'Discover', active: true }, { icon: '💬', label: 'Chats' }, { icon: '👥', label: 'Groups' }, { icon: '⭐', label: 'Ratings' }].map(item => (
          <div key={item.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '6px 14px', borderRadius: 14, background: item.active ? 'rgba(184,92,122,0.1)' : 'transparent', cursor: 'pointer' }}>
            <div style={{ fontSize: 20 }}>{item.icon}</div>
            <div style={{ fontSize: 10, fontWeight: 600, color: item.active ? 'var(--accent-light)' : 'var(--text-muted)' }}>{item.label}</div>
          </div>
        ))}
      </div>

      {/* Profile panel */}
      {selectedProfile && (
        <ProfilePanel
          profile={selectedProfile}
          isFemale={isFemale}
          onClose={() => setSelectedProfile(null)}
          onAccept={!isFemale ? () => sendIntent(selectedProfile) : undefined}
        />
      )}

      {/* Rating panel */}
      {ratingTarget && (
        <div style={overlayStyle} onClick={() => setRatingTarget(null)}>
          <div style={{ ...panelStyle, padding: 28 }} onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: 18, fontWeight: 700 }}>Rate {ratingTarget.name}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>How was the interaction?</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 24 }}>
              {[1, 2, 3, 4, 5].map(s => (
                <button key={s} onClick={() => setRatingScore(s)} style={{ width: 44, height: 44, borderRadius: '50%', border: ratingScore >= s ? '2px solid var(--accent)' : '2px solid rgba(255,255,255,0.06)', background: ratingScore >= s ? 'rgba(184,92,122,0.15)' : 'var(--bg-card2)', color: ratingScore >= s ? 'var(--yellow)' : 'var(--text-muted)', fontSize: 18, cursor: 'pointer' }}>★</button>
              ))}
            </div>
            <button onClick={submitRating} style={{ ...primaryBtn, width: '100%', padding: 15, fontSize: 15 }}>Submit rating</button>
          </div>
        </div>
      )}
    </div>
  )
}
