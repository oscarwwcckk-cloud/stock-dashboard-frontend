// 靜態/API 雙模式切換。
//   VITE_DATA_MODE=static（正式免費靜態站）→ 直接 fetch /data/*.json
//   否則（本機開發）→ 走 axios client 打 FastAPI /api
import { client } from './client'

export const STATIC = import.meta.env.VITE_DATA_MODE === 'static'

const DATA_BASE = (import.meta.env.BASE_URL || '/') + 'data/'

export async function fetchStatic<T>(file: string): Promise<T> {
  const res = await fetch(DATA_BASE + file)
  if (!res.ok) throw new Error(`static fetch failed: ${file} (${res.status})`)
  return res.json() as Promise<T>
}

// api 模式的便捷包裝（保留既有 axios 行為）
export async function fetchApi<T>(path: string, params?: Record<string, unknown>): Promise<T> {
  const { data } = await client.get(path, { params })
  return data as T
}
