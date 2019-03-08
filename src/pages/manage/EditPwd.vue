<template>
  <div>
    <h3>修改密码</h3>
    <a-form>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label='原密码'>
        <a-input placeholder='请输入原密码' v-model="oldPwd" type="password" />
      </a-form-item>

      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label='新密码'>
        <a-input placeholder='请输入新密码' v-model="newPwd1" type="password" />
      </a-form-item>

      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label='再输一次'>
        <a-input placeholder='请再输一次新密码' v-model="newPwd2" type="password" />
      </a-form-item>

      <a-form-item :wrapperCol="wrapperButtonCol">
        <a-button-group>
          <a-button @click="clearAdminPwd">清空</a-button>
          <a-button type='primary' @click="editAdminPwd">确认保存</a-button>
        </a-button-group>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import api from '../../api/cheetah'
import { mapState } from 'vuex'

export default {
  components: { },
  data () {
    return {
      labelCol: {
        xs: { span: 4 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 10 },
        sm: { span: 10 }
      },
      wrapperButtonCol: {
        xs: { span: 10, offset: 4 },
        sm: { span: 10, offset: 4 }
      },
      oldPwd: '',
      newPwd1: '',
      newPwd2: ''
    }
  },
  computed: {
    ...mapState({
      authInfo: state => state.auth.authInfo
    })
  },
  created () { },
  beforeDestroy () { },
  mounted () {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    init () { },
    clearAdminPwd () {
      this.oldPwd = ''
      this.newPwd1 = ''
      this.newPwd2 = ''
    },
    editAdminPwd () {
      if (this.oldPwd === '') {
        this.$message.error(`请输入原始密码！`)
        return
      }
      if (this.newPwd1 === '') {
        this.$message.error(`请输入新密码！`)
        return
      }
      if (this.newPwd1 !== this.newPwd2) {
        this.$message.error(`两次密码输入不一致！`)
        return
      }
      let $this = this
      this.$confirm({
        title: '提示',
        content: '您确认要修改密码码？',
        okText: '确认修改',
        cancelText: '取消',
        async onOk  () {
          let result = await api.editManagementPwd(
            {
              adminName: $this.authInfo.loginName,
              old: $this.oldPwd,
              new: $this.newPwd1
            }
          )

          if (result) {
            $this.$message.success('密码修改成功！')
            $this.clearAdminPwd()
          }
        },
        onCancel () {}
      })
    }
  }
}
</script>
