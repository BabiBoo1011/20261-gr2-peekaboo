import { useEffect, useState } from 'react'
import { getHealth, getModels } from '../api/client.js'
import ModelViewer from '../scene/ModelViewer.jsx'

const SERVICES = [['server', 'Server'], ['database', 'PostgreSQL'], ['ollama', 'Ollama']]

// Trang kiểm tra khung dự án: trạng thái các dịch vụ và xem thử mô hình thật trong thư viện
export default function ModelCheckPage() {
  const [health, setHealth] = useState(null)
  const [models, setModels] = useState([])
  const [selectedId, setSelectedId] = useState('cat')
  const [error, setError] = useState(null)

  useEffect(() => {
    getHealth().then(setHealth).catch((err) => setError(err.message))
    getModels().then(setModels).catch((err) => setError(err.message))
  }, [])

  const selected = models.find((m) => m.id === selectedId)

  return (
    <div className="page">
      <header className="header">
        <h1>Peekaboo</h1>
        <ul className="health">
          {SERVICES.map(([key, label]) => {
            const s = health?.[key]
            const state = !health ? 'pending' : s.ok ? 'ok' : 'fail'
            return (
              <li key={key} className={state} title={s?.error ?? s?.version ?? ''}>
                {label}: {state === 'pending' ? 'đang kiểm tra' : state === 'ok' ? 'kết nối được' : 'lỗi'}
              </li>
            )
          })}
        </ul>
      </header>
      {error && <p className="error">Không gọi được server: {error}</p>}

      <main className="content">
        <aside className="model-list">
          <p>{models.length} mô hình</p>
          <ul>
            {models.map((m) => (
              <li key={m.id}>
                <button className={m.id === selectedId ? 'active' : ''} onClick={() => setSelectedId(m.id)}>
                  <img src={m.preview} alt="" width="40" height="40" />
                  <span>
                    {m.nameEn}
                    <small>{m.nameVi}</small>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <section className="viewer">
          {selected && <ModelViewer url={selected.file} />}
          {selected && (
            <p className="caption">
              <b>{selected.nameEn}</b> – {selected.nameVi} · {selected.bbox.join(' × ')} m · {selected.credit.author} ({selected.credit.license})
            </p>
          )}
        </section>
      </main>
    </div>
  )
}
