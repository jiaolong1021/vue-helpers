import element from "./element";
import elementPlus from "./element-plus";
import vue from "./vue";
import vant from "./vant";

export function getGlobalAttrs(version: string) {
  if (version === 'element-ui') {
    return {
      ...element,
      ...vue,
    }
  } else if (version === 'element-plus') {
    return {
      ...elementPlus,
      ...vue,
    }
  } else if (version === 'vant') {
    return {
      ...vue,
      ...vant
    }
  }
  return {}
}