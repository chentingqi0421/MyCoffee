<template>
	<div class="nav-bar">
		<van-nav-bar left-text="返回" left-arrow :fixed="true" @click-left="back" :style="{top:availTop}">
			<template #title>
				<span style="color: #7186C7;font-weight: bold;">{{title}}</span>
			</template>
		</van-nav-bar>
	</div>
</template>

<script>
	export default {
		props: {
			title: {
				default: '',
				type: String
			},
			pathName: {
				default: '',
				type: String
			}
		},
		data() {
			return {
				availTop: 0,
			}
		},
		created() {
			this.availTop = this.$store.state.availTop;
		},
		methods: {
			back() {
				if (this.pathName == '') {
					this.$router.go(-1);
				} else {
					let name = this.pathName
					this.$router.push({
						name
					});
				}
			}
		}
	}
</script>

<style lang="less">
	.nav-bar {
		.van-nav-bar {
			top: 44px
		}
	}
</style>
