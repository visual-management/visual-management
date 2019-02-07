# GitLab - Pipelines list

<p align="center">
  <img alt="GitLab - Pipelines list" src="/plugins/visual-management-plugin-gitlab/assets/pipelines-list.png" />
</p>

<p align="center">Show a list of pipelines for the configured projects list.</p>

---

## Configuration

### host

`string`

GitLab host.

### accessToken

`string`

GitLab [personal access token](https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html).

### projects

`Array<{id: string, name: string, refs: string[]}>`

#### projects.id

`number`

GitLab project ID.

#### projects.name

`string`

The name to be shown.

#### projects.refs

`string`

The name to be shown.

### paginationInterval

`number` (in milliseconds), defaults to `5000`

Switch page at this time interval.

### updateInterval

`number` (in milliseconds), defaults to `60000`

Update jobs info at this time interval.
