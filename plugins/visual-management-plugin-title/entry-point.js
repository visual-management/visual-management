import Title from './title.vue'

export default {
  id         : 'title',
  name       : 'Title',
  description: `Show a title`,
  components : [
    {
      name         : 'Title',
      tag          : 'title-cmpt',
      vue          : Title,
      config       : {
        title  : 'This is a title!',
        classes: [],
        align  : 'center center'
      },
      defaultWidth : 4,
      defaultHeight: 1
    }
  ]
}
