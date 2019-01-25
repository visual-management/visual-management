<template>
  <div class="container">
    <div class="list">
      <h4 v-if="todayEvents && todayEvents.length > 0">Aujourd'hui</h4>

      <div
        v-for="event in todayEvents"
        class="event"
        :class="event.agenda"
      >
        <span class="time" v-if="event.timeName">{{ event.timeName }}</span>
        <span class="title">{{ event.title }}</span>
        <span class="agenda">{{ event.agendaName }}</span>
      </div>

      <h4 class="inner-title" v-if="tomorrowEvents && tomorrowEvents.length > 0">Demain</h4>

      <div
        v-for="event in tomorrowEvents"
        class="event"
        :class="event.agenda"
      >
        <span class="time" v-if="event.timeName">{{ event.timeName }}</span>
        <span class="title">{{ event.title }}</span>
        <span class="agenda">{{ event.agendaName }}</span>
      </div>

      <h4 class="inner-title" v-if="importantEvents && importantEvents.length > 0">Importants à venir</h4>

      <div
        v-for="event in importantEvents"
        class="event"
        :class="event.agenda"
      >
        <span class="time" v-if="event.timeName">{{ event.timeName }}</span>
        <span class="title">{{ event.title }}</span>
        <span class="agenda">{{ event.agendaName }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .container {
    position: relative;
    min-height: 100%;
    box-sizing: border-box;
  }

  .container .list {
    box-sizing: border-box;
    overflow-y: hidden;
    position: absolute;
    width: 100%;
    padding: 12px;
  }

  .container h4 {
    margin: 0 0 12px;
    font-weight: 700;
    font-size: 14px;
  }

  .container .inner-title {
    margin-top: 12px;
  }

  .event {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    margin: 0 0 8px;
    padding: 0 10px;
    border-radius: 2px;
  }

  .event span {
    color: #333333;
  }

  .event .time {
    padding-right: 8px;
  }

  .event .title {
    flex: 1;
    font-weight: 700;
    font-size: 18px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-right: 8px;
  }

  .event .agenda {
    text-transform: uppercase;
    font-size: 13px;
  }

  .event.holidays { background-color: #D67F74; }
  .event.releases { background-color: #489588; }
  .event.homeworks { background-color: #DFC238; }
  .event.training { background-color: #7C8BCD; }
  .event.demonstration { background-color: #DC6E04; }
  .event.absence { background-color: #9D2158; }
  .event.shifting { background-color: #966FB2; }
</style>

<script>
  import Vue from 'vue';
  import VueResource from 'vue-resource';
  import AsyncComputed from 'vue-async-computed';
  import * as moment from 'moment';

  Vue.use(VueResource);
  Vue.use(AsyncComputed);

  export default {

    props: {
      config: {
        host               : String,
        importantAgendas   : Array,
        importantEventsDays: Number,
        updateInterval     : Number
      }
    },

    data () {
      return {
        forceUpdate    : 0,
        pauseScroll    : false,
        AGENDA: {
          holidays: 'Congé',
          releases: 'Livraison',
          homeworks: 'Télétravail',
          training: 'Formation',
          demonstration: 'Démonstration',
          absence: 'Absence',
          shifting: 'Déplacement'
        }
      }
    },

    computed: {

      host () {
        return (this.config.host.endsWith('/')) ? this.config.host.substring(0, this.config.host.length - 1) : this.config.host;
      },

      url () {
        return `${this.host}/api/event`;
      }

    },

    created () {
      moment.locale('fr');

      setInterval(() => {

        // Value has changed, so it will re-fetch events.
        this.forceUpdate++;

      }, this.config.updateInterval);
    },

    mounted () {
      setTimeout(() => {
        this.initAutoScroll();
      });
    },

    asyncComputed: {

      todayEvents: {
        get () {
          return this.update('today');
        },
        watch () {
          this.forceUpdate
        },
        defaults: []
      },

      tomorrowEvents: {
        get () {
          return this.update('tomorrow');
        },
        watch () {
          this.forceUpdate
        },
        defaults: []
      },

      importantEvents: {
        get () {
          return this.update('important');
        },
        watch () {
          this.forceUpdate
        },
        defaults: []
      }

    },

    methods: {

      async update (type) {
        const http$ = await this.$http.get(this.getUrlFromType(type));
        let events = http$.body;

        // Filter important events
        if (type === 'important') {
          events = events.filter((event) => this.config.importantAgendas.includes(event.agenda));
        }

        events = events.map((event) => {
          event.agendaName = this.AGENDA[event.agenda];
          event.timeName = this.getTimeName(type, event);

          return event;
        });

        return events;
      },

      todayUrl () {
        return `${this.url}/start-date/${moment().format('YYYY-MM-DD')}`;
      },

      tomorrowUrl () {
        return `${this.url}/start-date/${moment().add(1, 'day').format('YYYY-MM-DD')}`;
      },

      importantUrl () {
        return `${this.url}/between/${moment().add(2, 'days').format('YYYY-MM-DD')}/${moment().add(this.config.importantEventsDays + 2, 'days').format('YYYY-MM-DD')}?dup=true`;
      },

      getUrlFromType (type) {
        switch (type) {
          case 'today':
            return this.todayUrl();

          case 'tomorrow':
            return this.tomorrowUrl();

          case 'important':
            return this.importantUrl();
        }
      },

      getNextRecurrenceDates (event) {

        // Next day of week
        let date;
        if (moment().isoWeekday() <= event.dow[0]) {
          date = moment().isoWeekday(event.dow[0]);
        } else {
          date = moment().add(1, 'weeks').isoWeekday(event.dow[0]);
        }

        const startDate = date.clone().hours(0).minutes(0).seconds(0);
        const endDate = date.clone().hours(0).minutes(0).seconds(0);

        if (event.start) {
          const startDateSplit = event.start.split(':');

          startDate.hours(startDateSplit[0]).minutes(startDateSplit[1]);
        }

        if (event.end) {
          const endDateSplit = event.end.split(':');

          endDate.hours(endDateSplit[0]).minutes(endDateSplit[1]);
        }

        return [
          startDate,
          endDate
        ];
      },

      getTimeName (type, event) {
        let startDate, endDate;
        if (event.recurrence) {
          [ startDate, endDate ] = this.getNextRecurrenceDates(event);
        } else if (!event.end) {
          startDate = endDate = moment(event.start);
        } else {
          startDate = moment(event.start);
          endDate = moment(event.end);
        }

        let str = '';
        switch (type) {
          case 'important':
            str += startDate.format('dddd');

            if (!event.allDay) {
              str += ` ${startDate.format('HH:mm')}`;

              if (event.end) {
                str += ` - ${endDate.format('HH:mm')}`;
              }

            }
            break;

          default:
            if (!event.allDay) {
              str += ` ${startDate.format('HH:mm')}`;

              if (event.end) {
                str += ` - ${endDate.format('HH:mm')}`;
              }

            }
        }

        return str;
      },

      initAutoScroll () {
        this.$el.querySelector('.list').style.height = this.$el.clientHeight + 'px';

        this.$el.addEventListener('mouseenter', () => this.pauseScroll = true);
        this.$el.addEventListener('mouseleave', () => this.pauseScroll = false);

        window.requestAnimationFrame(() => this.autoScroll('down'));
      },

      autoScroll (direction) {
        const el = this.$el.querySelector('.list');
        const scrollDistancePerSecond = 10; // Scroll Xpx every second.
        const scrollDistancePerAnimationFrame = Math.ceil(scrollDistancePerSecond / 60); // Animate at 60 fps.

        if ((el.clientHeight + el.scrollTop) === el.scrollHeight) {
          setTimeout(() => {
            window.requestAnimationFrame(() => this.autoScroll('up'));
          }, 1000);
        } else if (el.scrollTop === 0) {
          setTimeout(() => {
            window.requestAnimationFrame(() => this.autoScroll('down'));
          }, 1000);
        } else {
          window.requestAnimationFrame(() => this.autoScroll(direction));
        }

        if (!this.pauseScroll) {
          switch (direction) {
            case 'up':
              el.scrollTop -= scrollDistancePerAnimationFrame;
              break;

            case 'down':
              el.scrollTop += scrollDistancePerAnimationFrame;
              break;
          }
        }

      }

    }

  }
</script>
