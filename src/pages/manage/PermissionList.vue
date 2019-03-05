<template>
  <div>
    <h3>权限接口列表</h3>
    <iTable :toolbars="tableToolbars" :actionButtons="tableActionBtns" :columns="tableColumns" :dataSource="tableData" :pagination="tablePagination" :height="tableHeight" @on-change="handleTableChange"></iTable>
    <a-modal title="新增权限接口" v-model="createModalVisible" @ok="createModalAction" okText="保存" cancelText="取消">
      <a-form>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label='权限名称'>
          <a-input placeholder='请输入权限名称' v-model="info.name"></a-input>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label='权限值'>
          <a-input placeholder='请输入权限值' v-model="info.permission"></a-input>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label='权限组'>
          <a-input placeholder='请输入权限组' v-model="info.permissionGroup"></a-input>
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal title="修改权限接口" v-model="editModalVisible" @ok="editModalAction" okText="保存" cancelText="取消">
      <a-form>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label='权限名称'>
          <a-input placeholder='请输入权限名称' v-model="info.name"></a-input>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label='权限值'>
          <a-input placeholder='请输入权限值' v-model="info.permission"></a-input>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label='权限组'>
          <a-input placeholder='请输入权限组' v-model="info.permissionGroup"></a-input>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>

import api from '../../api/cheetah'
import { iTable } from '../../components/'

export default {
  components: {
    iTable
  },
  data () {
    return {
      labelCol: {
        span: 4
      },
      wrapperCol: {
        span: 14
      },
      wrapperButtonCol: {
        span: 14, offset: 4
      },
      tableColumns: [],
      tableData: [],
      tablePagination: {},
      tableToolbars: [],
      tableActionBtns: [],
      createModalVisible: false,
      editModalVisible: false,
      info: {
        id: 0,
        name: '',
        permission: '',
        permissionGroup: ''
      }
    }
  },
  computed: {
    tableHeight () {
      return this.$utils.Common.getWidthHeight().height - 188
    }
  },
  created () { },
  beforeDestroy () { },
  mounted () {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    init () {
      // 功能按钮
      this.tableToolbars = [
        {
          model: 'button',
          icon: 'reload',
          text: '刷新',
          click: () => {
            this.$message.success('刷新成功!')
            this.fetch({
              ...this.tablePagination
            })
          }
        },
        {
          model: 'button',
          icon: 'edit',
          text: '新增',
          click: () => {
            this.info = {
              id: 0,
              loginName: '',
              loginPwd: '',
              fullName: '',
              oldLoginPwd: '',
              newLoginPwd: '' }
            this.createModalVisible = true
          }
        }
      ]
      // 列头
      this.tableColumns = [
        {
          title: '编号',
          dataIndex: 'id',
          width: '10%'
        },
        {
          title: '权限名称',
          dataIndex: 'name',
          width: '15%'
        }, {
          title: '权限值',
          dataIndex: 'permission',
          width: '20%'
        }, {
          title: '权限组',
          dataIndex: 'permissionGroup',
          width: '20%'
        }, {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          width: '20%'
        }
      ]
      // 操作按钮
      this.tableActionBtns = [
        {
          model: 'button',
          text: '修改',
          icon: 'edit',
          purview: 'edit',
          click: (e) => {
            this.info = {
              id: e.id,
              name: e.name,
              permission: e.permission,
              permissionGroup: e.permissionGroup }
            this.editModalVisible = true
          }
        },
        {
          model: 'button',
          text: '删除',
          purview: 'delete',
          style: { color: '#ff0000' },
          icon: 'edit',
          confirm: {
            title: '确认要删除吗？',
            confirm: async (e) => {
              let result = await api.delPermission({
                permissionID: e.id
              })
              if (result) {
                this.$message.success('权限删除成功！')
                this.fetch({
                  ...this.tablePagination
                })
              }
            },
            cancel: (e) => { }
          }
        }
      ]
      // 分页
      this.tablePagination = {
        pageSize: 20,
        current: 1,
        total: 200
      }
      this.fetch({
        ...this.tablePagination
      })
    },
    async fetch (param = {}) {
      this.tableData = []
      let result = await api.getAllPermission(`?pageindex=${param.current}&pagesize=${param.pageSize}`)
      if (result) {
        result.data.forEach(item => {
          this.tableData.push({
            key: item.id,
            ...item
          })
        })
        this.tablePagination = {
          pageSize: param.pageSize,
          current: param.current,
          total: 0
        }
      }
    },
    handleTableChange (val) {
      this.tablePagination = val.pagination
      this.fetch({
        ...this.tablePagination
      })
    },
    async createModalAction () {
      if (this.info.name === '') {
        this.$message.error('请填写权限名称！')
        return
      }

      if (this.info.permission === '') {
        this.$message.error('请填写权限值！')
        return
      }

      if (this.info.permissionGroup === '') {
        this.$message.error('请填写权限组！')
        return
      }

      let result = await api.createPermission({
        'permissionName': this.info.name,
        'permission': this.info.permission,
        'group': this.info.permissionGroup
      })

      if (result) {
        this.$message.success('新增权限成功！')
        this.createModalVisible = false
        this.info = {
          id: 0,
          name: '',
          permission: '',
          permissionGroup: '' }
        this.fetch({
          ...this.tablePagination
        })
      }
    },
    async editModalAction () {
      if (this.info.name === '') {
        this.$message.error('请填写权限名称！')
        return
      }

      if (this.info.permission === '') {
        this.$message.error('请填写权限值！')
        return
      }

      if (this.info.permissionGroup === '') {
        this.$message.error('请填写权限组！')
        return
      }

      let result = await api.editPermission({
        'permissionName': this.info.name,
        'permission': this.info.permission,
        'group': this.info.permissionGroup
      })

      if (result) {
        this.$message.success('权限修改成功！')
        this.editModalVisible = false
        this.info = {
          id: 0,
          name: '',
          permission: '',
          permissionGroup: '' }
        this.fetch({
          ...this.tablePagination
        })
      }
    }
  }
}
</script>
