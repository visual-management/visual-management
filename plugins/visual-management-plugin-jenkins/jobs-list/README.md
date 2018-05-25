# Jenkins - Jobs list

<p align="center">
  <img alt="Jenkins - Jobs list" src="/plugins/visual-management-plugin-jenkins/assets/jobs-list.png" />
</p>

<p align="center">Show a jobs list and there current state.</p>

---

## Configuration

### host

`string`

Jenkins host.

### username

`string`

Jenkins username. We can use it when an authentication to the API is needed.

### apiToken

`string`

Jenkins token for the API. We can use it when an authentication to the API is needed.

### jobs
        
`Object{id: string, name: string}`

Jobs information.

### showSuccessful

`boolean`, defaults to `false`

Whether to show successful builds or not.

### paginationInterval

`number` (in milliseconds), defaults to `5000`

Switch page at this time interval.

### updateInterval

`number` (in milliseconds), defaults to `60000`

Update jobs info at this time interval.
