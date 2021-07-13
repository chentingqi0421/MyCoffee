<template>
	<div class="bg-box">
		<div class="bg-box-bg"></div>
		<div class="bg-box-group">
			<slot></slot>
		</div>
	</div>
</template>

<script>
</script>

<style lang="less">
	.bg-box {
		padding-top: 46px;
		.bg-box-bg {
			height: 160px;
			background: url('../../assets/images/bg.png') no-repeat center center;
			background-size: 100% 100%;
		}

		.bg-box-group {
			margin: -100px 20px 0;
			border-radius: 10px;
			background-color: #fff;
			overflow: hidden;
			padding: 10px;
			box-shadow: 0 8px 12px #ebedf0;
		}
	}
</style>
