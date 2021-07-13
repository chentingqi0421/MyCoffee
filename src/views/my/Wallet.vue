<template>
	<div class="wallet">
		<nav-bar title="钱包" />
		<bg-box>
			<div class="waller-box">
				<div class="box flex">
					<img class="icon" src="@/assets/images/balance.png" alt="">
				</div>
				<div class="box flex container">
					<div class="total-money">{{balance}}</div>
					<div>总余额（元）</div>
					<div style="color:#7186C7">明细 ></div>
				</div>
				<div class="box balance">
					<div class="box">
						<div class="balance-count">{{balance}}</div>
						<div>可用余额（元）</div>
					</div>
					<div class="line"></div>
					<div class="box">
						<div class="balance-count">0</div>
						<div>冻结余额（元）</div>
					</div>
				</div>
				<div class="box flex">
					<div class="recharge" @click="recharge">门店充值</div>
				</div>
			</div>
		</bg-box>

		<van-popup v-model="popupShow" position="bottom" :style="{height:'268px'}">
			<div class="popup">
				<van-field v-model="rechargeValue" label="¥" placeholder="请输入充值金额" readonly label-class="label" />
				<van-number-keyboard :show="keyboardShow" theme="custom" extra-key="." close-button-text="完成"
					@blur="blur" @input="onInput" @delete="onDelete">
				</van-number-keyboard>
			</div>
		</van-popup>

	</div>
</template>

<script>
	export default {
		data() {
			return {
				popupShow: false,
				keyboardShow: false,
				rechargeValue: '',
				balance: 0,
			}
		},
		created() {
			this.getBalance();
		},
		methods: {
			getBalance() {
				let tokenString = localStorage.getItem("CSTK");
				let params = new URLSearchParams();
				params.append('tokenString', tokenString);
				this.$store.commit('upLoading', true);
				this.axios({
						method: "POST",
						url: "/findBalance",
						data: params,
					})
					.then((result) => {
						this.balance = result.data.result[0].balance;
						this.$store.commit('upLoading', false);
					})
					.catch((err) => {
						this.$store.commit('upLoading', false);
					});
			},
			recharge() {
				this.popupShow = true;
				this.keyboardShow = true;
			},
			onInput(v) {
				if (v == '.' && this.rechargeValue == '') {
					this.rechargeValue = '0.';
					return
				}
				if (v == '0' && !this.rechargeValue.includes('.')) {
					this.rechargeValue = '0.';
					return
				}
				if (v == '.' && this.rechargeValue.includes('.')) {
					return
				}
				if (this.rechargeValue.includes('.') && this.rechargeValue.split('.')[1].length >= 2) {
					return
				}
				this.rechargeValue += v;
			},
			onDelete() {
				this.rechargeValue = this.rechargeValue.slice(0, -1);
			},
			blur() {
				if (parseFloat(this.rechargeValue) <= 0) {
					console.log('充值金额不能为零');
					return
				}
				if(this.rechargeValue == ''){
					console.log('充值金额不能为空')
					return
				}
				let tokenString = localStorage.getItem("CSTK");
				let params = new URLSearchParams();
				params.append('money', this.rechargeValue);
				params.append('tokenString', tokenString);
				this.$store.commit('upLoading', true);
				this.axios({
						method: "POST",
						url: "/recharge",
						data: params,
					})
					.then((result) => {
						this.$store.commit('upLoading', false);
						if (result.data.code == 200) {
							this.popupShow = false;
							this.keyboardShow = false;
							this.balance = parseFloat(this.balance) + parseFloat(this.rechargeValue);
							this.rechargeValue = '';
						}
					})
					.catch((err) => {
						this.show = false;
						this.rechargeValue = '';
						this.$store.commit('upLoading', false);
					});
			}
		}
	}
</script>

<style lang="less">
	.wallet {

		.waller-box {
			color: #333333;

			.icon {
				width: 44px;
				height: 44px;
			}

			.box {
				margin: 20px 0;
			}

			.recharge {
				flex: 1;
				height: 40px;
				line-height: 40px;
				color: #FFFFFF;
				text-align: center;
				background-color: @blue;
				border-radius: 22px;
				font-size: 14px;
			}

			.flex {
				margin: 20px 0;
			}

			.container {
				flex-direction: column;

				div {
					margin-top: 6px;
				}

				.total-money {
					font-size: 36px;
					font-weight: bold;
					color: #000000
				}
			}

			.balance {
				display: flex;
				align-items: center;
				justify-content: space-around;

				.line {
					width: 1px;
					height: 22px;
					background-color: @blue;
				}

				.box {
					display: flex;
					align-items: center;
					justify-content: center;
					flex-direction: column;

					.balance-count {
						margin-bottom: 8px;
						font-weight: bold;
						font-size: 18px;
					}
				}
			}
		}

		.popup {
			background-color: @gray-1;

			.label {
				width: 20px;
				font-size: 24px;
				text-align: center;
			}
		}
	}
</style>
