import elementUi from "./element-ui";
import elementPlus from "./element-plus";

export function getDocumentAttrs(version: string) {
  if (version === 'element-ui') {
    return {
      ...elementUi
    }
  } else if (version === 'element-plus') {
    return {
      ...elementPlus
    }
  }
}