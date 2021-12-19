<template>
  <b-card
    img-top
    no-body
    class="text-center bg-dark border-secondary me-2 mb-2 shadow"
    header-tag="header"
  >
    <template #header>
      <b-icon
        icon="grip-vertical"
        scale="1.9"
        class="handle float-start mt-2"
      ></b-icon>
      <h6 class="float-start m-1">#{{ id }}</h6>
      <div class="float-end">
        <b-button
          @click.stop="toggleSkip"
          variant="outline-secondary"
          class="border-0 bg-transparent shadow-none p-0 mt-1 me-3"
          title="Skip Frame"
        >
          <b-icon v-if="frame.skip" icon="eye-slash-fill" scale="1.2"></b-icon>
          <b-icon v-else icon="eye-fill" scale="1.2"></b-icon>
        </b-button>
        <b-button
          @click="cloneFrame"
          variant="outline-secondary"
          class="border-0 bg-transparent shadow-none p-0 mt-1 me-3"
          title="Clone Frame"
        >
          <b-icon icon="files" scale="1.1"></b-icon>
        </b-button>
        <b-button
          @click="removeFrame"
          variant="outline-danger"
          class="border-0 bg-transparent shadow-none p-0 mt-1"
          title="Remove Frame"
        >
          <b-icon icon="trash-fill" scale="1.1"></b-icon>
        </b-button>
      </div>
    </template>
    <canvas class="card-img-top" ref="canvas"></canvas>
    <b-card-body>
      <b-form>
        <div class="row">
          <label
            :for="`inputDelay-${id}`"
            class="col-sm-3 col-form-label col-form-label-sm"
          >
            Delay
          </label>
          <div class="col-sm-9">
            <input
              type="number"
              class="form-control form-control-sm"
              :id="`inputDelay-${id}`"
              :value="frame.delay"
              :disabled="frame.skip"
            />
          </div>
        </div>
      </b-form>
    </b-card-body>
  </b-card>
</template>

<script>
export default {
  name: "Frame",
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  emits: ["cloneFrame", "removeFrame"],
  computed: {
    frame() {
      return this.$store.getters.getFrameById(this.id);
    },
  },
  data() {
    return {
      ctx: null,
      image: null,
    };
  },
  mounted() {
    // Create and configure graphic context
    this.ctx = this.$refs.canvas.getContext("2d");
    this.ctx.imageSmoothingEnabled = false;

    // Draw
    this.image = new Image();
    this.image.onload = this.drawImage;
    this.image.src = URL.createObjectURL(this.frame.file);
  },
  methods: {
    cloneFrame() {
      this.$emit("cloneFrame", this.id);
    },
    removeFrame() {
      this.$emit("removeFrame", this.id);
    },
    toggleSkip() {
      this.frame.skip = !this.frame.skip;
    },
    drawImage() {
      const width = this.$refs.canvas.width;
      const height = this.$refs.canvas.height;

      // Get the scale
      const scale = Math.min(
        width / this.image.width,
        height / this.image.height
      );

      // Get the top left position of the image
      const x = width / 2 - (this.image.width / 2) * scale;
      const y = height / 2 - (this.image.height / 2) * scale;

      // Draw
      this.ctx.beginPath();
      this.ctx.fillStyle = "black";
      this.ctx.fillRect(0, 0, width, height);
      this.ctx.drawImage(
        this.image,
        x,
        y,
        this.image.width * scale,
        this.image.height * scale
      );
    },
  },
};
</script>

<style scoped>
.handle {
  cursor: move;
  margin-left: -0.5em !important;
}
</style>
