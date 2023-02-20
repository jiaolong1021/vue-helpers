// 文档入口
import element from './element-ui';
import elementPlus from './element-plus';
import vant from './vant';

export function getDocuments(version: string) {
  if (version === 'element-ui') {
    return {
      ...vant,
      ...element
    }
  } else if (version === 'element-plus') {
    return {
      ...vant,
      ...elementPlus
    }
  } else {
    return vant
  }
}