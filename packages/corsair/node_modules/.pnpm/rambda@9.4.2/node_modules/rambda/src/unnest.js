export function unnest(list){
  return list.reduce((acc, item) => {
    if (Array.isArray(item)){
      return [ ...acc, ...item ]
    }

    return [ ...acc, item ]
  }, [])
}
