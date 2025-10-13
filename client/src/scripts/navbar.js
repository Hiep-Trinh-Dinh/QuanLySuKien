import '../assets/css/navbar.css'
import { useAuth } from './useAuth.js'

export default {
  name: 'Navbar',
  data(){
    return {
      user: null,
      admin: false,
      menuOpen: false,
    }
  },
  setup(){
    const { logout } = useAuth()
    return { logout }
  },
  computed: {
    userAvatar(){
      return this.user?.avatar || 'https://i.pravatar.cc/100?img=12'
    }
  },
  mounted(){
    this.readUser()
    window.addEventListener('auth:login', this.onAuthLogin)
    window.addEventListener('auth:logout', this.onAuthLogout)
    window.addEventListener('storage', this.onStorage)
    window.addEventListener('click', this.handleOutside)
  },
  beforeUnmount(){
    window.removeEventListener('auth:login', this.onAuthLogin)
    window.removeEventListener('auth:logout', this.onAuthLogout)
    window.removeEventListener('storage', this.onStorage)
    window.removeEventListener('click', this.handleOutside)
  },
  methods: {
    readUser(){
      const raw = localStorage.getItem('user')
      this.user = raw ? JSON.parse(raw) : null
      // Đồng bộ trạng thái admin dựa vào role
      this.admin = this.user && this.user.role === 'admin';
    },
    onAuthLogin(e){
      this.readUser(); // Đọc lại user mới nhất từ localStorage mỗi lần nhận sự kiện đăng nhậ
    },
    onAuthLogout(){
      this.user = null
      this.admin = false
    },
    onStorage(e){
      if (e.key === 'user') this.readUser()
    },
    toggleMenu(e){
      e.stopPropagation()
      this.menuOpen = !this.menuOpen
    },
    handleOutside(){
      this.menuOpen = false
    }
  }
}
