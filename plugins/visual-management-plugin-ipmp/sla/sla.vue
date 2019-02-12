<template>
  <div class="container">
    <div class="list">
      <div class="ticket" :class="[ ticket.remainingTimeArea ]" v-for="ticket in tickets">
        <span class="id">#{{ ticket.id }} - </span>
        <span class="name">{{ ticket.name }}</span>
        <span class="time-left">{{ ticket.timeLeft }}h</span>
      </div>

      <div class="everything-is-ok" v-if="tickets && tickets.length === 0">
        <img src="../assets/sunny.svg" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .container {
    position: relative;
    min-height: 100%;
    box-sizing: border-box;

    .list {
      box-sizing: border-box;
      overflow-y: hidden;
      position: absolute;
      width: 100%;
      padding: 12px;

      .everything-is-ok {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
      }

    }

  }

  .ticket {
    box-sizing: border-box;
    display: flex;
    width: 100%;
    margin: 0 0 8px;
    padding: 16px 12px;
    border-radius: 2px;
    font-weight: 700;

    .id {
      margin-right: 8px;
    }

    .name {
      flex: 1;
    }

    .time-left {
      margin-left: 8px;
    }

    &.greater-than-80 { background-color: #8CC04F; color: #333333; }
    &.between-25-and-80 { background-color: #F6B44B; color: #333333; }
    &.lower-than-25 { background-color: #D54C53; color: #333333; }

    &:last-child {
      margin-bottom: 0;
    }

  }
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
        host          : String,
        username      : String,
        password      : String,
        projects      : Array,
        updateInterval: Number
      }
    },

    data () {
      return {
        forceUpdate   : 0,
        STATUS        : {
          RECORDED   : 'recorded',
          QUALIFIED  : 'qualified',
          ACCEPTED   : 'accepted',
          RE_OPENED  : 're-opened',
          IN_PROGRESS: 'in progress',
          DONE       : 'done',
          VERIFIED   : 'verified',
          DELIVERED  : 'delivered',
          VALIDATED  : 'validated',
          CLOSED     : 'closed',
          CANCELLED  : 'cancelled',
          PENDING    : 'pending'
        }
      }
    },

    computed: {

      host () {
        return (this.config.host.endsWith('/')) ? this.config.host.substring(0, this.config.host.length - 1) : this.config.host;
      },

      url () {
        return `${this.host}/api/ticket/all`;
      },

      httpOptions () {
        if (this.config.username === undefined || this.config.username === undefined || this.config.username === '') {
          return {};
        }

        return {
          headers: {
            'Authorization': `Basic ${btoa(this.config.username + ':' + this.config.password)}`
          }
        };
      }

    },

    created () {
      moment.locale('fr');

      setInterval(() => {
        // Value has changed, so it will re-fetch projects.
        this.forceUpdate++;
      }, this.config.updateInterval);
    },

    mounted () {
      setTimeout(() => {
        this.initAutoScroll();
      });
    },

    asyncComputed: {

      tickets: {
        get () {
          return this.update();
        },
        watch () {
          this.forceUpdate
        },
        defaults: []
      }

    },

    methods: {

      async update () {
        const http$ = await this.$http.get(this.url, this.httpOptions);
        const rawTickets = http$.body.items;
        let tickets = [];

        for (const ticket of this.getTicketsForConfiguredProjects(rawTickets)) {
          const projectConfiguration = this.getConfigurationForProject(parseInt(ticket.idProject, 10));
          const elapsedHours = this.getElapsedHours(ticket.creationDateTime);

          // The ticket must go into an `accepted` state before an elapsed time of X hours based on the `creationDateTime`.
          if (this.isNotAccepted(ticket)) {
            const timeLeftInHours = Math.ceil(projectConfiguration.hoursBeforeAccepted - elapsedHours);

            tickets.push({
              id               : ticket.id,
              name             : ticket.name,
              timeLeft         : timeLeftInHours,
              remainingTimeArea: this.getRemainingTimeArea(timeLeftInHours, projectConfiguration.hoursBeforeAccepted)
            });
          }
        }

        return tickets;
      },

      getTicketsForConfiguredProjects (tickets) {
        return tickets.filter((ticket) => this.getProjectsId().includes(parseInt(ticket.idProject, 10)));
      },

      getProjectsId () {
        return this.config.projects.map((project) => project.id);
      },

      getConfigurationForProject (projectId) {
        return this.config.projects.find((project) => project.id === projectId);
      },

      isNotAccepted (ticket) {
        return ticket.nameStatus === this.STATUS.RECORDED;
      },

      getElapsedHours (creationDateTime) {
        const momentCreationDateTime = moment(creationDateTime, 'YYYY-MM-DD HH:mm:ss');
        const diffInMilliseconds = moment.duration(moment().diff(momentCreationDateTime));

        return diffInMilliseconds.asHours();
      },

      getRemainingTimeArea (timeLeftInHours, projectHoursBeforeAccepted) {
        const percentage = (timeLeftInHours / projectHoursBeforeAccepted) * 100;

        if (percentage >= 80) {
          return 'greater-than-80';
        } else if (percentage >= 25 && percentage < 80) {
          return 'between-25-and-80';
        } else {
          return 'lower-than-25';
        }
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
