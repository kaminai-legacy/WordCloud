export function getDatasetSamples() {
    return import.meta.glob(
        './../datasets/*.json',
    )
}

export function parseDatasetItem(datasetItem) {
    if (!datasetItem) { return datasetItem }

    const data = {};

    datasetItem.values.forEach(v => {
        data[v['key']] = v['value']
    });
    
    return {
        type: datasetItem.type,
        metadata: datasetItem.metadata,
        data,
    }
}

export function parseDataset(dataset) {
    if (!dataset) { return dataset }

    return dataset.map(parseDatasetItem)
}

