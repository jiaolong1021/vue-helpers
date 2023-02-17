import element from './element';
import elementJs from './element-js';
import elementPlus from './element-plus';
// import vue from './vue';
// import vant from './vant';

export function getTags(version: string) {
  if (version === 'element-ui') {
    return {
      ...element,
      // ...vue,
      // ...vant
    }
  } else if (version === 'element-plus') {
    return {
      ...elementPlus,
      // ...vue,
      // ...vant
    }
  }
  return {}
}

export function getJsTags(version: string) {
  if (version === 'element-ui') {
    return {
      ...elementJs,
      // ...vue,
      // ...vant
    }
  } else if (version === 'element-plus') {
    return {
      ...elementPlus,
      // ...vue,
      // ...vant
    }
  }
  return {}
}