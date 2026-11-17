import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_API_URL || 'https://dragon-badminton.onrender.com/api'

const STATUS_OPTIONS = [
  { value: 'active', label: 'Hoạt động' },
  { value: 'maintenance', label: 'Bảo trì' },
]

const empty = { name: '', description: '', status: STATUS_OPTIONS[0].value }
const jsonHeaders = { 'Content-Type': 'application/json', Accept: 'application/json' }

export default function App() {
  const [courts, setCourts] = useState([])
  const [form, setForm] = useState(empty)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  async function load() {
    try {
      setLoading(true)
      const res = await fetch(`${API}/courts`, { headers: { Accept: 'application/json' } })
      setCourts(await res.json())
    } catch {
      setError('Không tải được dữ liệu từ BE')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function save(e) {
    e.preventDefault()
    setError('')
    const url = editingId ? `${API}/courts/${editingId}` : `${API}/courts`
    const res = await fetch(url, {
      method: editingId ? 'PUT' : 'POST',
      headers: jsonHeaders,
      body: JSON.stringify(form),
    })
    if (!res.ok) {
      setError('Lưu thất bại, kiểm tra lại dữ liệu')
      return
    }
    setForm(empty)
    setEditingId(null)
    load()
  }

  function edit(c) {
    setEditingId(c.id)
    setForm({ name: c.name, description: c.description ?? '', status: c.status })
  }

  async function remove(id) {
    if (!confirm('Xóa sân này?')) return
    await fetch(`${API}/courts/${id}`, { method: 'DELETE', headers: { Accept: 'application/json' } })
    load()
  }

  const labelOf = (v) => STATUS_OPTIONS.find((s) => s.value === v)?.label ?? v

  return (
    <div className="container py-4">
      <h2 className="mb-3">Dragon Badminton – Quản lý sân</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={save} className="card card-body mb-4">
        <h5>{editingId ? 'Sửa sân' : 'Thêm sân'}</h5>
        <div className="mb-2">
          <label className="form-label">Tên sân</label>
          <input className="form-control" required value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="mb-2">
          <label className="form-label">Mô tả</label>
          <textarea className="form-control" value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <div className="mb-3">
          <label className="form-label">Trạng thái</label>
          <select className="form-select" value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}>
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
        <div>
          <button className="btn btn-success me-2" type="submit">Lưu</button>
          {editingId && (
            <button className="btn btn-secondary" type="button"
              onClick={() => { setEditingId(null); setForm(empty) }}>Hủy</button>
          )}
        </div>
      </form>

      {loading && <p>Đang tải... (server miễn phí có thể mất khoảng 1 phút để khởi động)</p>}

      <table className="table table-bordered">
        <thead>
          <tr><th>#</th><th>Tên</th><th>Mô tả</th><th>Trạng thái</th><th></th></tr>
        </thead>
        <tbody>
          {!loading && courts.length === 0 && (
            <tr><td colSpan="5">Chưa có sân nào.</td></tr>
          )}
          {courts.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.name}</td>
              <td>{c.description}</td>
              <td>{labelOf(c.status)}</td>
              <td>
                <button className="btn btn-sm btn-warning me-2" onClick={() => edit(c)}>Sửa</button>
                <button className="btn btn-sm btn-danger" onClick={() => remove(c.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}