  import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import { getDatasetSamples, parseDataset, parseDatasetItem } from '@/services/datasets.js';

export const useDatasetsStore = defineStore('datasets', () => {
  const datasetsSamples = getDatasetSamples()
  const datasetsSamplesPaths = Object.keys(datasetsSamples)

  const currentDataset = ref(null)
  const currentDatasetFilter = ref(null)
  const currentDatasetPath = ref(null)
  const datasetsSamplesShortPaths = ref(datasetsSamplesPaths.map(path => {
    return {
      short: path.split('/').at(-1),
      full: path,
    }
  }))

  const filters = computed(() => {
    if (!currentDataset.value) {
      return currentDataset.value;
    }
    let filters = new Set([]);
    const { items } = currentDataset.value;

    items.forEach(item => {
      const parsedItem = parseDatasetItem(item)
      const entityConcept = parsedItem.data.entityConcept
      filters.add(entityConcept.split('#').at(-1));
    });

    return new Set(filters)
  })

  const datasetSamples = computed(() => {
    if (!currentDataset.value) {
      return currentDataset.value;
    }
    const { items } = currentDataset.value;
    if (currentDatasetFilter.value) {
      return items.filter(item => {
        const parsedItem = parseDatasetItem(item)
        const entityConcept = parsedItem.data.entityConcept
        return entityConcept.includes(currentDatasetFilter.value)
      })
    } else {
      return items
    }
  })

  const datasetSamplesPrepared = computed(() => {
    if (!datasetSamples.value) {
      return datasetSamples.value;
    }

    return parseDataset(datasetSamples.value).map(item => {
      const {data} = item;
      return {
        label: data.entityTitle,
        weight: data.count,
      }
    })
  })

  async function selectDataset(datasetName) {
    const module = await datasetsSamples[datasetName]();
    currentDatasetPath.value = datasetName;
    currentDatasetFilter.value = null;
    currentDataset.value = { ...module };
  }

  function selectDatasetFilter(filterName) {
    currentDatasetFilter.value = currentDatasetFilter.value === filterName ? null : filterName;
  }

  return { currentDataset, datasetSamples, datasetSamplesPrepared, currentDatasetFilter, currentDatasetPath, datasetsSamplesShortPaths, filters, selectDataset, selectDatasetFilter }
})
