<script setup>
import { storeToRefs } from 'pinia'

import { useDatasetsStore } from '@/stores/datasets.js';

const store = useDatasetsStore()
const { currentDatasetPath, datasetsSamplesShortPaths } = storeToRefs(store)
</script>


<template>
    <article class="dataset-manager">
        <header class="dataset-manager__title">
            <h2 class="nowrap">Available datasets</h2>
        </header>
        <div class="dataset-manager__content">
            <div class="dataset-manager__content__item"
                :class="{ 'dataset-manager__content__item--active': currentDatasetPath === datasetPath.full }"
                v-for="datasetPath in datasetsSamplesShortPaths" :key="datasetPath.full"
                @click="store.selectDataset(datasetPath.full)">
                {{ datasetPath.short }}
            </div>
        </div>
    </article>
</template>

<style lang="scss" scoped>
.nowrap {
    white-space: nowrap;
}

.dataset-manager {
    &__title {
        &>h2 {
            margin-bottom: 8px;
            font-size: 1.6rem;
        }
    }

    &__content {
        display: flex;
        flex-direction: column;
        gap: 8px;

        &__item {
            cursor: pointer;
            transition: all .2s linear;
            font-size: 1rem;

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
}
</style>