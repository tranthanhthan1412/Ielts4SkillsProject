import { apiRequest } from './api'
import type { User } from './api'

export type SignInPayload = {
  username: string
  password: string
}

export type SignUpPayload = SignInPayload & {
  email: string
  firstName: string
  lastName: string
}

type SignInResponse = {
  accessToken: string
}

type SignUpResponse = {
  message: string
  user: User
}

export async function signUp(payload: SignUpPayload) {
  return apiRequest<SignUpResponse>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function signIn(payload: SignInPayload) {
  return apiRequest<SignInResponse>('/auth/signin', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function getCurrentUser(token: string) {
  const { user } = await apiRequest<{ user: User }>('/users/me', {}, token)
  return user
}

export async function signOut(token?: string, signal?: AbortSignal) {
  return apiRequest<void>(
    '/auth/signout',
    { method: 'POST', signal },
    token,
  )
}
