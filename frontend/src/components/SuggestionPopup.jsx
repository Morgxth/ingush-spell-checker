import { useEffect, useRef } from 'react'
import s from './SuggestionPopup.module.css'

export default function SuggestionPopup({ popup, onSelect, onClose }) {
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose()
    }
    document.addEventListener('mousedown', handler)
    document.addEventListener('touchstart', handler)
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('touchstart', handler)
    }
  }, [onClose])

  if (popup.type === 'warning') {
    const [w1, w2] = popup.bigram.split(' ')
    return (
      <div
        ref={ref}
        className={s.popup}
        style={{ left: popup.x, top: popup.y }}
      >
        <div className={s.headerWarn}>
          <span className={s.wordWarn}>⚠ Необычное сочетание</span>
          <span className={s.label}>не встречалось в корпусе</span>
        </div>
        <div className={s.warnBody}>
          <span className={s.bigramWord}>{w1}</span>
          <span className={s.bigramArrow}>→</span>
          <span className={s.bigramWord}>{w2}</span>
        </div>
        <p className={s.warnHint}>
          Эти слова часты по отдельности, но никогда не стоят рядом в текстах корпуса
        </p>
      </div>
    )
  }

  return (
    <div
      ref={ref}
      className={s.popup}
      style={{ left: popup.x, top: popup.y }}
    >
      <div className={s.header}>
        <span className={s.word}>«{popup.word}»</span>
        <span className={s.label}>не найдено в словаре</span>
      </div>
      {popup.suggestions.length > 0 ? (
        <ul className={s.list}>
          {popup.suggestions.map((sugg) => (
            <li key={sugg.word}>
              <button className={s.item} onClick={() => onSelect(sugg.word)}>
                <span className={s.suggWord}>{sugg.word}</span>
                {sugg.translation && (
                  <span className={s.translation}>{sugg.translation}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className={s.empty}>Подсказок нет</p>
      )}
    </div>
  )
}
