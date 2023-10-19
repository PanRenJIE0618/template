<script lang="ts" setup>
import * as echarts from 'echarts';

let props = defineProps({
  width: {
    type: String,
    default: 1000
  },
  height:{
    type:String,
    default:500
  },
  Data:{
    type:Object,
    default:[]
  },
  id:{
    type:String,
  }
})
const store = useStore();
let myChart = reactive<any>({})
// 基于准备好的dom，初始化echarts实例
onMounted(() => {
  myChart = echarts.init(document.getElementById(props.id), null, {
    width: props.width,
    height: props.height
  });
  let de = "#" + props.id
  $(de)[0].style.width = props.width + "px"
  $(de)[0].style.height = props.height + "px"
  // $(de)[0].style.margin = "100px auto auto auto"
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