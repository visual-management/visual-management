<template>
  <div id="app">
    <grid-layout
      :layout="layout"
      :col-num="24"
      :row-height="70"
      :is-draggable="editing"
      :is-resizable="editing"
      :vertical-compact="false"
      :margin="[10, 10]"
      :use-css-transforms="true"
    >
      <grid-item
        v-for="item in layout"
        v-if="!item.toDelete"
        :key="item.i"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i"
        :class="[item.plugin + '-plugin', item.component + '-component', item.component + '-' + item.i + '-component', {'editing': editing, 'not-editing': !editing}]"
      >
        <div class="edit-mode" v-show="editing">
          <button @click="onDelete(item)" class="material-button accent">Supprimer</button>
          <button @click="onEditItem(item)" v-show="item.config" class="material-button accent">Modifier</button>
        </div>

        <component :is="item.component" :config="item.config"></component>
      </grid-item>
    </grid-layout>

    <ul class="mfb-component--br mfb-slidein" data-mfb-toggle="hover" data-mfb-state="closed" v-show="!editing">
      <li class="mfb-component__wrap">
        <a class="mfb-component__button--main">
          <i class="mfb-component__main-icon--resting material-icons">menu</i>
          <i class="mfb-component__main-icon--active material-icons">close</i>
        </a>

        <ul class="mfb-component__list">
          <li>
            <a @click="onEdit" data-mfb-label="Edition mode" class="mfb-component__button--child">
              <i class="mfb-component__child-icon material-icons">edit</i>
            </a>
          </li>

          <li>
            <a @click="onAddNewComponent" data-mfb-label="Add new component" class="mfb-component__button--child">
              <i class="mfb-component__child-icon material-icons">add</i>
            </a>
          </li>
        </ul>
      </li>
    </ul>

    <a @click="onSave" class="save-btn mfb-component__button--main" v-show="editing">
      <i class="mfb-component__main-icon--resting material-icons">save</i>
    </a>

    <modal
      v-show="showModal"
      :value="hideModal"
      :item="editItem"
      @input="hideModal()"
    ></modal>
  </div>
</template>

<script>
  import { components } from './app.module'
  import Modal from './components/Modal.vue'

  export default {
    name: 'app',
    components: Object.assign({
      'modal': Modal
    }, components),
    data () {
      return {
        editing: false,
        editItem: null,
        layout: [],
        showModal: false
      }
    },

    methods: {
      onEdit () {
        this.editing = !this.editing
      },

      onAddNewComponent () {
        this.showModal = !this.showModal
      },

      onSave () {
        this.$socket.emit('component.update-all', this.layout.map((item) => ({
          _id: item._id,
          x: item.x,
          y: item.y,
          w: item.w,
          h: item.h
        })))

        this.layout.filter((item) => item.toDelete).forEach((itemToDelete) => {
          this.$socket.emit('component.remove', itemToDelete)
        })

        this.editing = false
      },

      onDelete (itemToDelete) {
        itemToDelete.toDelete = true
      },

      onEditItem (item) {
        this.editItem = item
        this.showModal = true
        this.editing = false
      },

      hideModal () {
        this.editItem = null
        this.showModal = false
      }

    },

    sockets: {
      grid (data) {
        this.layout = data.map((item) => {
          item.toDelete = false
          return item
        })
      },

      componentCreated (component) {
        component.toDelete = false
        this.layout.push(component)

        this.showModal = false
      },

      componentUpdated (component) {
        component.toDelete = false
        this.showModal = false
      },

      componentDeleted (component) {
        this.layout = this.layout.filter((item) => item._id !== component._id)
      },

      refreshView () {
        window.location.reload()
      }
    }
  }
</script>

<style lang="scss">
  @import '../static/styles';

  html,
  body,
  #app,
  .vue-grid-layout{
    height: 100%;
    min-height: 100%;
  }

  body {
    font-family: 'Roboto', sans-serif;
    margin: 0;
  }

  h1 {
    width: 100%;
    text-align: center;
    font-size: 1.3em;
    margin-top: 5px;
  }

  .save-btn {
    position: fixed;
    bottom: 0;
    right: 0;
    margin: 25px;
    z-index: 30;
    background-color: $accent-color;
  }

  .not-editing {
    /*pointer-events: none;*/
  }

  .not-editing > .vue-resizable-handle {
    display: none;
  }

  .vue-grid-item  .edit-mode {
    z-index: 10;
    cursor: move;
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: $primary-color-80-opacity;
    box-sizing: border-box;
  }
</style>
