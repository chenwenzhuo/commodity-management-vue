<template>
    <el-card class="box-card">
        <div slot="header" class="card-title">
            <div class="search-prod">
                <el-select v-model="searchMtd">
                    <el-option value="prodName" label="按名称搜索">按名称搜索</el-option>
                    <el-option value="prodDesc" label="按描述搜索">按描述搜索</el-option>
                </el-select>
                <el-input v-model="searchKey" placeholder="请输入关键字"/>
                <el-button type="primary" @click="searchProducts">搜索</el-button>
            </div>
            <el-button type="primary" icon="el-icon-plus">添加商品</el-button>
        </div>
        <el-table :data="productData" height="680" border style="width: 100%"
                  :header-cell-style="{'text-align':'center'}">
            <el-table-column prop="name" label="商品名称" min-width="20%">
            </el-table-column>
            <el-table-column prop="desc" label="商品描述" min-width="40%">
            </el-table-column>

            <el-table-column label="价格" min-width="10%" align="center">
                <template v-slot="scope">¥{{ scope.row.price }}</template>
            </el-table-column>

            <el-table-column label="状态" min-width="10%" align="center">
                <template v-slot="scope">
                    <span v-if="scope.row.status===1">在售</span>
                    <span v-else>下架</span>
                </template>
            </el-table-column>

            <el-table-column label="操作" min-width="20%" align="center">
                <template v-slot="scope">
                    <el-button @click="handleDetailClick">详情</el-button>
                    <el-button>修改</el-button>
                    <el-button>下架</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
</template>

<script>
import ajaxMtd from '@/utils/ajax';

export default {
    name: "ProductHome",
    data() {
        return {
            searchMtd: 'prodName',//搜索商品的方式
            searchKey: '',//搜索商品的关键词
            pageNum: 1,
            pageSize: 5,
            productData: [],//商品数据
        }
    },
    methods: {
        async reqProducts() {
            const response = await ajaxMtd('/manage/product/list', {
                pageNum: this.pageNum, pageSize: this.pageSize
            });
            if (response.status === 0) {
                this.productData = response.data;
            } else {
                this.$message.error('查询商品信息出错');
            }
        },
        searchProducts() {
        },
        handleDetailClick(){
            this.$router.push('/product/detail');
        }
    },
    mounted() {
        this.reqProducts();//组件挂载时查询商品信息
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

    .search-prod {
      width: 400px;
      display: flex;

      .el-input {
        width: 70%;
        margin: 0 10px;
      }
    }

    .el-button {
      background-color: #3d986e;
      border-color: #3d986e;
    }
  }

  .el-table {
    .el-button {
      margin: 0 10px;
      padding: 0;
      border: 0;
      background-color: rgba(255, 255, 255, 0);
      color: #1DA57A;
      cursor: pointer;
    }
  }
}
</style>
