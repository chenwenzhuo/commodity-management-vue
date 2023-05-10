import Vue from 'vue';
import {
    Message, MessageBox,
    Form, FormItem, Button, Input, Radio,
    Container, Header, Aside, Main, Footer,
    Menu, MenuItem, Submenu, Card, Table, TableColumn,
    Dialog, Select, Option, Pagination, Row, Col,
    Image, Cascader, Upload
} from "element-ui";

Vue.use(Button);
Vue.use(Input);
Vue.use(Radio);
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
Vue.use(Pagination);
Vue.use(Row);
Vue.use(Col);
Vue.use(Image);
Vue.use(Cascader);
Vue.use(Upload);

Vue.prototype.$message = Message;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
