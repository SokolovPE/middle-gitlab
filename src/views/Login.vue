<template>
    <div>
        <v-row>
            <v-col cols="4">
                Authorize:
                <v-text-field v-model="username" label="Username" />
                <v-text-field v-model="gitlabToken" label="GitLab Token" />
                <v-btn @click.prevent="performLogin">Login</v-btn>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
    data() {
        return {
            username: '',
            gitlabToken: '',
        };
    },
    methods: {
        ...mapActions('auth', ['login']),
        performLogin() {
            //TODO: Add field validation.
            this.login({
                username: this.username,
                gitlabToken: this.gitlabToken,
            }).then(() => {
                this.$router.push({ name: 'Home' });
            });
        },
    },
};
</script>

<style lang="scss" scoped></style>
