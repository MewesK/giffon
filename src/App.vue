<template>
  <input
    multiple
    @change="onFileChange"
    type="file"
    style="display: none"
    ref="fileInput"
    accept="image/*"
  />
  <header>
    <nav class="navbar navbar-dark bg-dark" aria-label="Main navigation">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">
          <span class="mr-1">
            <b-icon icon="stack"></b-icon>
          </span>
          GIF+
        </a>
        <b-button
          @click="onAddAnimation"
          variant="outline-secondary"
          class="border-0 bg-transparent shadow-none"
          title="Add Animation"
        >
          <b-icon
            icon="plus-circle-fill"
            scale="1.1"
          ></b-icon>
        </b-button>
      </div>
    </nav>
  </header>
  <main
    @dragover.prevent.stop
    @drop.prevent.stop="onDrop"
    class="container-fluid flex-grow-1"
  >
    <template v-for="animation in animations" :key="animation.id">
      <Animation :id="animation.id" class="shadow" />
    </template>
  </main>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import uniqueId from "lodash-es/uniqueId";

import Animation from "./components/Animation.vue";

export default {
  name: "App",
  components: {
    Animation,
  },
  computed: mapState(["animations"]),
  methods: {
    ...mapMutations(["newAnimation", "newFrame"]),
    addAnimation(files) {
      const animationId = uniqueId("animation");
      this.newAnimation({ animationId });
      files.forEach((file) =>
        this.newFrame({ animationId, file })
      );
    },
    onAddAnimation() {
      this.$refs.fileInput.click();
    },
    onDrop(event) {
      this.addAnimation(event.dataTransfer.files);
    },
    onFileChange() {
      this.addAnimation(this.$refs.fileInput.files);
    },
  },
};
</script>

<style>
body {
  color: var(--bs-light) !important;
  background-color: var(--bs-secondary) !important;
}
</style>
