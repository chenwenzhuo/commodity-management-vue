export default {
    namespaced: true,
    state: {
        users: [{
            username: 'admin',
            password: 'admin',
            phone: '',
            email: '',
            create_time: Date.now(),
            role_id: ''
        }],
    },
    getters: {},
    mutations: {},
    actions: {}
};
