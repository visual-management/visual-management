<template>
  <div class="container">
    <div class="list">
      <div
        class="everything-is-ok"
        v-show="urls && urls.length === 0"
      >
        <img src="../assets/health/ok.svg" />
      </div>

      <div
        v-for="url in urls"
        :class="[ 'health', url.status ]"
        @click="goTo(url.url)"
      >
        <div class="title">{{ url.name }} </div>
        <img :class="url.status" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .container {
    position: relative;
    min-height: 100%;
    box-sizing: border-box;
  }

  .list {
    display: flex;
    box-sizing: border-box;
    overflow-x: hidden;
    position: absolute;
    height: 100%;
    width: 100%;
    padding: 8px 4px;

    .everything-is-ok {
      overflow: auto;
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 1;

      & > img {
        height: 6vw;
      }

    }

    .health {
      cursor: pointer;
      opacity: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin: 0 4px;
      padding: 8px;
      transition: opacity 1s;

      .title {
        width: 130px;
        margin-bottom: 15px;
        text-align: center;
      }

      img {
        height: 55px;

        &.ok { content: url('../assets/health/ok.svg'); }
        &.ko { content: url('../assets/health/ko.svg'); }

      }

      &.hidden {
        opacity: 0;
      }

      &.ok { background-color: #4CAF50; }
      &.ko { background-color: #F44336; }

    }

  }
</style>

<script>
  import Vue from 'vue';
  import VueResource from 'vue-resource';
  import AsyncComputed from 'vue-async-computed';

  Vue.use(VueResource);
  Vue.use(AsyncComputed);

  export default {

    props: {
      config: {
        urls           : [ {
          name: String,
          url : String
        } ],
        showWorkingUrls: Boolean,
        updateInterval : Number
      }
    },

    data () {
      return {
        forceUpdate: 0,
        pauseScroll: false
      }
    },

    asyncComputed: {

      urls: {
        get () {
          return this.update();
        },
        watch () {
          this.forceUpdate
        },
        defaults: []
      }

    },

    created () {
      setInterval(() => {
        // Value has changed, so it will re-fetch projects.
        this.forceUpdate++;
      }, this.config.updateInterval);
    },

    updated () {
      this.initAutoScroll();
    },

    methods: {

      goTo (url) {
        window.open(url)
      },

      async update () {
        const urls = [];

        for (const url of this.config.urls.slice(0)) {
          try {
            await this.$http.get(url.url);

            url.status = 'ok';
          } catch (err) {
            url.status = 'ko';
          }

          if (this.config.showWorkingUrls || (!this.config.showWorkingUrls && url.status !== 'ok')) {
            urls.push(url);
          }
        }

        return urls;
      },

      initAutoScroll () {
        this.$el.querySelector('.list').style.height = this.$el.clientHeight + 'px';

        this.$el.addEventListener('mouseenter', () => this.pauseScroll = true);
        this.$el.addEventListener('mouseleave', () => this.pauseScroll = false);

        window.requestAnimationFrame(() => this.autoScroll('right'));
      },

      autoScroll (direction) {
        const el = this.$el.querySelector('.list');
        const scrollDistancePerSecond = 10; // Scroll Xpx every second.
        const scrollDistancePerAnimationFrame = Math.ceil(scrollDistancePerSecond / 60); // Animate at 60 fps.

        if ((el.clientWidth + el.scrollLeft) === el.scrollWidth) {
          setTimeout(() => {
            window.requestAnimationFrame(() => this.autoScroll('left'));
          }, 1000);
        } else if (el.scrollLeft === 0) {
          setTimeout(() => {
            window.requestAnimationFrame(() => this.autoScroll('right'));
          }, 1000);
        } else {
          window.requestAnimationFrame(() => this.autoScroll(direction));
        }

        if (!this.pauseScroll) {
          switch (direction) {
            case 'left':
              el.scrollLeft -= scrollDistancePerAnimationFrame;
              break;

            case 'right':
              el.scrollLeft += scrollDistancePerAnimationFrame;
              break;
          }
        }

      }

    }

  }
</script>
