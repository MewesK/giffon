import { createStore } from "vuex";
import uniqueId from "lodash-es/uniqueId";

export default createStore({
  state: {
    animations: {},
    frames: {},
  },
  getters: {
    getAnimationById: (state) => (id) => {
      return state.animations[id];
    },
    getFrameById: (state) => (id) => {
      return state.frames[id];
    },
  },
  mutations: {
    newAnimation: (state, { animationId = uniqueId("animation") }) => {
      // New animation
      state.animations[animationId] = {
        id: animationId,
        frameReferences: [],
      };
    },
    removeAnimation: (state, { animationId }) => {
      // Remove frames
      state.animations[animationId].frameReferences.forEach(
        (frameReference) => delete state.frames[frameReference.id]
      );

      // Remove animation
      delete state.animations[animationId];
    },
    newFrame: (state, { animationId, frameId = uniqueId("frame"), file = null }) => {
      // New frame
      state.frames[frameId] = {
        id: frameId,
        file,
        delay: 100,
        skip: false,
      };

      // Add frame relation to animation
      state.animations[animationId].frameReferences.push({ id: frameId });
    },
    cloneFrame: (state, { animationId, frameId }) => {
      // Clone frame
      console.log(animationId, frameId);
      const newFrameId = uniqueId("frame");
      state.frames[newFrameId] = { ...state.frames[frameId], id: newFrameId };

      // Add frame relation to animation
      const newFrameIndex =
        state.animations[animationId].frameReferences.findIndex(
          (frameReference) => frameReference.id === frameId
        ) + 1;
      state.animations[animationId].frameReferences.splice(newFrameIndex, 0, {
        id: newFrameId,
      });
    },
    removeFrame: (state, { animationId, frameId }) => {
      // Remove frame relation from animation
      state.animations[animationId].frameReferences = state.animations[
        animationId
      ].frameReferences.filter(
        (frameReference) => frameReference.id !== frameId
      );

      // Remove frame
      delete state.frames[frameId];
    },
  },
  actions: {
    save: () => {
      // TODO: Implement
    },
  },
});
