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

### visible

`Array<'ERROR' | 'WARNING' | 'SUCCESSFUL' | 'DISABLED'>'`, defaults to `[ 'ERROR' | 'WARNING' ]`

Which builds we want to show up in the list.

### paginationInterval

`number` (in milliseconds), defaults to `5000`

Switch page at this time interval.

### updateInterval

`number` (in milliseconds), defaults to `60000`

Update jobs info at this time interval.
