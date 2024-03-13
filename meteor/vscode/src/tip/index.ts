import ant from './ant-desigin-vue-text';

export function getTip(version: string) {
  if (version === 'ant-desigin-vue') {
    return ant
  } else if (version === 'element') {
    return {}
  } else if (version === 'element-plus') {
    return {}
  } else {
    return {}
  }
}

// export function getJsTip(version: string) {
//   return {}
// }