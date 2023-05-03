import Vue from 'vue';
import {
    Form, FormItem, Button, Input, Message,
    Container, Header, Aside, Main, Footer,
    Menu, MenuItem, Submenu,
    Card, Table, TableColumn,
    Dialog
} from "element-ui";

Vue.use(Button);
Vue.use(Input);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Footer);
Vue.use(Menu);
Vue.use(MenuItem);
Vue.use(Submenu);
Vue.use(Card);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Dialog);

Vue.prototype.$message = Message;
