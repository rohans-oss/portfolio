// Brand marks (lucide no longer ships brand icons) and the chat's tiny markdown renderer.

export function GithubIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  )
}

export function LinkedinIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  )
}

// Tiny markdown renderer for chat: **bold**, _italic_, [links](url), `code`, "- " lists.
export function Markdown({ text }) {
  const inline = (s, key) => {
    const parts = []
    const re = /(\*\*[^*]+\*\*|_[^_]+_|\[[^\]]+\]\([^)]+\)|`[^`]+`)/g
    let last = 0
    let m
    let i = 0
    while ((m = re.exec(s))) {
      if (m.index > last) parts.push(s.slice(last, m.index))
      const t = m[0]
      if (t.startsWith('**')) parts.push(<strong key={i++}>{t.slice(2, -2)}</strong>)
      else if (t.startsWith('`')) parts.push(<code key={i++}>{t.slice(1, -1)}</code>)
      else if (t.startsWith('_')) parts.push(<em key={i++}>{t.slice(1, -1)}</em>)
      else {
        const [, label, href] = t.match(/\[([^\]]+)\]\(([^)]+)\)/)
        const safe = /^(https?:|mailto:|tel:|\/[^/])/.test(href) ? href : '#'
        parts.push(
          <a
            key={i++}
            href={safe}
            target={safe.startsWith('http') ? '_blank' : undefined}
            download={safe.endsWith('.pdf') ? '' : undefined}
            rel="noreferrer"
          >
            {label}
          </a>,
        )
      }
      last = m.index + t.length
    }
    if (last < s.length) parts.push(s.slice(last))
    return <span key={key}>{parts}</span>
  }
  const groups = []
  text.split('\n').forEach((line, idx) => {
    const li = line.match(/^\s*[-*•]\s+(.*)/)
    if (li) {
      const lastG = groups.at(-1)
      if (lastG?.type === 'ul') lastG.items.push({ idx, s: li[1] })
      else groups.push({ type: 'ul', idx, items: [{ idx, s: li[1] }] })
    } else if (line.trim()) groups.push({ type: 'p', idx, s: line })
  })
  return (
    <>
      {groups.map((g) =>
        g.type === 'ul' ? (
          <ul key={`u${g.idx}`}>
            {g.items.map((it) => (
              <li key={it.idx}>{inline(it.s, it.idx)}</li>
            ))}
          </ul>
        ) : (
          <p key={g.idx}>{inline(g.s, g.idx)}</p>
        ),
      )}
    </>
  )
}
