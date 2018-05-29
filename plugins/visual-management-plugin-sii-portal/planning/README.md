# SII Portal - Planning

<p align="center">
  <img alt="SII Portal - Planning" src="/plugins/visual-management-plugin-sii-portal/assets/planning.png" />
</p>

<p align="center">Show a planning of upcoming events: <strong>today</strong>, <strong>tomorrow</strong> & <strong>most important upcoming events</strong>.</p>

---

## Configuration

### host

`string`

SII portal host.

### importantAgendas

`Array<string>`

List of agendas you want to mark as **important**. They will appear in the important upcoming events for the next `importantEventsDays` days.

### importantEventsDays

`number`, defaults to `5`

The number of days from which to retrieve the important events The number of days from which to retrieve the important events (starts the day after "Tomorrow").

### updateInterval

`number` (in milliseconds), defaults to `3600000` (1 hours)

Update component info at this time interval.
