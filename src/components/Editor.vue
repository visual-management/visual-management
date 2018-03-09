<template>
  <div class="editor">
    <div
         id="code-editor"
         data-language="javascript">
      {{ value }}
    </div>
  </div>
</template>

<script>
  /* global CodeFlask */
  export default {
    name: 'editor',
    props: ['value'],

    mounted () {
      this.flask = new CodeFlask()
      this.flask.run('#code-editor', { language: 'json', lineNumbers: true })
      this.flask.onUpdate((code) => {
        this.value = code
        this.$emit('input', this.value)
      })
    },

    watch: {
      value (value) {
        this.flask.update(value)
      }
    },

    methods: {

    }
  }
</script>

<style lang="scss" scoped>
  .editor {
    #code-editor {
      width: 99%;
      height: 25vh;
    }
  }
</style>
