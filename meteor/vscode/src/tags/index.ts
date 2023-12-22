import element from './element';
import elementJs from './element-js';
import elementPlus from './element-plus';
import elementPlusJs from './element-plus-js';
import vant from './vant';
// import vue from './vue';
// import vant from './vant';

export function getTags(version: string) {
  if (version === 'element-ui') {
    return element
  } else if (version === 'element-plus') {
    return elementPlus
  } else if (version === 'vant') {
    return vant
  } else {
    return {}
  }
}

export function getVantTags() {
  return vant
}

export function getJsTags(version: string) {
  if (version === 'element-ui') {
    return elementJs
  } else if (version === 'element-plus') {
    return elementPlusJs
  } else {
    return {}
  }
}