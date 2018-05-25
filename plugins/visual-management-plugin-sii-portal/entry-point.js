import Planning from './planning/planning.vue'

export default {
  id         : 'sii-portal',
  name       : 'SII Portal',
  description: 'A set of components for the SII Portal (calendar, application urls, ...)',
  components : [
    {
      name         : 'Planning',
      tag          : 'planning',
      vue          : Planning,
      config       : {
        host               : '',
        importantAgendas   : [],
        importantEventsDays: 5,
        updateInterval     : 36000000 // 10 hours
      },
      defaultWidth : 2,
      defaultHeight: 2
    }
  ]
}
