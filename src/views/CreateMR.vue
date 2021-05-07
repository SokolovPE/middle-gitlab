<template>
    <div>
        <v-row>
            <v-col cols="4">
                <h2>Create new Merge Request</h2>
                <v-select
                    v-model="selectedMergeType"
                    :items="mergeTypes"
                    item-text="title"
                    item-value="branches"
                    label="Merge type"
                    return-object
                >
                </v-select>
                <v-select
                    v-model="currentProject"
                    :items="projects"
                    item-text="name"
                    item-value="id"
                    label="Project"
                    return-object
                >
                </v-select>
                <v-select
                    v-model="mergeRequest.sourceBranch"
                    :items="branches"
                    item-text="name"
                    item-value="name"
                    label="Source Branch"
                >
                </v-select>
                <v-text-field
                    v-model="mergeRequest.title"
                    label="Merge title"
                />
                <v-text-field
                    v-model="mergeRequest.description"
                    label="Merge message"
                />
                <v-btn @click.prevent="createRequests"
                    >Create Request{{
                        selectedMergeType.title == 'Hotfix' ? 's' : ''
                    }}</v-btn
                >
            </v-col>
        </v-row>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { GitlabService } from '../services/gitlab.service';
export default {
    name: 'CreateMR',
    data() {
        return {
            gitlabService: {},
            projects: [],
            branches: [],
            selectedMergeType: {},
            mergeTypes: [
                { title: 'Feature', branches: ['develop'] },
                { title: 'Hotfix', branches: ['develop', 'master'] },
            ],
            mergeRequest: {
                id: '',
                sourceBranch: '',
                targetBranches: [],
                title: '',
                squash: true,
                labels: '',
                description: '',
            },
        };
    },
    computed: {
        ...mapGetters('auth', ['getUsername', 'getGitlabToken']),
        ...mapGetters('gitlab', [
            'getBaseUrl',
            'getProjectApiUrl',
            'getProjects',
            'getCurrentProject',
        ]),
        currentProject: {
            get() {
                return this.getCurrentProject;
            },
            set(value) {
                this.selectProject(value);
                this.gitlabService
                    .fetchBranches(this.getProjectApiUrl)
                    .then((data) => {
                        this.branches = data;
                        this.mergeRequest.sourceBranch = data[0];
                    });
            },
        },
    },
    methods: {
        ...mapActions('gitlab', ['selectProject', 'setProjects']),
        createRequests() {
            this.gitlabService.createRequests(
                this.getProjectApiUrl,
                this.mergeRequest
            );
        },
    },
    watch: {
        selectedMergeType(newValue) {
            this.mergeRequest.targetBranches = newValue.branches;
            this.mergeRequest.labels = newValue.title;
        },
    },
    mounted() {
        this.gitlabService = new GitlabService(
            this.getBaseUrl,
            this.getUsername,
            this.getGitlabToken
        );
        // Re-fetch projects
        this.gitlabService.fetchProjects().then((data) => {
            this.setProjects(data);
            this.currentProject = this.getCurrentProject;
            this.projects = data;
        });
        this.selectedMergeType = this.mergeTypes[0];
    },
};
</script>

<style lang="scss" scoped></style>
