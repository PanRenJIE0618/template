<script lang="ts" setup>
import Barcharts from "../../components/Echarts/barcharts.vue";
import Gauge from "../../components/Echarts/gauge.vue";
import Virtual_polyline from "../../components/Echarts/Virtual_polyline.vue";
import AmDemo from "../../components/amcharts/Am.vue"

let category = ['PVC', '铸铁', '水泥', '钢', '砼', '砖石混', '石棉水泥', '复合材料', '聚乙烯', '铜', '光纤', '玻璃钢']
let barData = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    },
    formatter: (params: any) => {
      let par = params[0]
      return `${category[par.dataIndex]}<br />${par.name}:${par.value}%`
    }
  },
  xAxis: {
    type: 'category',
    data: ['PVC', 'ZT', 'SN', 'G', 'T', 'ZH', 'SM','FH','PE','CU','GX','BL'],
    data1: category,
    axisLabel:{
      margin:15,
      fontSize:11,
      color:"#FFF"
    },
    axisLine:{
      show:false
    },
    axisTick:{
      alignWithLabel:true,
      length:10,
      lineStyle:{
        color:"#2a4469"
      }
    }
  },
  yAxis: {
    type: 'value',
    max: 100,
    axisLabel:{
      formatter:'{value}%',
      color:"#FFF"
    },
    splitLine:{
      lineStyle:{
        color:'#2a4469'
      }
    }
  },
  series: [
    {
      data: [50, 60, 60, 80, 60, 30, 90,60,30,55,55,90],
      type: 'bar',
      barWidth: 27,
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 1,
              color: "rgba(0, 29, 36,0.4)" // 0% 处的颜色
            },
            {
              offset: 0,
              color: '#0BF7F8' // 100% 处的颜色
            }
          ],
          global: false // 缺省为 false
        },
        borderRadius: [14,14,0,0]
      }
    }
  ]
};
let gauge = {
  grid: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  },
  series: [
    {
      type: 'gauge',
      center: ['50%', '70%'],
      startAngle: 180,
      endAngle: -0,
      min: 0,
      max: 100,
      splitNumber: 12,
      radius: '90%',
      itemStyle: {
        color: '#FFAB91'
      },
      progress: {
        show: true,
        width: 80
      },
      pointer: {
        show: false
      },
      axisLine: {
        roundCap: true,
        lineStyle: {
          color: [[1, 'rgba(11, 131, 114,0.4)']],
          width: 50
        }
      },
      axisTick: {
        distance: -70,
        splitNumber: 5,
        lineStyle: {
          width: 10,
          color: '#00E5C4'
        }
      },
      splitLine: {
        show: false
      },
      axisLabel: {
        show: false
      },
      anchor: {
        show: false
      },
      title: {
        show: false
      },
      detail: {
        show: false
      },
      data: [
        {
          value: 0
        }
      ]
    },
    {
      type: 'gauge',
      center: ['50%', '70%'],
      startAngle: 180,
      endAngle: -0,
      min: 0,
      max: 100,
      itemStyle: {
        color: '#1EFFD7'
      },
      radius: '82%',
      progress: {
        roundCap: true,
        show: true,
        width: 15
      },
      pointer: {
        show: false
      },
      axisLine: {
        roundCap: true,
        lineStyle: {
          width: 15,
          color: [[1, 'rgba(0, 229, 196,0.4)']]
        }
      },
      axisTick: {
        distance: 40,
        splitNumber: 5,
        lineStyle: {
          width: 25,
          color: '#00E5C4'
        }
      },
      splitLine: {
        show: false
      },
      axisLabel: {
        show: false
      },
      detail: {
        valueAnimation: true,
        width: '60%',
        lineHeight: 40,
        borderRadius: 8,
        offsetCenter: [0, '-5%'],
        fontSize: 45,
        fontWeight: 'bolder',
        formatter: '{value}',
        color: 'inherit'
      },
      data: [
        {
          value: 76
        }
      ]
    }
  ]
};

let dt = reactive<any>({});
let categoryBar = reactive<any>([]);
let dottedBase = +new Date();
let lineData = reactive<any>([]);
let initFlowBar = () => {
  let date = [new Date((dottedBase += 3600 * 24 * 365000)).getFullYear()].join('-');
  let userNumber = (Math.random() * 100 + Math.random() * 200).toFixed(0)
  categoryBar.push(date);
  lineData.push(userNumber);
  return date
}
for (let i = 0; i < 8; i++) {
  initFlowBar()
}
dt = setInterval(() => {
  let date =  initFlowBar()
  categoryBar.shift() && lineData.shift()
  if (date >= '2040') {
    dottedBase = +new Date();
  }
}, 2000)
let flowBarData = reactive({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    },
    formatter: (params: any) => {
      let par = params[0]
      return `${par.name}<br />${par.seriesName}:${par.value}`
    }
  },
  xAxis: {
    data: categoryBar,
    axisLine: {
      show: false,
      lineStyle: {
        color: '#ccc'
      }
    },
    axisTick: {
      show: false,
      alignWithLabel: true
    }
  },
  yAxis: {
    show: false,
    max:300
  },
  series: [
    {
      name: 'bar',
      type: 'line',
      smooth: true,
      showAllSymbol: true,
      symbol: 'emptyCircle',
      symbolSize: 10,
      data: lineData,
      itemStyle: {
        color: "#1eb8ff",
      },
      lineStyle: {
        width: 5
      }
    },
    {
      name: 'line',
      type: 'bar',
      barGap: '-100%',
      barWidth: 10,
      z: -12,
    },
    {
      name: 'dotted',
      type: 'pictorialBar',
      symbol: 'rect',
      itemStyle: {
        color: "#1eb8ff"
      },
      z: -10,
      barWidth: 10,
      data: lineData
    }
  ]
})

listenMsg(({type,content}:any)=>{
  console.log(type)
  console.log(content)
})

onUnmounted(() => {
  clearInterval(dt)
})
console.log("")
</script>

<template>
  <div class="echarts">
    <div class="Bar">
      <Barcharts :width="500" :height="400" :Data="barData" ></Barcharts>
      <Virtual_polyline :width="500" :height="400" :Data="flowBarData" id="flow"></Virtual_polyline>
    </div>
    <div class="Gauge">
      <Gauge :width="500" :height="400" :Data="gauge" id="gauge"></Gauge>
    </div>
    <div>
      <AmDemo></AmDemo>
    </div>
  </div>
</template>


<style scoped lang="scss">
.echarts {
  .Bar {
    display: flex;
  }
}
</style>