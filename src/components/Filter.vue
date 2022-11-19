<script setup>
import { storeToRefs } from 'pinia'

import { useDatasetsStore } from '@/stores/datasets.js';

const store = useDatasetsStore()
const { filters, currentDatasetFilter } = storeToRefs(store)
</script>


<template>
    <div class="filter">
        <div class="filter__item" :class="{ 'filter__item--active': currentDatasetFilter === filter }" v-for="filter in filters" :key="filter"
            @click="store.selectDatasetFilter(filter)">
            {{ filter }}
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .filter{
        display: flex;
        gap: 8px;

        &__item{
            text-transform: capitalize;

            cursor: pointer;
            transition: all .2s linear;

            &:hover {
                color: blue;
            }

            &--active {
                color: green;
            }
        }
    }
</style>