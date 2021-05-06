<template>
    <v-app>
        <v-app-bar app color="primary" dark>
            <div class="d-flex align-center">
                <v-img
                    alt="Vuetify Logo"
                    class="shrink mr-2"
                    contain
                    src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
                    transition="scale-transition"
                    width="40"
                />

                <v-img
                    alt="Vuetify Name"
                    class="shrink mt-1 hidden-sm-and-down"
                    contain
                    min-width="100"
                    src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
                    width="100"
                />
            </div>

            <v-spacer></v-spacer>
            <div class="user-info mr-2" v-if="isUserLogged">
                <span>{{ getUsername }}</span>
            </div>
            <v-btn @click.prevent="performLogout" text v-if="isUserLogged">
                <span class="mr-2">Logout</span>
                <v-icon>mdi-open-in-new</v-icon>
            </v-btn>
            <v-btn to="/login" text v-else>
                <span class="mr-2">Login</span>
                <v-icon>mdi-open-in-new</v-icon>
            </v-btn>
        </v-app-bar>

        <v-main>
            <router-view />
        </v-main>
    </v-app>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
export default {
    name: 'App',
    computed: {
        ...mapGetters('auth', ['getUsername', 'isUserLogged']),
    },
    methods: {
        ...mapActions('auth', ['logout']),
        performLogout() {
            this.logout();
        },
    },
};
</script>
