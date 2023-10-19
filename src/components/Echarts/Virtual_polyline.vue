<script lang="ts" setup>
import * as echarts from 'echarts';

let props = defineProps({
  id: {
    type: String,
  },
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
watch(props.Data,(newVal,oldVal)=>{
  crChart()
})
let myChart = reactive<any>({})
// 基于准备好的dom，初始化echarts实例
onMounted(() => {
  myChart = echarts.init(document.getElementById(`${props.id}`), null, {
    width: props.width,
    height: props.height
  });
  crChart()
})
let crChart = () => {
  myChart.setOption(props.Data);
}

</script>
<template>
  <div :id="props.id"></div>
</template>


<style scoped lang="scss">

</style>