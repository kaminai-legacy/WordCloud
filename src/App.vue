<script setup>
import DatasetManager from '@/components/DatasetManager.vue';
import Filter from '@/components/Filter.vue';
import WordCloud from '@/components/WordCloud.vue';
</script>

<template>
  <header>
    <h1>WordCloud</h1>
    <nav>
      <Filter/>
    </nav>
  </header>
  <aside>
    <DatasetManager/>
  </aside>
  <main>
    <WordCloud />
  </main>
</template>

<style scoped>
</style>
