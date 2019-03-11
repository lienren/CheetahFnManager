<template>
  <div>
    <h3>日志列表</h3>
    <iTable :toolbars="tableToolbars" :actionButtons="tableActionBtns" :columns="tableColumns" :dataSource="tableData" :pagination="tablePagination" :height="tableHeight" @on-change="handleTableChange"></iTable>
    <a-drawer title="搜索条件" placement="top" :height="510" :closable="false" @close="onSearchClose" :visible="visibleSearch">
      <a-form>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="开始结束时间">
          <a-range-picker :placeholder="['开始日期', '结束日期']" @change="onChangeStartEndTime" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="名称">
          <a-input placeholder="请输入名称（选填）" v-model="searchTitle"></a-input>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="操作人">
          <a-input placeholder="请输入操作人（选填）" v-model="searchUser"></a-input>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="操作内容">
          <a-input placeholder="请输入操作内容（选填）" v-model="searchAction"></a-input>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="IP">
          <a-input placeholder="请输入IP（选填）" v-model="searchIp"></a-input>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="接口路径">
          <a-input placeholder="请输入接口路径（选填）" v-model="searchPath"></a-input>
        </a-form-item>
      </a-form>
      <div :style="{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
        }">
        <a-button :style="{marginRight: '8px'}" @click="onSearchClose">关闭</a-button>
        <a-button @click="onSearch" type="primary">搜索</a-button>
      </div>
    </a-drawer>
    <a-modal title="日志详细" v-model="isLogVisible" @ok="isLogVisible=false" okText="确认" cancelText="关闭">
      <a-form>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="编号">
          {{logDetail.id}}
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="名称">
          {{logDetail.title}}
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="操作人">
          {{logDetail.user}}
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="操作内容">
          {{logDetail.action}}
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="IP">
          {{logDetail.ip}}
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="接口地址">
          {{logDetail.path}}
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="请求参数">
          {{logDetail.req}}
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="返回参数">
          {{logDetail.resp}}
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="错误描述">
          {{logDetail.errorMsg}}
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="请求时间">
          {{logDetail.createTime}}
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="耗时(ms)">
          {{logDetail.costTime}}
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
      tableColumns: [],
      tableData: [],
      tablePagination: {},
      tableToolbars: [],
      tableActionBtns: [],
      visibleSearch: false,
      labelCol: {
        span: 4
      },
      wrapperCol: {
        span: 14
      },
      wrapperButtonCol: {
        span: 14, offset: 4
      },
      searchStartEndTime: [],
      searchStartEndTimeString: [],
      searchTitle: '',
      searchUser: '',
      searchAction: '',
      searchIp: '',
      searchPath: '',
      searchDirType: 'DESC',
      logDetail: {},
      isLogVisible: false
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
          icon: 'search',
          text: '搜索',
          click: (e) => {
            this.visibleSearch = true
          }
        },
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
          title: '名称',
          dataIndex: 'title',
          width: '15%'
        },
        {
          title: '操作人',
          dataIndex: 'user',
          width: '15%'
        }, {
          title: '操作内容',
          dataIndex: 'actionContent',
          width: '15%'
        }, {
          title: '时间',
          dataIndex: 'createTime',
          width: '20%'
        }, {
          title: '耗时',
          dataIndex: 'costTimeUnit',
          width: '15%'
        }, {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          width: '10%'
        }
      ]
      // 操作按钮
      this.tableActionBtns = [{
        model: 'button',
        text: '详细',
        icon: 'detail',
        click: (e) => {
          this.logDetail = e
          this.isLogVisible = true
        }
      }]
      // 分页
      this.tablePagination = {
        pageSize: 20,
        current: 1,
        total: 0
      }
    },
    initInfo () {
      this.searchStartEndTime = []
      this.searchStartEndTimeString = []
      this.searchTitle = ''
      this.searchUser = ''
      this.searchAction = ''
      this.searchIp = ''
      this.searchPath = ''
    },
    async fetch (param = {}) {
      if (this.searchStartEndTimeString.length === 0) {
        return
      }
      this.tableData = []
      let result = await api.getLogs({
        pageIndex: param.current,
        pageSize: param.pageSize,
        dirType: this.searchDirType,
        data: {
          title: this.searchTitle,
          user: this.searchUser,
          action: this.searchAction,
          ip: this.searchIp,
          path: this.searchPath,
          starttime: this.searchStartEndTimeString[0] + ' 00:00:00',
          endtime: this.searchStartEndTimeString[1] + ' 23:59:59'
        } })
      if (result) {
        result.data.data.forEach(item => {
          this.tableData.push({
            key: item.id,
            actionContent: item.action,
            costTimeUnit: item.costTime + 'ms',
            ...item
          })
        })
        this.tablePagination = {
          pageSize: param.pageSize,
          current: param.current,
          total: result.data.total
        }
      }
    },
    handleTableChange (val) {
      this.tablePagination = val.pagination
      this.fetch({
        ...this.tablePagination
      })
    },
    onSearchClose () {
      this.visibleSearch = false
    },
    onChangeStartEndTime (date, dateString) {
      this.searchStartEndTime = date
      this.searchStartEndTimeString = dateString
    },
    onSearch () {
      if (this.searchStartEndTimeString.length === 0) {
        this.$message.error(`请选择开始结束时间！`)
        return
      }
      this.onSearchClose()
      // 分页
      this.tablePagination = {
        pageSize: 20,
        current: 1,
        total: 0
      }
      this.fetch({
        ...this.tablePagination
      })
    }
  }
}
</script>
