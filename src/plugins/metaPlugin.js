/* @name metaPlugin
 * @description Updates route meta data client-side
 */
function metaPlugin(newLocation, { meta }, isHistoryEvent) {
  if (meta) {
    const { title, description } = meta;
    document.title = title;
    document.querySelector('meta[name="description"]').setAttribute("content", description);
  }
}

export default metaPlugin;