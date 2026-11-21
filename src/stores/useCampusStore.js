import { reactive, computed } from 'vue'
import { api } from '@/boot/axios'

const API_2 =
  import.meta.env.QCLI_API_URL_2 ||
  'https://6b014e3b1c637a569e52f7f8.mockapi.io/api'

const state = reactive({
  user: {
    id: '1',
    name: '',
    email: '',
    faculty: '',
    year: '',
    bio: '',
    joinedClubs: [],
    rsvp: [],
    saved: []
  },
  clubs: [],
  events: [],
  joinedClubs: [],
  rsvp: [],
  saved: [],
  query: '',
  notifications: [
    {
      id: '1',
      text: 'Welcome to PSU CLUB! Explore clubs and upcoming campus events.',
      time: 'Just now',
      unread: true
    },
    {
      id: '2',
      text: 'Music Club Acoustic Night registration is now open.',
      time: '2h ago',
      unread: false
    }
  ],
  isLoading: false,
  errorMessage: ''
})

let pendingFetch = null

function setApiError(error) {
  if (error.response) {
    switch (error.response.status) {
      case 401:
        state.errorMessage = 'Your session has expired. Please login again.'
        break
      case 404:
        state.errorMessage = 'The requested resource could not be found.'
        break
      case 500:
        state.errorMessage = 'The server encountered an error.'
        break
      default:
        state.errorMessage = `Unexpected Error (${error.response.status})`
        break
    }
  } else if (error.request) {
    state.errorMessage = 'Unable to connect to the server.'
  } else {
    state.errorMessage = error.message
  }
  console.error(error)
}

export function useCampusStore() {
  // GET: ดึง clubs จาก API_1 และดึง events, user จาก API_2 (MockAPI)
  async function fetchAll() {
    if (pendingFetch) return pendingFetch

    state.isLoading = true
    state.errorMessage = ''
    pendingFetch = Promise.all([
      api.get('/clubs'),
      api.get(`${API_2}/events`),
      api.get(`${API_2}/user`)
    ])
      .then(([clubsRes, eventsRes, userRes]) => {
        state.clubs = clubsRes.data || []
        state.events = eventsRes.data || []

        const userData = Array.isArray(userRes.data)
          ? userRes.data[0]
          : userRes.data

        if (userData) {
          state.user = { id: '1', ...userData }
          if (Array.isArray(userData.joinedClubs)) {
            state.joinedClubs = [...userData.joinedClubs]
          }
          if (Array.isArray(userData.rsvp)) {
            state.rsvp = [...userData.rsvp]
          }
          if (Array.isArray(userData.saved)) {
            state.saved = [...userData.saved]
          }
        }
      })
      .catch(error => {
        setApiError(error)
      })
      .finally(() => {
        state.isLoading = false
        pendingFetch = null
      })

    return pendingFetch
  }

  function clubById(id) {
    return state.clubs.find(c => String(c.id) === String(id))
  }

  function addClubToEvent(event) {
    return { ...event, club: clubById(event.clubId) }
  }

  const filteredEvents = computed(() => {
    const keyword = state.query.trim().toLowerCase()
    if (keyword === '') {
      return state.events.map(addClubToEvent)
    }

    const result = state.events.filter(e => {
      const club = clubById(e.clubId)
      const tagsText = Array.isArray(e.tags) ? e.tags.join(' ') : ''
      const clubName = club ? club.name : ''
      const text = `${e.title || ''} ${e.location || ''} ${tagsText} ${clubName}`
      return text.toLowerCase().includes(keyword)
    })
    return result.map(addClubToEvent)
  })

  const unreadCount = computed(() => {
    return state.notifications.filter(n => n.unread).length
  })

  const myActivities = computed(() => {
    return state.events
      .filter(
        e =>
          state.rsvp.includes(String(e.id)) || state.rsvp.includes(Number(e.id))
      )
      .map(addClubToEvent)
  })

  const savedEvents = computed(() => {
    return state.events
      .filter(
        e =>
          state.saved.includes(String(e.id)) ||
          state.saved.includes(Number(e.id))
      )
      .map(addClubToEvent)
  })

  function eventsByClub(clubId) {
    return state.events
      .filter(e => String(e.clubId) === String(clubId))
      .map(addClubToEvent)
  }

  function isRsvp(id) {
    return state.rsvp.includes(String(id)) || state.rsvp.includes(Number(id))
  }

  function isSaved(id) {
    return state.saved.includes(String(id)) || state.saved.includes(Number(id))
  }

  function isJoined(clubId) {
    return state.joinedClubs.includes(String(clubId))
  }

  // PUT: อัปเดตจำนวนผู้เข้าร่วมกิจกรรม และ sync rsvp ของ user ลง MockAPI
  async function toggleRsvp(id) {
    const strId = String(id)
    const event = state.events.find(e => String(e.id) === strId)
    if (!event) return false

    const alreadyGoing = isRsvp(id)
    const nextAttendees = alreadyGoing
      ? Math.max(0, (event.attendees || 0) - 1)
      : (event.attendees || 0) + 1

    state.errorMessage = ''
    try {
      const response = await api.put(`${API_2}/events/${strId}`, {
        attendees: nextAttendees
      })
      event.attendees = response.data.attendees

      const index = state.rsvp.findIndex(item => String(item) === strId)
      if (index === -1) {
        state.rsvp.push(strId)
      } else {
        state.rsvp.splice(index, 1)
      }

      const userId = state.user.id || '1'
      await api.put(`${API_2}/user/${userId}`, { rsvp: [...state.rsvp] })
      return !alreadyGoing
    } catch (error) {
      setApiError(error)
      return alreadyGoing
    }
  }

  // PUT: toggle saved event และ sync ลง user ใน MockAPI
  async function toggleSave(id) {
    const strId = String(id)
    const index = state.saved.findIndex(item => String(item) === strId)
    const willSave = index === -1
    if (willSave) {
      state.saved.push(strId)
    } else {
      state.saved.splice(index, 1)
    }

    try {
      const userId = state.user.id || '1'
      await api.put(`${API_2}/user/${userId}`, { saved: [...state.saved] })
    } catch (error) {
      console.error('Failed to sync saved events:', error)
    }
    return willSave
  }

  // PUT: อัปเดตจำนวนสมาชิกชมรม และ sync joinedClubs ของ user ลง MockAPI
  async function toggleJoin(clubId) {
    const strClubId = String(clubId)
    const club = clubById(strClubId)
    if (!club) return false

    const alreadyJoined = isJoined(strClubId)
    const nextMembers = alreadyJoined
      ? Math.max(0, (club.members || 0) - 1)
      : (club.members || 0) + 1

    state.errorMessage = ''
    try {
      const response = await api.put(`/clubs/${strClubId}`, {
        members: nextMembers
      })
      club.members = response.data.members

      const index = state.joinedClubs.findIndex(
        item => String(item) === strClubId
      )
      if (index === -1) {
        state.joinedClubs.push(strClubId)
      } else {
        state.joinedClubs.splice(index, 1)
      }

      const userId = state.user.id || '1'
      await api.put(`${API_2}/user/${userId}`, {
        joinedClubs: [...state.joinedClubs]
      })
      return !alreadyJoined
    } catch (error) {
      setApiError(error)
      return alreadyJoined
    }
  }

  async function markAllRead() {
    state.notifications.forEach(n => {
      n.unread = false
    })
  }

  // POST: เพิ่มโพสต์/กิจกรรมใหม่ลงใน MockAPI (API_2)
  async function addPost(post) {
    state.isLoading = true
    state.errorMessage = ''
    try {
      const newEvent = {
        attendees: 0,
        location: 'TBA',
        tags: [],
        ...post
      }

      const response = await api.post(`${API_2}/events`, newEvent)
      state.events.unshift(response.data)
      return response.data.id
    } catch (error) {
      setApiError(error)
      return null
    } finally {
      state.isLoading = false
    }
  }

  // PUT: แก้ไขข้อมูลกิจกรรมใน MockAPI (API_2)
  async function updateEvent(id, updatedData) {
    state.isLoading = true
    state.errorMessage = ''
    try {
      const strId = String(id)
      const response = await api.put(`${API_2}/events/${strId}`, updatedData)
      const index = state.events.findIndex(e => String(e.id) === strId)
      if (index !== -1) {
        state.events[index] = { ...state.events[index], ...response.data }
      }
      return true
    } catch (error) {
      setApiError(error)
      return false
    } finally {
      state.isLoading = false
    }
  }

  // DELETE: ลบกิจกรรมออกจาก MockAPI (API_2)
  async function deleteEvent(id) {
    state.isLoading = true
    state.errorMessage = ''
    try {
      const strId = String(id)
      await api.delete(`${API_2}/events/${strId}`)
      state.events = state.events.filter(e => String(e.id) !== strId)

      let needUserPut = false
      if (state.rsvp.includes(strId)) {
        state.rsvp = state.rsvp.filter(item => String(item) !== strId)
        needUserPut = true
      }
      if (state.saved.includes(strId)) {
        state.saved = state.saved.filter(item => String(item) !== strId)
        needUserPut = true
      }
      if (needUserPut) {
        const userId = state.user.id || '1'
        await api.put(`${API_2}/user/${userId}`, {
          rsvp: [...state.rsvp],
          saved: [...state.saved]
        })
      }
      return true
    } catch (error) {
      setApiError(error)
      return false
    } finally {
      state.isLoading = false
    }
  }

  // PUT: แก้ไขข้อมูลผู้ใช้ใน MockAPI (API_2)
  async function updateProfile(profileData) {
    state.isLoading = true
    state.errorMessage = ''
    try {
      const userId = state.user.id || '1'
      const response = await api.put(`${API_2}/user/${userId}`, profileData)
      state.user = { ...state.user, ...response.data }
      return true
    } catch (error) {
      setApiError(error)
      return false
    } finally {
      state.isLoading = false
    }
  }

  return {
    state,
    fetchAll,
    clubById,
    filteredEvents,
    unreadCount,
    eventsByClub,
    myActivities,
    savedEvents,
    isRsvp,
    isSaved,
    isJoined,
    toggleRsvp,
    toggleSave,
    toggleJoin,
    markAllRead,
    addPost,
    updateEvent,
    deleteEvent,
    updateProfile
  }
}