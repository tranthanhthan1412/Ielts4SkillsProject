export type User = {
  id: string
  username: string
  email: string
  displayName: string
}

type ApiError = {
  message?: string
}

const API_BASE = '/api'

export const TOKEN_KEY = 'ielts_access_token'

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  token?: string,
): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })

  if (!response.ok) {
    const error = (await response.json().catch(() => ({}))) as ApiError
    throw new Error(error.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.')
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}
