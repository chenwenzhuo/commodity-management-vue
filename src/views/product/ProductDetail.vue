<template>
    <el-card class="box-card">
        <div slot="header" class="card-title">
            <el-button type="text" icon="el-icon-back" @click="goBack">
                返回
            </el-button>
        </div>
        <div class="card-body">
            <el-row type="flex">
                <el-col :span="8">商品名称：</el-col>
                <el-col :span="24">{{ name }}</el-col>
            </el-row>
            <el-row type="flex">
                <el-col :span="8">商品描述：</el-col>
                <el-col :span="24">{{ desc }}</el-col>
            </el-row>
            <el-row type="flex">
                <el-col :span="8">所属分类：</el-col>
                <el-col :span="24">
                    <span v-if="pCategoryId!==0">{{ pCategoryName }}</span>
                    <i class="el-icon-right" v-if="pCategoryId!==0"></i>
                    <span>{{ categoryName }}</span>
                </el-col>
            </el-row>
            <el-row type="flex">
                <el-col :span="8">商品图片：</el-col>
                <el-col :span="24">
                    <span v-if="imgs.length===0">
                        <el-image>
                            <div slot="error" class="image-slot">
                                <i class="el-icon-picture-outline"></i>
                            </div>
                        </el-image>
                    </span>
                    <span v-else>
                        <el-image v-for="(item,index) in imgs" :key="index"
                                  :src="'http://localhost:5001/upload/'+item">
                        </el-image>
                    </span>
                </el-col>
            </el-row>
            <el-row type="flex">
                <el-col :span="8">商品详情：</el-col>
                <el-col :span="24">
                    <span v-html="detail"></span>
                </el-col>
            </el-row>
        </div>
    </el-card>
</template>

<script>
import ajaxMtd from '@/utils/ajax';

export default {
    name: "ProductDetail",
    data() {
        return {
            ...this.$route.query,
            categoryName: '',//当前商品所属的分类
            pCategoryName: '',//当前商品所属分类的父分类
        }
    },
    watch: {
        categoryId: {
            immediate: true,
            async handler(value) {
                const response = await ajaxMtd('/manage/category/info', {
                    categoryId: value
                });
                if (response.status === 0) {
                    this.categoryName = response.data.name;
                }
            },
        },
        pCategoryId: {
            immediate: true,
            async handler(value) {
                const response = await ajaxMtd('/manage/category/info', {
                    categoryId: value
                });
                if (response.status === 0) {
                    this.pCategoryName = response.data.name;
                }
            },
        }
    },
    methods: {
        goBack() {
            this.$router.go(-1);
        }
    }
}
</script>

<style scoped lang="less">
.box-card {
  height: 100%;
  overflow: scroll;

  .card-title {
    .el-button {
      color: #1DA57A;
      font-size: 24px;
    }
  }

  .card-body {

    .el-row {
      height: 40px;
      font-size: 18px;
    }

    .el-row:nth-of-type(4) {
      height: 300px;

      .el-image {
        height: 295px;

        &:not(:first-of-type) {
          margin-left: 10px;
        }
      }
    }
  }
}
</style>
