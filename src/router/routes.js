export const routes = [{
		path: '',
		name: 'Index',
		component: () => import('../views/Index.vue'),
		children: [{
				path: '',
				name: 'Home',
				component: () => import('../views/tabbar/Home.vue')
			},
			{
				path: 'menu',
				name: 'Menu',
				component: () => import('../views/tabbar/Menu.vue')
			},
			{
				path: 'cart',
				name: 'Cart',
				component: () => import('../views/tabbar/Cart.vue')
			},
			{
				path: 'my',
				name: 'My',
				component: () => import('../views/tabbar/My.vue')
			}
		]
	},
	{
		path: '/login',
		name: 'Login',
		component: () => import('../views/login/Login.vue')
	}, {
		path: '/register',
		name: 'Register',
		component: () => import('../views/login/Register.vue')
	}, {
		path: '/forget',
		name: 'Forget',
		component: () => import('../views/login/Forget.vue')
	}, {
		path: '/detail',
		name: 'Detail',
		component: () => import('../views/Detail.vue')
	},

	{
		path: '/pay',
		name: 'Pay',
		component: () => import('../views/Pay.vue')
	},

	{
		path: '/newAddress',
		name: 'NewAddress',
		component: () => import('../views/address/NewAddress.vue')
	},

	{
		path: '/address',
		name: 'Address',
		component: () => import('../views/address/Address.vue')
	},
	{
		path: '/account',
		name: 'Account',
		component: () => import('../views/my/Account.vue')
	},
	{
		path: '/wallet',
		name: 'Wallet',
		component: () => import('../views/my/Wallet.vue')
	},
	{
		path: '/order',
		name: 'Order',
		component: () => import('../views/Order.vue')
	},
	{
		path: '/like',
		name: 'Like',
		component: () => import('../views/Like.vue')
	},
	{
		path: '/secure',
		name: 'Secure',
		component: () => import('../views/my/Secure.vue')
	},
	{
		path: '/search',
		name: 'Search',
		component: () => import('../views/Search.vue')
	},
	{
		path: '/receive',
		name: 'Receive',
		component: () => import('../views/Receive.vue')
	},

	{
		path: '*',
		redirect: {
			name: 'Home'
		}
	}
]
