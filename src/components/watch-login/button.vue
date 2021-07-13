<template>
	<div class="wButton flex" @click="clickButton">
		<span>{{value}}</span>
	</div>
</template>

<script>
	export default {
		name: 'wButton',
		props: {
			value: {
				default: '',
				type: String
			},
		},
		methods: {
			clickButton() {
				this.$emit('click');
			}
		}
	}
</script>

<style lang="less">
	.wButton {
		min-width: 200px;
		// background-color: #fff;
		border-radius: 50px;
		box-shadow: 0 0 30px 0 #eaebeb;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 15px 20px;
		font-size: 16px;
		color: #fff;
		background-color: #7186C7;
	}
</style>
