<template>
	<div class="loader">
		<div class="preloading">
			<div class="loading"></div>
		</div>
	</div>
</template>

<script>
	export default {
		name: "loading",
		data() {
			return {};
		}
	};
</script>

<style lang="less">
	.loader {
		position: fixed;
		width: 100%;
		top: 0;
		bottom: 44px;
		z-index: 10000;
		display: flex;
		align-items: center;
		justify-content: center;

		.loading {
			display: block;
			position: relative;
			left: 50%;
			top: 50%;
			width: 75px;
			height: 75px;
			margin: -32.5px 0 0 -32.5px;
			border-radius: 50%;
			border: 1.5px solid transparent;
			border-top-color: #9370db;
			-webkit-animation: spin 2s linear infinite;
			animation: spin 2s linear infinite;
		}

		.loading::before {
			content: "";
			position: absolute;
			top: 2.5px;
			left: 2.5px;
			right: 2.5px;
			bottom: 2.5px;
			border-radius: 50%;
			border: 1.5px solid transparent;
			border-top-color: #ba55d3;
			-webkit-animation: spin 3s linear infinite;
			animation: spin 3s linear infinite;
		}

		.loading::after {
			content: "";
			position: absolute;
			top: 7.5px;
			left: 7.5px;
			right: 7.5px;
			bottom: 7.5px;
			border-radius: 50%;
			border: 1.5px solid transparent;
			border-top-color: #ff00ff;
			-webkit-animation: spin 1.5s linear infinite;
			animation: spin 1.5s linear infinite;
		}

		@-webkit-keyframes spin {
			0% {
				-webkit-transform: rotate(0deg);
				-ms-transform: rotate(0deg);
				transform: rotate(0deg);
			}

			100% {
				-webkit-transform: rotate(360deg);
				-ms-transform: rotate(360deg);
				transform: rotate(360deg);
			}
		}

		@keyframes spin {
			0% {
				-webkit-transform: rotate(0deg);
				-ms-transform: rotate(0deg);
				transform: rotate(0deg);
			}

			100% {
				-webkit-transform: rotate(360deg);
				-ms-transform: rotate(360deg);
				transform: rotate(360deg);
			}
		}
	}
</style>
