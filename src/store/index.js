import { createStore } from "vuex";
import uniqueId from "lodash-es/uniqueId";

export default createStore({
  state: {
    animations: [],
    frames: [],
  },
  getters: {
    getAnimationById: (state) => (id) => {
      return state.animations.find((animation) => animation.id === id);
    },
    getFrameById: (state) => (id) => {
      return state.frames.find((frame) => frame.id === id);
    },
  },
  mutations: {
    createAnimation: (state, { animationId = uniqueId("animation") }) => {
      // New animation
      state.animations.push({
        id: animationId,
        frameReferences: [],
      });
    },
    removeAnimation: (state, { animationId }) => {
      // Get animation index
      const animationIndex = state.animations.findIndex(
        (animation) => animation.id === animationId
      );

      // Remove frames
      state.frames = state.frames.filter(
        (frame) =>
          !state.animations[animationIndex].frameReferences.includes(frame.id)
      );

      // Remove animation
      delete state.animations[animationIndex];
    },
    createFrame: (
      state,
      { animationId, frameId = uniqueId("frame"), file = null }
    ) => {
      // Get animation index
      const animationIndex = state.animations.findIndex(
        (animation) => animation.id === animationId
      );

      // Add frame
      state.frames.push({
        id: frameId,
        file,
        delay: 100,
        skip: false,
      });

      // Add frame relation to animation
      state.animations[animationIndex].frameReferences.push({ id: frameId });
    },
    cloneFrame: (state, { animationId, frameId }) => {
      // Get animation index
      const animationIndex = state.animations.findIndex(
        (animation) => animation.id === animationId
      );

      // Clone frame
      const newFrameId = uniqueId("frame");
      state.frames.push({
        ...state.frames.find((frame) => frame.id === frameId),
        id: newFrameId,
      });

      // Add frame relation to animation
      const newFrameIndex =
        state.animations[animationIndex].frameReferences.findIndex(
          (frameReference) => frameReference.id === frameId
        ) + 1;
      state.animations[animationIndex].frameReferences.splice(
        newFrameIndex,
        0,
        {
          id: newFrameId,
        }
      );
    },
    removeFrame: (state, { animationId, frameId }) => {
      // Get animation index
      const animationIndex = state.animations.findIndex(
        (animation) => animation.id === animationId
      );

      // Remove frame relation from animation
      state.animations[animationIndex].frameReferences = state.animations[
        animationIndex
      ].frameReferences.filter(
        (frameReference) => frameReference.id !== frameId
      );

      // Remove frame
      state.frames = state.frames.filter((frame) => frame.id !== frameId);
    },
  },
  actions: {
    save: () => {
      // TODO: Implement
    },
  },
});
