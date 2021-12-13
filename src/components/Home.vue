<template>
  <el-container class="home-container">
    <!--头部区域-->
    <el-header>
      <div>
        <img src="../assets/logo1.png" alt="" />
        <span>订单管理系统</span>
      </div>
      <div>
        <div id="user-name">欢迎您：{{ username }}</div>
        <full-screen />
        <el-button type="info" @click="logout">退出</el-button>
      </div>
    </el-header>
    <!--页面主体区域-->
    <el-container>
      <!--侧边栏-->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!--侧边栏菜单区域-->
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
        >
          <!--一级菜单-->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menulist"
            :key="item.id"
          >
            <!--一级菜单的模板区域-->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>
            <!--二级菜单-->
            <!--开启router,index就是跳转的地址-->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState('/' + subItem.path)"
            >
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--右侧内容主题-->
      <el-main>
        <!--路由占位符-->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import FullScreen from './FullScreen/'

export default {
  data () {
    return {
      // 左侧菜单数据
      menulist: [],
      iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      // 边栏是否收起
      isCollapse: false,
      // 被激活的链接地址
      activePath: '/welcome',
      username: '',
      identity: ''
    }
  },
  components: {
    FullScreen
  },
  created () {
    this.username = window.sessionStorage.getItem('username')
    this.identity = window.sessionStorage.getItem('identity')
    this.getMenuList(this.username, this.identity)
  },
  methods: {
    // 退出
    logout () {
      // window.sessionStorage.clear()
      this.$router.push('./login')
    },
    // 获取所有的菜单
    async getMenuList (username, identity) {
      if (identity === 'admin') {
        const { data: res } = await this.$http.get('/cu_admin/getmenus')
        this.menulist = res
      } else if (identity === 'agent1') {
        const { data: res } = await this.$http.get('/cu_admin/get1menus')
        this.menulist = res
      } else if (identity === 'agent2') {
        const { data: res } = await this.$http.get('/cu_admin/get2menus')
        this.menulist = res
      } else {
        return this.$message.error('身份认证出错，获取菜单失败')
      }
      // if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
    },
    // 单击按钮，控制折叠与展开
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    // 保存链接的激活状态
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}

.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    div {
      margin-right: 10px;
      font-size: 18px;
    }
    img {
      height: 45px;
    }
    span {
      margin-left: 15px;
    }
  }
}

.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #eaedf1;
}

.iconfont {
  margin-right: 10px;
}

.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
