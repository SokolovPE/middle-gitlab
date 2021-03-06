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
    getCurrentProject: (state) => state.currentProject,
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
    setProjects: ({ commit }, payload) => {
        commit('SET_PROJECTS', payload);
        commit('SET_CURRENT_PROJECT', payload[0]);
    },
};

export default {
    state,
    getters,
    mutations,
    actions,
    namespaced: true,
};
