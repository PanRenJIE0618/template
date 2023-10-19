<script lang="ts" setup>
import * as echarts from 'echarts';

let props = defineProps({
  width: {
    type: String,
    default: 1000
  },
  height: {
    type: String,
    default: 500
  },
  Data: {
    type: Object,
    default: []
  },
})
const store = useStore();
let myChart = reactive<any>({})
// 基于准备好的dom，初始化echarts实例
onMounted(() => {
  myChart = echarts.init(document.getElementById("BarCharts"), null, {
    width: props.width,
    height: props.height
  });
  $('#BarCharts')[0].style.width = props.width + "px"
  $('#BarCharts')[0].style.height = props.height + "px"
  crChart()
})
let crChart = () => {
  myChart.setOption(props.Data);
}

</script>
<template>
  <div id="BarCharts"></div>
</template>


<style scoped lang="scss">
</style>