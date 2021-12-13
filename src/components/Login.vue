<template>
  <div class="login_container">
    <div class="login_box">
      <!--头像区域-->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!--登录表单区域-->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginFormRules"
        label-width="0px"
        class="login_form"
      >
        <!--选择身份-->
        <el-select v-model="value" placeholder="请选择您的身份">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <!--用户名-->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="iconfont icon-user"
          ></el-input>
        </el-form-item>
        <!--密码-->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="iconfont icon-3702mima"
            type="password"
          ></el-input>
        </el-form-item>
        <!--按钮-->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      options: [
        { value: 'admin', label: '管理员' },
        { value: 'agent1', label: '一级代理' },
        { value: 'agent2', label: '二级代理' }
      ],
      value: '',
      // 这是登陆表单的数据绑定对象
      loginForm: {
        username: '',
        password: ''
      },
      // 这是表单的验证规则对象
      loginFormRules: {
        // 验证用户名和密码是否合法
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    // 绑定事件
    window.addEventListener('keydown', this.keyDown)
  },
  methods: {
    // 点击重置按钮，重置登录表单
    resetLoginForm () {
      this.$refs.loginFormRef.resetFields()
    },
    keyDown (e) {
      // 如果是回车则执行登录方法
      if (e.keyCode === 13) {
        this.login()
      }
    },
    login () {
      if (this.value === '') return this.$message.error('请选择您的身份')
      this.$refs.loginFormRef.validate(async (valid, field) => {
        // async,await用于简化promise操作，await只能修饰??
        if (!valid) {
          const arr = Object.keys(field)
          return this.$message.error({
            message: field[arr[0]][0].message,
            duration: 1500
          })
        }
        const { data: res } = await this.$http({
          url: '/cu_admin/login?identity=' + this.value,
          method: 'get',
          params: this.loginForm
        })
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success('登录成功')
        window.sessionStorage.setItem('identity', this.value)
        window.sessionStorage.setItem('username', this.loginForm.username)
        // 1. 将登录成功后的token,保存到客户端的sessionStorage中
        // 1.1 项目中除了登录之外的其他API接口，必须在登录之后才能访问
        // 1.2 token 只应在当前网站打开期间生效，所以将token保存在sessionStorage中,而不是localStorage中
        // window.sessionStorage.setItem('token', res.data.token)
        // 2. 通过编程实导航跳转到后台主页，路由地址是 /home
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 350px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }

  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
  .btns {
    display: flex;
    justify-content: flex-end;
  }
  .el-select {
    display: flex;
    justify-content: left;
    margin-bottom: 22px;
  }
}
</style>
