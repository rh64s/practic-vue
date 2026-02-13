export default createStore({
  state: {
    token: localStorage.getItem('token') || '',
  },
  getters: {
    isAuthenticated: state => !!state.token,
  },
  actions: {
    AUTH_REQUEST: ({ commit }, user) => {
      return new Promise((resolve, reject) => {
        loginRequest(user)
        .then((token) => {})
      })
    }
  }
});
