import Vue from 'vue';
import {
    Message, MessageBox,
    Form, FormItem, Button, Input,
    Container, Header, Aside, Main, Footer,
    Menu, MenuItem, Submenu,
    Card, Table, TableColumn,
    Dialog, Select, Option
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
Vue.use(Select);
Vue.use(Option);

Vue.prototype.$message = Message;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
