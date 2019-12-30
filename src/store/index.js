import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLoggedIn: false,
    userId: '',
    userData: {},
    bookingsData: [],
    allBookingsData: [],
    liveStreaming: {},
    instagram: []
  },
  mutations: {
    performLogin (state, payload) {
      state.userId = payload.user._id
      localStorage.setItem('tkn', payload.token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${payload.token}`
      this.dispatch('fetchUserData')
    },
    performLogOut (state) {
      state.isLoggedIn = false
      state.userId = ''
      state.userData = ''
      localStorage.removeItem('tkn')
      axios.defaults.headers.common['Authorization'] = ''
    },
    consolidateUserData (state, payload) {
      state.userId = payload._id
      state.isLoggedIn = true
      state.userData = payload
    },
    consolidateBookingsData (state, payload) {
      state.bookingsData = payload
    },
    consolidateAllBookingsData (state, payload) {
      state.allBookingsData = payload
    },
    consolidateLiveStreamingData (state, payload) {
      state.liveStreaming = payload
    },
    consolidateInstagramData (state, payload) {
      state.instagram = payload
    }
  },
  actions: {
    checkLogin (context) {
      let token = localStorage.getItem('tkn')
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        this.dispatch('fetchUserData')
      } else {
        axios.defaults.headers.common['Authorization'] = ''
      }
    },
    logIn (context, payload) {
      let url = `${process.env.VUE_APP_SERVER_URL}/api-v1/login`
      console.log('logging in..')
      axios.post(url, payload, { headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true })
        .then(res => {
          if (res.statusText === 'OK') {
            console.log('logged', res)
            this.commit('performLogin', res.data)
          }
        })
    },
    logOut () {
      let url = `${process.env.VUE_APP_SERVER_URL}/api-v1/logout`
      axios.get(url, { withCredentials: true })
        .then(res => {
          if (res.statusText === 'OK') {
            console.log('logged out')
            this.commit('performLogOut')
          }
        })
    },
    addBooking (context, payload) {
      let url = `${process.env.VUE_APP_SERVER_URL}/api-v1/bookings`
      console.log('adding booking...', payload)
      let data = { payload: { ...payload }, id: this.state.userId }
      axios.post(url, data, { headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true })
        .then(res => {
          if (res.statusText === 'OK') {
            console.log('booking added')
            this.dispatch('fetchUserData')
            this.dispatch('fetchAllBookingsData')
          }
        })
    },
    editBooking (context, payload) {
      let url = `${process.env.VUE_APP_SERVER_URL}/api-v1/bookings`
      console.log('editing booking...', payload)
      let { id, ...newload } = payload
      let data = { payload: newload, id: payload.id }
      axios.put(url, data, { headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true })
        .then(res => {
          if (res.statusText === 'OK') {
            console.log('booking updated')
            this.dispatch('fetchUserData')
            this.dispatch('fetchAllBookingsData')
          }
        })
    },
    deleteBooking (context, payload) {
      let url = `${process.env.VUE_APP_SERVER_URL}/api-v1/bookings`
      console.log('removing booking...', payload)
      let data = { id: payload }
      axios.delete(url, {
        data: data,
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true })
        .then(res => {
          if (res.statusText === 'OK') {
            console.log('booking deleted')
            this.dispatch('fetchUserData')
            this.dispatch('fetchAllBookingsData')
          }
        })
    },
    fetchUserData () {
      let url = `${process.env.VUE_APP_SERVER_URL}/api-v1/userdata`
      let data = { id: this.state.userId }
      console.log('fetching user data...')
      axios.post(url, data, { headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true })
        .then(res => {
          if (res.statusText === 'OK') {
            console.log('user data fetched', res)
            this.commit('consolidateUserData', res.data)
          }
        })
    },
    fetchBookingsData () {
      let url = `${process.env.VUE_APP_SERVER_URL}/api-v1/bookings`
      console.log('fetching bookings data...')
      axios.get(url, { withCredentials: true })
        .then(res => {
          if (res.statusText === 'OK') {
            console.log('fetched bookings data.')
            this.commit('consolidateBookingsData', res.data)
          }
        })
    },
    fetchAllBookingsData () {
      let url = `${process.env.VUE_APP_SERVER_URL}/api-v1/allbookings`
      console.log('fetching ALL bookings data...')
      axios.get(url, { withCredentials: true })
        .then(res => {
          if (res.statusText === 'OK') {
            console.log('fetched  ALL bookings data.')
            this.commit('consolidateAllBookingsData', res.data)
          }
        })
    },
    fetchLiveStreamingData () {
      let twitchID = process.env.VUE_APP_TWITCH_ID
      let url = `https://api.twitch.tv/helix/streams?user_login=${process.env.VUE_APP_TWITCH_USER}`
      console.log('fetching live streaming data...')
      axios.get(url, { headers: { 'Client-ID': twitchID } })
        .then(res => {
          if (res.status === 200) {
            console.log('fetched  live streams data', res.data)
            if (res.data !== this.state.liveStreaming) {
              this.commit('consolidateLiveStreamingData', res.data)
            }
          }
        })
    },
    fetchInstagramData () {
      let url = `https://www.instagram.com/${process.env.VUE_APP_INSTAGRAM_HANDLE}/?__a=1`
      console.log('fetching instagram data...')
      axios.get(url)
        .then(res => {
          if (res.status === 200) {
            let images = res.data.graphql.user.edge_owner_to_timeline_media.edges.slice(0, 9).map(el => {
              let url = `https://instagram.com/${process.env.VUE_APP_INSTAGRAM_HANDLE}/p/${el.node.shortcode}`
              let image = el.node.thumbnail_src
              let text = el.node.edge_media_to_caption.edges[0].node.text
              return { 'image': image, 'text': text.length > 160 ? text.substring(0, 160) + '...' : text, 'link': url }
            })
            console.log('fetched  instagram data', images)
            this.commit('consolidateInstagramData', images)
          }
        })
    }
  },
  modules: {
  }
})
