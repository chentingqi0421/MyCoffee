<template>
	<div class="wInput">
		<input :type="inputType" :value="value" :maxlength="maxlength" @input="$emit('input', $event.target.value)"
		 :placeholder="placeholder" />
		<div @click="clickEye" v-if="eye">
			<span class="cuIcon" :class="isEye?'cuIcon-attention':'cuIcon-attentionforbid'"></span>
		</div>
		<div class="vaild" v-if="vaild" @click="sendVaildCode">
			<span>{{send}}</span>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'wInput',
		props: {
			value: {
				default: '',
				type: String
			},
			type: {
				default: 'text',
				type: String
			},
			eye: {
				default: false,
				type: Boolean
			},
			placeholder: {
				default: '',
				type: String
			},
			vaild: {
				default: false,
				type: Boolean
			},
			maxlength: {
				default: 32,
				type: Number
			},
		},
		data() {
			return {
				isEye: false,
				inputType: '',
				inputValue: '',
				count: 60,
				send: '发送验证码',
				isEnd: true
			}
		},
		created() {
			this.inputType = this.type;
		},
		watch: {},
		methods: {
			clickEye() {
				this.isEye = !this.isEye;
				if (this.isEye) {
					this.inputType = 'text';
				} else {
					this.inputType = 'password';
				}
			},
			sendVaildCode() {
				if (this.isEnd) {
					let timer = setInterval(() => {
						this.count--;
						this.send = this.count + 's';
						if (this.count == 0) {
							clearInterval(timer);
							this.isEnd = true;
							this.count = 60;
							this.send = '发送验证码';
						}
					}, 1000);
					this.$emit('click');
				}
				this.isEnd = false;
			}
		}
	}
</script>

<style lang="less">
	.wInput {
		min-width: 200px;
		background-color: #fff;
		border-radius: 50px;
		box-shadow: 0 0 30px 0 #eaebeb;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 20px 20px;
		font-size: 16px;
		overflow: hidden;

		input {
			flex: 1;
			outline: none;
			border: none;
		}

		span {
			font-size: 18px;
		}

		.vaild {
			min-width: 70px;
			height: 20px;
			line-height: 20px;
			text-align: right;
			color: #75758B;

			span {
				font-size: 14px;
			}
		}
	}
</style>
