import '../assets/css/navbar.css'
import { useAuth } from './useAuth.js'

export default {
  name: 'Navbar',
  data(){
    return {
      user: null,
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
    },
    onAuthLogin(e){
      this.user = e.detail?.user || this.user
    },
    onAuthLogout(){
      this.user = null
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
