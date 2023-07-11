export function getRootContainer() {
    const container = document.getElementById('root');
    if (!container) {
        throw new Error('There is no element with id root');
    }
    return container;
}
