// store/slices/authSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export interface AuthUser {
  id: string
  email: string
  role: 'admin' | 'department' | 'intern'
  department_id: string | null
}

interface AuthState {
  token: string | null
  user: AuthUser | null
  status: 'idle' | 'loading' | 'failed'
  error: string | null
}

// ── Login ──────────────────────────────────────────────────────────
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (
    creds: { email: string; password: string },
    { rejectWithValue }
  ) => {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(creds),
    })
    const data = await res.json()
    if (!res.ok) return rejectWithValue(data.error || 'Login failed')

    localStorage.setItem('auth_token', data.token)
    localStorage.setItem('auth_user', JSON.stringify(data.user))
    return data as { token: string; user: AuthUser }
  }
)

// ── Logout ─────────────────────────────────────────────────────────
export const logoutUser = createAsyncThunk('/logoutUser', async () => {
  await fetch('/api/logout', { method: 'POST' })
  localStorage.removeItem('auth_token')
  localStorage.removeItem('auth_user')
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    user: null,
    status: 'idle',
    error: null,
  } as AuthState,
  reducers: {
    restoreSession(state) {
      try {
        const token = localStorage.getItem('auth_token')
        const user = localStorage.getItem('auth_user')
        if (token && user) {
          state.token = token
          state.user = JSON.parse(user)
        }
      } catch {}
    },
    clearError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (s) => { s.status = 'loading'; s.error = null })
      .addCase(loginUser.fulfilled, (s, a) => {
        s.status = 'idle'
        s.token = a.payload.token
        s.user = a.payload.user
      })
      .addCase(loginUser.rejected, (s, a) => {
        s.status = 'failed'
        s.error = a.payload as string
      })
      .addCase(logoutUser.fulfilled, (s) => {
        s.token = null; s.user = null
        s.status = 'idle'; s.error = null
      })
  },
})

export const { restoreSession, clearError } = authSlice.actions
export default authSlice.reducer