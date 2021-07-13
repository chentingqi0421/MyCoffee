import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		availTop: 0,
		sessionID: '',
		loading: '',
		invitationHeight: 0,
	},
	mutations: {
		changeAvailTop(state, availTop) {
			state.availTop = availTop;
		},
		upSessionID(state, sessionID) {
			state.sessionID = sessionID;
		},
		upLoading(state, bool) {
			state.loading = bool;
		},
		upInvitationHeight(state,height) {
			state.invitationHeight = height;
		}
	},
	actions: {},
	modules: {}
})
