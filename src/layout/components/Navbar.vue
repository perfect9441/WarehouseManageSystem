<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container"
               @toggleClick="toggleSideBar"/>

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container"/>

    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <search id="header-search" class="right-menu-item"/>

        <error-log class="errLog-container right-menu-item hover-effect"/>

        <message-box class=" right-menu-item hover-effect"/>

        <screenfull id="screenfull" class="right-menu-item hover-effect"/>

        <el-tooltip content="Global Size" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect"/>
        </el-tooltip>

      </template>

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          
          <img :src="avatar" class="user-avatar">
          <i class="el-icon-caret-bottom"/>
        </div>
        <el-dropdown-menu slot="dropdown">
          <!--          <router-link to="/profile/index">-->
          <!--            <el-dropdown-item>Profile</el-dropdown-item>-->
          <!--          </router-link>-->
          <!--          <router-link to="/">-->
          <!--            <el-dropdown-item>Dashboard</el-dropdown-item>-->
          <!--          </router-link>-->
          <!--          <a target="_blank" href="https://github.com/PanJiaChen/vue-element-admin/">-->
          <!--            <el-dropdown-item>Github</el-dropdown-item>-->
          <!--          </a>-->
          <!--          <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">-->
          <!--            <el-dropdown-item>Docs</el-dropdown-item>-->
          <!--          </a>-->
          <el-dropdown-item>
            <!-- <span style="display:block;" @click="changePassword">修改密码</span> -->
          </el-dropdown-item>
          <!--divided是分割线-->
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <!-- <el-dialog title="修改密码" :visible.sync="dialogFormVisible" :before-close="handleDialogClose">

      <el-form ref="changePasswordForm" :rules="changePasswordRules" :model="changePasswordItem" label-position="right" label-width="120px"
               style="width: 400px; margin-left:50px;">
        <el-form-item label="账号" >
          <el-input v-model="changePasswordItem.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input v-model="changePasswordItem.password" clearable show-password></el-input>
        </el-form-item>
        <el-form-item label="再次输入密码" prop="passwordConfirm">
          <el-input v-model="changePasswordItem.passwordConfirm" clearable show-password></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="handleDialogClose">
            取消
          </el-button>
          <el-button type="primary" @click="handleChangePassword" :loading="btnLoading">
            确定
          </el-button>
      </span>
    </el-dialog> -->

  </div>
</template>

<script>

    import Breadcrumb from '@/components/Breadcrumb'
    import Hamburger from '@/components/Hamburger'
    import ErrorLog from '@/components/ErrorLog'
    import Screenfull from '@/components/Screenfull'
    import SizeSelect from '@/components/SizeSelect'
    import Search from '@/components/HeaderSearch'
    import MessageBox from '@/components/MessageBox'
    // import {
    //     modifyPassword
    // } from '@/api/user'

    import {
        mapMutations,
        mapGetters,
        mapActions
    } from 'vuex'

    export default {

        data() {
           var validatePasswordConfirm=(rule, value, callback)=>{
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.changePasswordItem.password) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            }
            return {
                dialogFormVisible: false,
                btnLoading: false,
                changePasswordItem: {},
                changePasswordRules: {
                    password: [{required: true, message: '请输入新密码', trigger: 'blur'},
                        {min: 8, message: '密码位数要大于8位', trigger: 'blur'}
                    ],
                    passwordConfirm: [ {required: true, validator: validatePasswordConfirm, trigger: 'blur' },

                    ],

                },
            }
        },
        components: {
          MessageBox,
            Breadcrumb,
            Hamburger,
            ErrorLog,
            Screenfull,
            SizeSelect,
            Search
        },
        computed: {
            ...mapGetters([
                // 'userInfo',
               
                'sidebar',
                'avatar',
                'device'
            ])
        },
        methods: {
            resetSubmitItem(){
                this.changePasswordItem.password=null
                this.changePasswordItem.passwordConfirm=null
            },
            handleDialogClose(){
                this.resetSubmitItem()
                this.dialogFormVisible=false
            },
            toggleSideBar() {
                this.$store.dispatch('app/toggleSideBar')
            },
            async logout() {
                await this.$store.dispatch('user/logout')
                // this.$router.push(`/login?redirect=${this.$route.fullPath}`)
                //处理退出后重新进入账号404的问题
                this.$router.push(`/login`)
            },
            // changePassword() {
            //     this.changePasswordItem.adminId=this.userInfo.adminId
            //     this.changePasswordItem.username=this.userInfo.username
            //     this.dialogFormVisible = true
            // },

            handleChangePassword() {
                this.$refs['changePasswordForm'].validate((valid) => {
                    if (valid) {
                        this.btnLoading=true
                        modifyPassword(this.changePasswordItem).then(res=>{

                            console.info('modifyPassword')
                            console.info(res)
                            if(res.data==true){
                                this.$message({
                                    message: '密码修改成功',
                                    type: 'success'
                                });
                                this.btnLoading=false
                                this.dialogFormVisible=false
                            }else{
                                this.$message({
                                    message: '密码修改失败，请稍后重试',
                                    type: 'error'
                                });
                                this.btnLoading=false
                            }


                        }).catch(err=>{
                            console.info('modifyPassword===ERR')
                            console.info(err)
                            this.btnLoading=false

                        })



                    }
                })

            },
        }
    }
</script>

<style lang="scss" scoped>
  .navbar {
    height: 50px;
    overflow: hidden;
    position: relative;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

    .hamburger-container {
      line-height: 46px;
      height: 100%;
      float: left;
      cursor: pointer;
      transition: background .3s;
      -webkit-tap-highlight-color: transparent;

      &:hover {
        background: rgba(0, 0, 0, .025)
      }
    }

    .breadcrumb-container {
      float: left;
    }

    .errLog-container {
      display: inline-block;
      vertical-align: top;
    }

    .right-menu {
      float: right;
      height: 100%;
      line-height: 50px;

      &:focus {
        outline: none;
      }

      .right-menu-item {
        display: inline-block;
        padding: 0 8px;
        height: 100%;
        font-size: 18px;
        color: #5a5e66;
        vertical-align: text-bottom;

        &.hover-effect {
          cursor: pointer;
          transition: background .3s;

          &:hover {
            background: rgba(0, 0, 0, .025)
          }
        }
      }

      .avatar-container {
        margin-right: 30px;

        .avatar-wrapper {
          margin-top: 5px;
          position: relative;

          .user-avatar {
            cursor: pointer;
            width: 40px;
            height: 40px;
            border-radius: 10px;
          }

          .el-icon-caret-bottom {
            cursor: pointer;
            position: absolute;
            right: -20px;
            top: 25px;
            font-size: 12px;
          }
        }
      }
    }
  }
</style>
