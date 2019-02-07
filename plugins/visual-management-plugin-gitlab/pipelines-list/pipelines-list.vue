<template>
  <div class="projects">
    <div class="everything-is-ok" :hidden="projects.length > 0">
      <h1 class="title">GitLab ({{ config.projects.length }} projects)</h1>

      <img src="../assets/sunny.svg"/>
    </div>

    <a
      class="project"
      target="_blank"
      :href="project.url"
      :class="[ project.status , { hidden: hidden } ]"
      v-for="project in projects"
    >
      <img :src="project.avatarUrl" class="avatar" alt="Avatar"/>

      <h4>{{ project.name }}</h4>

      <div class="ref">
        <img src="../assets/code-branch.svg"/>
        {{ project.ref }}
      </div>

      <div class="stages">
        <div
          class="stage"
          :class="stage.status"
          :title="stage.name"
          v-for="stage in project.stages"
        >
          <img src="../assets/success.svg" :alt="stage.status" v-if="stage.status === 'success'"/>
          <img src="../assets/running.svg" :alt="stage.status" v-if="stage.status === 'running'"/>
          <img src="../assets/created.svg" :alt="stage.status" v-if="stage.status === 'created'"/>
          <img src="../assets/canceled.svg" :alt="stage.status" v-if="stage.status === 'canceled'"/>
          <img src="../assets/skipped.svg" :alt="stage.status" v-if="stage.status === 'skipped'"/>
          <img src="../assets/failed.svg" :alt="stage.status" v-if="stage.status === 'failed'"/>
        </div>
      </div>
    </a>
  </div>
</template>

<style lang="scss" scoped>
  $success-color: #8CC04F;
  $running-color: #1F78D1;
  $canceled-color: #A3A2A2;
  $skipped-color: #A3A2A2;
  $created-color: #A3A2A2;
  $failed-color: #D54C53;

  ::-webkit-scrollbar {
    display: none;
  }

  [hidden] {
    display: none !important;
  }

  .everything-is-ok {
    overflow: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;

    .title {
      margin: 0;
      text-transform: none;
      text-align: right;
    }

    img {
      flex: 1;
    }

  }

  .projects {
    overflow: auto;
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 8px;
    box-sizing: border-box;

    .project {
      opacity: 1;
      display: flex;
      align-items: center;
      flex-shrink: 0;
      height: 50px;
      margin: 0 0 8px;
      padding: 8px 10px;
      border-radius: 2px;
      text-decoration: none;
      transition: opacity 1s;
      color: #333333;

      .avatar {
        height: 35px;
        margin-right: 12px;
        border-radius: 50%;
      }

      h4 {
        margin: 0;
      }

      .ref {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;

        img {
          height: 18px;
          margin-right: 6px;
        }

      }

      .stages {
        flex: 1;
        display: flex;
        justify-content: flex-end;

        .stage {
          $separator-size: 7px;

          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          margin-right: $separator-size;
          border-radius: 50%;

          img {
            width: 16px;
            height: 16px;
          }

          &.success { background-color: darken($success-color, 15%); }
          &.running { background-color: darken($running-color, 15%); }
          &.canceled { background-color: darken($canceled-color, 15%); }
          &.skipped { background-color: darken($skipped-color, 15%); }
          &.created { background-color: darken($created-color, 15%); }
          &.failed { background-color: darken($failed-color, 15%); }

          &:not(:last-child):after {
            position: absolute;
            right: -$separator-size;
            content: '';
            width: $separator-size;
            height: 2px;
            background-color: #E5E5E5;
          }

        }

      }

      &.hidden {
        opacity: 0;
      }

      &.success { background-color: $success-color; }
      &.running { background-color: $running-color; }
      &.canceled { background-color: $canceled-color; }
      &.failed { background-color: $failed-color; }

      &:last-child {
        margin: 0;
      }

    }

  }
</style>

<script>
  import Vue from 'vue';
  import VueResource from 'vue-resource';

  Vue.use(VueResource);

  export default {

    props: {
      config: {
        host              : String,
        accessToken       : String,
        projects          : [ {
          id  : String,
          name: String,
          ref : Array
        } ],
        visible           : Array,
        paginationInterval: Number,
        updateInterval    : Number
      }
    },

    data() {
      return {
        page                 : 0,
        pages                : 0,
        hidden               : false,
        allProjects          : [],
        projects             : [],
        paginationIntervalRef: null
      }
    },

    computed: {
      host() {
        return (this.config.host.endsWith('/')) ? this.config.host.substring(0, this.config.host.length - 1) : this.config.host;
      },

      apiUrl() {
        return `${this.host}/api/v4`;
      },

      httpOptions() {
        if (!this.config.accessToken) {
          return {};
        }

        return {
          headers: {
            'Private-Token': this.config.accessToken
          }
        };
      }
    },

    mounted() {
      this.update();
      setInterval(this.update, this.config.updateInterval);
    },

    methods: {

      async update() {
        this.allProjects = [];

        for (const project of this.config.projects) {
          const pipelinesRes = (await this.$http.get(this.fetchPipelines(project.id), this.httpOptions)).body;

          const projectRefs = project.refs.slice(0);
          for (let pipeline of pipelinesRes) {
            if (projectRefs.includes(pipeline.ref)) {
              const jobs = (await this.$http.get(this.fetchJobs(project.id, pipeline.id), this.httpOptions)).body;

              this.allProjects.push({
                status   : pipeline.status,
                url      : pipeline.web_url,
                avatarUrl: jobs[ 0 ].user.avatar_url,
                name     : project.name,
                ref      : pipeline.ref,
                stages   : this.getStages(jobs)
              });

              projectRefs.splice(projectRefs.indexOf(pipeline.ref), 1);
            }
          }
        }

        this.projects = this.allProjects;

        // // Calculate the number of pages
        // // Check if the number of pages has changed since the last update
        const newPages = (this.allProjects.length === 0) ? 0 : Math.ceil(this.allProjects.length / this.howMuchJobsPerPage()) - 1;
        const pagesChanged = this.pages !== newPages;
        this.pages = newPages;

        // Paginate jobs
        this.autoPagination(pagesChanged);
      },

      fetchPipelines(projectId) {
        return `${this.apiUrl}/projects/${projectId}/pipelines`;
      },

      fetchJobs(projectId, pipelineId) {
        return `${this.apiUrl}/projects/${projectId}/pipelines/${pipelineId}/jobs`;
      },

      getStages(jobs) {
        return jobs.reduce((stages, job) => {
          const stageIndex = stages.findIndex((stage) => stage.name === job.stage);

          if (stageIndex !== -1) {
            stages[ stageIndex ].status = this.getStageStatus(stages[ stageIndex ], job.status);
          } else {
            stages.push({
              status: job.status,
              name  : job.stage
            });
          }

          return stages;
        }, []);
      },

      // Add an importance to a job status.
      // failed > canceled > skipped > success > manual
      getStageStatus(stage, newStatus) {
        const importance = [ 'failed', 'canceled', 'skipped', 'success', 'manual' ];
        const newStatusImportance = importance[ newStatus ];
        const currentStatusImportance = importance[ stage.status ];

        return (currentStatusImportance > newStatusImportance) ? newStatus : stage.status;
      },

      howMuchJobsPerPage() {
        // 50: project height
        return Math.floor(this.$el.offsetHeight / 50);
      },

      autoPagination(pagesChanged) {

        // Do a manual pagination in case there is only 1 page
        if (this.pages === 0) {
          this.paginate();
        }

        if (pagesChanged && this.paginationIntervalRef !== null) {
          clearInterval(this.paginationIntervalRef);
        }

        // Interval only if their is more than 1 page, otherwise the same page will fadeOut/In every 5 seconds (or so), kind of boring
        if (pagesChanged && this.pages > 0) {
          this.paginationIntervalRef = setInterval(this.paginate, this.config.paginationInterval);
        }
      },

      paginate() {
        this.fadeOut(() => {
          this.projects = [];

          const projectsPerPage = this.howMuchJobsPerPage();

          this.projects = this.allProjects.slice(this.page * projectsPerPage, (this.page * projectsPerPage) + projectsPerPage);

          this.page++;
          if (this.page > this.pages) {
            this.page = 0;
          }

          setTimeout(this.fadeIn, 50);
        });
      },

      fadeOut(cb) {
        this.hidden = true;

        setTimeout(() => {
          if (cb) {
            cb();
          }
        }, 1100);
      },

      fadeIn(cb) {
        this.hidden = false;

        setTimeout(() => {
          if (cb) {
            cb();
          }
        }, 1000);
      }

    }

  }
</script>
