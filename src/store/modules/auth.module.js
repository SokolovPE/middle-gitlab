const user = JSON.parse(localStorage.getItem('user'));
const state = {
    user: user ? user : { username: '', gitlabToken: '' },
};

const getters = {
    getGitlabToken: (state) => state.user.gitlabToken,
    getUsername: (state) => state.user.username,
    isUserLogged: (state) => (state.user ? true : false),
};

const mutations = {
    SET_USER(state, payload) {
        state.user = payload;
    },
};

const actions = {
    login: ({ commit }, payload) => {
        commit('SET_USER', payload);
        localStorage.setItem('user', JSON.stringify(payload));
    },
    logout: ({ commit }) => {
        commit('SET_USER', null);
        localStorage.removeItem('user');
    }
};

export default {
    state,
    getters,
    mutations,
    actions,
    namespaced: true,
};
