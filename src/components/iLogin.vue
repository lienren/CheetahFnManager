<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div style="padding-top:20px;">
        <a-form>
          <a-form-item v-if="!loginButtonLoading">
            <a-input placeholder="请填写登录帐号" size="large" v-model="loginName">
              <a-icon slot="prefix" type="credit-card" />
              <a-icon v-if="loginName" slot="suffix" type="close-circle" @click="loginName=''" />
            </a-input>
          </a-form-item>
          <a-form-item v-if="!loginButtonLoading">
            <a-input placeholder="请填写登录密码" size="large" v-model="loginPwd" type="password">
              <a-icon slot="prefix" type="lock" />
              <a-icon v-if="loginPwd" slot="suffix" type="close-circle" @click="loginPwd=''" />
            </a-input>
          </a-form-item>
          <a-form-item v-if="!loginButtonLoading">
            <a-input-group compact>
              <a-input style="width:65%" placeholder="请填写右侧图文验证码" maxlength="4" size="large" v-model="imgCode">
                <a-icon slot="prefix" type="picture" />
                <a-icon v-if="imgCode" slot="suffix" type="close-circle" @click="imgCode=''" />
              </a-input>
              <a-button style="width:35%;" size="large" @click="channgeVerificationCodeImg">
                <img :src="imgBase64" alt="">
              </a-button>
            </a-input-group>
          </a-form-item>
          <a-form-item>
            <a-button :type="loginButtonType" size="large" style="width:100%;" @click="login" :loading="loginButtonLoading">{{loginButtonText}}</a-button>
          </a-form-item>
          <a-form-item>
            <p class="text-tip">PRESENTED BY LI.R&D TEAM 2018-2020.</p>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../api/cheetah'
// const dataNavs = require('../../datas/navs.json')

export default {
  components: {},
  data () {
    return {
      loginName: '',
      loginPwd: '',
      imgCode: '',
      imgCodeKey: '',
      imgBase64: '',
      loginButtonLoading: false,
      loginButtonText: '登 录',
      loginButtonType: 'primary'
    }
  },
  computed: {},
  created () { },
  beforeDestroy () { },
  mounted () {
    // 初始化登录信息
    this.$store.commit('AUTH_INIT')
    this.init()
  },
  methods: {
    async init () {
      this.channgeVerificationCodeImg()
    },
    async login () {
      if (this.loginName === '') {
        this.$message.error('请填写帐号信息！')
        return
      }

      if (this.loginPwd === '') {
        this.$message.error('请填写密码！')
        return
      }

      if (this.imgCode === '') {
        this.$message.error('请填写图文验证码！')
        return
      }

      if (this.imgCodeKey === '') {
        this.$message.error('请先获取图文验证码！')
        return
      }

      this.loginButtonLoading = true
      this.loginButtonText = '登录权限验证中，请稍后'

      let result = await api.login({
        'name': this.loginName,
        'password': this.loginPwd,
        'verificationKey': this.imgCodeKey,
        'verificationCode': this.imgCode
      }, {
        defFail: false
      })

      if (result.code === 200) {
        let tokenInfo = this.$utils.Jwt.getTokenInfo(result.data)
        window.$globalHub.$store.commit('SET_AUTH', {
          loginName: this.loginName,
          fullName: tokenInfo && tokenInfo.payload ? tokenInfo.payload.fullname : '未知',
          token: result.data,
          tokenInfo: tokenInfo
        })

        // 获取菜单列表
        result = await api.getManagementPage({
          adminName: this.loginName
        })
        if (result && result.data) {
          let pageDataToNavs = function (data) {
            return data.map(m1 => {
              return {
                id: m1.url,
                name: m1.name,
                icon: m1.icon,
                children: m1.children && m1.children.length > 0 ? m1.children.map(m2 => {
                  return {
                    id: m2.url,
                    name: m2.name,
                    purview: m2.permission ? m2.permission.split(',') : []
                  }
                }) : null
              }
            })
          }
          // console.log('pageDataToNavs:', pageDataToNavs)
          // window.$globalHub.$store.commit('SET_NAV', dataNavs)
          window.$globalHub.$store.commit('SET_NAV', pageDataToNavs(result.data))
        }
        this.$router.push({ path: '/dashboard' })
      } else {
        this.loginButtonLoading = false
        this.loginButtonText = '验证失败，请重新填写后再试一次'
        this.loginButtonType = 'danger'
        this.imgCode = ''
        this.channgeVerificationCodeImg()
      }
    },
    async channgeVerificationCodeImg () {
      this.imgCodeKey = this.$utils.Common.generateMixed(32)
      let result = await api.getVerificationCode({
        key: this.imgCodeKey
      })
      this.imgBase64 = 'data:image/png;base64,' + result.data
    }
  }
}
</script>

<style lang="less" rel="stylesheet/less">
  .login-wrap {
    .ms-login {
      position: relative;
      width: 380px;
      padding: 10px 20px 0;
      border-radius: 8px;
      background-color: rgba(0, 0, 0, 0.6);
      z-index: 1001;

      .ant-form-item {
        margin-bottom: 12px;

        .text-tip {
          color: #f1f1f1;
          text-align: center;
          font-size: 12px;
          padding: 0;
          margin: 0;
        }

        &:last-child {
          margin-bottom: 0 !important;
        }
      }
    }
  }
</style>
