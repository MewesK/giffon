<template>
  <input
    multiple
    @change="onFileInputChange"
    type="file"
    style="display: none"
    ref="fileInput"
    accept="image/*"
  />
  <b-card
    @dragover.prevent.stop
    @drop.prevent.stop="onCardDrop"
    img-top
    no-body
    class="text-center bg-dark border-secondary mt-3 mb-3shadow"
    header-tag="header"
  >
    <template #header>
      <h6 class="float-start m-1">#{{ id }}</h6>
      <div class="float-end">
        <b-button
          @click="onAddFrameClick"
          variant="outline-secondary"
          class="border-0 bg-transparent shadow-none p-0 mt-1 me-3"
          title="Add Frame"
        >
          <b-icon icon="plus-circle-fill" scale="1.1"></b-icon>
        </b-button>
        <b-button
          @click="onRemoveAnimationClick"
          variant="outline-danger"
          class="border-0 bg-transparent shadow-none p-0 mt-1"
          title="Remove Animation"
        >
          <b-icon icon="trash-fill" scale="1.1"></b-icon>
        </b-button>
      </div>
    </template>

    <b-card-body>
      <div class="d-flex flex-wrap text-muted mt-2">
        <draggable
          @start="drag = true"
          @end="drag = false"
          v-model="animation.frameReferences"
          animation="200"
          ghost-class="ghost"
          handle=".handle"
          item-key="id"
          tag="transition-group"
        >
          <template #item="{ element }">
            <Frame
              @clone="onFrameClone"
              @remove="onFrameRemove"
              :id="element.id"
            />
          </template>
        </draggable>
      </div>
    </b-card-body>
  </b-card>
</template>

<script>
import draggable from "vuedraggable";

import Frame from "./Frame.vue";

export default {
  name: "Animation",
  components: {
    draggable,
    Frame,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  computed: {
    animation() {
      return this.$store.getters.getAnimationById(this.id);
    },
  },
  data() {
    return {
      drag: false,
    };
  },
  methods: {
    addFrame(files) {
      files.forEach((file) => this.$store.commit("createFrame", { animationId: this.id, file }));
    },
    onAddFrameClick() {
      this.$refs.fileInput.click();
    },
    onCardDrop(event) {
      this.addFrame(event.dataTransfer.files);
    },
    onFileInputChange() {
      this.addFrame(this.$refs.fileInput.files);
    },
    onFrameClone(frameId) {
      this.$store.commit("cloneFrame", { animationId: this.id, frameId });
    },
    onFrameRemove(frameId) {
      this.$store.commit("removeFrame", { animationId: this.id, frameId });
    },
    onRemoveAnimationClick() {
      this.$store.commit("removeAnimation", { animationId: this.id });
    },
  },
};
</script>

<style scoped>
.flip-list-move {
  transition: transform 0.5s;
}
.ghost {
  opacity: 0.3;
}
</style>
