import iframe from './iframe.vue'

export default {
  id         : 'iframe',
  name       : 'iFrame',
  description: 'Show whatever url you want in an iFrame',
  components : [
    {
      name         : 'iframe',
      tag          : 'plugin-iframe',
      vue          : iframe,
      config       : {
        url: ''
      },
      defaultWidth : 2,
      defaultHeight: 2
    }
  ]
}
