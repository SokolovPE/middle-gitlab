const state = {
    baseUrl: 'https://gitlab.com',
    projects: [],
    currentProject: {},
};

const getters = {
    getBaseUrl: (state) => state.baseUrl,
    getProjectApiUrl: (state) =>
        `${state.baseUrl}/api/v4/projects/${state.currentProject.id}`,
    getProjects: (state) => state.projects,
};

const mutations = {
    SET_PROJECTS(state, payload) {
        state.projects = payload;
    },
    SET_CURRENT_PROJECT(state, payload) {
        state.currentProject = payload;
    },
};

const actions = {
    updateProjects: ({ commit }, payload) => {
        commit('SET_PROJECTS', payload);
    },
    selectProject: ({ commit }, payload) => {
        commit('SET_CURRENT_PROJECT', payload);
    },
};

export default {
    state,
    getters,
    mutations,
    actions,
    namespaced: true,
};
