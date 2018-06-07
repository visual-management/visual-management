# Server - Health

<p align="center">
  <img alt="Server - Health" src="/plugins/visual-management-plugin-server/assets/health.png" />
</p>

<p align="center">Show the servers health.</p>

---

## Configuration

### urls

`Array<{url: string, name: string}>`

#### urls.url

`string`

URL to watch.

#### urls.name

`string`

Name of the URL to be displayed.

### showWorkingUrls

`boolean`, defaults to `false`

If you should show (or not) the working URLs.

### updateInterval

`number` (in milliseconds), defaults to `60000` (1 minute)

Update component info at this time interval.
