const userListStore = {
  state: {
    users: [],
    notificationList: [],
    currentTrack: { track: '', album: '', duration: '0' },
    currentProgress: 0,
    progressionInterval: false,
    trackPlaying: false,
    toSkip: { votes: [], requiredVotes: 0 },
    voted: false,
    currentQueue: [],
    sliderQueue: [],
    history: [],
    sliderHistory: [],
    maxTime: 0,
    hosting: false,
  },
  mutations: {
    addCurrentTrack: (state, payload) => {
      if (payload.hasOwnProperty('track') && payload.hasOwnProperty('album')) {
        try { // Issue with Jest/Vue Testing Utils, throws improper error, this keeps tests running, return statement should never be hit in prod
          if (payload.queue.length) {
            state.maxTime = payload.duration;
            state.currentTrack = payload;
            state.trackPlaying = payload.currentlyPlaying;
          }

          if (!state.currentQueue.length) {
            payload.queue.shift();
            state.currentQueue = payload.queue;
            state.sliderQueue = payload.queue;
          } else if (!state.currentQueue.length && !payload.queue.length && payload.track.length && state.currentTrack.track === '') {
            state.maxTime = payload.duration;
            state.currentTrack = payload;
            state.trackPlaying = payload.currentlyPlaying;
          }

          if (payload.hasOwnProperty('history')) {
            state.history = payload.history.map((current) => current[0]);
          }
        } catch (e) {
          return false;
        }
      }
    },
    setProgression: (state, payload) => {
      if (payload.increment) {
        if (!state.progressionInterval) {
          state.progressionInterval = true;
          if (payload.hasOwnProperty('maxTime')) { state.maxTime = payload.maxTime; }
        }

        state.currentProgress++;
      } else {
        // When track is finished
        state.progressionInterval = false;
        state.currentProgress = 0;
        state.trackPlaying = false;
        state.toSkip.votes = { votes: [], requiredVotes: 0 };
        state.voted = false;
        state.currentTrack = { track: '', album: '', duration: '0' };
      }
    },
    setCurrentProgress: (state, payload) => {
      if (payload.hasOwnProperty('seconds')) { state.currentProgress = payload.seconds; }
    },
    addSkipVotes: (state, payload) => {
      state.toSkip.votes = payload.currentVotes;
      state.toSkip.requiredVotes = payload.neededVotes;
    },
    votedSkip: (state) => {
      if (state.voted === false) {
        state.voted = true;
      }
    },
    addToQueue: (state, payload) => {
      if (payload.length) {
        payload.shift();
        state.currentQueue = payload;
        state.sliderQueue = payload;
      }
    },
    setHosting: (state, payload) => {
      if (typeof payload === 'boolean') { state.hosting = payload; }
    },
    setIndex: (state, payload) => {
      if (Object.prototype.hasOwnProperty.call(payload, 'index') === true) {
        if (payload.type === 'queue') {
          const queueCopy = [...state.currentQueue];
          state.sliderQueue = queueCopy.splice(payload.index, state.currentQueue.length);
        } else if (payload.type === 'history') {
          const historyCopy = [...state.history];
          state.sliderHistory = historyCopy.splice(payload.index, state.history.length);
        }
      }
    },
  },
  getters: {
    grabCurrentPlaying: (state) => state.currentTrack,
    grabCurrentProgress: (state) => state.currentProgress,
    grabCurrentVotes: (state) => state.toSkip,
    grabIfVoted: (state) => state.voted,
    grabIfHosting: (state) => {
      if (state.hosting !== true && localStorage.getItem('host_mode') === 'true') {
        return true;
      }
      return state.hosting;
    },
  },
  actions: {
    handleProgression({ state, commit }, payload) {
      if (!state.progressionInterval) {
        commit('setProgression', { increment: true, maxTime: payload.maxTime });

        const progress = setInterval(() => {
          if (state.currentProgress >= Math.floor(state.maxTime / 1000) || !state.progressionInterval) {
            clearInterval(progress);
            commit('setProgression', { increment: false });
            return false;
          }

          commit('setProgression', { increment: true });
        }, 1000);
      }
    },
  },
};

export default userListStore;
