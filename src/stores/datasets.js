import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import { getDatasetSamples } from '@/services/datasets.js';

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
      return []
    }
    let filters = new Set([]);
    const { items } = currentDataset.value;

    items.forEach(item => {

      const entityConcept = item.values.filter(i => i.key === 'entityConcept').at(0).value
      filters.add(entityConcept.split('#').at(-1));
    });

    return new Set(filters)
  })

  const datasetSamples = computed(() => {
    if (!currentDataset.value) {
      return null;
    }
    const { items } = currentDataset.value;
    if (currentDatasetFilter.value) {
      return items.filter(item => {
        const entityConcept = item.values.filter(i => i.key === 'entityConcept').at(0).value;
        return entityConcept.includes(currentDatasetFilter.value)
      })
    } else {
      return items
    }
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

  return { currentDataset, datasetSamples, currentDatasetFilter, currentDatasetPath, datasetsSamplesShortPaths, filters, selectDataset, selectDatasetFilter }
})
