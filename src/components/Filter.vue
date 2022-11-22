<script setup>
import { storeToRefs } from 'pinia'

import { useDatasetsStore } from '@/stores/datasets.js';

const store = useDatasetsStore()
const { filters, currentDatasetFilter } = storeToRefs(store)
</script>


<template>
    <div class="filter">
        <div class="filter__item no-select" :class="{ 'filter__item--active': currentDatasetFilter === filter }" v-for="filter in filters" :key="filter"
            @click="store.selectDatasetFilter(filter)">
            {{ filter }}
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .filter{
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 8px;
        margin: 10px 0;

        max-width: 80vw;

        &__item{
            text-transform: capitalize;
            font-size: 1.2rem;

            cursor: pointer;
            transition: all .2s linear;
            color: var(--main-color);
            font-weight: 500;

            &:hover:not(&--active) {
                color: var(--main-color-lighten);
            }

            &--active {
                color: var(--second-color);
            }
        }
    }
</style>