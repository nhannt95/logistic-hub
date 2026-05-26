import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const STORAGE_KEY = 'lh.auth'

interface AuthUser {
  username: string
  name: string
  role: 'Điều Độ' | 'Tài Xế' | 'Kế Toán' | 'Giám Đốc'
}

function load(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as AuthUser) : null
  } catch {
    return null
  }
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(load())

  const isAuthenticated = computed(() => user.value !== null)

  async function login(username: string, password: string): Promise<boolean> {
    await new Promise((r) => setTimeout(r, 300))
    if (username !== 'demo' || password !== 'demo123') return false
    const u: AuthUser = {
      username: 'demo',
      name: 'HoangKhang Admin',
      role: 'Giám Đốc',
    }
    user.value = u
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u))
    return true
  }

  function logout() {
    user.value = null
    localStorage.removeItem(STORAGE_KEY)
  }

  return { user, isAuthenticated, login, logout }
})
