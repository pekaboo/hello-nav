const PATH_REG = /^.*\d{2}-(.*)\.ts$/
async function getAppItems(url: string): Promise<AppItem[]> {
  const result: AppItem[] = await fetch(url).then((res) => res.json());
  return result;
}
async function getModules(context: Record<string, AppItem[]>): Promise<CateItem[]> {
  if (import.meta.env.VITE_USE_MENU_URL) { 
    let result: any = await getAppItems(import.meta.env.VITE_USE_MENU_URL)
    console.log(result)
    let rows = result.data.rows
    let groups: CateItem[] = []
    rows.forEach((item: { cat: string; id: string; url: string; name: string; code: string ;icon:string}) => {
      let group = groups.find(g => g.title === item.cat)
      if (!group) {
        group = { title: item.cat, children: [] }
        groups.push(group)
      }
      group.children.push({ 
        homepage: item.url,
        repository: item.url,
        name: item.name,
        "icon": item.icon||'',
        "keywords": [
          "code",
          item.cat
         ],
      })
    })
    console.log(groups)
//     DEMO
//     [
//     {
//         "title": "自留地",
//         "children": [
//             {
//                 "homepage": "https://poe.com",
//                 "repository": "https://poe.com",
//                 "icon": "",
//                 "keywords": [
//                     "poe",
//                     "poe"
//                 ],
//                 "name": "POE"
//             },
//             {
//                 "homepage": "https://devv.ai/",
//                 "name": "devv.ai"
//             },
//             {
//                 "homepage": "https://search.glarity.ai/",
//                 "name": "glarity.ai"
//             }
//         ]
//     },
//     {
//         "title": "每天",
//         "children": [
//             {
//                 "homepage": "https://www.x.com/",
//                 "name": "twiter"
//             }
//         ]
//     }
// ]
    return groups
  }
  const result: CateItem[] = [];
  for (const path in context) {
    if (context[path].length === 1 && context[path][0].navUrl||'') {
      result.push({
        title: path.replace(PATH_REG, (_, $1) => $1.replace('_', '/')),
        children: await getAppItems(context[path][0].navUrl||'')
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
