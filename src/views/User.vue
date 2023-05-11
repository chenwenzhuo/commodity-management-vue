<template>
    <el-card class="box-card">
        <div slot="header" class="box-header">
            <el-button type="primary" icon="el-icon-plus" @click="handleAddUser">
                创建用户
            </el-button>
        </div>
        <el-table ref="userTable" :data="userData" border style="width: 100%">
            <el-table-column prop="username" label="用户名" align="center">
            </el-table-column>
            <el-table-column prop="email" label="邮箱" align="center">
            </el-table-column>
            <el-table-column prop="phone" label="电话" align="center">
            </el-table-column>
            <el-table-column prop="create_time" label="注册时间" align="center"
                             :formatter="(row)=>formatTime(row.create_time)">
            </el-table-column>
            <el-table-column prop="role_id" label="所属角色" align="center"
                             :formatter="(row)=>roleData.find(item=>item._id===row.role_id).name">
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template v-slot="scope">
                    <el-button class="oprt-btn" @click="handleUpdateUser(scope.row)">修改</el-button>
                    <el-button class="oprt-btn" @click="handleDeleteUser(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :title="dialogTitle" :visible="dialogVisible===1" width="30%">
            <el-form ref="userForm" :model="userForm" label-position="right">
                <el-row type="flex" justify="left">
                    <el-col :span="22">
                        <el-form-item prop="username" label="用户名" label-width="80px"
                                      :rules="[{required:true,message:'用户名不能为空'}]">
                            <el-input type="text" placeholder="请输入用户名"
                                      v-model="userForm.username" autocomplete="off"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row type="flex" justify="left" v-if="add_update_flag==='add'">
                    <el-col :span="22">
                        <el-form-item prop="password" label="密码" label-width="80px"
                                      :rules="[{required:true,message:'密码不能为空'}]">
                            <el-input type="password" placeholder="请输入密码"
                                      v-model="userForm.password" autocomplete="off"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row type="flex" justify="left">
                    <el-col :span="22">
                        <el-form-item prop="phone" label="手机号" label-width="80px"
                                      :rules="[{required:true,message:'手机号不能为空'},{validator:validatePhone}]">
                            <el-input type="text" placeholder="请输入手机号"
                                      v-model="userForm.phone" autocomplete="off"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row type="flex" justify="left">
                    <el-col :span="22">
                        <el-form-item prop="email" label="邮箱" label-width="80px"
                                      :rules="[{required:true,message:'邮箱不能为空'}]">
                            <el-input type="text" placeholder="请输入邮箱"
                                      v-model="userForm.email" autocomplete="off"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row type="flex" justify="left">
                    <el-col :span="22">
                        <el-form-item prop="role_id" label="角色" label-width="80px"
                                      :rules="[{required:true,message:'角色不能为空'}]">
                            <el-select v-model="userForm.role_id">
                                <el-option v-for="(item) in roleData" :key="item._id"
                                           :value="item._id" :label="item.name">
                                    {{ item.name }}
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="hideDialog">取 消</el-button>
                <el-button type="primary" @click="handleConfirmAddUpdate">确 定</el-button>
            </div>
        </el-dialog>
    </el-card>
</template>

<script>
import ajaxMtd from '@/utils/ajax';
import {formatTime} from "@/utils/tools";
import {nextTick} from "vue";

export default {
    name: "User",
    data() {
        return {
            userData: [],//表格用户数据
            roleData: [],//所有角色数据
            dialogVisible: 0,//弹窗是否可见
            add_update_flag: '',//弹窗用于添加/修改用户的标志位
            selectedUserId: '',//修改用户时，此用户的id
            userForm: {//用户表单的数据
                username: '',
                password: '',
                email: '',
                phone: '',
                role_id: '',
            }
        }
    },
    computed: {
        dialogTitle() {
            if (this.add_update_flag === 'add') {
                return '创建用户';
            } else if (this.add_update_flag === 'update') {
                return '修改用户';
            }
            return '';
        }
    },
    methods: {
        formatTime,
        async reqUser() {
            const response = await ajaxMtd('/manage/user/list');
            if (response.status !== 0) {
                this.$message.error(response.msg);
                return;
            }
            this.userData = response.data.users;
            this.roleData = response.data.roles;
        },
        handleAddUser() {
            //弹窗未打开时打开弹窗
            if (this.dialogVisible === 0) {
                this.dialogVisible = 1;
                this.add_update_flag = 'add';
                return;
            }
            this.$refs.userForm.validate(async valid => {
                if (!valid)
                    return;
                const response = await ajaxMtd('/manage/user/add', {
                    username: this.userForm.username,
                    password: this.userForm.password,
                    phone: this.userForm.phone,
                    email: this.userForm.email,
                    role_id: this.userForm.role_id
                }, 'POST');
                if (response.status === 0) {
                    this.reqUser();
                    this.$message.success('添加用户成功');
                    this.resetUserForm();
                    this.dialogVisible = 0;
                    this.add_update_flag = '';
                } else {
                    this.$message.error(response.msg);
                }
            });
        },
        handleUpdateUser(row) {
            //弹窗未打开时打开弹窗
            if (this.dialogVisible === 0) {
                this.dialogVisible = 1;
                this.add_update_flag = 'update';
                //将当前行的数据填入
                this.selectedUserId = row._id;
                this.userForm.username = row.username;
                this.userForm.phone = row.phone;
                this.userForm.email = row.email;
                this.userForm.role_id = row.role_id;
                return;
            }
            this.$refs.userForm.validate(async valid => {
                if (!valid)
                    return;
                const response = await ajaxMtd('/manage/user/update', {
                    _id: this.selectedUserId,
                    username: this.userForm.username,
                    phone: this.userForm.phone,
                    email: this.userForm.email,
                    role_id: this.userForm.role_id
                }, 'POST');
                if (response.status === 0) {
                    this.reqUser();
                    this.$message.success('修改用户成功');
                    this.resetUserForm();
                    this.dialogVisible = 0;
                    this.add_update_flag = '';
                    this.selectedUserId = '';
                } else {
                    this.$message.error(response.msg);
                }
            });
            this.dialogVisible = 0;
            this.add_update_flag = '';
        },
        handleConfirmAddUpdate() {
            if (this.add_update_flag === 'add') {
                this.handleAddUser();
            } else if (this.add_update_flag === 'update') {
                this.handleUpdateUser();
            }
        },
        hideDialog() {
            this.dialogVisible = 0;
            this.add_update_flag = '';
            this.resetUserForm();
        },
        resetUserForm() {
            this.userForm = {
                username: '',
                password: '',
                email: '',
                phone: '',
                role_id: '',
            };
            //修改userForm导致界面更新，更新后清楚表单项校验结果
            nextTick(() => this.$refs.userForm.clearValidate());
        },
        validatePhone(rule, value, callback) {
            if (value === '') {
                callback(new Error('手机号不能为空'));
            } else if (!/[0-9]/.test(value)) {
                callback(new Error('手机号应只包含数字'));
            } else if (value.length !== 11) {
                callback(new Error('手机号长度应为11位'));
            }
            callback();
        },
        handleDeleteUser(row) {
            this.$confirm('确认删除当前用户？', '提示', {
                confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
            }).then(async () => {
                const response = await ajaxMtd('/manage/user/delete', {userId: row._id}, 'POST');
                if (response.status === 0) {
                    this.reqUser();
                    this.$message.success('删除用户成功');
                } else {
                    this.$message.error(response.msg);
                }
            }).catch(() => {
                //点击取消的回调
            });
        },
    },
    mounted() {
        this.reqUser();//组件挂载时请求数据
    }
}
</script>

<style scoped lang="less">
.box-card {
  height: 100%;
  overflow: scroll;

  .box-header {
    display: flex;
    justify-content: flex-end;
    align-items: center;

    .el-button {
      background-color: #1DA57A;
    }
  }

  .dialog-footer {
    .el-button:first-child {
      background-color: #ffffff;

      &:hover {
        color: #1DA57A;
        border-color: #1DA57A;
      }
    }

    .el-button:last-child {
      background-color: #1DA57A;
    }
  }
}

.oprt-btn {
  margin: 0;
  padding: 0;
  border: 0;
  background-color: rgba(255, 255, 255, 0);
  color: #1DA57A;
  cursor: pointer;

  &:last-child {
    margin-left: 10px;
  }
}
</style>