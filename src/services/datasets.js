export function getDatasetSamples() {
    return import.meta.glob(
        './../datasets/*.json',
    )
}

