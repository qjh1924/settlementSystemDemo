<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input
            placeholder="请输入代理ID进行搜索"
            v-model="queryInfo.query"
            clearable
            @clear="getOrderList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getOrderList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加订单信息</el-button
          >
        </el-col>
      </el-row>

      <!-- 订单列表 -->
      <el-table :data="orderList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="订单编号" prop="order_no"></el-table-column>
        <el-table-column label="订单类型" prop="order_type"></el-table-column>
        <el-table-column
          label="客户姓名"
          prop="order_consumer_name"
        ></el-table-column>
        <el-table-column
          label="身份证号"
          prop="order_consumer_idnum"
        ></el-table-column>
        <el-table-column
          label="手机号"
          prop="order_consumer_phonenum"
        ></el-table-column>
        <el-table-column
          label="二级代理ID/姓名"
          prop="order_agent2_idname"
        ></el-table-column>
        <el-table-column
          label="创建时间"
          prop="order_create_time"
        ></el-table-column>
        <el-table-column label="操作" width="180px">
          <template v-slot="scope">
            <el-tooltip
              content="修改订单信息"
              :enterable="false"
              placement="top"
            >
              <el-button
                size="small"
                round
                type="primary"
                icon="el-icon-edit"
                @click="editOrder(scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="删除" :enterable="false" placement="top">
              <el-button
                size="small"
                round
                type="danger"
                icon="el-icon-delete"
                @click="delteOrder(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!--添加订单信息对话框-->
    <el-dialog
      title="添加订单信息"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!--内容主体区域-->
      <el-form
        :model="addOrderForm"
        :rules="addOrderFormRules"
        ref="addOrderFormRef"
        label-width="108px"
      >
        <el-form-item label="订单编号" prop="order_no">
          <el-input v-model="addOrderForm.order_no" disabled></el-input>
        </el-form-item>
        <el-form-item label="订单类型" prop="order_type">
          <el-select v-model="addOrderForm.order_type">
            <el-option
              v-for="item in order_type_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户姓名" prop="order_consumer_name">
          <el-input v-model="addOrderForm.order_consumer_name"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="order_consumer_idnum">
          <el-input v-model="addOrderForm.order_consumer_idnum"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="order_consumer_phonenum">
          <el-input v-model="addOrderForm.order_consumer_phonenum"></el-input>
        </el-form-item>
        <el-form-item label="二级代理ID" prop="order_agent2_id">
          <el-input v-model="addOrderForm.order_agent2_id"></el-input>
        </el-form-item>
      </el-form>
      <!--底部区域-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrder">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改订单信息对话框 -->
    <el-dialog
      title="修改订单信息"
      :visible.sync="modifyDialogVisible"
      width="50%"
      @close="modifyDialogClose"
    >
      <el-form
        :model="modifyForm"
        :rules="modifyFormRules"
        ref="modifyFormRef"
        label-width="100px"
      >
        <el-form-item label="订单编号" prop="order_no">
          <el-input v-model="modifyForm.order_no" disabled></el-input>
        </el-form-item>
        <el-form-item label="订单类型" prop="order_type">
          <el-select v-model="modifyForm.order_type">
            <el-option
              v-for="item in order_type_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户姓名" prop="order_consumer_name">
          <el-input v-model="modifyForm.order_consumer_name"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="order_consumer_idnum">
          <el-input v-model="modifyForm.order_consumer_idnum"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="order_consumer_phonenum">
          <el-input v-model="modifyForm.order_consumer_phonenum"></el-input>
        </el-form-item>
        <el-form-item label="二级代理ID" prop="order_agent2_id">
          <el-input v-model="modifyForm.order_agent2_id"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="modifyOrderInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    // 自定义手机号校验规则
    var checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        // 合法的手机号
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }
    // 自定义身份证号校验规则
    var checkIdNo = (rule, value, callback) => {
      const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
      if (value === '' || value === undefined || value === null) {
        callback()
      } else {
        if (!reg.test(value) && value !== '') {
          callback(new Error('请输入正确的身份证号码'))
        } else {
          callback()
        }
      }
    }
    return {
      // 订单列表查询参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      // 订单列表
      orderList: [],
      // 控制添加订单信息对话框的显示与隐藏
      addDialogVisible: false,
      // 添加订单信息的表单数据
      addOrderForm: {
        order_type: 1,
        order_consumer_name: '',
        order_consumer_phonenum: '',
        order_consumer_idnum: '',
        order_agent2_id: null
      },
      // 修改订单信息对话框
      modifyDialogVisible: false,
      // 要修改的订单信息对象
      modifyForm: {},
      modifyFormRules: {
        order_type: [
          { required: true, message: '请输入订单类型', trigger: 'blur' }
        ],
        order_consumer_name: [
          { required: true, message: '请输入客户姓名', trigger: 'blur' }
        ],
        order_consumer_phonenum: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
        order_consumer_idnum: [
          { required: true, message: '请输入身份证号', trigger: 'blur' },
          { validator: checkIdNo, trigger: 'blur' }
        ],
        order_agent2_id: [
          { required: true, message: '请输入二级代理ID', trigger: 'blur' }
        ]
      },
      // 添加订单信息验证规则对象
      addOrderFormRules: {
        order_type: [
          { required: true, message: '请输入订单类型', trigger: 'blur' }
        ],
        order_consumer_name: [
          { required: true, message: '请输入客户姓名', trigger: 'blur' }
        ],
        order_consumer_phonenum: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
        order_consumer_idnum: [
          { required: true, message: '请输入身份证号', trigger: 'blur' },
          { validator: checkIdNo, trigger: 'blur' }
        ],
        order_agent2_id: [
          { required: true, message: '请输入二级代理ID', trigger: 'blur' }
        ]
      },
      order_type_options: [
        {
          value: 1,
          label: '两百打一年'
        },
        {
          value: 2,
          label: '三百打两年'
        }
      ]
    }
  },
  created () {
    this.getOrderList()
  },
  methods: {
    async getOrderList () {
      const { data: res } = await this.$http({
        url: '/cu_admin/order/getorders',
        method: 'get',
        params: this.queryInfo
      })
      this.orderList = res.data
      this.total = res.totalpage
    },
    // 修改订单信息
    editOrder (orderInfo) {
      this.modifyForm = orderInfo
      this.modifyDialogVisible = true
    },
    // 添加订单信息
    addOrder () {
      // 预校验
      this.$refs.addOrderFormRef.validate(async (valid, field) => {
        if (!valid) {
          const arr = Object.keys(field)
          return this.$message.error({
            message: field[arr[0]][0].message,
            duration: 1500
          })
        }
        // 发起网络请求
        const { data: res } = await this.$http.post(
          '/cu_admin/order/addorder',
          this.addOrderForm
        )
        if (res !== 'success') {
          return this.$message.error(res)
        }
        this.$message.success('添加用户成功')
        this.addDialogVisible = false
        // 重新获取用户列表
        this.getOrderList()
      })
    },
    // 监听添加用户对话框的关闭事件
    addDialogClosed () {
      // 重置表单内容
      this.$refs.addrOderFormRef.resetFields()
    },

    // 修改订单信息
    modifyOrderInfo () {
      this.$refs.modifyFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          '/cu_admin/order/modifyorder',
          this.modifyForm
        )
        if (res !== 'success') {
          return this.$message.error({
            message: '修改订单信息失败',
            duration: 1500
          })
        }
        this.$message.success('修改信息成功')
        this.modifyDialogVisible = false
        this.getOrderList()
      })
    },
    // 删除订单
    async delteOrder (orderInfo) {
      // cancel confirm
      const result = await this.$confirm(
        '此操作将永久删除该订单, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(reason => reason)
      // 取消删除
      if (result === 'cancel') {
        return this.$message({
          message: '已取消删除',
          duration: 1500
        })
      }
      const { data: res } = await this.$http({
        url: '/cu_admin/order/deleteorder',
        method: 'get',
        params: {
          id: orderInfo.order_id
        }
      })
      // 删除失败
      if (res !== 'success') {
        return this.$message.error({
          message: '删除订单失败',
          duration: 1500
        })
      }
      this.$message.success({
        message: '删除订单成功!',
        duration: 1500
      })
      this.getOrderList()
    },
    // 修改订单信息对话框关闭
    modifyDialogClose () {
      this.$refs.modifyFormRef.resetFields()
    },
    // 分页
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    handleCurrentChange (newSize) {
      this.queryInfo.pagenum = newSize
      this.getOrderList()
    },
    showEditDialog () {
      this.addressDialogVisible = true
    },
    addressDialogClosed () {
      this.$refs.addressFormRef.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>
