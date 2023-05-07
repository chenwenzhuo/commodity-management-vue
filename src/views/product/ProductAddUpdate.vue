<template>
    <el-card class="box-card">
        <div slot="header" class="card-title">
            <el-button type="text" icon="el-icon-back" @click="$router.go(-1)">
                返回
            </el-button>
            <span>添加商品</span>
        </div>
        <div class="card-body">
            <el-form ref="addUpdateForm" :model="addUpdateForm">
                <!--el-form-item必须添加prop属性，否则表单校验不生效-->
                <el-form-item prop="productName" label="商品名称"
                              :rules="[{required:true,message:'商品名称必须输入'}]">
                    <el-col :span="8">
                        <el-input type="text" placeholder="请输入商品名称" autocomplete="off"
                                  v-model="addUpdateForm.productName"/>
                    </el-col>
                </el-form-item>
                <el-form-item prop="productDesc" label="商品描述"
                              :rules="[{required:true,message:'商品描述必须输入'}]">
                    <el-col :span="8">
                        <el-input type="textarea" placeholder="请输入商品描述" v-model="addUpdateForm.productDesc"
                                  :autosize="{minRows:2,maxRows:5}"/>
                    </el-col>
                </el-form-item>
                <el-form-item prop="productPrice" label="商品价格"
                              :rules="[{required:true,message:'商品价格必须输入'}]">
                    <el-col :span="8">
                        <el-input type="number" placeholder="请输入商品价格"
                                  v-model="addUpdateForm.productPrice" :min="0">
                            <template slot="prepend">¥</template>
                            <template slot="append">元</template>
                        </el-input>
                    </el-col>
                </el-form-item>
                <el-form-item prop="categories" label="商品分类"
                              :rules="[{required:true,message:'商品分类必须输入'}]">
                    <el-col :span="8">
                        <el-cascader :options="categoryOptions" v-model="addUpdateForm.categories"
                                     :props="{ checkStrictly: true }" clearable
                                     @change="handleCascaderChange">
                        </el-cascader>
                    </el-col>
                </el-form-item>
                <el-form-item label="商品图片">
                    <el-col :span="16">
                        <el-upload action="http://localhost:8848/ajaxPrefix/manage/img/upload"
                                   list-type="picture-card" accept="image/*" name="image"
                                   :file-list="imagesList" :limit="3"
                                   :on-success="handleImgsSuccess" :on-remove="handleImgsRemove">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                    </el-col>
                </el-form-item>
                <el-form-item label="商品详情">
                    <el-col :span="24">
                        <div style="border: 1px solid #ccc;">
                            <Toolbar
                                    style="border-bottom: 1px solid #ccc"
                                    :editor="editor"
                                    mode="default"
                            />
                            <Editor
                                    style="height: 500px; overflow-y: hidden;"
                                    v-model="addUpdateForm.productDetail"
                                    mode="default"
                                    @onCreated="onCreated"
                            />
                        </div>
                    </el-col>
                </el-form-item>
                <el-form-item label-width="0">
                    <el-button type="primary" native-type="submit" @click="submitForm"
                               style="background-color: #1DA57A;">
                        提交
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
    </el-card>
</template>

<script>
import {Editor, Toolbar} from '@wangeditor/editor-for-vue'
import ajaxMtd from '@/utils/ajax';

export default {
    name: "ProductAddUpdate",
    components: {Editor, Toolbar},
    data() {
        return {
            addUpdateForm: {
                productName: '',
                productDesc: '',
                productPrice: '',
                categories: [],
                productDetail: '',
            },
            imagesList: [],
            categoryOptions: [],//级联选择器的选项数组
            editor: null,//富文本编辑器
        }
    },
    methods: {
        async reqCategories(parentId) {
            //查询分类信息
            const response = await ajaxMtd('/manage/category/list', {parentId});
            if (response.status !== 0) {//查询出错，提示
                this.$message.error('获取商品分类出错');
                return;
            }
            //查询成功
            this.initCascaderOptions(response.data, parentId);
        },
        initCascaderOptions(categories, parentId) {
            if (parentId === 0) {//parentId为0，则当前categories数组为一级分类
                this.categoryOptions = categories.map(item => {
                    return {
                        parent: item.parentId,
                        value: item._id,
                        label: item.name,
                        children: []
                    }
                });
            } else {//parentId为0，则categories为二级分类，将其设为父分类的children属性
                this.categoryOptions.forEach(fItem => {
                    if (fItem.value !== parentId) {
                        return;//当前fItem不是categories的父分类，跳过
                    }
                    fItem.children = categories.map(item => {
                        return {
                            parent: item.parentId,
                            value: item._id,
                            label: item.name
                        }
                    });
                });
            }
        },
        handleCascaderChange(choice) {
            //由于cascader组件支持多选，故choice参数为数组，此处单选直接取下标0
            this.reqCategories(choice[0]);//查询子分类
        },
        handleImgsSuccess(file, fileList) {
            console.log('-----------Success file', file);
            console.log('-----------Success fileList', fileList);
            if (file.status === 0) {
                this.imagesList.push(file.data);
            }
        },
        async handleImgsRemove(file, fileList) {
            console.log('-----------Remove file', file);
            console.log('-----------Remove fileList', fileList);
            if (file.status === 'success') {
                const response = await ajaxMtd('/manage/img/delete', {name: file.name}, 'POST');
                this.imagesList = this.imagesList.filter(item => item.name !== file.name);
            }
        },
        submitForm() {
            this.$refs.addUpdateForm.validate(async valid => {
                if (!valid) {
                    return;
                }
                const reqData = {
                    pCategoryId: this.addUpdateForm.categories.length === 1 ? '0' : this.addUpdateForm.categories[0],
                    categoryId: this.addUpdateForm.categories.length === 1 ?
                        this.addUpdateForm.categories[0] : this.addUpdateForm.categories[1],
                    name: this.addUpdateForm.productName,
                    desc: this.addUpdateForm.productDesc,
                    price: this.addUpdateForm.productPrice,
                    imgs: this.imagesList.map(item => item.name),
                    detail: this.addUpdateForm.productDetail
                };
                const reqUrl = '/manage/product/add';//请求URL
                const response = await ajaxMtd(reqUrl, reqData, 'POST');
                if (response.status === 0) {
                    this.$message.success('添加商品成功');
                    this.$router.replace('/product');
                } else {
                    this.$message.error('添加商品失败');
                }
            });
        },
        onCreated(editor) {
            this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
        },
    },
    mounted() {
        this.reqCategories(0);//组件挂载时查询一级分类信息
    },
    beforeDestroy() {
        const editor = this.editor
        if (editor == null) return
        editor.destroy() // 组件销毁时，及时销毁编辑器
    }
}
</script>

<style scoped lang="less">
.box-card {
  height: 100%;
  overflow: scroll;

  .card-title {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .el-button, span {
      color: #1DA57A;
      font-size: 24px;
    }
  }
}
</style>
