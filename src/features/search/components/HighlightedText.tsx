import { escapeRegExp, getHighlightTokens } from '../utils/highlight.util'

interface HighlightedTextProps {
  text: string
  query?: string
}

export function HighlightedText({ text, query }: HighlightedTextProps) {
  const tokens = getHighlightTokens(query)

  if (!text || tokens.length === 0) return <span>{text}</span>

  const matcher = new RegExp(`(${tokens.map(escapeRegExp).join('|')})`, 'gi')
  const parts = text.split(matcher)

  return (
    <span>
      {parts.map((part, index) => {
        const isMatch = tokens.some(
          (token) => part.toLowerCase() === token.toLowerCase(),
        )

        return isMatch ? (
          <span key={`${part}-${index}`} className="bg-yellow-200">
            {part}
          </span>
        ) : (
          <span key={`${part}-${index}`}>{part}</span>
        )
      })}
    </span>
  )
}
