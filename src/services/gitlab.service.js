var GITLAB_URL = '';
var USER_NAME = '';
var GITLAB_TOKEN = '';

class GitlabService {
    constructor(url, userName, token) {
        GITLAB_URL = url;
        USER_NAME = userName;
        GITLAB_TOKEN = token;
    }

    async fetchProjects() {
        let response = await fetch(
            `${GITLAB_URL}/api/v4/users/${USER_NAME}/projects`,
            {
                method: 'GET',
                headers: {
                    'PRIVATE-TOKEN': GITLAB_TOKEN,
                },
            }
        );
        return await response.json();
    }

    async fetchBranches(gitlabApi) {
        let response = await fetch(`${gitlabApi}/repository/branches`, {
            method: 'GET',
            headers: {
                'PRIVATE-TOKEN': GITLAB_TOKEN,
            },
        });
        return await response.json();
    }

    async createRequests(gitlabApi, mergeRequest) {
        let milestone = await this.getLatestMilestone(gitlabApi);
        console.log('start');
        if (milestone === undefined) {
            console.log('no milestone?');
            return;
        }
        mergeRequest.targetBranches.forEach((targetBranch) => {
            let body = {
                id: mergeRequest.id,
                source_branch: mergeRequest.sourceBranch,
                target_branch: targetBranch,
                title: mergeRequest.title,
                labels: mergeRequest.labels.toLowerCase(),
                milestone_id: milestone.id,
                description: mergeRequest.description,
            };
            this.createRequest(gitlabApi, body);
        });
    }

    async createRequest(gitlabApi, body) {
        let response = await fetch(`${gitlabApi}/merge_requests`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'PRIVATE-TOKEN': GITLAB_TOKEN,
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
    }

    async getLatestMilestone(gitlabApi) {
        let response = await fetch(`${gitlabApi}/milestones?state=active`, {
            method: 'GET',
            headers: {
                'PRIVATE-TOKEN': GITLAB_TOKEN,
            },
        });
        let milestones = await response.json();
        console.log(milestones);
        if (milestones != null || milestones !== undefined) {
            return milestones[0];
        }
        return null;
    }
}

export { GitlabService };
