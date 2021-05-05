<template>
    <div>
        <v-row>
            <v-col cols="4">
                Authorize:
                <v-text-field v-model="user" label="User" />
                <v-text-field v-model="token" label="Token" />
                <v-btn @click.prevent="performLogin">Login</v-btn>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="4">
                Create Merge:
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
                    v-model="selectedProject"
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
export default {
    data() {
        return {
            baseUrl: 'https://gitlab.com',
            token: '',
            user: 'sokolovpe',
            projectPath: 'sokolovpe%2Fgitlab-new',
            projectUrl: '',
            projects: [],
            selectedProject: {},
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
            },
        };
    },
    methods: {
        async performLogin() {
            await this.fetchProjects().then(() => {
                this.selectedProject = this.projects[0];
            });
        },
        async fetchProjects() {
            let response = await fetch(
                `${this.baseUrl}/api/v4/users/${this.user}/projects`,
                {
                    method: 'GET',
                    headers: {
                        'PRIVATE-TOKEN': this.token,
                    },
                }
            );
            this.projects = await response.json();
        },
        async fetchBranches() {
            let response = await fetch(
                `${this.projectUrl}/repository/branches`,
                {
                    method: 'GET',
                    headers: { 'PRIVATE-TOKEN': this.token },
                }
            );
            this.branches = await response.json();
        },
        async createRequests() {
            let milestone = await this.getLatestMilestone();
            if (milestone === undefined) {
                console.log('no milestone?');
                return;
            }
            this.mergeRequest.targetBranches.forEach((targetBranch) => {
                let body = {
                    id: this.mergeRequest.id,
                    source_branch: this.mergeRequest.sourceBranch,
                    target_branch: targetBranch,
                    title: this.mergeRequest.title,
                    labels: this.mergeRequest.labels.toLowerCase(),
                    milestone_id: milestone.id,
                };
                this.createRequest(body);
            });
        },
        async createRequest(body) {
            let response = await fetch(`${this.projectUrl}/merge_requests`, {
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    'PRIVATE-TOKEN': this.token,
                    'Content-Type': 'application/json',
                },
            });
            if (response.status !== 201) {
                console.log(
                    `There's an error during creation of MR: ${await response.json()
                        .error}}`
                );
            } else {
                console.log(
                    `Successfully created request from ${body.source_branch} to ${body.target_branch}`
                );
            }
        },
        async getLatestMilestone() {
            let response = await fetch(
                `${this.projectUrl}/milestones?state=active`,
                {
                    method: 'GET',
                    headers: {
                        'PRIVATE-TOKEN': this.token,
                    },
                }
            );
            let milestones = await response.json();
            if (milestones != null || milestones !== undefined) {
                return milestones[0];
            }
            return null;
        },
    },
    watch: {
        selectedMergeType(newValue) {
            this.mergeRequest.targetBranches = newValue.branches;
            this.mergeRequest.labels = newValue.title;
        },
        selectedProject(newValue) {
            this.projectUrl = `${this.baseUrl}/api/v4/projects/${newValue.id}`;
            this.fetchBranches().then(() => {
                this.mergeRequest.sourceBranch = this.branches[0].name;
            });
        },
    },
    mounted() {
        this.mergeRequest.id = this.projectPath;
        this.selectedMergeType = this.mergeTypes[0];
    },
};
</script>

<style lang="scss" scoped></style>
