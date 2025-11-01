import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000'
})

export function useAuth() {
  const username = ref('')
  const email = ref('')
  const password = ref('')
  const confirmPassword = ref('')
  const error = ref('')
  const loading = ref(false)
  const router = useRouter()

  async function register() {
    error.value = ''
    loading.value = true
    if (!username.value || !email.value || !password.value || !confirmPassword.value) {
      error.value = 'Vui lòng nhập đầy đủ thông tin.'
      loading.value = false
      return
    }
    if (password.value !== confirmPassword.value) {
      error.value = 'Mật khẩu xác nhận không khớp.'
      loading.value = false
      return
    }
    try {
      await api.post('/register', {
        username: username.value,
        email: email.value,
        password: password.value
      })
      alert('Đăng ký thành công! Hãy đăng nhập.')
      router.push('/login')
    } catch (e) {
      error.value = e.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.'
    } finally {
      loading.value = false
    }
  }

  async function login() {
    error.value = ''
    loading.value = true
    if (!email.value || !password.value) {
      error.value = 'Vui lòng nhập đầy đủ thông tin.'
      loading.value = false
      return
    }
    try {
      const res = await api.post('/login', {
        email: email.value,
        password: password.value
      })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      localStorage.setItem('user_id', res.data.user.id);

      // phát sự kiện để navbar (và các nơi khác) cập nhật ngay
      window.dispatchEvent(new CustomEvent('auth:login', { detail: { user: res.data.user } }))
      alert('Đăng nhập thành công!')
      router.push('/')
    } catch (e) {
      error.value = e.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.'
    } finally {
      loading.value = false
    }
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.dispatchEvent(new CustomEvent('auth:logout'))
    router.push('/login')
  }

  function isLoggedIn() {
    return !!localStorage.getItem('token')
  }

  function getUser() {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  }

  return {
    username,
    email,
    password,
    confirmPassword,
    error,
    loading,
    register,
    login,
    logout,
    isLoggedIn,
    getUser
  }
}
