import Vue from 'vue';
import 'element-ui/lib/theme-chalk/index.css';
import {Container, Header, Aside, Main, Row, Col,
    Dropdown, DropdownMenu, DropdownItem,
    Menu, MenuItem, Submenu,
    Input, Button, Tag,
    Form, FormItem,
    Scrollbar, Tabs, TabPane, Divider, Step, Steps,
    Tree, Select, Option, Radio, Popover, InputNumber, Checkbox, Switch,
    Table, TableColumn,
    Dialog, Pagination, DatePicker, Upload
} from 'element-ui';

const components = [
    Container, Header, Aside, Main, Row, Col,
    Dropdown, DropdownMenu, DropdownItem,
    Menu, MenuItem, Submenu,
    Input, Button, Tag,
    Form, FormItem,
    Scrollbar, Tabs, TabPane, Divider, Step, Steps,
    Tree, Select, Option, Radio, Popover, InputNumber, Checkbox, Switch,
    Table, TableColumn,
    Dialog, Pagination, DatePicker, Upload
];

components.forEach(component => {
    Vue.component(component.name, component);
});

export default components;
