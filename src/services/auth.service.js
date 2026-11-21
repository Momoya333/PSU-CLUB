import { api } from '@/boot/axios'

// ตรวจสอบ Username, Password จากคนกรอก แล้วสร้าง Token เก็บต่อใน json
export const login = async (username, password) => {
  const response = await api.get('/users')
  const matchedUser = response.data.find(
    u => u.username === username && u.password === password
  )

  if (!matchedUser) {
    const error = new Error('Invalid username or password.')
    error.response = { data: { message: 'Invalid username or password.' } }
    throw error
  }

  const { password: _, ...safeUser } = matchedUser
  const mockToken = `psuclub_jwt_${btoa(
    JSON.stringify({ id: safeUser.id, role: safeUser.role, iat: Date.now() })
  )}`

  return {
    data: {
      success: true,
      message: 'Login successful.',
      data: {
        accessToken: mockToken,
        user: safeUser
      }
    }
  }
}

// ลงทะเบียนใหม่ (บันทึกลงjson)
export const register = async payload => {
  // เช็กก่อนว่า username ซ้ำไหม
  const checkRes = await api.get('/users')
  const isDuplicate = checkRes.data?.some(u => u.username === payload.username)

  if (isDuplicate) {
    const error = new Error('Username already exists.')
    error.response = { data: { message: 'This username is already taken.' } }
    throw error
  }

  const newUser = {
    username: payload.username,
    password: payload.password,
    name: payload.name,
    email: payload.email || `${payload.username}@psu.ac.th`,
    role: payload.role || 'student'
  }

  const createRes = await api.post('/users', newUser)
  const { password: _, ...safeUser } = createRes.data

  const mockToken = `psuclub_jwt_${btoa(
    JSON.stringify({ id: safeUser.id, role: safeUser.role, iat: Date.now() })
  )}`

  return {
    data: {
      success: true,
      message: 'Registration successful.',
      data: {
        accessToken: mockToken,
        user: safeUser
      }
    }
  }
}

// ตรวจสอบToken/ดึงข้อมูลผู้ใช้ปัจจุบัน
export const getProfile = async userId => {
  const response = await api.get(`/users/${userId}`)
  const { password: _, ...safeUser } = response.data
  return {
    data: {
      success: true,
      data: safeUser
    }
  }
}