<script lang="ts" setup>
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

let ColorList = ["2F7FB4","2F7FB4","FCA773","2F7FB4","FCA773","2F7FB4","FCA773","2F7FB4","FCA773","EB7089","33A894","2F7FB4","FCA773","EB7089","33A894","2F7FB4"]

onMounted(() => {
  let root = am5.Root.new("chatAm");
  root.setThemes([am5themes_Animated.new(root)]);
  var chart = root.container.children.push(
    am5xy.XYChart.new(root, {
      panX: false,
      panY: false,
      wheelX: "none",
      wheelY: "none"
    })
  );

// Add cursor
// https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
  var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
  cursor.lineY.set("visible", false);

// Create axes
// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
  var xRenderer = am5xy.AxisRendererX.new(root, {minGridDistance: 30});
  xRenderer.labels.template.setAll({text: "{realName}"});

  var xAxis = chart.xAxes.push(
    am5xy.CategoryAxis.new(root, {
      maxDeviation: 0,
      categoryField: "category",
      renderer: xRenderer,
      tooltip: am5.Tooltip.new(root, {
        autoTextColor:false,
        labelText: "{realName}"
      })
    })
  );
  var yAxis = chart.yAxes.push(
    am5xy.ValueAxis.new(root, {
      maxDeviation: 0.3,
      renderer: am5xy.AxisRendererY.new(root, {})
    })
  );

  var yAxis2 = chart.yAxes.push(
    am5xy.ValueAxis.new(root, {
      maxDeviation: 0.3,
      syncWithAxis: yAxis,
      renderer: am5xy.AxisRendererY.new(root, {opposite: true})
    })
  );

// Create series
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
  var series = chart.series.push(
    am5xy.ColumnSeries.new(root, {
      name: "Series 1",
      xAxis: xAxis,
      yAxis: yAxis2,
      valueYField: "value",
      sequencedInterpolation: true,
      categoryXField: "category",
      tooltip: am5.Tooltip.new(root, {
        labelText: "{provider} {realName}: {valueY}",
      })
    })
  );

  series.columns.template.setAll({
    fillOpacity: 0.9,
    strokeOpacity: 0
  });
  series.columns.template.adapters.add("fill", (fill, target) => {
    // return chart.get("colors").getIndex(series.columns.indexOf(target));
    // console.log(chart.get("colors").getIndex(series.columns.indexOf(target)))
    console.log(ColorList[series.columns.indexOf(target)])
    return "#" + ColorList[series.columns.indexOf(target)]
  });

  series.columns.template.adapters.add("stroke", (stroke, target) => {
    return chart.get("colors").getIndex(series.columns.indexOf(target));
  });
  var chartData = [];

// Set data
  var data = {
    "给水": {
      "生活用水": 401733.1158,
    },
    "排水": {
      "污水": 10898.25866,
      "雨污合流": 472229.2733,
    },
    "燃气": {
      "煤气": 176760.2186,
      "天然气": 188824.2482,
    },
    "电力": {
      "供电": 629409.8343,
      "路灯": 129824.7917,
      "电车": 24320.23042,
      "交通信号": 84090.65562,
    },
    "通信": {
      "电信电缆": 281604.6765,
      "有线电视": 2551.646692,
      "信息": 472112.0934,
      "其他": 14803.37644,
    },
    "其他": {
      "不明管线": 12915.80299,
    }
  };

// process data ant prepare it for the chart
  for (var providerName in data) {
    var providerData = data[providerName];
    // add data of one provider to temp array
    var tempArray = [];
    var count = 0;
    // add items
    for (var itemName in providerData) {
      if (itemName != "quantity") {
        count++;
        // we generate unique category for each column (providerName + "_" + itemName) and store realName
        tempArray.push({
          category: providerName + "_" + itemName,
          realName: itemName,
          value: providerData[itemName],
          provider: providerName
        });
      }
    }
    // sort temp array
    tempArray.sort(function (a, b) {
      if (a.value > b.value) {
        return 1;
      } else if (a.value < b.value) {
        return -1;
      } else {
        return 0;
      }
    });

    // add quantity and count to middle data item (line series uses it)
    var lineSeriesDataIndex = Math.floor(count / 2);
    tempArray[lineSeriesDataIndex].quantity = providerData.quantity;
    tempArray[lineSeriesDataIndex].count = count;
    // push to the final data
    am5.array.each(tempArray, function (item) {
      chartData.push(item);
    });

    // // create range (the additional label at the bottom)
    // series.columns.template.states.create("给水", {
    //   fill: am5.color(0x76b041),
    //   stroke: am5.color(0x76b041)
    // });
    var range = xAxis.makeDataItem({});
    xAxis.createAxisRange(range);

    range.set("category", tempArray[0].category);
    range.set("endCategory", tempArray[tempArray.length - 1].category);

    var label = range.get("label");


    //设置最底部分组大类
    label.setAll({
      text: tempArray[0].provider,
      dy: 30,
      fontWeight: "bold",
      fill:"#BEBEBE",
      tooltipText: tempArray[0].provider
    });

    var tick = range.get("tick");
    tick.setAll({visible: true, strokeOpacity: 1, length: 50, location: 0});

    var grid = range.get("grid");
    grid.setAll({strokeOpacity: 1});
  }

  var range = xAxis.makeDataItem({});
  xAxis.createAxisRange(range);
  range.set("category", chartData[chartData.length - 1].category);
  var tick = range.get("tick");
  tick.setAll({visible: true, strokeOpacity: 1, length: 50, location: 1});

  var grid = range.get("grid");
  grid.setAll({strokeOpacity: 1, location: 1});

  xAxis.data.setAll(chartData);
  series.data.setAll(chartData);

  series.appear(1000);
  chart.appear(1000, 100);
})
</script>

<template>
  <div id="chatAm"></div>
</template>


<style scoped lang="scss">
#chatAm {
  width: 700PX;
  height: 500PX;
}
</style>