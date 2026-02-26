import { useState, useCallback, useRef } from 'react'
import { checkText } from './api'
import StatsPanel from './components/StatsPanel'
import TextEditor from './components/TextEditor'
import ContextWarnings from './components/ContextWarnings'
import Dictionary from './components/Dictionary'
import s from './App.module.css'

const DEBOUNCE_MS = 800

export default function App() {
  const [tab, setTab] = useState('checker') // 'checker' | 'dictionary'

  const [corrections, setCorrections]         = useState([])
  const [contextWarnings, setContextWarnings] = useState([])
  const [loading, setLoading]                 = useState(false)
  const [errorCount, setErrorCount]           = useState(null)
  const debounceRef = useRef(null)

  const handleTextChange = useCallback((text) => {
    clearTimeout(debounceRef.current)

    if (!text.trim()) {
      setCorrections([])
      setContextWarnings([])
      setErrorCount(null)
      return
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const result = await checkText(text)
        setCorrections(result.corrections ?? [])
        setContextWarnings(result.contextWarnings ?? [])
        setErrorCount(result.corrections?.length ?? 0)
      } catch {
        // сервер недоступен
      } finally {
        setLoading(false)
      }
    }, DEBOUNCE_MS)
  }, [])

  return (
    <div>
      <header className={s.header}>
        <div>
          <h1 className={s.title}>ГIалгIай мотт</h1>
          <p className={s.subtitle}>Проверка орфографии ингушского языка</p>
        </div>
        {loading && <span className={s.loading}>проверяю...</span>}
      </header>

      <StatsPanel />

      <nav className={s.tabs}>
        <button
          className={`${s.tab} ${tab === 'checker' ? s.tabActive : ''}`}
          onClick={() => setTab('checker')}
        >
          Проверка
        </button>
        <button
          className={`${s.tab} ${tab === 'dictionary' ? s.tabActive : ''}`}
          onClick={() => setTab('dictionary')}
        >
          Словарь
        </button>
      </nav>

      {tab === 'checker' && (
        <>
          <TextEditor
            corrections={corrections}
            contextWarnings={contextWarnings}
            onTextChange={handleTextChange}
          />

          {errorCount !== null && (
            <div className={s.summary}>
              {errorCount === 0
                ? <span className={s.ok}>✓ Ошибок не найдено</span>
                : <span className={s.err}>✗ Найдено слов не из словаря: {errorCount}</span>
              }
              {contextWarnings.length > 0 && (
                <span className={s.warn}> · {contextWarnings.length} контекстных предупреждений</span>
              )}
            </div>
          )}

          <ContextWarnings warnings={contextWarnings} />
        </>
      )}

      {tab === 'dictionary' && <Dictionary />}
    </div>
  )
}
