import PipelinesList from './pipelines-list/pipelines-list.vue'

export default {
  id         : 'gitlab',
  name       : 'GitLab',
  description: 'A set of components for GitLab',
  components : [
    {
      name         : 'Pipelines list',
      tag          : 'pipelines-list',
      vue          : PipelinesList,
      config       : {
        host              : '',
        accessToken       : '',
        projects          : [
          {
            id  : '',
            name: '',
            refs: []
          }
        ],
        paginationInterval: 5000,
        updateInterval    : 60000
      },
      defaultWidth : 4,
      defaultHeight: 2
    }
  ]
}
