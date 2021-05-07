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
import { mapActions, mapGetters } from 'vuex';
import { GitlabService } from '../services/gitlab.service';
export default {
    data() {
        return {
            username: '',
            gitlabToken: '',
        };
    },
    computed: {
        ...mapGetters('auth', ['getUsername', 'getGitlabToken']),
        ...mapGetters('gitlab', ['getBaseUrl', 'getProjectApiUrl']),
    },
    methods: {
        ...mapActions('auth', ['login']),
        ...mapActions('gitlab', ['setProjects']),
        performLogin() {
            //TODO: Add field validation.
            this.login({
                username: this.username,
                gitlabToken: this.gitlabToken,
            });
            new GitlabService(
                this.getBaseUrl,
                this.getUsername,
                this.getGitlabToken
            )
                .fetchProjects()
                .then((data) => {
                    this.setProjects(data);
                });
            this.$router.push({ name: 'Home' });
        },
    },
};
</script>

<style lang="scss" scoped></style>
