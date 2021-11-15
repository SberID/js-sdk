export const getMeta = (metaName: string): string => {
    const meta = document.querySelector(`meta[name="${metaName}"]`);

    if (!meta) {
        return '';
    }

    return meta.getAttribute('content') || '';
};
