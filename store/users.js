import _ from 'underscore'
import api from '~/api'

const perPage = 10

export const state = () => ({
  users: [],
  collection: [],
  showenCollection: [],
  currentPage: 1,
})

export const getters = {
  getShowenCollection: state => state.showenCollection,
}

export const mutations = {
  setAllUsers(state, users) {
    state.users = users
  },
  setCollectionOfUsers(state, collection) {
    state.collection = collection
    state.currentPage = 1
    state.showenCollection = state.collection.slice(0, perPage * state.currentPage)
  },
  showOneMorePage(state, page) {
    state.currentPage = state.currentPage + 1
    state.showenCollection = state.collection.slice(0, perPage * state.currentPage)
  },
  filterUsers(state, query) {
    if (_.isEmpty(query)) {
      state.collection = state.users
      return
    }

    state.collection = _.filter(state.users, (user) => {
      return user.name.includes(query) || user.address.includes(query) || user.title.includes(query) || user.email.includes(query)
    })
    state.currentPage = 1
    state.showenCollection = state.collection.slice(0, perPage * state.currentPage)
  },
}

export const actions = {
  async fetchUsers({ commit }) {
    const res = await api.users()

    commit('setAllUsers', res.data)
    commit('setCollectionOfUsers', res.data)
  },
  async searchUsers({ commit }, query) {
    await commit('filterUsers', query)
  },
  async paginateUsers({ commit }, page) {
    await commit('showOneMorePage', page)
  }
}
