const ITEMS = [
  '🚀 50,204 members active globally',
  '💻 1,247 open-source projects',
  '⚡ 893 commits pushed today',
  '🌍 90+ countries represented',
  '🔥 247 new members joined today',
  '⭐ 4.9/5 average community rating',
  '🏆 142 hackathons hosted to date',
  '📚 3,400+ tutorials published',
  '🤝 12,800 mentorship connections made',
  '🛠️ 780 pull requests merged today',
]

export default function LiveTicker() {
  return (
    <div style={{
      overflow: 'hidden',
      padding: '11px 0',
      borderTop:    '1px solid rgba(0,212,255,0.1)',
      borderBottom: '1px solid rgba(0,212,255,0.1)',
      background: 'rgba(0,212,255,0.02)',
      position: 'relative',
    }}>
      {/* Left fade */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 80,
        background: 'linear-gradient(to right, #02020e, transparent)',
        zIndex: 2, pointerEvents: 'none',
      }} />
      {/* Right fade */}
      <div style={{
        position: 'absolute', right: 0, top: 0, bottom: 0, width: 80,
        background: 'linear-gradient(to left, #02020e, transparent)',
        zIndex: 2, pointerEvents: 'none',
      }} />

      <div style={{ display: 'flex', animation: 'ticker 38s linear infinite', width: 'max-content' }}>
        {[...ITEMS, ...ITEMS].map((item, i) => (
          <span
            key={i}
            style={{
              padding: '0 44px',
              color: 'rgba(180,196,220,0.65)',
              fontSize: '0.8rem',
              whiteSpace: 'nowrap',
              fontFamily: '"Rajdhani", monospace',
              letterSpacing: '0.06em',
              fontWeight: 500,
            }}
          >
            <span style={{ color: '#00d4ff', marginRight: 10, fontSize: '0.6rem' }}>◆</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
