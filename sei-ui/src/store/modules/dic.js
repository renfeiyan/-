const dic = {
    state: {
        change: '0'
    },
    mutations: {
        setDicData(state, data) {
            state[data.name] = data.data;
            state.changeName = data.name;
            state.change = Math.random();
        },
        clearDicData(state, name) {
            state[name] = null;
            state.change = Math.random();
        }
    }
};

export default dic;
