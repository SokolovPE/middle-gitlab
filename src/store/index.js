import Vue from 'vue';
import Vuex from 'vuex';
import gitlab from './modules/gitlab.module';
import auth from './modules/auth.module';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {},
    mutations: {},
    actions: {},
    modules: {
        gitlab,
        auth,
    },
});
