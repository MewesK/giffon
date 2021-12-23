<template>
  <input
    multiple
    @change="onFileInputChange"
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
          @click="onAddAnimationClick"
          variant="outline-secondary"
          class="border-0 bg-transparent shadow-none"
          title="Add Animation"
        >
          <b-icon icon="plus-circle-fill" scale="1.1"></b-icon>
        </b-button>
      </div>
    </nav>
  </header>
  <main
    @dragover.prevent.stop
    @drop.prevent.stop="onMainDrop"
    class="container-fluid flex-grow-1"
  >
    <template v-for="animation in animations" :key="animation.id">
      <Animation :id="animation.id" class="shadow" />
    </template>
  </main>
</template>

<script>
import { mapState } from "vuex";
import uniqueId from "lodash-es/uniqueId";

import Animation from "./components/Animation.vue";

export default {
  name: "App",
  components: {
    Animation,
  },
  computed: mapState(["animations"]),
  methods: {
    addAnimation(files) {
      const animationId = uniqueId("animation");
      this.$store.commit("createAnimation", { animationId });
      files.forEach((file) =>
        this.$store.commit("createFrame", { animationId, file })
      );
    },
    onAddAnimationClick() {
      this.$refs.fileInput.click();
    },
    onMainDrop(event) {
      this.addAnimation(event.dataTransfer.files);
    },
    onFileInputChange() {
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
