<script setup>
import * as d3 from 'd3'
import cloud from 'd3-cloud'
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { storeToRefs } from 'pinia'

import { useDatasetsStore } from '@/stores/datasets.js';
import { toFloat } from '@/helpers/mathHelper.js';
import { throttle, debounce, refreshUI } from '@/helpers/logicHelper.js';

const store = useDatasetsStore()
const { datasetSamplesPrepared } = storeToRefs(store)

const counter = ref(0);
const wordcloud = ref(null);
const layout = ref(cloud());
const isDrawing = ref(false);

const timeSleep = 150;

const datasetSamples = computed(() => {
   return counter.value + JSON.stringify(datasetSamplesPrepared.value)
})

function incCounter() {
   ++counter.value
}

const throttleIncCounter = throttle(incCounter, timeSleep);

function showError(error) {
   if (wordcloud.value) {
      wordcloud.value.innerHTML = `<div class="error-message">${error}</div>`
   }
}

function showLoader() {
   if (wordcloud.value) {
      wordcloud.value.innerHTML = `<div class="loading"></div>`
   }
   return true
}

function hideLoader() {
   if (wordcloud.value) {
      d3.select(wordcloud.value).selectAll('.loading').remove();
   }
   return true
}

async function drawCloud() {
   if (!datasetSamplesPrepared.value) {
      return
   }

   if (isDrawing.value) {
      return debounce(drawCloud, timeSleep)
   }

   d3.select(wordcloud.value).selectAll('*').remove();

   isDrawing.value = true
   showLoader();
   await refreshUI(timeSleep);

   const samples = (datasetSamplesPrepared.value || []).sort((a, b) => a.weight - b.weight),
      words = (samples || []).map(function (d) { return { text: d.label, size: d.weight }; }),
      expected = samples.length,
      minWeight = samples.at(0).weight,
      maxWeight = samples.at(-1).weight;

   const minFont = 5, maxFont = 25;
   const rootDomRect = wordcloud.value.getBoundingClientRect()

   const fontSize = d3.scaleLinear().range([minFont, maxFont]).clamp(true)
   samples.length && fontSize.domain([+minWeight || 1, +maxWeight])


   let scale, wordScale = 1, tries = 0, tryLastWord = 0, arr = [], tryCount = 3, lastWordCount = 0, tryLastWordCount = tryCount - 1

   const width = Math.floor(rootDomRect.width - 20),
      height = Math.floor(rootDomRect.height - 20)

   const svg = d3.select(wordcloud.value).append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("display", "inline-block")
      .append("g")
      .attr("transform", "scale(" + 1 + ")translate(" + [width >> 1, height >> 1] + ")")

   layout.value
      .spiral('rectangular')
      .size([width, height])
      .words(words)
      .random(function (d) { return 0.5; })
      .padding(0)
      .rotate(0)
      .fontSize(function (t) {
         return fontSize(+t.size) * wordScale
      })
      .on("end", draw);

   layout.value.start();

   function draw(words) {
      if (words.length < expected) {
         arr.push(words.length)
         tries++;
         layout.value.stop();
         if (tries === tryCount) {
            const avg = arr.reduce((prev, next) => { return prev + next }, 0) / tryCount
            wordScale *= avg / expected
            wordScale *= 0.8
            tries = 0
            arr = []
         }
         if (lastWordCount === words.length) {
            tryLastWord++
         } else {
            lastWordCount = words.length;
            tryLastWord = 0
         }
         if (tryLastWord === tryLastWordCount) {
            return showError('Sorry, we cannot fit all words');
         }
         layout.value.start();
         return;
      }

      svg
         .selectAll("text")
         .data(words)
         .enter()
         .append("text")
         .style("font-size", function (d) { return d.size; })
         .style("fill", function (d, i) { return d3.schemeCategory10[i % 10]; })
         .attr("text-anchor", "middle")
         .style("font-family", "Impact")
         .attr("transform", function (d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
         })
         .text(function (d) { return d.text; });

      const svgDom = wordcloud.value.querySelector('svg'), svgDomRect = svgDom.getBoundingClientRect()
      let svgGDom = wordcloud.value.querySelector('svg > g'), svgGDomRect = svgGDom.getBoundingClientRect()
      const Xscale = width / svgGDomRect.width, Yscale = height / svgGDomRect.height;
      scale = toFloat(Math.min(Xscale, Yscale), 3)

      const partOfScale = scale / 1000;
      if (scale === toFloat(Xscale, 3)) {
         while (svgGDomRect.width * scale > width) {
            scale -= partOfScale;
         }
      } else {
         while (svgGDomRect.height * scale > height) {
            scale -= partOfScale;
         }
      }

      let translateX = width >> 1
      let translateY = height >> 1

      svg
         .attr("transform", "scale(" + 1 + ")translate(" + [
            translateX, translateY
         ] + ")")
         .attr("transform-origin", "center")
         .attr("transform-box", "fill-box")

      svgGDom = wordcloud.value.querySelector('svg > g'), svgGDomRect = svgGDom.getBoundingClientRect()
      let leftDiff = svgGDomRect.left - svgDomRect.left
      let rightDiff = svgDomRect.right - svgGDomRect.right
      let topDiff = svgGDomRect.top - svgDomRect.top
      let bottomDiff = svgDomRect.bottom - svgGDomRect.bottom

      svg
         .attr("transform", "scale(" + scale + ")translate(" + [
            translateX + (rightDiff - leftDiff) / 2, translateY + (bottomDiff - topDiff) / 2
         ] + ")")
   }
   hideLoader();
   isDrawing.value = false
}

onMounted(() => {
   window.addEventListener('resize', throttleIncCounter);
});

onUnmounted(() => {
   window.removeEventListener('resize', throttleIncCounter);
});


watch(datasetSamples, () => {
   drawCloud()
})
</script>


<template>
   <div class="wordcloud" ref="wordcloud"></div>
</template>

<style lang="scss" scoped>
.wordcloud {
   width: 100%;
   height: 100%;

   border: 1px solid black;
   box-sizing: border-box;

   display: flex;
   flex-direction: column;
   justify-content: center;
   align-items: center;
}
</style>