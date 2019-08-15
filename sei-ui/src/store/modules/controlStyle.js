const controlStyle = {
    state: {
        isCollapse: false,
        menu: null
    },
    mutations: {
        toggleSiderBar(state) {
            state.isCollapse = !state.isCollapse;
        },
        setMenu(state, data) {
            state.menu = data;
        }
    }
};

export default controlStyle
