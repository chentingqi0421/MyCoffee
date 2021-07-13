<template>
	<div id="app" :style="{top:availTop}">
		<div id="content">
			<!-- 一级路由 -->
			<router-view />
			<Loading v-if="$store.state.loading"></Loading>
		</div>
	</div>
</template>

<script>
	import Loading from './components/loading/loading.vue'

	export default {
		components: {
			Loading
		},
		data() {
			return {
				availTop: 0,
			}
		},
		created() {
			// let availTop = window.screen.availHeight - window.innerHeight + 'px';
			let availTop = '0px';
			this.availTop = availTop;
			this.$store.commit('changeAvailTop', availTop);
		},
		watch: {
			$loading(val) {
				console.log(val)
			}
		}
	}
</script>

<style lang="less">
	@import url(./assets/icon/cuIconfont.css);
	@import url(./assets/icon/iconfont/iconfont.css);
	@import url(./assets/icon/font-awesome-4.7.0/css/font-awesome.min.css);

	@import url(./assets/less/theme.less);

	body {
		background-color: #fff;
		// color: #646566;
	}

	#app {
		font-family: Avenir, Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		position: fixed;
		width: 100%;
		top: 0;
		bottom: 0;
		overflow: hidden;
		background-color: #f7f8fa;
	}

	#content {
		position: absolute;
		width: 100%;
		height: 100%;
		overflow-y: auto;
	}

	.fl {
		float: left;
	}

	.fr {
		float: right;
	}

	.clearfix::after {
		content: "";
		display: block;
		clear: both;
	}

	.auto-img {
		width: 100%;
		display: block;
	}

	.one-text {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.flex {
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
