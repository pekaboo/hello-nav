const PATH_REG = /^.*\d{2}-(.*)\.ts$/
async function getAppItems(url: string): Promise<AppItem[]> {
  const result: AppItem[] = await fetch(url).then((res) => res.json());
  return result;
}
async function getModules(context: Record<string, AppItem[]>): Promise<CateItem[]> {
  if (import.meta.env.VITE_USE_MENU_URL) { 
    const result: any = await getAppItems(import.meta.env.VITE_USE_MENU_URL)
    return result
  }
  const result: CateItem[] = [];
  for (const path in context) {
    if (context[path].length === 1 && context[path][0].navUrl) {
      result.push({
        title: path.replace(PATH_REG, (_, $1) => $1.replace('_', '/')),
        children: await getAppItems(context[path][0].navUrl)
      });
    } else {
      result.push({
        title: path.replace(PATH_REG, (_, $1) => $1.replace('_', '/')),
        children: context[path],
      });
    } 
  }
  return result;
}

const context: Record<string, AppItem[]> = import.meta.importGlob('./modules/*.ts', {
  eager: true,
  import: 'default',
})
export default await getModules(context)   //<CateItem[]>getModules(context)
