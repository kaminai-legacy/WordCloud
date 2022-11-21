<script setup>
import DatasetManager from '@/components/DatasetManager.vue';
import Filter from '@/components/Filter.vue';
import WordCloud from '@/components/WordCloud.vue';
</script>

<template>
  <header class="center-h">
    <h1 class="title">WordCloud</h1>
    <nav>
      <Filter />
    </nav>
  </header>
  <section>
    <aside  class="center-h">
      <DatasetManager />
    </aside>
    <main  class="center-h">
      <WordCloud />
    </main>
  </section>

</template>

<style scoped>
  .title{
    font-size: 3rem;
    margin: 0;
  }
</style>
