// Các hàm gọi backend
async function getJson(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${url} trả lỗi ${res.status}`)
  return res.json()
}

export const getHealth = () => getJson('/api/health')
export const getModels = () => getJson('/api/models')
