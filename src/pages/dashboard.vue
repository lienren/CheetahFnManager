<template>
  <div class="page-main">
    <div class="box">
      <a-row>
        <a-col :span="1">
          <a-avatar icon="user" style="color: #fff; backgroundColor: #1890ff;"></a-avatar>
        </a-col>
        <a-col :span="17">
          <h3>早安，{{authInfo.fullName}}，祝你开心每一天！</h3>
          <div style="color:#666;">{{todayCalendar}} 农历{{lunarCalendar}}</div>
        </a-col>
        <a-col :span="6">
          <a-row>
            <a-col :span="8">
              <div style="position:relative;background-color:#f50;width:60px;height:60px;color:#fff;border-radius:60px;">
                <div style="position:absolute;width:100%;top:12px;font-size:24px;text-align:center;padding:0;margin:0;">18</div>
                <div style="position:absolute;width:100%;bottom:6px;font-size:10px;text-align:center;padding:0;margin:0;transform: scale(0.7);">门店数</div>
              </div>
            </a-col>
            <a-col :span="8">
              <div style="position:relative;background-color:#108ee9;width:60px;height:60px;color:#fff;border-radius:60px;">
                <div style="position:absolute;width:100%;top:12px;font-size:24px;text-align:center;padding:0;margin:0;">58</div>
                <div style="position:absolute;width:100%;bottom:6px;font-size:10px;text-align:center;padding:0;margin:0;transform: scale(0.7);">菜品数</div>
              </div>
            </a-col>
            <a-col :span="8">
              <div style="position:relative;background-color:#2db7f5;width:60px;height:60px;color:#fff;border-radius:60px;">
                <div style="position:absolute;width:100%;top:12px;font-size:24px;text-align:center;padding:0;margin:0;">12</div>
                <div style="position:absolute;width:100%;bottom:6px;font-size:10px;text-align:center;padding:0;margin:0;transform: scale(0.7);">商家数</div>
              </div>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </div>
    <div class="box nobg">
      <a-list :grid="{ gutter: 16, column: 4 }" :dataSource="stsData">
        <a-list-item slot="renderItem" slot-scope="item, index">
          <a-card :loading="stsDataLoading">
            <div style="color:rgba(0,0,0,.45);">{{item.title}}</div>
            <div style="font-size:30px;color:#333;">{{item.content}}</div>
            <a-divider style="margin:10px 0;" />
            <div style="font-size:14px;color:#666;">
              <span style="margin-right:5px;">{{item.sub.title}}</span>
              <span>{{item.sub.content}}</span>
            </div>
          </a-card>
        </a-list-item>
      </a-list>
    </div>

    <div class="box">
      <a-tabs>
        <a-tab-pane tab="销售额" key="1">
          <a-row>
            <a-col :span="16">
              <ve-histogram :data="chartData1" :extend="chartExtend"></ve-histogram>
            </a-col>
            <a-col :span="8">
              <a-card :bordered="false">
                <p style="color:#333;font-weight:bold;font-size:14px;">门店销售额排行</p>
                <a-list :dataSource="storeData">
                  <a-list-item slot="renderItem" slot-scope="item, index">
                    <a-list-item-meta>
                      <div slot="title">{{item.name}}</div>
                      <a-avatar slot="avatar" :style="{backgroundColor:item.sort<4?'#f56a00':'#aaa'}" size="small">{{item.sort}}</a-avatar>
                    </a-list-item-meta>
                    <div>{{item.sales}}</div>
                  </a-list-item>
                </a-list>
              </a-card>
            </a-col>
          </a-row>
        </a-tab-pane>
        <a-tab-pane tab="访问量" key="2">
          <a-row>
            <a-col :span="16">
              <ve-histogram :data="chartData2" :extend="chartExtend"></ve-histogram>
            </a-col>
            <a-col :span="8">
              <a-card :bordered="false">
                <p style="color:#333;font-weight:bold;font-size:14px;">门店访问量排行</p>
                <a-list :dataSource="storeData">
                  <a-list-item slot="renderItem" slot-scope="item, index">
                    <a-list-item-meta>
                      <div slot="title">{{item.name}}</div>
                      <a-avatar slot="avatar" :style="{backgroundColor:item.sort<4?'#f56a00':'#aaa'}" size="small">{{item.sort}}</a-avatar>
                    </a-list-item-meta>
                    <div>{{item.sales}}</div>
                  </a-list-item>
                </a-list>
              </a-card>
            </a-col>
          </a-row>
        </a-tab-pane>
        <a-range-picker slot="tabBarExtraContent" :placeholder="['开始日期', '结束日期']" />
      </a-tabs>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  components: {},
  data () {
    return {
      stsData: [
        {
          title: '总销售额',
          content: '¥126,560',
          sub: {
            title: '日均销售额',
            content: '¥1,009'
          }
        },
        {
          title: '总访问量',
          content: '8,846',
          sub: {
            title: '日均访问量',
            content: '108'
          }
        },
        {
          title: '总下单笔数',
          content: '6,560',
          sub: {
            title: '日均下单笔数',
            content: '205'
          }
        },
        {
          title: '总支付笔数',
          content: '5,860',
          sub: {
            title: '日均支付笔数',
            content: '198'
          }
        }
      ],
      stsDataLoading: true,
      chartExtend: {
        series: {
          label: { show: true, position: 'top' }
        }
      },
      chartData1: {
        columns: ['日期', '销售额', '订单量'],
        rows: [
          { '日期': '1号', '销售额': 1393, '订单量': 139 },
          { '日期': '2号', '销售额': 3530, '订单量': 353 },
          { '日期': '3号', '销售额': 2923, '订单量': 292 },
          { '日期': '4号', '销售额': 1723, '订单量': 172 },
          { '日期': '5号', '销售额': 3792, '订单量': 379 },
          { '日期': '6号', '销售额': 4593, '订单量': 459 },
          { '日期': '7号', '销售额': 1393, '订单量': 139 },
          { '日期': '8号', '销售额': 3530, '订单量': 353 },
          { '日期': '9号', '销售额': 2923, '订单量': 292 },
          { '日期': '10号', '销售额': 1723, '订单量': 172 },
          { '日期': '11号', '销售额': 3792, '订单量': 379 },
          { '日期': '12号', '销售额': 4593, '订单量': 459 }
        ]
      },
      chartData2: {
        columns: ['日期', '访问量', '订单量'],
        rows: [
          { '日期': '1号', '访问量': 1393, '订单量': 139 },
          { '日期': '2号', '访问量': 3530, '订单量': 353 },
          { '日期': '3号', '访问量': 2923, '订单量': 292 },
          { '日期': '4号', '访问量': 1723, '订单量': 172 },
          { '日期': '5号', '访问量': 3792, '订单量': 379 },
          { '日期': '6号', '访问量': 4593, '订单量': 459 },
          { '日期': '7号', '访问量': 1393, '订单量': 139 },
          { '日期': '8号', '访问量': 3530, '订单量': 353 },
          { '日期': '9号', '访问量': 2923, '订单量': 292 },
          { '日期': '10号', '访问量': 1723, '订单量': 172 },
          { '日期': '11号', '访问量': 3792, '订单量': 379 },
          { '日期': '12号', '访问量': 4593, '订单量': 459 }
        ]
      },
      storeData: [{
        sort: 1,
        name: '玄武区门店',
        sales: '¥1,009'
      },
      {
        sort: 2,
        name: '白下区门店',
        sales: '¥1,009'
      },
      {
        sort: 3,
        name: '秦淮区门店',
        sales: '¥1,009'
      },
      {
        sort: 4,
        name: '建邺区门店',
        sales: '¥1,009'
      }, {
        sort: 5,
        name: '鼓楼区门店',
        sales: '¥1,009'
      },
      {
        sort: 6,
        name: '浦口区门店',
        sales: '¥1,009'
      }]
    }
  },
  computed: {
    ...mapState({
      authInfo: state => state.auth.authInfo
    }),
    todayCalendar () {
      return this.$utils.Date.format(new Date(), 'yyyy年M月d日') + ' ' + this.$utils.Date.getWeek()
    },
    lunarCalendar () {
      return this.$utils.Date.getLunarCalendar()
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
      let $this = this
      window.setTimeout(() => {
        $this.stsDataLoading = false
      }, 1500)
    },
    addBadge () {
      this.$store.commit('SET_BADGE', this.$store.state.auth.badge + 1)
    },
    clearBadge () {
      this.$store.commit('SET_BADGE', 0)
    }
  }
}
</script>

<style scoped lang="less">
  .page-main {
    .box {
      padding: 20px;
      background-color: #fff;
      margin-bottom: 20px;
      border-radius: 2px;

      &.nobg {
        padding: 0;
        margin: 0;
        background-color: transparent;
      }
    }
  }
</style>
