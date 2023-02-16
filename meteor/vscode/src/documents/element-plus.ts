export default {
  "el-button": `|  属性 | 说明 | 类型 | 可选值 | 默认值 |
  | :--- | :--- | :--- | :--- | :--- |
  | size | 尺寸 | string | large / default /small | — |
  | type | 类型 | string | primary / success / warning / danger / info / text | — |
  | plain | 是否为朴素按钮 | boolean | — | false |
  | text2.2.0 | 是否为文字按钮 | boolean | — | false |
  | bg 2.2.0 | 是否显示文字按钮背景颜色 | boolean | — | false |
  | link 2.2.1 | 是否为链接按钮 | boolean | — | false |
  | round | 是否为圆角按钮 | boolean | — | false |
  | circle | 是否为圆形按钮 | boolean | — | false |
  | loading | 是否为加载中状态 | boolean | — | false |
  | loading-icon | 自定义加载中状态图标组件 | string / Component | — | Loading |
  | disabled | 按钮是否为禁用状态 | boolean | — | false |
  | icon | 图标组件 | string / Component | — | — |
  | autofocus | 原生 autofocus 属性 | boolean | — | false |
  | native-type | 原生 type 属性 | string | button / submit / reset | button |
  | auto-insert-space | 自动在两个中文字符之间插入空格 | boolean |  | — |
  \n
  |  插槽名 | 说明 |
  | :--- | :--- |
  | — | 自定义默认内容 |
  | loading | 自定义加载中组件 |
  | icon | 自定义图标组件 |
  \n
  |  参数 | 描述 | 类型 | 可选值 | 默认值 |
  | :--- | :--- | :--- | :--- | :--- |
  | autoInsertSpace | 自动在两个中文字符之间插入空格 | boolean | - | false |
  `,
  "el-button-group": `|  属性 | 说明 | 类型 | 可选值 | 默认值 |
  | :--- | :--- | :--- | :--- | :--- |
  | size | 用于控制该按钮组内按钮的大小 | string | 与按钮的大小相同 | — |
  | type | 用于控制该按钮组内按钮的类型 | string | 与按钮的类型一致 | — |
  \n
  |  插槽名 | 说明 | 子标签 |
  | :--- | :--- | :--- |
  | - | 自定义按钮组内容 | Button |
  `,
  "el-container": `|  属性 | 说明 | 类型 | 可选值 | 默认值 |
  | :--- | :--- | :--- | :--- | :--- |
  | direction | 子元素的排列方向 | string | horizontal / vertical | 子元素中有 el-header 或 el-footer 时为 vertical，否则为 horizontal |
  \n
  |  插槽名 | 说明 | 子标签 |
  | :--- | :--- | :--- |
  | — | 自定义默认内容 | Container / Header / Aside / Main / Footer |
  `,
  "el-header": `|  属性 | 说明 | 类型 | 可选值 | 默认值 |
  | :--- | :--- | :--- | :--- | :--- |
  | height | 顶栏高度 | string | — | 60px |
  \n
  |  插槽名 | 说明 |
  | :--- | :--- |
  | — | 自定义默认内容 |
  `,
  "el-aside": `|  属性 | 说明 | 类型 | 可选值 | 默认值 |
  | :--- | :--- | :--- | :--- | :--- |
  | width | 侧边栏宽度 | string | — | 300px |
  \n
  |  插槽名 | 说明 |
  | :--- | :--- |
  | — | 自定义默认内容 |
  `,
  "el-main": `|  插槽名 | 说明 |
  | :--- | :--- |
  | — | 自定义默认内容 |
  `,
  "el-footer": `|  属性 | 说明 | 类型 | 可选值 | 默认值 |
  | :--- | :--- | :--- | :--- | :--- |
  | height | 底栏高度 | string | — | 60px |
  \n
  |  插槽名 | 说明 |
  | :--- | :--- |
  | — | 自定义默认内容 |
  `,
  "el-icon": `|  属性 | 说明 | 类型 | 可选值 | 默认值 |
  | :--- | :--- | :--- | :--- | :--- |
  | color | svg 的 fill 颜色 | Pick&lt;CSSProperties, 'color'&gt; | - | inherit |
  | size | SVG 图标的大小，size x size | number/ | string | - |
  \n
  |  名称 | 说明 |
  | :--- | :--- |
  | — | 自定义默认内容 |
  `,
  "el-row": `|  属性 | 说明 | 类型 | 可选值 | 默认值 |
  | :--- | :--- | :--- | :--- | :--- |
  | gutter | 栅格间隔 | number | — | 0 |
  | justify | flex 布局下的水平排列方式 | string | start/end/center/space-around/space-between/space-evenly | start |
  | align | flex 布局下的垂直排列方式 | string | top/middle/bottom | top |
  | tag | 自定义元素标签 | string | * | div |
  \n
  |  插槽名 | 说明 | 子标签 |
  | :--- | :--- | :--- |
  | — | 自定义默认内容 | Col |
  `,
  "el-col": `|  属性 | 说明 | 类型 | 可选值 | 默认值 |
  | :--- | :--- | :--- | :--- | :--- |
  | span | 栅格占据的列数 | number | — | 24 |
  | offset | 栅格左侧的间隔格数 | number | — | 0 |
  | push | 栅格向右移动格数 | number | — | 0 |
  | pull | 栅格向左移动格数 | number | — | 0 |
  | xs | &lt;768px 响应式栅格数或者栅格属性对象 | number/object (例如 {span: 4, offset: 4}) | — | — |
  | sm | ≥768px 响应式栅格数或者栅格属性对象 | number/object (例如 {span: 4, offset: 4}) | — | — |
  | md | ≥992px 响应式栅格数或者栅格属性对象 | number/object (例如 {span: 4, offset: 4}) | — | — |
  | lg | ≥1200px 响应式栅格数或者栅格属性对象 | number/object (例如 {span: 4, offset: 4}) | — | — |
  | xl | ≥1920px 响应式栅格数或者栅格属性对象 | number/object (例如 {span: 4, offset: 4}) | — | — |
  | tag | 自定义元素标签 | string | * | div |
  \n
  |  插槽名 | 说明 |
  | :--- | :--- |
  | — | 自定义默认内容 |
  \n
  |  属性 | 说明 | 类型 | 可选值 | 默认值 |
  | :--- | :--- | :--- | :--- | :--- |
  | type | 类型 | string | primary / success / warning / danger / info | default |
  | underline | 是否下划线 | boolean | — | true |
  | disabled | 是否禁用状态 | boolean | — | false |
  | href | 原生 href 属性 | string | — | - |
  | icon | 图标组件 | string / Component | — | - |
  \n
  |  插槽名 | 说明 |
  | :--- | :--- |
  | — | 自定义默认内容 |
  `,
  "el-scrollbar": `|  属性 | 说明 | 类型 | 可选值 | 默认值 |
  | :--- | :--- | :--- | :--- | :--- |
  | height | 滚动条高度 | string / number | — | — |
  | max-height | 滚动条最大高度 | string / number | — | — |
  | native | 是否使用原生滚动条样式 | boolean | — | false |
  | wrap-style | 包裹容器的自定义样式 | string | — | — |
  | wrap-class | 包裹容器的自定义类名 | string | — | — |
  | view-style | 视图的自定义样式 | string | — | — |
  | view-class | 视图的自定义类名 | string | — | — |
  | noresize | 不响应容器尺寸变化，如果容器尺寸不会发生变化，最好设置它可以优化性能 | boolean | — | false |
  | tag | 视图的元素标签 | string | — | div |
  | always | 滚动条总是显示 | boolean | — | false |
  | min-size | 滚动条最小尺寸 | number | — | 20 |
  \n
  |  事件名 | 说明 | 参数 |
  | :--- | :--- | :--- |
  | scroll | 滚动时触发的事件 | 滚动距离 { scrollLeft, scrollTop } |
  \n
  |  方法名 | 说明 | 参数 |
  | :--- | :--- | :--- |
  | scrollTo | 滚动到一组特定坐标 | (options: ScrollToOptions | number, yCoord?: number) |
  | setScrollTop | 设置滚动条到顶部的距离 | (scrollTop: number) |
  | setScrollLeft | 设置滚动条到左边的距离 | (scrollLeft: number) |
  | update | 手动更新滚动条状态 | — |
  \n
  |  名称 | 说明 |
  | :--- | :--- |
  | — | 自定义默认内容 |
  `,
  "el-space": `|  属性 | 说明 | 类型 | 可选值 | 默认值 |
  | :--- | :--- | :--- | :--- | :--- |
  | alignment | 对齐的方式 | string | align-items | 'center' |
  | class | 类名 | string / Array&lt;Object | String&gt; / Object | - | - |
  | direction | 排列的方向 | string | vertical/horizontal | horizontal |
  | prefix-cls | 给 space-items 的类名前缀 | string | el-space | - |
  | style | 额外样式 | string / Array&lt;Object | String&gt; / Object | - | - |
  | spacer | 间隔符 | string / number / VNode | - | - |
  | size | 间隔大小 | string / number / [number, number] | - | 'small' |
  | wrap | 设置是否自动折行 | boolean | true / false | false |
  | fill | 子元素是否填充父容器 | boolean | true / false | false |
  | fill-ratio | 填充父容器的比例 | number | - | 100 |
  \n
  |  名称 | 说明 |
  | :--- | :--- |
  | default | 需要添加间隔的元素 |
  `,
  "el-config": `|  参数 | 说明 | 类型 | 可选值 | 默认值 |
  | :--- | :--- | :--- | :--- | :--- |
  | locale | 翻译文本对象 | Language | languages | English |
  | size | 全局组件大小 | string | large / default /small | default |
  | zIndex | 全局初始化 zIndex 的值 | number | - | - |
  | namespace | 全局组件类名称前缀 (需要配合 $namespace 使用) | string | - | el |
  | button | 按钮相关的配置详细配置见下表 | ButtonGlobalConfig | - | 详见下表 |
  | message | 消息相关配置， 详见下表 | MessageGlobalConfig | - | 详见下表 |
  | experimental-features | 将要添加的实验阶段的功能，所有功能都是默认设置为 false | Object | - | - |
  `,
  "el-message": `|  参数 | 描述 | 类型 | 可选值 | 默认值 |
  | :--- | :--- | :--- | :--- | :--- |
  | max | 可同时显示的消息最大数量 | number | - | - |
  `,
  "el-config-provider": `|  名称 | 描述 | Scope |
  | :--- | :--- | :--- |
  | - | 自定义默认内容 | config: 提供全局配置（从顶部继承） |
  `,
  "el-cascader": `|  属性 | 说明 | 类型 | 可选值 | 默认值 |
  | :--- | :--- | :--- | :--- | :--- |
  | model-value / v-model | 选中项绑定值 | - | — | — |
  | options | 可选项数据源，键名可通过 Props 属性配置 | array | — | — |
  | props | 配置选项，具体见下表 | object | — | — |
  | size | 尺寸 | string | large / default / small | — |
  | placeholder | 输入框占位文本 | string | — | Select |
  | disabled | 是否禁用 | boolean | — | false |
  | clearable | 是否支持清空选项 | boolean | — | false |
  | show-all-levels | 输入框中是否显示选中值的完整路径 | boolean | — | true |
  | collapse-tags | 多选模式下是否折叠Tag | boolean | - | false |
  | collapse-tags-tooltip | 当鼠标悬停于折叠标签的文本时，是否显示所有选中的标签。 要使用此属性，collapse-tags属性必须设定为 true | boolean | - | false |
  | separator | 用于分隔选项的字符 | string | — | ' / ' |
  | filterable | 该选项是否可以被搜索 | boolean | — | — |
  | filter-method | 自定义搜索逻辑，第一个参数是node，第二个参数是keyword，返回的布尔值表示是否保留该选项 | function(node, keyword) | - | - |
  | debounce | 搜索关键词正在输入时的去抖延迟，单位为毫秒 | number | — | 300 |
  | before-filter | 过滤函数调用前欲被调用的钩子函数，该函数接受一个参数。 如果该函数的返回值是 false 或者是一个被拒绝的 Promise，那么接下来的过滤逻辑便不会执行。 | function(value) | — | — |
  | popper-class | 弹出内容的自定义类名 | string | — | — |
  | teleported | 是否在弹出内容时启用动画 | boolean | true / false | true |
  | popper-append-to-body(弃用) | 是否将弹出的内容直接插入到 body 元素。 在弹出内容的边框定位出现问题时，可将该属性设置为 false | boolean | - | true |
  | tag-type | 标签类型 | string | success/info/warning/danger | info |
  \n
  |  事件名 | 说明 | 回调参数 |
  | :--- | :--- | :--- |
  | change | 当绑定值变化时触发的事件 | value |
  | expand-change | 当展开节点发生变化时触发 | 各父级选项值组成的数组 |
  | blur | 当失去焦点时触发 | (event: Event) |
  | focus | 当获得焦点时触发 | (event: Event) |
  | visible-change | 下拉框出现/隐藏时触发 | 出现则为 true，隐藏则为 false |
  | remove-tag | 在多选模式下，移除Tag时触发 | 移除的Tag对应的节点的值 |
  \n
  |  方法名 | 说明 | 参数 |
  | :--- | :--- | :--- |
  | getCheckedNodes | 获取选中的节点 | (leafOnly) 是否只是叶子节点，默认值为 false |
  \n
  |  插槽名 | 说明 |
  | :--- | :--- |
  | - | 自定义备选项的节点内容，参数为 { node, data }，分别为当前节点的 Node 对象和数据 |
  | empty | 无匹配选项时的内容 |
  `,
  "el-cascader-panel": `|  属性 | 说明 | 类型 | 可选值 | 默认值 |
  | :--- | :--- | :--- | :--- | :--- |
  | model-value / v-model | 选中项绑定值 | - | — | — |
  | options | 可选项数据源，键名可通过 Props 属性配置 | array | — | — |
  | props | 配置选项，具体见下表 | object | — | — |
  \n
  |  事件名称 | 说明 | 回调参数 |
  | :--- | :--- | :--- |
  | change | 当选中节点变化时触发 | value |
  | expand-change | 当展开节点发生变化时触发 | 各父级选项值组成的数组 |
  \n
  |  方法名 | 说明 | 参数 |
  | :--- | :--- | :--- |
  | getCheckedNodes | 获取选中的节点数组 | (leafOnly) 是否只是叶子节点，默认值为 false |
  | clearCheckedNodes | 清空选中的节点 | - |
  \n
  |  插槽名 | 说明 |
  | :--- | :--- |
  | - | 自定义备选项的节点内容，参数为 { node, data }，分别为当前节点的 Node 对象和数据 |
  \n
  |  属性 | 说明 | 类型 | 可选值 | 默认值 |
  | :--- | :--- | :--- | :--- | :--- |
  | expandTrigger | 次级菜单的展开方式 | string | click / hover | 'click' |
  | multiple | 是否多选 | boolean | - | false |
  | checkStrictly | 是否严格的遵守父子节点不互相关联 | boolean | - | false |
  | emitPath | 在选中节点改变时，是否返回由该节点所在的各级菜单的值所组成的数组，若设置 false，则只返回该节点的值 | boolean | - | true |
  | lazy | 是否动态加载子节点，需与 lazyLoad 方法结合使用 | boolean | - | false |
  | lazyLoad | 加载动态数据的方法，仅在 lazy 为 true 时有效 | function(node, resolve)，node为当前点击的节点，resolve为数据加载完成的回调(必须调用) | - | - |
  | value | 指定选项的值为选项对象的某个属性值 | string | — | 'value' |
  | label | 指定选项标签为选项对象的某个属性值 | string | — | 'label' |
  | children | 指定选项的子选项为选项对象的某个属性值 | string | — | 'children' |
  | disabled | 指定选项的禁用为选项对象的某个属性值 | string | — | 'disabled' |
  | leaf | 指定选项的叶子节点的标志位为选项对象的某个属性值 | string | — | 'leaf' |
  `,
  "el-checkbox": `|  属性 | 说明 | 类型 | 可选值 | 默认值 |
  | :--- | :--- | :--- | :--- | :--- |
  | model-value / v-model | 选中项绑定值 | string / number / boolean | — | — |
  | label | 选中状态的值（只有在checkbox-group或者绑定对象类型为array时有效） | string / number / boolean / object | — | — |
  | true-label | 选中时的值 | string / number | — | — |
  | false-label | 没有选中时的值 | string / number | — | — |
  | disabled | 是否禁用 | boolean | — | false |
  | border | 是否显示边框 | boolean | — | false |
  | size | Checkbox 的尺寸 | string | large / default / small | — |
  | name | 原生 name 属性 | string | — | — |
  | checked | 当前是否勾选 | boolean | — | false |
  | indeterminate | 设置 indeterminate 状态，只负责样式控制 | boolean | — | false |
  \n
  |  事件名 | 说明 | 回调参数 |
  | :--- | :--- | :--- |
  | change | 当绑定值变化时触发的事件 | value |
  \n
  |  插槽名 | 说明 |
  | :--- | :--- |
  | — | 自定义默认内容 |
  `,
  "el-checkbox-group": `|  属性 | 说明 | 类型 | 可选值 | 默认值 |
  | :--- | :--- | :--- | :--- | :--- |
  | model-value / v-model | 绑定值 | array | — | [] |
  | size | 多选框组尺寸 | string | large / default / small | — |
  | disabled | 是否禁用 | boolean | — | false |
  | min | 可被勾选的 checkbox 的最小数量 | number | — | — |
  | max | 可被勾选的 checkbox 的最大数量 | number | — | — |
  | label | 为屏幕阅读器准备的标签 | string | — | — |
  | text-color | 当按钮为活跃状态时的字体颜色 | string | — | #ffffff |
  | fill | 当按钮为活跃状态时的边框和背景颜色 | string | — | #409EFF |
  \n
  |  事件名 | 说明 | 回调参数 |
  | :--- | :--- | :--- |
  | change | 当绑定值变化时触发的事件 | value |
  \n
  |  插槽名 | 说明 | 子标签 |
  | :--- | :--- | :--- |
  | - | 自定义默认内容 | Checkbox / Checkbox-button |
  `,
  "el-checkbox-button": `|  属性 | 说明 | 类型 | 可选值 | 默认值 |
  | :--- | :--- | :--- | :--- | :--- |
  | label | 选中状态的值，只有在绑定对象类型为 array 时有效。 | string / number / boolean / object | — | — |
  | true-label | 选中时的值 | string / number | — | — |
  | false-label | 没有选中时的值 | string / number | — | — |
  | disabled | 是否禁用 | boolean | — | false |
  | name | 原生 name 属性 | string | — | — |
  | checked | 当前是否勾选 | boolean | — | false |
  \n
  |  插槽名 | 描述 |
  | :--- | :--- |
  | — | 自定义默认内容 |
  \n
  |  属性 | 说明 | 类型 | 可选值 | 默认值 |
  | :--- | :--- | :--- | :--- | :--- |
  | model-value / v-model | 选中项绑定值 | string | — | — |
  | disabled | 是否禁用 | boolean | — | false |
  | size | 尺寸 | string | large / default / small | — |
  | show-alpha | 是否支持透明度选择 | boolean | — | false |
  | color-format | 写入 v-model 的颜色的格式 | string | hsl / hsv / hex / rgb | hex (当 show-alpha 为 false) / rgb (当 show-alpha 为 true) |
  | popper-class | ColorPicker 下拉框的类名 | string | — | — |
  | predefine | 预定义颜色 | array | — | — |
  \n
  |  事件名 | 说明 | 回调参数 |
  | :--- | :--- | :--- |
  | change | 当绑定值变化时触发 | 当前值 |
  | active-change | 面板中当前显示的颜色发生改变时触发 | 当前显示的颜色值 |
  \n
  |  属性 | 说明 | 类型 | 可选值 | 默认值 |
  | :--- | :--- | :--- | :--- | :--- |
  | model-value / v-model | 选中项绑定值 | date(DatePicker) / array(DateRangePicker) | — | — |
  | readonly | 只读 | boolean | — | false |
  | disabled | 禁用 | boolean | — | false |
  | size | 输入框尺寸 | string | large/default/small | default |
  | editable | 文本框可输入 | boolean | — | true |
  | clearable | 是否显示清除按钮 | boolean | — | true |
  | placeholder | 非范围选择时的占位内容 | string | — | — |
  | start-placeholder | 范围选择时开始日期的占位内容 | string | — | — |
  | end-placeholder | 范围选择时结束日期的占位内容 | string | — | — |
  | type | 显示类型 | string | year/month/date/dates/datetime/ week/datetimerange/daterange/ monthrange | date |
  | format | 显示在输入框中的格式 | string | 请查看 date formats | YYYY-MM-DD |
  | popper-class | DatePicker 下拉框的类名 | string | — | — |
  | range-separator | 选择范围时的分隔符 | string | — | '-' |
  | default-value | 可选，选择器打开时默认显示的时间 | Date | anything accepted by new Date() | — |
  | default-time | 范围选择时选中日期所使用的当日内具体时刻 | Date[] | 长度为2的数组，每一项都是Date对象。 第一项是起始日期，第二项是终止日期 | — |
  | value-format | 可选，绑定值的格式。 不指定则绑定值为 Date 对象 | string | 请查阅 date formats | — |
  | id | 等价于原生 id 属性 | string / array(string) | 字符串 id=\"my-date\" 对应单个日期或数组 :id=\"['my-range-start', 'my-range-end']\" 对应日期范围 | - |
  | name | 等价于原生 name 属性 | string | — | — |
  | unlink-panels | 在范围选择器里取消两个日期面板之间的联动 | boolean | — | false |
  | prefix-icon | 自定义前缀图标 | string / Component | — | Date |
  | clear-icon | 自定义清除图标 | string / Component | — | CircleClose |
  | validate-event | 输入时是否触发表单的校验 | boolean | - | true |
  | disabled-date | 一个用来判断该日期是否被禁用的函数，接受一个 Date 对象作为参数。 应该返回一个 Boolean 值。 | function | — | — |
  | shortcuts | 设置快捷选项，需要传入数组对象 | object[{ text: string, value: date / function }] | — | — |
  | cell-class-name | 设置自定义类名 | Function(Date) | — | — |
  | teleported | 是否将 date-picker 的下拉列表插入至 body 元素 | boolean | true / false | true |
  \n
  |  事件名 | 说明 | 回调参数 |
  | :--- | :--- | :--- |
  | change | 用户确认选定的值时触发 | 组件绑定值 |
  | blur | 在组件 Input 失去焦点时触发 | 组件实例 |
  | focus | 在组件 Input 获得焦点时触发 | 组件实例 |
  | calendar-change | 如果用户没有选择日期，那默认展示当前日的月份。 你可以使用 default-value 来设置成其他的日期。 | [Date, Date] |
  | panel-change | 当日期面板改变时触发。 | (date, mode, view) |
  | visible-change | 当 DatePicker 的下拉列表出现/消失时触发 | 出现时为true，隐藏时为false |
  \n
  |  方法名 | 说明 | 参数 |
  | :--- | :--- | :--- |
  | focus | 使 input 获取焦点 | focusStartInput |
  \n
  |  插槽名 | 说明 |
  | :--- | :--- |
  | default | 自定义内容 |
  | range-separator | 自定义范围分割符内容 |
  \n
  |  属性 | 说明 | 类型 | 可选值 | 默认值 |
  | :--- | :--- | :--- | :--- | :--- |
  | model-value / v-model | 选中项绑定值 | date(DateTimePicker) / array(DateTimeRangePicker) | — | — |
  | readonly | 只读 | boolean | — | false |
  | disabled | 禁用 | boolean | — | false |
  | editable | 文本框可输入 | boolean | — | true |
  | clearable | 是否显示清除按钮 | boolean | — | true |
  | size | 输入框尺寸 | string | large/default/small | default |
  | placeholder | 非范围选择时的占位内容 | string | — | — |
  | start-placeholder | 范围选择时开始日期的占位内容 | string | — | — |
  | end-placeholder | 范围选择时结束日期的占位内容 | string | — | — |
  | time-arrow-control | whether to pick time using arrow buttons | boolean | — | false |
  | type | 显示类型 | string | year/month/date/datetime/ week/datetimerange/daterange | date |
  | format | 显示在输入框中的格式 | string | see date formats | YYYY-MM-DD HH:mm:ss |
  | popper-class | DateTimePicker 下拉框的类名 | string | — | — |
  | range-separator | 选择范围时的分隔符 | string | - | '-' |
  | default-value | 可选，选择器打开时默认显示的时间 | Date | 可被new Date()解析的所有值 | — |
  | default-time | 选中日期后的默认具体时刻 | 若为非时间范围: Date / 若为时间范围: Date[] | 非范围选择时：Date 对象；范围选择时：数组，长度为 2，每项值为 Date 对象，第一项指定开始日期的时刻，第二项指定结束日期的时刻。 不指定会使用时刻 00:00:00 | — |
  | value-format | 可选，绑定值的格式。 不指定则绑定值为 Date 对象 | string | 查看 日期格式 | — |
  | id | 等价于原生 input id 属性 | string / array(string) | 字符串 id=\"my-date\" 对应单个日期或数组 :id=\"['my-range-start', 'my-range-end']\" 对应日期范围 | - |
  | name | 等价于原生 input name 属性 | string | — | — |
  | unlink-panels | 在范围选择器里取消两个日期面板之间的联动 | boolean | — | false |
  | prefix-icon | 自定义前缀图标 | string / Component | — | Date |
  | clear-icon | 自定义清除图标 | string / Component | — | CircleClose |
  | shortcuts | 设置快捷选项，需要传入数组对象 | object[{ text: string, value: date / function }] | — | — |
  | disabledDate | 一个用来判断该日期是否被禁用的函数，接受一个 Date 对象作为参数。 应该返回一个 Boolean 值。 | function | — | — |
  | cellClassName | 设置自定义类名 | Function(Date) | — | — |
  | teleported | 是否将 datetime-picker 的下拉列表插入至 body 元素 | boolean | true / false | true |
  \n
  |  事件名 | 说明 | 回调参数 |
  | :--- | :--- | :--- |
  | change | 用户确认选定的值时触发 | value |
  | blur | 在组件 Input 失去焦点时触发 | instance |
  | focus | 在组件 Input 获得焦点时触发 | instance |
  | calendar-change | 如果用户没有选择日期，那默认展示当前日的月份。 选中日历日期后会执行的回调，只有当 datetimerange 才生效 | [Date, Date] |
  | visible-change | 当 DateTimePicker 的下拉列表出现/消失时触发 | 出现时为true，隐藏时为false |
  \n
  |  方法名 | 说明 | 参数 |
  | :--- | :--- | :--- |
  | focus | 使 input 获取焦点 | — |
  \n
  |  插槽名 | 说明 |
  | :--- | :--- |
  | default | 自定义单元格内容 |
  | range-separator | 自定义范围分割符内容 |
  `,
  "el-input": `|  属性 | 说明 | 类型 | 可选值 | 默认值 |
  | :--- | :--- | :--- | :--- | :--- |
  | type | 类型 | string | text，textarea 和其他原生 input 的 type 值 | text |
  | modelValue / v-model | 绑定值 | string / number | — | — |
  | maxlength | 最大输入长度 | string / number | — | — |
  | minlength | 原生属性，最小输入长度 | number | — | — |
  | show-word-limit | 是否显示输入字数统计，只在 type = \"text\" 或 type = \"textarea\" 时有效 | boolean | — | false |
  | placeholder | 输入框占位文本 | string | — | — |
  | clearable | 是否可清空 | boolean | — | false |
  | formatter | 指定输入值的格式。(只有当 type 是\"text\"时才能工作) | function(value: string / number): string | — | — |
  | parser | 指定从格式化器输入中提取的值。(仅当 type 是\"text\"时才起作用) | function(string): string | — | — |
  | show-password | 是否显示切换密码图标 | boolean | — | false |
  | disabled | 是否禁用 | boolean | — | false |
  | size | 输入框尺寸，只在 type 不为 'textarea' 时有效 | string | large / default / small | — |
  | prefix-icon | 自定义前缀图标 | string / Component | — | — |
  | suffix-icon | 自定义后缀图标 | string / Component | — | — |
  | rows | 输入框行数，仅 type 为 'textarea' 时有效 | number | — | 2 |
  | autosize | textarea 高度是否自适应，仅 type 为 'textarea' 时生效。 可以接受一个对象，比如: { minRows: 2, maxRows: 6 } | boolean / object | — | false |
  | autocomplete | 原生 autocomplete 属性 | string | — | off |
  | name | 等价于原生 input name 属性 | string | — | — |
  | readonly | 原生  readonly 属性，是否只读 | boolean | — | false |
  | max | 原生 max 属性，设置最大值 | — | — | — |
  | min | 原生属性，设置最小值 | — | — | — |
  | step | 原生属性，设置输入字段的合法数字间隔 | — | — | — |
  | resize | 控制是否能被用户缩放 | string | none / both / horizontal / vertical | — |
  | autofocus | 原生属性，自动获取焦点 | boolean | — | false |
  | form | 原生属性 | string | — | — |
  | label | 标签文本 | string | — | — |
  | tabindex | 输入框的 tabindex | string / number | - | - |
  | validate-event | 输入时是否触发表单的校验 | boolean | - | true |
  | input-style | input 元素或 textarea 元素的 style | object | - | {} |
  \n
  |  名称 | 说明 |
  | :--- | :--- |
  | prefix | 输入框头部内容，只对 type=\"text\" 有效 |
  | suffix | 输入框尾部内容，只对 type=\"text\" 有效 |
  | prepend | 输入框前置内容，只对 type=\"text\" 有效 |
  | append | 输入框后置内容，只对 type=\"text\" 有效 |
  \n
  |  事件名 | 说明 | 参数 |
  | :--- | :--- | :--- |
  | blur | 在 Input 失去焦点时触发 | (event: Event) |
  | focus | 在 Input 获得焦点时触发 | (event: Event) |
  | change | 仅在输入框失去焦点或用户按下回车时触发 | (value: string | number) |
  | input | 在 Input 值改变时触发 | (value: string | number) |
  | clear | 在点击由 clearable 属性生成的清空按钮时触发 | — |
  \n
  |  方法 | 说明 | 参数 |
  | :--- | :--- | :--- |
  | focus | 使 input 获取焦点 | — |
  | blur | 使 input 失去焦点 | — |
  | select | 选中 input 中的文字 | — |
  `,
  "el-autocomplete": `|  属性 | 说明 | 类型 | 可选值 | 默认值 |
  | :--- | :--- | :--- | :--- | :--- |
  | placeholder | 占位文本 | string | — | — |
  | clearable | 是否可清空 | boolean | — | false |
  | disabled | 是否禁用 | boolean | — | false |
  | value-key | 输入建议对象中用于显示的键名 | string | — | value |
  | icon | 图标组件 | string / Component | — | — |
  | model-value / v-model | 选中项绑定值 | string | — | — |
  | debounce | 获取输入建议的防抖延时 | number | — | 300 |
  | placement | 菜单弹出位置 | string | top / top-start / top-end / bottom / bottom-start / bottom-end | bottom-start |
  | fetch-suggestions | 获取输入建议的方法， 仅当你的输入建议数据 resolve 时，通过调用 callback(data:[])  来返回它 | Function(queryString, callback) | — | — |
  | popper-class | Autocomplete 下拉列表的类名 | string | — | — |
  | trigger-on-focus | 是否在输入框 focus 时显示建议列表 | boolean | — | true |
  | name | 原生属性 name 属性 | string | — | — |
  | select-when-unmatched | 在输入没有任何匹配建议的情况下，按下回车是否触发 select 事件 | boolean | — | false |
  | label | 输入框关联的 label 文字 | string | — | — |
  | prefix-icon | 输入框头部图标 | string / Component | — | — |
  | suffix-icon | 输入框尾部图标 | string / Component | — | — |
  | hide-loading | 是否隐藏远程加载时的加载图标 | boolean | — | false |
  | popper-append-to-body（已废弃） | 是否将下拉列表插入至 body 元素。 在下拉列表的定位出现问题时，可将该属性设置为 false | boolean | - | false |
  | teleported | 是否将下拉列表插入至 body 元素 | boolean | true / false | true |
  | highlight-first-item | 是否默认高亮远程搜索结果的第一项 | boolean | — | false |
  \n
  |  名称 | 说明 |
  | :--- | :--- |
  | prefix | 输入框头部内容 |
  | suffix | 输入框尾部内容 |
  | prepend | 输入框前置内容 |
  | append | 输入框后置内容 |
  \n
  |  名称 | 说明 |
  | :--- | :--- |
  | — | 自定义输入建议的内容。 自定义标签，参数为 |
  \n
  |  事件名 | 说明 | 参数 |
  | :--- | :--- | :--- |
  | select | 点击选中建议项时触发 | 选中的建议项 |
  | change | 在 Input 值改变时触发 | (value: string | number) |
  \n
  |  方法名 | 说明 | 参数 |
  | :--- | :--- | :--- |
  | focus | 使 input 获取焦点 | — |
  \n
  |  属性 | 说明 | 类型 | 可选值 | 默认值 |
  | :--- | :--- | :--- | :--- | :--- |
  | model-value / v-model | 选中项绑定值 | number / undefined | — | — |
  | min | 设置计数器允许的最小值 | number | — | -Infinity |
  | max | 设置计数器允许的最大值 | number | — | Infinity |
  | step | 计数器步长 | number | — | 1 |
  | step-strictly | 是否只能输入 step 的倍数 | boolean | — | false |
  | precision | 数值精度 | number | — | — |
  | size | 计数器尺寸 | string | large/small | default |
  | disabled | 是否禁用计数器 | boolean | — | false |
  | controls | 是否使用控制按钮 | boolean | — | true |
  | controls-position | 控制按钮位置 | string | right | - |
  | name | 原生 name 属性 | string | — | — |
  | label | 输入框关联的 label 文字 | string | — | — |
  | placeholder | 输入框默认 placeholder | string | - | - |
  | value-on-clear (&gt; 2.2.0) | 当输入框被清空时显示的值 | string / number / null | min/max | - |
  \n
  |  事件名 | 说明 | 回调参数 |
  | :--- | :--- | :--- |
  | change | 绑定值被改变时触发 | (currentValue: number | NaN, oldValue: number | NaN) |
  | blur | 在组件 Input 失去焦点时触发 | (event: Event) |
  | focus | 在组件 Input 获得焦点时触发 | (event: Event) |
  \n
  |  方法名 | 说明 | 参数 |
  | :--- | :--- | :--- |
  | focus | 使 input 组件获得焦点 | - |
  | blur | 使 input 组件失去焦点 | — |
  `,
  "el-radio": `|  属性 | 说明 | 类型 | 可选值 | 默认值 |
  | :--- | :--- | :--- | :--- | :--- |
  | model-value / v-model | 选中项绑定值 | string / number / boolean | — | — |
  | label | 单选框对应的值 | string / number / boolean | — | — |
  | disabled | 是否禁用单选框 | boolean | — | false |
  | border | 是否显示边框 | boolean | — | false |
  | size | Radio 的尺寸 | string | large / default /small | — |
  | name | 原生 name 属性 | string | — | — |
  \n
  |  事件名 | 说明 | 回调参数 |
  | :--- | :--- | :--- |
  | change | 绑定值变化时触发的事件 | 选中的 Radio label 值 |
  \n
  |  插槽名 | 说明 |
  | :--- | :--- |
  | — | 自定义默认内容 |
  `,
  "el-radio-group": `|  属性 | 说明 | 类型 | 可选值 | 默认值 |
  | :--- | :--- | :--- | :--- | :--- |
  | model-value / v-model | 绑定值 | string / number / boolean | — | — |
  | size | 单选框组尺寸 | string | large / default / small | default |
  | disabled | 是否禁用 | boolean | — | false |
  | text-color | 按钮形式的 Radio 激活时的文本颜色 | string | — | #ffffff |
  | fill | 按钮形式的 Radio 激活时的填充色和边框色 | string | — | #409EFF |
  \n
  |  事件名 | 说明 | 回调参数 |
  | :--- | :--- | :--- |
  | change | 绑定值变化时触发的事件 | 选中的 Radio label 值 |
  \n
  |  插槽名 | 说明 | 子标签 |
  | :--- | :--- | :--- |
  | — | 自定义默认内容 | Radio / Radio-button |
  `,
  "el-radio-button": `|  属性 | 说明 | 类型 | 可选值 | 默认值 |
  | :--- | :--- | :--- | :--- | :--- |
  | label | radio 的 value | string / number | — | — |
  | disabled | 是否禁用 | boolean | — | false |
  | name | 原生 name 属性 | string | — | — |
  \n
  |  插槽名 | 说明 |
  | :--- | :--- |
  | — | 默认插槽内容 |
  `,
  "el-rate": `|  属性 | 说明 | 类型 | 可选值 | 默认值 |
  | :--- | :--- | :--- | :--- | :--- |
  | model-value / v-model | 选中项绑定值 | number | — | 0 |
  | max | 最大分值 | number | — | 5 |
  | size | 尺寸 | string | large / default / small | default |
  | disabled | 是否为只读 | boolean | — | false |
  | allow-half | 是否允许半选 | boolean | — | false |
  | low-threshold | 低分和中等分数的界限值， 值本身被划分在低分中 | number | — | 2 |
  | high-threshold | 高分和中等分数的界限值， 值本身被划分在高分中 | number | — | 4 |
  | colors | icon 的颜色。 若传入数组，共有 3 个元素，为 3 个分段所对应的颜色；若传入对象，可自定义分段，键名为分段的界限值，键值为对应的颜色 | array/object | — | ['#F7BA2A', '#F7BA2A', '#F7BA2A'] |
  | void-color | 未选中 icon 的颜色 | string | — | #C6D1DE |
  | disabled-void-color | 只读时未选中 icon 的颜色 | string | — | #EFF2F7 |
  | icons | 图标组件 若传入数组，共有 3 个元素，为 3 个分段所对应的类名；若传入对象，可自定义分段，键名为分段的界限值，键值为对应的类名 | array/object | — | [StarFilled, StarFilled, StarFilled] |
  | void-icon | 未被选中的图标组件 | string/component | — | Star |
  | disabled-void-icon | 禁用状态的未选择图标 | string/component | — | StarFilled |
  | show-text | 是否显示辅助文字，若为真，则会从 texts 数组中选取当前分数对应的文字内容 | boolean | — | false |
  | show-score | 是否显示当前分数， show-score 和 show-text 不能同时为真 | boolean | — | false |
  | text-color | 辅助文字的颜色 | string | — | #1F2D3D |
  | texts | 辅助文字数组 | array | — | ['Extremely bad', 'Disappointed', 'Fair', 'Satisfied', 'Surprise'] |
  | score-template | 分数显示模板 | string | — |  |
  \n
  |  事件名 | 描述说明 | 参数 |
  | :--- | :--- | :--- |
  | change | 分值改变时触发 | val，改变后的值 |
  `,
  "el-select": `|  属性 | 说明 | 类型 | 可选值 | 默认值 |
  | :--- | :--- | :--- | :--- | :--- |
  | model-value / v-model | 选中项绑定值 | string / number / boolean / object | — | — |
  | multiple | 是否多选 | boolean | — | false |
  | disabled | 是否禁用 | boolean | — | false |
  | value-key | 作为 value 唯一标识的键名，绑定值为对象类型时必填 | string | — | value |
  | size | 输入框尺寸 | string | large/default/small | default |
  | clearable | 是否可以清空选项 | boolean | — | false |
  | collapse-tags | 多选时是否将选中值按文字的形式展示 | boolean | — | false |
  | collapse-tags-tooltip | 当鼠标悬停于折叠标签的文本时，是否显示所有选中的标签。 要使用此属性，collapse-tags属性必须设定为 true | boolean | true / false | false |
  | multiple-limit | multiple 属性设置为 true 时，代表多选场景下用户最多可以选择的项目数， 为 0 则不限制 | number | — | 0 |
  | name | Select 输入框的原生 name 属性 | string | — | — |
  | effect | Tooltip 主题，内置了 dark / light 两种 | string | string | light |
  | autocomplete | Select 输入框的原生 autocomplete 属性 | string | — | off |
  | placeholder | 占位文字 | string | — | Select |
  | filterable | Select 组件是否可筛选 | boolean | — | false |
  | allow-create | 是否允许用户创建新条目， 只有当 filterable 设置为 true 时才会生效。 | boolean | — | false |
  | filter-method | 自定义筛选方法 | function | — | — |
  | remote | 其中的选项是否从服务器远程加载 | boolean | — | false |
  | remote-method | 自定义远程搜索方法 | function | — | — |
  | loading | Select 组件是否从远程加载数据 | boolean | — | false |
  | loading-text | 从服务器加载内容时显示的文本 | string | — | Loading |
  | no-match-text | 搜索条件无匹配时显示的文字，也可以使用 empty 插槽设置 | string | — | No matching data |
  | no-data-text | 无选项时显示的文字，也可以使用 empty 插槽设置自定义内容 | string | — | No data |
  | popper-class | Select 下拉框的自定义类名 | string | — | — |
  | reserve-keyword | 当 multiple 和 filter被设置为 true 时，是否在选中一个选项后保留当前的搜索关键词 | boolean | — | true |
  | default-first-option | 是否在输入框按下回车时，选择第一个匹配项。 需配合 filterable 或 remote 使用 | boolean | - | false |
  | popper-append-to-body(deprecated) | 是否将弹出框插入至 body 元素。 在弹出框的定位出现问题时，可将该属性设置为 false | boolean | - | true |
  | teleported | 是否将下拉列表插入至 body 元素 | boolean | true / false | true |
  | persistent | 当下拉选择器未被激活并且persistent设置为false，选择器会被删除。 | boolean | true / false | true |
  | automatic-dropdown | 对于不可搜索的 Select，是否在输入框获得焦点后自动弹出选项菜单 | boolean | - | false |
  | clear-icon | 自定义清除图标组件 | string / Component | — | CircleClose |
  | fit-input-width | 下拉框的宽度是否与输入框相同 | boolean | — | false |
  | suffix-icon | 自定义后缀图标组件 | string / Component | — | ArrowUp |
  | tag-type | 标签类型 | string | success/info/warning/danger | info |
  \n
  |  事件名 | 说明 | 回调参数 |
  | :--- | :--- | :--- |
  | change | 选中值发生变化时触发 | val，目前的选中值 |
  | visible-change | 下拉框出现/隐藏时触发 | val，出现则为 true，隐藏则为 false |
  | remove-tag | 多选模式下移除tag时触发 | val，移除的tag值 |
  | clear | 可清空的单选模式下用户点击清空按钮时触发 | — |
  | blur | 当 input 失去焦点时触发 | (event: Event) |
  | focus | 当 input 获得焦点时触发 | (event: Event) |
  \n
  |  插槽名 | 说明 | 子标签 |
  | :--- | :--- | :--- |
  | — | Option 组件列表 | Option Group / Option |
  | prefix | Select 组件头部内容 | — |
  | empty | 无选项时的列表 | — |
  \n
  |  方法名 | 说明 | 参数 |
  | :--- | :--- | :--- |
  | focus | 使选择器的输入框获取焦点 | - |
  | blur | 使选择器的输入框失去焦点，并隐藏下拉框 | - |
  `,
  "el-option": `|  属性 | 说明 | 类型 | 可选值 | 默认值 |
  | :--- | :--- | :--- | :--- | :--- |
  | label | 分组的组名 | string | — | — |
  | disabled | 是否将该分组下所有选项置为禁用 | boolean | — | false |
  \n
  |  插槽名 | 说明 | 子标签 |
  | :--- | :--- | :--- |
  | - | 自定义默认内容 | Option |
  \n
  |  属性 | 说明 | 类型 | 可选值 | 默认值 |
  | :--- | :--- | :--- | :--- | :--- |
  | value | 选项的值 | string / number / boolean / object | — | — |
  | label | 选项的标签，若不设置则默认与value相同 | string/number | — | — |
  | disabled | 是否禁用该选项 | boolean | — | false |
  \n
  |  插槽名 | 说明 |
  | :--- | :--- |
  | — | 默认插槽 |
  `,
  "el-select-v-2": `|  属性 | 说明 | 类型 | 可选值 | 默认值 |
  | :--- | :--- | :--- | :--- | :--- |
  | model-value / v-model | 绑定值 | string / number / boolean / object | — | — |
  | multiple | 是否多选 | boolean | — | false |
  | disabled | 是否禁用 | boolean | — | false |
  | value-key | 作为 value 唯一标识的键名，绑定值为对象类型时必填 | string | — | value |
  | size | 输入框尺寸 | string | large/default/small | default |
  | clearable | 是否可以清空选项 | boolean | — | false |
  | clear-icon | 自定义清除图标 | string / Component | — | CircleClose |
  | collapse-tags | 多选时是否将选中值按文字的形式展示 | boolean | — | false |
  | collapse-tags-tooltip | 当鼠标悬停于折叠标签的文本时，是否显示所有选中的标签。 只有当 collapse-tags 设置为 true 时才会生效。 | boolean | true / false | false |
  | multiple-limit | 多选时可被选择的最大数目。 当被设置为0时，可被选择的数目不设限。 | number | — | 0 |
  | name | 选择器的原生name属性 | string | — | — |
  | effect | 文字提示（Tooltip）的主题，内置dark和light两种。 | string | string | light |
  | autocomplete | 自动完成选择输入 | string | — | off |
  | placeholder | select input的原生autocomplete属性 | string | — | Please select |
  | filterable | 是否可筛选 | boolean | — | false |
  | allow-create | 是否允许创建新条目， 当使用该属性时，filterable必须设置为true | boolean | — | false |
  | reserve-keyword | 筛选时，是否在选择选项后保留关键字 | boolean | — | true |
  | no-data-text | 当在没有数据时显示的文字，你同时可以使用#empty插槽进行设置。 | string | — | No Data |
  | popper-class | 选择器下拉菜单的自定义类名 | string | — | — |
  | popper-append-to-body(deprecated) | 是否将弹出框插入至 body 元素 当弹出框的位置出现问题时，你可以尝试将该属性设置为false。 | boolean | - | false |
  | teleported | 该下拉菜单是否使用teleport插入body元素 | boolean | true / false | true |
  | persistent | 当下拉选择器未被激活并且persistent设置为false，选择器会被删除。 | boolean | true / false | true |
  | popper-options | 自定义popper.js参数 | object | - | - |
  | automatic-dropdown | 对于不可过滤的 Select 组件，此属性决定是否在输入框获得焦点后自动弹出选项菜单 | boolean | - | false |
  | height | 下拉菜单的高度，每一个子选项的高度是 34px | number | - | 170 |
  | scrollbar-always-on | 控制是否总是展示滚动条 | boolean | - | false |
  | remote | 是否从服务器搜索数据 | boolean | — | false |
  | remote-method | 当输入值发生变化时被调用的函数。 其参数是当前输入值。 只有当 filterable 设置为 true 时才会生效。 | function(keyword: string) | — | — |
  \n
  |  事件名 | 说明 | 回调参数 |
  | :--- | :--- | :--- |
  | change | 选中值发生变化时触发 | val，目前的选中值 |
  | visible-change | 下拉框出现/隐藏时触发 | val，出现则为 true，隐藏则为 false |
  | remove-tag | 多选模式下移除tag时触发 | val，移除的tag值 |
  | clear | 可清空的单选模式下用户点击清空按钮时触发 | — |
  | blur | 当选择器的输入框失去焦点时触发 | (event: FocusEvent) |
  | focus | 当选择器的输入框获得焦点时触发 | (event: FocusEvent) |
  \n
  |  插槽名 | 说明 |
  | :--- | :--- |
  | default | 自定义 Option 模板 |
  | empty | 自定义当选项为空时的内容 |
  | prefix | 输入框的前缀 |
  \n
  |  属性 | 描述 | 类型 | 可选值 | 默认值 |
  | :--- | :--- | :--- | :--- | :--- |
  | model-value / v-model | 选中项绑定值 | number | — | 0 |
  | min | 最小值 | number | — | 0 |
  | max | 最大值 | number | — | 100 |
  | disabled | 是否禁用 | boolean | — | false |
  | step | 步长 | number | — | 1 |
  | show-input | 是否显示输入框，仅在非范围选择时有效 | boolean | — | false |
  | show-input-controls | 在显示输入框的情况下，是否显示输入框的控制按钮 | boolean | — | true |
  | size | 滑块的大小 | string | large / default / small | default |
  | input-size | 输入框的大小，如果设置了 size 属性，默认值自动取 size | string | large / default / small | default |
  | show-stops | 是否显示间断点 | boolean | — | false |
  | show-tooltip | 是否显示提示信息 | boolean | — | true |
  | format-tooltip | 格式化提示信息 | function(value) | — | — |
  | range | 是否开启选择范围 | boolean | — | false |
  | vertical | 垂直模式 | boolean | — | false |
  | height | 滑块高度，垂直模式必填 | string | — | — |
  | label | 屏幕阅读器标签 | string | — | — |
  | range-start-label | 当 range 为true时，屏幕阅读器标签开始的标记 | string | — | — |
  | range-end-label | 当 range 为true时，屏幕阅读器标签结尾的标记 | string | — | — |
  | format-value-text | 显示屏幕阅读器的 aria-valuenow 属性的格式 | function(value) | — | — |
  | debounce | 输入时的去抖延迟，毫秒，仅在 show-input 等于 true 时有效 | number | — | 300 |
  | tooltip-class | tooltip 的自定义类名 | string | — | — |
  | marks | 标记， key 的类型必须为 number 且取值在闭区间 [min, max] 内，每个标记可以单独设置样式 | object | — | — |
  \n
  |  事件名 | 说明 | 参数 |
  | :--- | :--- | :--- |
  | change | 值改变时触发（使用鼠标拖曳时，只在松开鼠标后触发） | val，新状态的值 |
  | input | 数据改变时触发（使用鼠标拖曳时，活动过程实时触发） | val，改变后的值 |
  \n
  |  属性 | 说明 | 类型 | 可选值 | 默认值 |
  | :--- | :--- | :--- | :--- | :--- |
  | model-value / v-model | 绑定值，必须等于 active-value 或 inactive-value，默认为 Boolean 类型 | boolean / string / number | — | — |
  | disabled | 是否禁用 | boolean | — | false |
  | loading | 是否显示加载中 | boolean | — | false |
  | size | switch 的大小 | string | large / default / small | default |
  | width | switch 的宽度 | number / string | — | — |
  | inline-prompt | 无论图标或文本是否显示在点内，只会呈现文本的第一个字符 | boolean | — | false |
  | active-icon | switch 状态为 on 时所显示图标，设置此项会忽略 active-text | string / Component | — | — |
  | inactive-icon | switch 状态为 off 时所显示图标，设置此项会忽略 inactive-text | active-icon | — | — |
  | active-text | switch 打开时的文字描述 | string | — | — |
  | inactive-text | switch 的状态为 off 时的文字描述 | string | — | — |
  | active-value | switch 状态为 on 时的值 | boolean / string / number | — | true |
  | inactive-value | switch的状态为 off 时的值 | boolean / string / number | — | false |
  | active-color | switch的值为 on 时的颜色 | string | — | #409EFF |
  | inactive-color | switch的值为 off 的颜色 | string | — | #C0CCDA |
  | border-color | switch 边框颜色 | string | — | — |
  | name | switch 对应的 name 属性 | string | — | — |
  | validate-event | 改变 switch 状态时是否触发表单的校验 | boolean | — | true |
  | before-change | switch 状态改变前的钩子， 返回 false 或者返回 Promise 且被 reject 则停止切换 | function | — | — |
  \n
  |  事件名 | 说明 | 回调参数 |
  | :--- | :--- | :--- |
  | change | switch 状态发生变化时的回调函数 | val，新状态的值 |
  \n
  |  方法 | 说明 | 参数 |
  | :--- | :--- | :--- |
  | focus | 使 Switch 获取焦点 | — |
  `,
  "el-time-picker": `|  属性 | 说明 | 类型 | 可选值 | 默认值 |
  | :--- | :--- | :--- | :--- | :--- |
  | model-value / v-model | 选中项绑定值 | Date | — | — |
  | readonly | 完全只读 | boolean | — | false |
  | disabled | 禁用 | boolean | — | false |
  | editable | 文本框可输入 | boolean | — | true |
  | clearable | 是否显示清除按钮 | boolean | — | true |
  | size | 输入框尺寸 | string | large / default / small | — |
  | placeholder | 非范围选择时的占位内容 | string | — | — |
  | start-placeholder | 范围选择时开始日期的占位内容 | string | — | — |
  | end-placeholder | 范围选择时结束日期的占位内容 | string | — | — |
  | is-range | 是否为时间范围选择 | boolean | — | false |
  | arrow-control | 是否使用箭头进行时间选择 | boolean | — | false |
  | align | 对齐方式 | left / center / right | left |  |
  | popper-class | TimePicker 下拉框的类名 | string | — | — |
  | range-separator | 选择范围时的分隔符 | string | — | '-' |
  | format | 显示在输入框中的格式 | string | 请查看 date formats | HH:mm:ss |
  | default-value | 可选，选择器打开时默认显示的时间 | Date(TimePicker) / string(TimeSelect) | 可被new Date()解析(TimePicker) / 可选值(TimeSelect) | — |
  | id | 等价于原生 input id 属性 | string / array(string) | 字符串 id=\"my-time\" range 模式 数组 :id=\"['my-range-start', 'my-range-end']\" | - |
  | name | 等价于原生 input name 属性 | string | — | — |
  | prefix-icon | 自定义前缀图标 | string / Component | — | Clock |
  | clear-icon | 自定义清除图标 | string / Component | — | CircleClose |
  | disabled-hours | 禁止选择部分小时选项 | function | — | — |
  | disabled-minutes | 禁止选择部分分钟选项 | function(selectedHour) | — | — |
  | disabled-seconds | 禁止选择部分秒选项 | function(selectedHour, selectedMinute) | — | — |
  | teleported | 是否将 popover 的下拉列表镜像至 body 元素 | boolean | true / false | true |
  \n
  |  事件名 | 说明 | 回调参数 |
  | :--- | :--- | :--- |
  | change | 用户确认选定的值时触发 | val，组件绑定值 |
  | blur | 在组件 Input 失去焦点时触发 | 组件实例 |
  | focus | 在组件 Input 获得焦点时触发 | 组件实例 |
  | visible-change | 当 TimePicker 的下拉列表出现/消失时触发 | 出现时为true，隐藏时为false |
  \n
  |  方法名 | 说明 | 参数 |
  | :--- | :--- | :--- |
  | focus | 使 input 获取焦点 | — |
  | blur | 使 input 失去焦点 | — |
  \n
  |  属性 | 说明 | 类型 | 可选值 | 默认值 |
  | :--- | :--- | :--- | :--- | :--- |
  | model-value / v-model | 选中项绑定值 | string | — | — |
  | disabled | 禁用状态 | boolean | — | false |
  | editable | 文本框可输入 | boolean | — | true |
  | clearable | 是否显示清除按钮 | boolean | — | true |
  | size | 输入框尺寸 | string | large / default / small | default |
  | placeholder | 非范围选择时的占位内容 | string | — | — |
  | name | 原生属性 | string | — | — |
  | effect | Tooltip 主题，内置了 dark / light 两种主题 | string | string | light |
  | prefix-icon | 自定义前缀图标组件 | string / Component | — | Clock |
  | clear-icon | 自定义清除图标组件 | string / Component | — | CircleClose |
  | start | 开始时间 | string | — | 09:00 |
  | end | 结束时间 | string | — | 18:00 |
  | step | 间隔时间 | string | — | 00:30 |
  | min-time | 最早时间点，早于该时间的时间段将被禁用 | string | — | 00:00 |
  | max-time | 最晚时间点，晚于该时间的时间段将被禁用 | string | — | — |
  | format | 设置时间格式 | string | 详见 格式表示 | HH:mm |
  \n
  |  事件名 | 说明 | 回调参数 |
  | :--- | :--- | :--- |
  | change | 用户确认选定的值时触发 | val，组件绑定值 |
  | blur | 在组件 Input 失去焦点时触发 | 组件实例 |
  | focus | 在组件 Input 获得焦点时触发 | 组件实例 |
  \n
  |  方法名 | 说明 | 参数 |
  | :--- | :--- | :--- |
  | focus | 使 input 获取焦点 | — |
  | blur | 使 input 失去焦点 | — |
  \n
  |  属性 | 说明 | 类型 | 可选值 | 默认值 |
  | :--- | :--- | :--- | :--- | :--- |
  | model-value / v-model | 选中项绑定值 | array | — | — |
  | data | Transfer 的数据源 | array[{ key, label, disabled }] | — | [ ] |
  | filterable | 是否可搜索 | boolean | — | false |
  | filter-placeholder | 搜索框占位符 | string | — | Enter keyword |
  | filter-method | 自定义搜索方法 | function | — | — |
  | target-order | 右侧列表元素的排序策略： 若为 original，则保持与数据源相同的顺序； 若为 push，则新加入的元素排在最后； 若为 unshift，则新加入的元素排在最前 | string | original / push / unshift | original |
  | titles | 自定义列表标题 | array | — | ['List 1', 'List 2'] |
  | button-texts | 自定义按钮文案 | array | — | [ ] |
  | render-content | 自定义数据项渲染函数 | function(h, option) | — | — |
  | format | 列表顶部勾选状态文案 | object{noChecked, hasChecked} | — | { noChecked: '\${checked}/\${total}', hasChecked: '\${checked}/\${total}' } |
  | props | 数据源的字段别名 | object{key, label, disabled} | — | — |
  | left-default-checked | 初始状态下左侧列表的已勾选项的 key 数组 | array | — | [ ] |
  | right-default-checked | 初始状态下右侧列表的已勾选项的 key 数组 | array | — | [ ] |
  \n
  |  插槽名 | 说明 |
  | :--- | :--- |
  | — | 自定义数据项的内容， 参数为 { option } |
  | left-footer | 左侧列表底部的内容 |
  | right-footer | 右侧列表底部的内容 |
  \n
  |  方法名 | 说明 | 参数 |
  | :--- | :--- | :--- |
  | clearQuery | 清空某个面板的搜索关键词 | 'left' / 'right' |
  \n
  |  事件名 | 说明 | 回调参数 |
  | :--- | :--- | :--- |
  | change | 右侧列表元素变化时触发 | 当前值、数据移动的方向（'left' / 'right'）、发生移动的数据 key 数组 |
  | left-check-change | 左侧列表元素被用户选中 / 取消选中时触发 | 当前被选中的元素的 key 数组、选中状态发生变化的元素的 key 数组 |
  | right-check-change | 右侧列表元素被用户选中 / 取消选中时触发 | 当前被选中的元素的 key 数组、选中状态发生变化的元素的 key 数组 |
  \n
  |  属性 | 说明 | 类型 | 可选值 | 默认值 |
  | :--- | :--- | :--- | :--- | :--- |
  | model-value / v-model | 选中项绑定值 | Date | — | — |
  | range | 时间范围，包括开始时间与结束时间。 开始时间必须是周起始日，结束时间必须是周结束日，且时间跨度不能超过两个月。 | [Date]Array | — | — |
  \n
  |  插槽名 | 说明 | 参数 |
  | :--- | :--- | :--- |
  | dateCell | { type, isSelected, day, date }. type 表示该日期的所属月份，可选值有 prev-month，current-month，next-month；isSelected 标明该日期是否被选中；day 是格式化的日期，格式为 yyyy-MM-dd；date 是单元格的日期 | data |
  \n
  |  属性 | 说明 | 类型 | 可选值 | 默认值 |
  | :--- | :--- | :--- | :--- | :--- |
  | header | 卡片的标题 你既可以通过设置 header 来修改标题，也可以通过 slot#header 传入 DOM 节点 | string | — | — |
  | body-style | body 的样式 | object | — | { padding: '20px' } |
  | shadow | 设置阴影显示时机 | string | always / hover / never | always |
  \n
  |  插槽名 | 说明 |
  | :--- | :--- |
  | — | 自定义默认内容 |
  `,
  "el-carousel": `|  属性 | 说明 | 类型 | 可选值 | 默认值 |
  | :--- | :--- | :--- | :--- | :--- |
  | height | carousel 的高度 | string | — | — |
  | initial-index | 初始状态激活的幻灯片的索引，从 0 开始 | number | — | 0 |
  | trigger | 指示器的触发方式 | string | hover/click | hover |
  | autoplay | 是否自动切换 | boolean | — | true |
  | interval | 自动切换的时间间隔，单位为毫秒 | number | — | 3000 |
  | indicator-position | 指示器的位置 | string | outside/none | — |
  | arrow | 切换箭头的显示时机 | string | always/hover/never | hover |
  | type | carousel 的类型 | string | card | — |
  | loop | 是否循环显示 | boolean | - | true |
  | direction | 展示的方向 | string | horizontal/vertical | horizontal |
  | pause-on-hover | 鼠标悬浮时暂停自动切换 | boolean | - | true |
  \n
  |  事件名 | 说明 | 回调参数 |
  | :--- | :--- | :--- |
  | change | 幻灯片切换时触发 | 目前激活的幻灯片的索引，原幻灯片的索引 |
  \n
  |  方法名 | 说明 | 参数 |
  | :--- | :--- | :--- |
  | setActiveItem | 手动切换幻灯片 | 需要切换的幻灯片的索引，从 0 开始；或相应 el-carousel-item 的 name 属性值 |
  | prev | 切换至上一张幻灯片 | — |
  | next | 切换至下一张幻灯片 | — |
  \n
  |  插槽名 | 说明 | 子标签 |
  | :--- | :--- | :--- |
  | - | 自定义默认内容 | Carousel-Item |
  `,
  "el-carousel-item": `|  属性 | 说明 | 类型 | 可选值 | 默认值 |
  | :--- | :--- | :--- | :--- | :--- |
  | name | 幻灯片的名字，可用作 setActiveItem 的参数 | string | — | — |
  | label | 该幻灯片所对应指示器的文本 | string | — | — |
  \n
  |  插槽名 | 说明 |
  | :--- | :--- |
  | — | 自定义默认内容 |
  `,
  "el-collapse": `|  属性 | 详情 | 类型 | 可选值 | 默认值 |
  | :--- | :--- | :--- | :--- | :--- |
  | model-value / v-model | 当前激活的面板(如果是手风琴模式，绑定值类型需要为string，否则为array) | string (accordion mode) / array (non-accordion mode) | — | — |
  | accordion | 是否手风琴模式 | boolean | — | false |
  \n
  |  事件名 | 说明 | 回调参数 |
  | :--- | :--- | :--- |
  | change | 当前激活面板改变时触发(如果是手风琴模式，参数 activeNames 类型为string，否则为array) | (activeNames: array (non-accordion mode) / string (accordion mode)) |
  \n
  |  插槽名 | Description | 子标签 |
  | :--- | :--- | :--- |
  | - | 自定义默认内容 | Collapse Item |
  \n
  |  属性 | 说明 | 类型 | 可选值 | 默认值 |
  | :--- | :--- | :--- | :--- | :--- |
  | name | 唯一标志符 | string/number | — | — |
  | title | 面板标题 | string | — | — |
  | disabled | 是否禁用 | boolean | — | — |
  \n
  |  插槽名 | 说明 |
  | :--- | :--- |
  | — | content of Collapse Item |
  | title | content of Collapse Item title |
  `,
  "el-descriptions": `|  属性 | 说明 | 类型 | 可选值 | 默认值 |
  | :--- | :--- | :--- | :--- | :--- |
  | border | 是否带有边框 | boolean | — | false |
  | column | 一行 Descriptions Item 的数量 | number | — | 3 |
  | direction | 排列的方向 | string | vertical / horizontal | horizontal |
  | size | 列表的尺寸 | string | large / default / small | default |
  | title | 标题文本，显示在左上方 | string | — | — |
  | extra | 操作区文本，显示在右上方 | string | — | — |
  \n
  |  插槽名 | 说明 | 子标签 |
  | :--- | :--- | :--- |
  | — | 自定义默认内容 | Descriptions Item |
  | title | 自定义标题，显示在左上方 | — |
  | extra | 自定义操作区，显示在右上方 | — |
  \n
  |  属性 | 说明 | 类型 | 可选值 | 默认值 |
  | :--- | :--- | :--- | :--- | :--- |
  | label | 标签文本 | string | — | — |
  | span | 列的数量 | number | — | 1 |
  | width | 列的宽度，不同行相同列的宽度按最大值设定（如无 border ，宽度包含标签与内容） | string / number | — | — |
  | min-width | 列的最小宽度，与 width 的区别是 width 是固定的，min-width 会把剩余宽度按比例分配给设置了 min-width 的列（如无 border，宽度包含标签与内容） | string / number | — | — |
  | align | 列的内容对齐方式（如无 border，对标签和内容均生效） | string | left / center / right | left |
  | label-align | 列的标签对齐方式，若不设置该项，则使用内容的对齐方式（如无 border，请使用 align 参数） | string | left / center / right | — |
  | class-name | 列的内容自定义类名 | string | — | — |
  | label-class-name | column label custom class name | string | — | — |
  \n
  |  插槽名 | 说明 |
  | :--- | :--- |
  | — | 自定义默认内容 |
  | label | 自定义标签 |
  `,
  "el-empty": `|  属性 | 说明 | 类型 | 可选值 | 默认值 |
  | :--- | :--- | :--- | :--- | :--- |
  | image | 图片地址 | string | — | — |
  | image-size | 图片大小（宽度） | number | — | — |
  | description | 描述 | string | — | — |
  \n
  |  插槽名 | 描述说明 |
  | :--- | :--- |
  | default | 自定义底部内容 |
  | image | 自定义图片 |
  | description | 自定义描述 |
  \n
  |  属性 | 说明 | 类型 | 可选值 | 默认值 |
  | :--- | :--- | :--- | :--- | :--- |
  | v-infinite-scroll | 滚动到底部时，加载更多数据 | function | - | - |
  | infinite-scroll-disabled | 是否禁用 | boolean | - | false |
  | infinite-scroll-delay | 节流时延，单位为ms | number | - | 200 |
  | infinite-scroll-distance | 触发加载的距离阈值，单位为px | number | - | 0 |
  | infinite-scroll-immediate | 是否立即执行加载方法，以防初始状态下内容无法撑满容器。 | boolean | - | true |
  \n
  |  属性 | 说明 | 类型 | 可选值 | 默认值 |
  | :--- | :--- | :--- | :--- | :--- |
  | small | 是否使用小型分页样式 | boolean | — | false |
  | background | 是否为分页按钮添加背景色 | boolean | — | false |
  | page-size | 每页显示条目个数，支持 v-model 双向绑定 | number | — | 10 |
  | default-page-size | 每页显示条目数的初始值 | number | - | - |
  | total | 总条目数 | number | — | — |
  | page-count | 总页数 total 和 page-count 设置任意一个就可以达到显示页码的功能；如果要支持 page-sizes 的更改，则需要使用 total 属性 | number | — | — |
  | pager-count | 设置最大页码按钮数。 页码按钮的数量，当总页数超过该值时会折叠 | number | 5 ≤ x ≤ 21 的奇数 | 7 |
  | current-page | 当前页数，支持 v-model 双向绑定 | number | — | 1 |
  | default-current-page | 当前页数的初始值 | number | - | - |
  | layout | 组件布局，子组件名用逗号分隔 | string | sizes / prev / pager / next / jumper / -&gt; / total / slot | 'prev, pager, next, jumper, -&gt;, total' |
  | page-sizes | 每页显示个数选择器的选项设置 | number[] | — | [10, 20, 30, 40, 50, 100] |
  | popper-class | 每页显示个数选择器的下拉框类名 | string | — | — |
  | prev-text | 替代图标显示的上一页文字 | string | — | — |
  | next-text | 替代图标显示的下一页文字 | string | — | — |
  | disabled | 是否禁用分页 | boolean | — | false |
  | hide-on-single-page | 只有一页时是否隐藏 | boolean | — | - |
  \n
  |  事件名 | 说明 | 参数 |
  | :--- | :--- | :--- |
  | size-change | pageSize 改变时触发 | 新每页条数 |
  | current-change | current-change 改变时触发 | 新当前页 |
  | prev-click | 用户点击上一页按钮改变当前页时触发 | 新当前页 |
  | next-click | 用户点击下一页按钮改变当前页时触发 | 新当前页 |
  \n
  |  名称 | 说明 |
  | :--- | :--- |
  | — | 自定义内容 设置文案，需要在 layout 中列出 slot |
  `,
  "el-progress": `|  属性 | 说明 | 类型 | 可选值 | 默认值 |
  | :--- | :--- | :--- | :--- | :--- |
  | percentage | 百分比，必填 | number | 0-100 | 0 |
  | type | 进度条类型 | string | line/circle/dashboard | line |
  | stroke-width | 进度条的宽度 | number | — | 6 |
  | text-inside | 进度条显示文字内置在进度条内（仅 type 为 'line' 时可用） | boolean | — | false |
  | status | 进度条当前状态 | string | success/exception/warning | — |
  | indeterminate | 是否为动画进度条 | boolean | - | false |
  | duration | 控制动画进度条速度 | number | - | 3 |
  | color | 进度条背景色 进度条背景色 （会覆盖 status 状态颜色） | string/function/array | — | '' |
  | width | 环形进度条画布宽度（只在 type 为 circle 或 dashboard 时可用） | number | — | 126 |
  | show-text | 是否显示进度条文字内容 | boolean | — | true |
  | stroke-linecap | circle/dashboard 类型路径两端的形状 | string | butt/round/square | round |
  | format | 指定进度条文字内容 | function(percentage) | — | — |
  \n
  |  名称 | 说明 |
  | :--- | :--- |
  | default | 自定义内容，参数为 { percentage } |
  `,
  "el-result": `|  属性 | 说明 | 类型 | 可选值 | 默认值 |
  | :--- | :--- | :--- | :--- | :--- |
  | title | 标题 | string | — | — |
  | sub-title | 二级标题 | string | — | — |
  | icon | 图标类型 | string | success / warning / info / error | info |
  \n
  |  名称 | 说明 |
  | :--- | :--- |
  | icon | 自定义图标 |
  | title | 自定义标题 |
  | sub-title | 自定义二级标题 |
  | extra | 自定义底部额外区域 |
  `,
  "el-table": `|  属性 | 说明 | 类型 | 可选值 | 默认值 |
  | :--- | :--- | :--- | :--- | :--- |
  | data | 显示的数据 | array | — | — |
  | height | Table 的高度， 默认为自动高度。 如果 height 为 number 类型，单位 px；如果 height 为 string 类型，则这个高度会设置为 Table 的 style.height 的值，Table 的高度会受控于外部样式。 | string / number | — | — |
  | max-height | Table 的最大高度。 合法的值为数字或者单位为 px 的高度。 | string / number | — | — |
  | stripe | 是否为斑马纹 table | boolean | — | false |
  | border | 是否带有纵向边框 | boolean | — | false |
  | size | Table 的尺寸 | string | large / default /small | — |
  | fit | 列的宽度是否自撑开 | boolean | — | true |
  | show-header | 是否显示表头 | boolean | — | true |
  | highlight-current-row | 是否要高亮当前行 | boolean | — | false |
  | current-row-key | 当前行的 key，只写属性 | string / number | — | — |
  | row-class-name | 行的 className 的回调方法，也可以使用字符串为所有行设置一个固定的 className。 | function({ row, rowIndex }) / string | — | — |
  | row-style | 行的 style 的回调方法，也可以使用一个固定的 Object 为所有行设置一样的 Style。 | function({ row, rowIndex }) / object | — | — |
  | cell-class-name | 单元格的 className 的回调方法，也可以使用字符串为所有单元格设置一个固定的 className。 | function({ row, column, rowIndex, columnIndex }) / string | — | — |
  | cell-style | 单元格的 style 的回调方法，也可以使用一个固定的 Object 为所有单元格设置一样的 Style。 | function({ row, column, rowIndex, columnIndex }) / object | — | — |
  | header-row-class-name | 表头行的 className 的回调方法，也可以使用字符串为所有表头行设置一个固定的 className。 | function({ row, rowIndex }) / string | — | — |
  | header-row-style | 表头行的 style 的回调方法，也可以使用一个固定的 Object 为所有表头行设置一样的 Style。 | function({ row, rowIndex }) / object | — | — |
  | header-cell-class-name | 表头单元格的 className 的回调方法，也可以使用字符串为所有表头单元格设置一个固定的 className。 | function({ row, column, rowIndex, columnIndex }) / string | — | — |
  | header-cell-style | 表头单元格的 style 的回调方法，也可以使用一个固定的 Object 为所有表头单元格设置一样的 Style。 | function({ row, column, rowIndex, columnIndex }) / object | — | — |
  | row-key | 行数据的 Key，用来优化 Table 的渲染； 在使用reserve-selection功能与显示树形数据时，该属性是必填的。 类型为 String 时，支持多层访问：user.info.id，但不支持 user.info[0].id，此种情况请使用 Function。 | function(row) / string | — | — |
  | empty-text | 空数据时显示的文本内容， 也可以通过 #empty 设置 | string | — | No Data |
  | default-expand-all | 是否默认展开所有行，当 Table 包含展开行存在或者为树形表格时有效 | boolean | — | false |
  | expand-row-keys | 可以通过该属性设置 Table 目前的展开行，需要设置 row-key 属性才能使用，该属性为展开行的 keys 数组。 | array | — | — |
  | default-sort | 默认的排序列的 prop 和顺序。 它的 prop 属性指定默认的排序的列，order 指定默认排序的顺序 | object | order: ascending / descending | 如果只指定了 prop, 没有指定 order, 则默认顺序是 ascending |
  | tooltip-effect | tooltip effect 属性 | string | dark / light | dark |
  | show-summary | 是否在表尾显示合计行 | boolean | — | false |
  | sum-text | 合计行第一列的文本 | string | — | 合计 |
  | summary-method | 自定义的合计计算方法 | function({ columns, data }) | — | — |
  | span-method | 合并行或列的计算方法 | function({ row, column, rowIndex, columnIndex }) | — | — |
  | select-on-indeterminate | 在多选表格中，当仅有部分行被选中时，点击表头的多选框时的行为。 若为 true，则选中所有行；若为 false，则取消选择所有行 | boolean | — | true |
  | indent | 展示树形数据时，树节点的缩进 | number | — | 16 |
  | lazy | 是否懒加载子节点数据 | boolean | — | — |
  | load | 加载子节点数据的函数，lazy 为 true 时生效，函数第二个参数包含了节点的层级信息 | function(row, treeNode, resolve) | — | — |
  | tree-props | 渲染嵌套数据的配置选项 | object | — | { hasChildren: 'hasChildren', children: 'children' } |
  | table-layout | 设置表格单元、行和列的布局方式 | string | fixed / auto | fixed |
  | scrollbar-always-on | 总是显示滚动条 | boolean | — | false |
  | flexible 2.2.1 | ensure main axis minimum-size doesn't follow the content | boolean | — | false |
  \n
  |  事件名 | 说明 | 回调参数 |
  | :--- | :--- | :--- |
  | select | 当用户手动勾选数据行的 Checkbox 时触发的事件 | selection, row |
  | select-all | 当用户手动勾选全选 Checkbox 时触发的事件 | selection |
  | selection-change | 当选择项发生变化时会触发该事件 | selection |
  | cell-mouse-enter | 当单元格 hover 进入时会触发该事件 | row, column, cell, event |
  | cell-mouse-leave | 当单元格 hover 退出时会触发该事件 | row, column, cell, event |
  | cell-click | 当某个单元格被点击时会触发该事件 | row, column, cell, event |
  | cell-dblclick | 当某个单元格被双击击时会触发该事件 | row, column, cell, event |
  | cell-contextmenu | 当某个单元格被鼠标右键点击时会触发该事件 | row, column, cell, event |
  | row-click | 当某一行被点击时会触发该事件 | row, column, event |
  | row-contextmenu | 当某一行被鼠标右键点击时会触发该事件 | row, column, event |
  | row-dblclick | 当某一行被双击时会触发该事件 | row, column, event |
  | header-click | 当某一列的表头被点击时会触发该事件 | column, event |
  | header-contextmenu | 当某一列的表头被鼠标右键点击时触发该事件 | column, event |
  | sort-change | 当表格的排序条件发生变化的时候会触发该事件 | { column, prop, order } |
  | filter-change | column 的 key， 如果需要使用 filter-change 事件，则需要此属性标识是哪个 column 的筛选条件 | filters |
  | current-change | 当表格的当前行发生变化的时候会触发该事件，如果要高亮当前行，请打开表格的 highlight-current-row 属性 | currentRow, oldCurrentRow |
  | header-dragend | 当拖动表头改变了列的宽度的时候会触发该事件 | newWidth, oldWidth, column, event |
  | expand-change | 当用户对某一行展开或者关闭的时候会触发该事件（展开行时，回调的第二个参数为 expandedRows；树形表格时第二参数为 expanded） | row, (expandedRows | expanded) |
  \n
  |  方法名 | 说明 | 参数 |
  | :--- | :--- | :--- |
  | clearSelection | 用于多选表格，清空用户的选择 | — |
  | getSelectionRows | 返回当前选中的行 |  |
  | toggleRowSelection | 用于多选表格，切换某一行的选中状态， 如果使用了第二个参数，则可直接设置这一行选中与否 | row, selected |
  | toggleAllSelection | 用于多选表格，切换全选和全不选 | — |
  | toggleRowExpansion | 用于可扩展的表格或树表格，如果某行被扩展，则切换。 使用第二个参数，您可以直接设置该行应该被扩展或折叠。 | row, expanded |
  | setCurrentRow | 用于单选表格，设定某一行为选中行， 如果调用时不加参数，则会取消目前高亮行的选中状态。 | row |
  | clearSort | 用于清空排序条件，数据会恢复成未排序的状态 | — |
  | clearFilter | 传入由columnKey 组成的数组以清除指定列的过滤条件。 如果没有参数，清除所有过滤器 | columnKeys |
  | doLayout | 对 Table 进行重新布局。 当表格可见性变化时，您可能需要调用此方法以获得正确的布局 | — |
  | sort | 手动排序表格。 参数 prop 属性指定排序列，order 指定排序顺序。 | prop: string, order: string |
  | scrollTo | 滚动到一组特定坐标 | (options: ScrollToOptions | number, yCoord?: number) |
  | setScrollTop | 设置垂直滚动位置 | top |
  | setScrollLeft | 设置水平滚动位置 | left |
  \n
  |  插槽名 | 说明 | 子标签 |
  | :--- | :--- | :--- |
  | - | 自定义默认内容 | Table-column |
  | append | 插入至表格最后一行之后的内容， 如果需要对表格的内容进行无限滚动操作，可能需要用到这个 slot。 若表格有合计行，该 slot 会位于合计行之上。 | — |
  | empty | 当数据为空时自定义的内容 | — |
  \n
  |  事件名 | 描述 | 参数 |
  | :--- | :--- | :--- |
  | column-sort | Invoked when column sorted | Object&lt;ColumnSortParam&gt; |
  | expanded-rows-change | Invoked when expanded rows changed | Array&lt;KeyType&gt; |
  | end-reached | Invoked when the end of the table is reached | - |
  | scroll | Invoked after scrolled | Object&lt;ScrollParams&gt; |
  | rows-rendered | Invoked when rows are rendered | Object&lt;RowsRenderedParams&gt; |
  | row-event-handlers | A collection of handlers attached to each row | Object&lt;RowEventHandlers&gt; |
  \n
  |  事件名 | 描述 | 参数 |
  | :--- | :--- | :--- |
  | scrollTo | Scroll to a given position | { scrollLeft?: number, scrollTop?: number} |
  | scrollToLeft | Scroll to a given horizontal position | scrollLeft: number |
  | scrollToTop | Scroll to a given vertical position | scrollTop: number |
  | scrollToRow | scroll to a given row with specified scroll strategy | row: number, strategy?: \"auto\" |\"center\" | \"end\" | \"start\" | \"smart\" |
  `,
  "el-table-column": `|  属性 | 说明 | 类型 | 可选值 | 默认值 |
  | :--- | :--- | :--- | :--- | :--- |
  | type | 对应列的类型。 如果设置了selection则显示多选框； 如果设置了 index 则显示该行的索引（从 1 开始计算）； 如果设置了 expand 则显示为一个可展开的按钮 | string | selection / index / expand | — |
  | index | 如果设置了 type=index，可以通过传递 index 属性来自定义索引 | number / function(index) | — | — |
  | label | column 的 key，如果需要使用 filter-change 事件，则需要此属性标识是哪个 column 的筛选条件 | string | — | — |
  | column-key | column 的 key， column 的 key， 如果需要使用 filter-change 事件，则需要此属性标识是哪个 column 的筛选条件 | string | — | — |
  | prop | 字段名称 对应列内容的字段名， 也可以使用 property属性 | string | — | — |
  | width | 对应列的宽度 | string / number | — | — |
  | min-width | 对应列的最小宽度， 对应列的最小宽度， 与 width 的区别是 width 是固定的，min-width 会把剩余宽度按比例分配给设置了 min-width 的列 | string / number | — | — |
  | fixed | 列是否固定在左侧或者右侧。 true 表示固定在左侧 | string / boolean | true / 'left' / 'right' | — |
  | render-header | 列标题 Label 区域渲染使用的 Function | function({ column, $index }) | — | — |
  | sortable | 对应列是否可以排序， 如果设置为 'custom'，则代表用户希望远程排序，需要监听 Table 的 sort-change 事件 | boolean / string | true / false / 'custom' | false |
  | sort-method | 指定数据按照哪个属性进行排序，仅当sortable设置为true的时候有效。 应该如同 Array.sort 那样返回一个 Number | function(a, b) | — | — |
  | sort-by | 指定数据按照哪个属性进行排序，仅当 sortable 设置为 true 且没有设置 sort-method 的时候有效。 如果 sort-by 为数组，则先按照第 1 个属性排序，如果第 1 个相等，再按照第 2 个排序，以此类推 | function(row, index) / string / array | — | — |
  | sort-orders | 数据在排序时所使用排序策略的轮转顺序，仅当 sortable 为 true 时有效。 需传入一个数组，随着用户点击表头，该列依次按照数组中元素的顺序进行排序 | array | 数组中的元素需为以下三者之一：ascending 表示升序，descending 表示降序，null 表示还原为原始顺序 | ['ascending', 'descending', null] |
  | resizable | 对应列是否可以通过拖动改变宽度（需要在 el-table 上设置 border 属性为真） | boolean | — | false |
  | formatter | 用来格式化内容 | function(row, column, cellValue, index) | — | — |
  | show-overflow-tooltip | 当内容过长被隐藏时显示 tooltip | boolean | — | false |
  | align | 对齐方式 | string | left / center / right | left |
  | header-align | 表头对齐方式， 若不设置该项，则使用表格的对齐方式 | string | left / center / right | — |
  | class-name | 列的 className | string | — | — |
  | label-class-name | 当前列标题的自定义类名 | string | — | — |
  | selectable | 仅对 type=selection 的列有效，类型为 Function，Function 的返回值用来决定这一行的 CheckBox 是否可以勾选 | function(row, index) | — | — |
  | reserve-selection | 仅对  type=selection 的列有效， 请注意， 需指定 row-key 来让这个功能生效。 | boolean | — | false |
  | filters | 数据过滤的选项， 数组格式，数组中的元素需要有 text 和 value 属性。 数组中的每个元素都需要有 text 和 value 属性。 | array[{ text, value }] | — | — |
  | filter-placement | 过滤弹出框的定位 | string | 与 Tooltip 的 placement 属性相同 | — |
  | filter-multiple | 数据过滤的选项是否多选 | boolean | — | true |
  | filter-method | 数据过滤使用的方法， 如果是多选的筛选项，对每一条数据会执行多次，任意一次返回 true 就会显示。 | function(value, row, column) | — | — |
  | filtered-value | 选中的数据过滤项，如果需要自定义表头过滤的渲染方式，可能会需要此属性。 | array | — | — |
  \n
  |  插槽名 | 说明 |
  | :--- | :--- |
  | — | 自定义列的内容 作用域参数为 { row, column, $index } |
  | header | 自定义表头的内容， 作用域参数为 { column, $index } |
  `,
  "el-table-v-2": `|  属性 | 描述说明 | 类型 | 默认值 |
  | :--- | :--- | :--- | :--- |
  | cache | Number of rows rendered in advance for boosting the performance | Number | 2 |
  | estimated-row-height | The estimated row height for rendering dynamic height rows | Number | - |
  | header-class | Customized class name passed to header wrapper | String/Function&lt;HeaderClassGetter&gt; | - |
  | header-props | Customized props name passed to header component | Object/Function&lt;HeaderPropsGetter&gt; | - |
  | header-cell-props | Customized props name passed to header cell component | Object/Function&lt;HeaderCellPropsGetter&gt; | - |
  | header-height | The height of entire header, when it's array, it will render as many header rows as the given array's length | Number/Array&lt;Number&gt; | 50 |
  | footer-height | The height of the footer element, when presented, it will be part of the calculation of the table's height. | Number | 0 |
  | row-class | Customized class name passed to row wrapper | String/Function&lt;RowClassGetter&gt; | - |
  | row-key | The key of each row, if not provided, it will be the index of the row | String/Symbol/Number | id |
  | row-props | Customized props name passed to row component | Object/Function&lt;RowPropsGetter&gt; | - |
  | row-height | The height of each row, used for calculating the total height of the table | Number | 50 |
  | cell-props | extra props passed to each cell (except header cells) | Object/Function&lt;CellPropsGetter&gt; | - |
  | columns | An array of column definitions. | Array&lt;Column&gt; | - |
  | data | An array of data to be rendered in the table. | Array&lt;Data&gt; | [] |
  | data-getter | An method which helps customizing the how to fetch the data from the data source. | Function | - |
  | fixed-data | Data for rendering rows above the main content and below the header | Array&lt;Data&gt; | - |
  | expand-column-key | The column key indicates which row is expandable | String | - |
  | expanded-row-keys | An array of keys for expanded rows, can be used with v-model | Array&lt;KeyType&gt; | - |
  | default-expanded-row-keys | An array of keys for default expanded rows, NON REACTIVE | Array&lt;KeyType&gt; | - |
  | class | Class name for the the virtual table, will be applied to all three tables (left, right, main) | String/Array/Object | - |
  | fixed | Flag indicates the table column's width is a fixed or flexible. | Boolean | false |
  | width * | Width for the table, required | Number | - |
  | height * | Height for the table, required | Number | - |
  | max-height | Maximum height for the table | Number | - |
  | h-scrollbar-size | Indicates the horizontal scrollbar's size for the table, used to prevent the horizontal and vertical scrollbar to collapse | Number | 6 |
  | v-scrollbar-size | Indicates the horizontal scrollbar's size for the table, used to prevent the horizontal and vertical scrollbar to collapse | Number | 6 |
  | scrollbar-always-on | If true, the scrollbar will always be shown instead of when mouse is placed above the table | Boolean | false |
  | sort-by | Sort indicator | Object&lt;SortBy&gt; | {} |
  | sort-state | Multiple sort indicator | Object&lt;SortState&gt; | undefined |
  \n
  |  插槽名 | 参数 |
  | :--- | :--- |
  | cell | CellSlotProps |
  | header | HeaderSlotProps |
  | header-cell | HeaderCellSlotProps |
  | row | RowSlotProps |
  | footer | - |
  | empty | - |
  | overlay | - |
  `,
  "el-column": `|  属性 | 描述 | 类型 | 默认值 |
  | :--- | :--- | :--- | :--- |
  | align | Alignment of the table cell content | Alignment | left |
  | class | Class name for the column | String | - |
  | fixed | Fixed direction of the column | Boolean/FixedDir | false |
  | flexGrow | CSSProperties flex grow, Only useful when not this is not a fixed table | Number | 0 |
  | flexShrink | CSSProperties flex shrink, Only useful when not this is not a fixed table | Number | 1 |
  | headerClass | Used for customizing header column class | String | - |
  | hidden | Whether the column is invisible | Boolean | - |
  | style | Customized style for column cell, will be merged with grid cell | CSSProperties | - |
  | sortable | Indicates whether the column is sortable | Boolean | - |
  | title | The default text rendered in header cell | String | - |
  | maxWidth | Maximum width for the column | String | - |
  | minWidth | Minimum width for the column | String | - |
  | width * | Width for the column Required | Number | - |
  | cellRenderer | Customized Cell renderer | VueComponent/(props: CellRenderProps) =&gt; VNode | - |
  | headerRenderer | Customized Header renderer | VueComponent/(props: HeaderRenderProps) =&gt; VNode | - |
  `,
  "el-tag": `|  属性 | 说明 | 类型 | 可选值 | 默认值 |
  | :--- | :--- | :--- | :--- | :--- |
  | type | 类型 | string | success/info/warning/danger | — |
  | closable | 是否可关闭 | boolean | — | false |
  | disable-transitions | 是否禁用渐变动画 | boolean | — | false |
  | hit | 是否有边框描边 | boolean | — | false |
  | color | 背景色 | string | — | — |
  | size | 尺寸 | string | large / default /small | default |
  | effect | 主题 | string | dark / light / plain | light |
  | round | Tag 是否为圆形 | boolean | — | false |
  \n
  |  事件名 | 说明 | 参数 |
  | :--- | :--- | :--- |
  | click | 点击 Tag 时触发的事件 | — |
  | close | 关闭 Tag 时触发的事件 | — |
  \n
  |  名称 | 说明 |
  | :--- | :--- |
  | — | 自定义默认内容 |
  `,
  "el-check-tag": `|  属性 | 说明 | 类型 | 可选值 | 默认值 |
  | :--- | :--- | :--- | :--- | :--- |
  | checked | 是否选中 | boolean | true/false | — |
  \n
  |  事件名 | 说明 | 参数 |
  | :--- | :--- | :--- |
  | change | 点击 Check Tag 时触发的事件 | checked |
  \n
  |  名称 | 说明 |
  | :--- | :--- |
  | — | 自定义默认内容 |
  `,
  "el-timeline": `|  插槽名 | 说明 | 子标签 |
  | :--- | :--- | :--- |
  | — | 时间戳 | Timeline-Item |
  `,
  "el-timeline-item": `|  属性 | 说明 | 类型 | 可选值 | 默认值 |
  | :--- | :--- | :--- | :--- | :--- |
  | timestamp | 时间戳 | string | — | — |
  | hide-timestamp | 是否隐藏时间戳 | boolean | — | false |
  | center | 是否垂直居中 | boolean | — | false |
  | placement | 时间戳位置 | string | top / bottom | bottom |
  | type | 节点类型 | string | primary / success / warning / danger / info | — |
  | color | 节点颜色 | string | hsl / hsv / hex / rgb | — |
  | size | 节点尺寸 | string | normal / large | normal |
  | icon | 自定义图标 | string / Component | — | — |
  | hollow | 是否空心点 | boolean | — | false |
  \n
  |  插槽名 | 说明 |
  | :--- | :--- |
  | — | Timeline-Item 的内容 |
  | dot | 自定义节点 |
  \n
  |  属性 | 说明 | 类型 | 可选值 | 默认值 |
  | :--- | :--- | :--- | :--- | :--- |
  | data | 展示数据 | array | — | — |
  | empty-text | 内容为空的时候展示的文本 | string | — | — |
  | node-key | 每个树节点用来作为唯一标识的属性，整棵树应该是唯一的 | string | — | — |
  | props | 配置选项，具体看下表 | object | — | — |
  | render-after-expand | 是否在第一次展开某个树节点后才渲染其子节点 | boolean | — | true |
  | load | 加载子树数据的方法，仅当 lazy 属性为true 时生效 | function(node, resolve)，node为当前点击的节点，resolve为数据加载完成的回调(必须调用) | — | — |
  | render-content | 树节点的内容区的渲染 Function | Function(h, { node, data, store }) | — | — |
  | highlight-current | 是否高亮当前选中节点，默认值是 false。 | boolean | — | false |
  | default-expand-all | 是否默认展开所有节点 | boolean | — | false |
  | expand-on-click-node | 是否在点击节点的时候展开或者收缩节点， 默认值为 true，如果为 false，则只有点箭头图标的时候才会展开或者收缩节点。 | boolean | — | true |
  | check-on-click-node | 是否在点击节点的时候选中节点，默认值为 false，即只有在点击复选框时才会选中节点。 | boolean | — | false |
  | auto-expand-parent | 展开子节点的时候是否自动展开父节点 | boolean | — | true |
  | default-expanded-keys | 默认展开的节点的 key 的数组 | array | — | — |
  | show-checkbox | 节点是否可被选择 | boolean | — | false |
  | check-strictly | 在显示复选框的情况下，是否严格的遵循父子不互相关联的做法，默认为 false | boolean | — | false |
  | default-checked-keys | 默认勾选的节点的 key 的数组 | array | — | — |
  | current-node-key | 当前选中的节点 | string, number | — | — |
  | filter-node-method | 对树节点进行筛选时执行的方法， 返回 false 则表示这个节点会被隐藏 | Function(value, data, node) | — | — |
  | accordion | 是否每次只打开一个同级树节点展开 | boolean | — | false |
  | indent | 相邻级节点间的水平缩进，单位为像素 | number | — | 16 |
  | icon | 自定义图标组件 | string / Component | - | - |
  | lazy | 是否懒加载子节点，需与 load 方法结合使用 | boolean | — | false |
  | draggable | 是否开启拖拽节点功能 | boolean | — | false |
  | allow-drag | 判断节点能否被拖拽 如果返回 false ，节点不能被拖动 | Function(node) | — | — |
  | allow-drop | 拖拽时判定目标节点能否成为拖动目标位置。 如果返回 false ，拖动节点不能被拖放到目标节点。 type 参数有三种情况：'prev'、'inner' 和 'next'，分别表示放置在目标节点前、插入至目标节点和放置在目标节点后 | Function(draggingNode, dropNode, type) | — | — |
  \n
  |  Props | 说明 | 类型 | 可选值 | 默认值 |
  | :--- | :--- | :--- | :--- | :--- |
  | label | 指定节点标签为节点对象的某个属性值 | string, function(data, node) | — | — |
  | children | 指定子树为节点对象的某个属性值 | string | — | — |
  | disabled | 指定节点选择框是否禁用为节点对象的某个属性值 | string, function(data, node) | — | — |
  | isLeaf | 指定节点是否为叶子节点，仅在指定了 lazy 属性的情况下生效 | string, function(data, node) | — | — |
  | class | 自定义节点类名 | string, function(data, node) | — | — |
  \n
  |  事件名 | 说明 | 回调参数 |
  | :--- | :--- | :--- |
  | node-click | 当节点被点击的时候触发 | 三个参数：对应于节点点击的节点对象， TreeNode 节点 属性，事件对象 |
  | node-contextmenu | 当某一节点被鼠标右键点击时会触发该事件 | 共四个参数，依次为：event、传递给 data 属性的数组中该节点所对应的对象、节点对应的 Node、节点组件本身。 |
  | check-change | 当复选框被点击的时候触发 | 共三个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、节点本身是否被选中、节点的子树中是否有被选中的节点 |
  | check | 点击节点复选框之后触发 | 共两个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、树目前的选中状态对象，包含 checkedNodes、checkedKeys、halfCheckedNodes、halfCheckedKeys 四个属性 |
  | current-change | 当前选中节点变化时触发的事件 | 共两个参数，依次为：当前节点的数据，当前节点的 Node 对象 |
  | node-expand | 节点被展开时触发的事件 | 共三个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、节点对应的 Node、节点组件本身 |
  | node-collapse | 节点被关闭时触发的事件 | 共三个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、节点对应的 Node、节点组件本身 |
  | node-drag-start | 节点开始拖拽时触发的事件 | 共两个参数，依次为：被拖拽节点对应的 Node、event |
  | node-drag-enter | 拖拽进入其他节点时触发的事件 | 共三个参数，依次为：被拖拽节点对应的 Node、所进入节点对应的 Node、event |
  | node-drag-leave | 拖拽离开某个节点时触发的事件 | 共三个参数，依次为：被拖拽节点对应的 Node、所离开节点对应的 Node、event |
  | node-drag-over | 在拖拽节点时触发的事件（类似浏览器的 mouseover 事件） | 共三个参数，依次为：被拖拽节点对应的 Node、当前进入节点对应的 Node、event |
  | node-drag-end | 拖拽结束时（可能未成功）触发的事件 | 共四个参数，依次为：被拖拽节点对应的 Node、结束拖拽时最后进入的节点（可能为空）、被拖拽节点的放置位置（before、after、inner）、event |
  | node-drop | 拖拽成功完成时触发的事件 | 共四个参数，依次为：被拖拽节点对应的 Node、结束拖拽时最后进入的节点、被拖拽节点的放置位置（before、after、inner）、event |
  \n
  |  插槽名 | 说明 |
  | :--- | :--- |
  | — | 自定义树节点的内容， 自定义树节点的内容， 参数为  { node, data } |
  `,
  "el-tree-v-2": `|  属性 | 说明 | 类型 | 默认值 |
  | :--- | :--- | :--- | :--- |
  | data | 展示数据 | array | — |
  | empty-text | 内容为空的时候展示的文本 | string | — |
  | props | 配置选项，具体看下表 | object | — |
  | highlight-current | 是否高亮当前选中节点 | boolean | false |
  | expand-on-click-node | 是否在点击节点的时候展开或者收缩节点， 默认值为 true，如果为 false，则只有点箭头图标的时候才会展开或者收缩节点 | boolean | true |
  | check-on-click-node | 是否在点击节点的时候选中节点，默认值为 false，即只有在点击复选框时才会选中节点 | boolean | false |
  | default-expanded-keys | 默认展开的节点的 key 的数组 | array | — |
  | show-checkbox | 节点是否可被选择 | boolean | false |
  | check-strictly | 在显示复选框的情况下，是否严格的遵循父子不互相关联的做法，默认为 false | boolean | false |
  | default-checked-keys | 默认勾选的节点的 key 的数组 | array | — |
  | current-node-key | 当前选中的节点 | string, number | — |
  | filter-method | 对树节点进行筛选时执行的方法，返回 true 表示这个节点可以显示， 返回 false 则表示这个节点会被隐藏 | Function(value, data) | — |
  | indent | 相邻级节点间的水平缩进，单位为像素 | number | 16 |
  | icon | 自定义树节点的图标 | string / Component | - |
  \n
  |  属性 | 说明 | 类型 | 默认值 |
  | :--- | :--- | :--- | :--- |
  | value | 每个树节点用来作为唯一标识的属性，在整棵树中应该是唯一的 | string, number | id |
  | label | 指定节点标签为节点对象的某个属性值 | string | label |
  | children | 指定子树为节点对象的某个属性值 | string | children |
  | disabled | 指定节点选择框是否禁用为节点对象的某个属性值 | string | disabled |
  \n
  |  事件名 | 说明 | 参数 |
  | :--- | :--- | :--- |
  | node-click | 当节点被点击的时候触发 | (data: TreeNodeData, node: TreeNode, e: MouseEvent) |
  | node-contextmenu | 当节点被鼠标右键点击时会触发该事件 | (e: Event, data: TreeNodeData, node: TreeNode) |
  | check-change | 节点选中状态发生变化时的回调 | (data: TreeNodeData, checked: boolean) |
  | check | 当复选框被点击的时候触发 | (data: TreeNodeData, info: { checkedKeys: TreeKey[],checkedNodes: TreeData, halfCheckedKeys: TreeKey[], halfCheckedNodes: TreeData,}) |
  | current-change | 当前选中节点变化时触发的事件 | (data: TreeNodeData, node: TreeNode) |
  | node-expand | 节点被展开时触发的事件 | (data: TreeNodeData, node: TreeNode) |
  | node-collapse | 节点被收起时触发的事件 | (data: TreeNodeData, node: TreeNode) |
  \n
  |  名称 | 说明 |
  | :--- | :--- |
  | - | 自定义树节点的内容。 作用域参数为 { node: TreeNode, data: TreeNodeData } |
  `,
  "el-backtop": `|  名称 | 说明 | 回调参数 |
  | :--- | :--- | :--- |
  | click | 点击按钮触发的事件 | (evt: MouseEvent) =&gt; void |
  \n
  |  插槽名 | 说明 |
  | :--- | :--- |
  | default | 自定义默认内容 |
  `,
  "el-breadcrumb": `|  属性 | 说明 | 类型 | 可选值 | 默认值 |
  | :--- | :--- | :--- | :--- | :--- |
  | separator | 分隔符 | string | — | / |
  | separator-icon | 图标分隔符的组件或组件名 | string / Component | — | - |
  \n
  |  插槽名 | 说明 | 子标签 |
  | :--- | :--- | :--- |
  | - | 自定义默认内容 | Breadcrumb Item |
  \n
  |  属性 | 说明 | 类型 | 可选值 | 默认值 |
  | :--- | :--- | :--- | :--- | :--- |
  | to | 路由跳转目标，同 vue-router 的 to属性 | string/object | — | — |
  | replace | 如果设置该属性为 true, 导航将不会留下历史记录 | boolean | — | false |
  \n
  |  插槽名 | 说明 |
  | :--- | :--- |
  | — | 自定义默认内容 |
  `,
  "el-dropdown": `|  属性 | 说明 | 类型 | 可选值 | 默认值 |
  | :--- | :--- | :--- | :--- | :--- |
  | type | 菜单按钮类型，同 Button 组件一样，仅在 split-button 为 true 的情况下有效。 | string | — | — |
  | size | 菜单尺寸，在 split-button 为 true 的情况下也对触发按钮生效。 | string | large / default / small | default |
  | max-height | 菜单最大高度 | string / number | — | — |
  | split-button | 下拉触发元素呈现为按钮组 | boolean | — | false |
  | disabled | 是否禁用 | boolean | — | false |
  | placement | 菜单弹出位置 | string | top/top-start/top-end/bottom/bottom-start/bottom-end | bottom |
  | trigger | 触发下拉的行为 | string | hover/click/contextmenu | hover |
  | hide-on-click | 是否在点击菜单项后隐藏菜单 | boolean | — | true |
  | show-timeout | 展开下拉菜单的延时，仅在 trigger 为 hover 时有效 | number | — | 250 |
  | hide-timeout | 收起下拉菜单的延时（仅在 trigger 为 hover 时有效） | number | — | 150 |
  | tabindex | Dropdown 组件的 tabindex | number | — | 0 |
  | popper-class | 自定义浮层类名 | string | — | — |
  | popper-options | popper.js 参数 | Object | 参考 popper.js 文档 | { boundariesElement: 'body', gpuAcceleration: false } |
  \n
  |  插槽名 | 说明 | 子标签 |
  | :--- | :--- | :--- |
  | — | 下拉菜单的内容 注意：必须是有效的 html 保险套元素（例如 &lt;span&gt;, &lt;button&gt; 等）或 el-component, 以附加触发监听器 | — |
  | dropdown | 下拉列表，通常是 &lt;el-dropdown-menu&gt; 组件 | Dropdown-Menu |
  \n
  |  方法名 | 说明 | 参数 |
  | :--- | :--- | :--- |
  | click | split-button 为 true 时，点击左侧按钮的回调 | — |
  | command | 点击菜单项触发的事件回调 | dropdown-item 的指令 |
  | visible-change | 下拉框出现/隐藏时触发 | 出现则为 true，隐藏则为 false |
  \n
  |  方法名 | 说明 | 参数 |
  | :--- | :--- | :--- |
  | handleOpen | 打开下拉菜单 | — |
  | handleClose | 关闭下拉菜单 | — |
  `,
  "el-dropdown-menu": `|  插槽名 | 说明 | 子标签 |
  | :--- | :--- | :--- |
  | — | 下拉菜单的内容 | Dropdown-Item |
  `,
  "el-dropdown-item": `|  属性 | 说明 | 类型 | 可选值 | 默认值 |
  | :--- | :--- | :--- | :--- | :--- |
  | command | 派发到command回调函数的指令参数 | string/number/object | — | — |
  | disabled | 是否禁用 | boolean | — | false |
  | divided | 是否显示分隔符 | boolean | — | false |
  | icon | 自定义图标 | string / Component | — | — |
  \n
  |  插槽名 | 说明 |
  | :--- | :--- |
  | — | 自定义Dropdown-Item内容 |
  `,
  "el-menu": `|  属性 | 说明 | 类型 | 可选值 | 默认值 |
  | :--- | :--- | :--- | :--- | :--- |
  | mode | 菜单展示模式 | string | horizontal / vertical | vertical |
  | collapse | 是否水平折叠收起菜单（仅在 mode 为 vertical 时可用） | boolean | — | false |
  | ellipsis | 是否省略多余的子项（仅在横向模式生效） | boolean | — | true |
  | background-color | background color of Menu (hex format) (deprecated, use --bg-color instead) | string | — | #ffffff |
  | text-color | text color of Menu (hex format) (deprecated, use --text-color instead) | string | — | #303133 |
  | active-text-color | text color of currently active menu item (hex format) (deprecated, use --active-color instead) | string | — | #409EFF |
  | default-active | 默认激活菜单的 index | string | — | — |
  | default-openeds | 默认打开的 sub-menu 的 index 的数组 | Array | — | — |
  | unique-opened | 是否只保持一个子菜单的展开 | boolean | — | false |
  | menu-trigger | 子菜单打开的触发方式，只在 mode 为 horizontal 时有效。 | string | hover / click | hover |
  | router | 是否启用 vue-router 模式。 启用该模式会在激活导航时以 index 作为 path 进行路由跳转 | boolean | — | false |
  | collapse-transition | 是否开启折叠动画 | boolean | — | true |
  \n
  |  方法名 | 说明 | 参数 |
  | :--- | :--- | :--- |
  | open | 展开指定的 sub-menu | index: 需要打开的 sub-menu 的 index |
  | close | 收起指定的 sub-menu | index: 需要收起的 sub-menu 的 index |
  \n
  |  事件名 | 说明 | 回调参数 |
  | :--- | :--- | :--- |
  | select | 菜单激活回调 | index: 选中菜单项的 index, indexPath: 选中菜单项的 index path, item: 选中菜单项, routeResult: vue-router 的返回值（如果 router 为 true） |
  | open | sub-menu 展开的回调 | index: 打开的 sub-menu 的 index, indexPath: 打开的 sub-menu 的 index path |
  | close | sub-menu 收起的回调 | index: 收起的 sub-menu 的 index, indexPath: 收起的 sub-menu 的 index path |
  \n
  |  插槽名 | 说明 | 子标签 |
  | :--- | :--- | :--- |
  | — | 自定义默认内容 | SubMenu / Menu-Item / Menu-Item-Group |
  `,
  "el-sub-menu": `|  属性 | 说明 | 类型 | 可选值 | 默认值 |
  | :--- | :--- | :--- | :--- | :--- |
  | index | 唯一标志 | string | — | — |
  | popper-class | 为 popper 添加类名 | string | — | — |
  | show-timeout | 展开 sub-menu 的延时 | number | — | 300 |
  | hide-timeout | 收起 sub-menu 的延时 | number | — | 300 |
  | disabled | 是否禁用 | boolean | — | false |
  | popper-append-to-body（已废弃） | 是否将弹出菜单插入至 body 元素。 在菜单的定位出现问题时，可尝试修改该属性 | boolean | - | 一级子菜单：true / 非一级子菜单：false |
  | popper-offset | 弹出窗口偏移 | number | — | 6 |
  \n
  |  插槽名 | 说明 | 子标签 |
  | :--- | :--- | :--- |
  | — | 自定义默认内容 | SubMenu / Menu-Item / Menu-Item-Group |
  `,
  "el-menu-item": `|  属性 | 说明 | 类型 | 可选值 | 默认值 |
  | :--- | :--- | :--- | :--- | :--- |
  | index | 唯一标志 | string/null | — | null |
  | route | Vue Router 路径对象 | object | — | — |
  | disabled | 是否禁用 | boolean | — | false |
  \n
  |  事件名 | 说明 | 回调参数 |
  | :--- | :--- | :--- |
  | click | 菜单点击时的回调函数 | el-menu-item 实例 |
  \n
  |  插槽名 | 说明 |
  | :--- | :--- |
  | — | 自定义默认内容 |
  `,
  "el-menu-item-group": `|  属性 | 说明 | 类型 | 可选值 | 默认值 |
  | :--- | :--- | :--- | :--- | :--- |
  | title | 组标题 | string | — | — |
  \n
  |  插槽名 | 说明 | 子标签 |
  | :--- | :--- | :--- |
  | — | 默认插槽内容 | Menu-Item |
  \n
  |  属性 | 说明 | 类型 | 可选值 | 默认值 |
  | :--- | :--- | :--- | :--- | :--- |
  | icon | 图标组件 | string / Component | — | Back |
  | title | 标题 | string | — | Back |
  | content | 内容 | string | — | — |
  \n
  |  事件名 | 说明 | 参数 |
  | :--- | :--- | :--- |
  | back | 点击左侧区域触发 | — |
  \n
  |  名称 | 说明 |
  | :--- | :--- |
  | icon | 自定义图标 |
  | title | 标题内容 |
  | content | 内容 |
  `,
  "el-steps": `|  属性 | 说明 | 类型 | 可选值 | 默认值 |
  | :--- | :--- | :--- | :--- | :--- |
  | space | 每个 step 的间距，不填写将自适应间距。 支持百分比。 | number / string | — | — |
  | direction | 显示方向 | string | vertical/horizontal | horizontal |
  | active | 设置当前激活步骤 | number | — | 0 |
  | process-status | 设置当前步骤的状态 | string | wait / process / finish / error / success | process |
  | finish-status | 设置结束步骤的状态 | string | wait / process / finish / error / success | finish |
  | align-center | 进行居中对齐 | boolean | — | false |
  | simple | 是否应用简洁风格 | boolean | - | false |
  \n
  |  插槽名 | 说明 | 子标签 |
  | :--- | :--- | :--- |
  | - | 默认插槽 | Step |
  `,
  "el-step": `|  属性 | 说明 | 类型 | 可选值 | 默认值 |
  | :--- | :--- | :--- | :--- | :--- |
  | title | 标题 | string | — | — |
  | description | 描述文案 | string | — | — |
  | icon | Step 组件的自定义图标。 也支持 slot 方式写入 | string / Component | — | — |
  | status | 设置当前步骤的状态， 不设置则根据 steps 确定状态 | string | wait / process / finish / error / success | — |
  \n
  |  插槽名 | 说明 |
  | :--- | :--- |
  | icon | 自定义图标 |
  | title | 自定义标题 |
  | description | 自定义描述文案 |
  `,
  "el-tabs": `|  属性 | 说明 | 类型 | 可选值 | 默认值 |
  | :--- | :--- | :--- | :--- | :--- |
  | model-value / v-model | 绑定值，选中选项卡的 name | string / number | — | 第一个选项卡的 name |
  | type | 风格类型 | string | card/border-card | — |
  | closable | 标签是否可关闭 | boolean | — | false |
  | addable | 标签是否可增加 | boolean | — | false |
  | editable | 标签是否同时可增加和关闭 | boolean | — | false |
  | tab-position | 选项卡所在位置 | string | top/right/bottom/left | top |
  | stretch | 标签的宽度是否自撑开 | boolean | - | false |
  | before-leave | 切换标签之前的钩子函数， 若返回 false  或者返回被 reject 的 Promise，则阻止切换。 | Function(activeName, oldActiveName) | — | — |
  \n
  |  事件名 | 说明 | 回调参数 |
  | :--- | :--- | :--- |
  | tab-click | tab 被选中时触发 | (pane: TabsPaneContext, ev: Event) |
  | tab-change | activeName 改变时触发 | (name: TabPanelName) |
  | tab-remove | 点击 tab 移除按钮时触发 | (name: TabPanelName) |
  | tab-add | 点击 tab 新增按钮时触发 | — |
  | edit | 点击 tab 的新增或移除按钮后触发 | (paneName: TabPanelName | undefined, action: 'remove' | 'add') |
  \n
  |  插槽名 | 说明 | 子标签 |
  | :--- | :--- | :--- |
  | - | 默认插槽 | Tab-pane |
  `,
  "el-tab-pane": `|  属性 | 说明 | 类型 | 可选值 | 默认值 |
  | :--- | :--- | :--- | :--- | :--- |
  | label | 选项卡标题 | string | — | — |
  | disabled | 是否禁用 | boolean | — | false |
  | name | 与选项卡绑定值 value 对应的标识符，表示选项卡别名 | string / number | — | 该选项卡在选项卡列表中的顺序值，如第一个选项卡则为'1' |
  | closable | 标签是否可关闭 | boolean | — | false |
  | lazy | 标签是否延迟渲染 | boolean | — | false |
  \n
  |  插槽名 | 说明 |
  | :--- | :--- |
  | - | Tab-pane 的内容 |
  | label | Tab-pane 的标题内容 |
  \n
  |  属性 | 说明 | 类型 | 可选值 | 默认值 |
  | :--- | :--- | :--- | :--- | :--- |
  | model-value / v-model | 是否显示 Dialog | boolean | — | — |
  | title | Dialog 对话框 Dialog 的标题， 也可通过具名 slot （见下表）传入 | string | — | — |
  | width | Dialog 的宽度 | string / number | — | 50% |
  | fullscreen | 是否为全屏 Dialog | boolean | — | false |
  | top | Dialog CSS 中的 margin-top 值 | string | — | 15vh |
  | modal | 是否需要遮罩层 | boolean | — | true |
  | append-to-body | Dialog 自身是否插入至 body 元素上。 嵌套的 Dialog 必须指定该属性并赋值为 true | boolean | — | false |
  | lock-scroll | 是否在 Dialog 出现时将 body 滚动锁定 | boolean | — | true |
  | custom-class | Dialog 的自定义类名 | string | — | — |
  | open-delay | Dialog 打开的延时时间，单位毫秒 | number | — | 0 |
  | close-delay | Dialog 关闭的延时时间，单位毫秒 | number | — | 0 |
  | close-on-click-modal | 是否可以通过点击 modal 关闭 Dialog | boolean | — | true |
  | close-on-press-escape | 是否可以通过按下 ESC 关闭 Dialog | boolean | — | true |
  | show-close | 是否显示关闭按钮 | boolean | — | true |
  | before-close | 关闭前的回调，会暂停 Dialog 的关闭 | function(done)，done 用于关闭 Dialog | — | — |
  | draggable | 为 Dialog 启用可拖拽功能 | boolean | — | false |
  | center | 是否让 Dialog 的 header 和 footer 部分居中排列 | boolean | — | false |
  | destroy-on-close | 当关闭 Dialog 时，销毁其中的元素 | boolean | — | false |
  \n
  |  插槽名 | 说明 |
  | :--- | :--- |
  | — | Dialog 的内容 |
  | header | 对话框标题的内容；会替换标题部分，但不会移除关闭按钮。 |
  | title(废弃) | 与 header 作用相同 请使用 header |
  | footer | Dialog 按钮操作区的内容 |
  \n
  |  事件名 | 说明 | 参数 |
  | :--- | :--- | :--- |
  | open | Dialog 打开的回调 | — |
  | opened | Dialog 打开动画结束时的回调 | — |
  | close | Dialog 关闭的回调 | — |
  | closed | Dialog 关闭动画结束时的回调 | — |
  | open-auto-focus | 输入焦点聚焦在 Dialog 内容时的回调 | — |
  | close-auto-focus | 输入焦点从 Dialog 内容失焦时的回调 | — |
  `,
  "el-drawer": `|  属性 | 说明 | 类型 | 可选值 | 默认值 |
  | :--- | :--- | :--- | :--- | :--- |
  | model-value / v-model | 是否显示 Drawer | boolean | — | false |
  | append-to-body | Drawer 自身是否插入至 body 元素上。嵌套的 Drawer 必须指定该属性并赋值为 true | boolean | — | false |
  | lock-scroll | 是否在 Drawer 出现时将 body 滚动锁定 | boolean | — | true |
  | before-close | 关闭前的回调，会暂停 Drawer 的关闭 | function(done)，done 用于关闭 Drawer | — | — |
  | close-on-click-modal | 是否可以通过点击 modal 关闭 Drawer | boolean | — | true |
  | close-on-press-escape | 是否可以通过按下 ESC 关闭 Drawer | boolean | — | true |
  | open-delay | Drawer 打开的延时时间，单位毫秒 | number | — | 0 |
  | close-delay | Drawer 关闭的延时时间，单位毫秒 | number | — | 0 |
  | custom-class | Drawer 的自定义类名 | string | — | — |
  | destroy-on-close | 控制是否在关闭 Drawer 之后将子元素全部销毁 | boolean | - | false |
  | modal | 是否需要遮罩层 | boolean | — | true |
  | direction | Drawer 打开的方向 | Direction | rtl / ltr / ttb / btt | rtl |
  | show-close | 是否显示关闭按钮 | boolean | — | true |
  | size | Drawer 窗体的大小, 当使用 number 类型时, 以像素为单位, 当使用 string 类型时, 请传入 'x%', 否则便会以 number 类型解释 | number / string | - | '30%' |
  | title | Drawer 的标题，也可通过具名 slot （见下表）传入 | string | — | — |
  | with-header | 控制是否显示 header 栏, 默认为 true, 当此项为 false 时, title attribute 和 title slot 均不生效 | boolean | - | true |
  | modal-class | 遮罩层的自定义类名 | string | - | - |
  | z-index | 设置 z-index | number | - | - |
  \n
  |  插槽名 | 说明 |
  | :--- | :--- |
  | — | Drawer 的内容 |
  | header | Drawer 标题的内容；会替换标题部分，但不会移除关闭按钮。 |
  | title(deprecated) | 与 header 作用相同 请使用 header |
  | footer | Drawer 页脚部分 |
  \n
  |  名称 | 说明 |
  | :--- | :--- |
  | handleClose | 用于关闭 Drawer, 该方法会调用传入的 before-close 方法 |
  \n
  |  事件名称 | 说明 | 参数 |
  | :--- | :--- | :--- |
  | open | Drawer 打开的回调 | — |
  | opened | Drawer 打开动画结束时的回调 | — |
  | close | Drawer 关闭的回调 | — |
  | closed | Drawer 关闭动画结束时的回调 | — |
  \n
  |  属性 | 说明 | 类型 | 可选值 | 默认值 |
  | :--- | :--- | :--- | :--- | :--- |
  | target | Loading 需要覆盖的 DOM 节点。 可传入一个 DOM 对象或字符串； 若传入字符串，则会将其作为参数传入 document.querySelector以获取到对应 DOM 节点 | object/string | — | document.body |
  | body | 同 v-loading 指令中的 body 修饰符 | boolean | — | false |
  | fullscreen | 同 v-loading 指令中的 fullscreen 修饰符 | boolean | — | true |
  | lock | 同 v-loading 指令中的 lock 修饰符 | boolean | — | false |
  | text | 显示在加载图标下方的加载文案 | string | — | — |
  | spinner | 自定义加载图标类名 | string | — | — |
  | background | 遮罩背景色 | string | — | — |
  | custom-class | Loading 的自定义类名 | string | — | — |
  \n
  |  名称 | 说明 | 类型 |
  | :--- | :--- | :--- |
  | v-loading | 是否显示动画 | boolean |
  | element-loading-text | 显示在加载图标下方的加载文案 | string |
  | element-loading-spinner | 自定义加载图标 | string |
  | element-loading-svg | 自定义加载图标 (与 element-loading-spinner 相同) | string |
  | element-loading-background | 背景遮罩的颜色 | string |
  `,
  "el-message-box": `|  属性 | 说明 | 类型 | 可选值 | 默认值 |
  | :--- | :--- | :--- | :--- | :--- |
  | title | MessageBox 标题 | string | — | — |
  | message | MessageBox 消息正文内容 | string | — | — |
  | dangerouslyUseHTMLString | 是否将 message 属性作为 HTML 片段处理 | boolean | — | false |
  | type | 消息类型，用于显示图标 | string | success / info / warning / error | — |
  | icon | 消息自定义图标，该属性会覆盖 type 的图标。 | string / Component | — | — |
  | custom-class | MessageBox 的自定义类名 | string | — | — |
  | custom-style | MessageBox 的自定义内联样式 | CSSProperties | — | — |
  | callback | 若不使用 Promise，可以使用此参数指定 MessageBox 关闭后的回调函数。 | function(action, instance)，action 的值为'confirm', 'cancel'或'close', instance 为 MessageBox 实例， 可以通过它访问实例上的属性和方法 | — | — |
  | showClose | MessageBox 是否显示右上角关闭按钮 | boolean | — | true |
  | before-close | messageBox 关闭前的回调，会暂停消息弹出框的关闭过程。 | function(action, instance, done)，action的值为'confirm', 'cancel'或'close'；instance为 MessageBox 实例，可以通过它访问实例上的属性和方法；done用于关闭 MessageBox 实例 | — | — |
  | distinguish-cancel-and-close | 是否将取消（点击取消按钮）与关闭（点击关闭按钮或遮罩层、按下 Esc 键）进行区分 | boolean | — | false |
  | lock-scroll | 是否在 MessageBox 出现时将 body 滚动锁定 | boolean | — | true |
  | show-cancel-button | 是否显示取消按钮 | boolean | — | false（以 confirm 和 prompt 方式调用时为 true） |
  | show-confirm-button | 是否显示确定按钮 | boolean | — | true |
  | cancel-button-text | 取消按钮的文本内容 | string | — | Cancel |
  | confirm-button-text | 确定按钮的文本内容 | string | — | OK |
  | cancel-button-class | 取消按钮的自定义类名 | string | — | — |
  | confirm-button-class | 确定按钮的自定义类名 | string | — | — |
  | close-on-click-modal | 是否可通过点击遮罩关闭 MessageBox | boolean | — | true（以 alert 方式调用时为 false） |
  | close-on-press-escape | 是否可通过按下 ESC 键关闭 MessageBox | boolean | — | true（以 alert 方式调用时为 false） |
  | close-on-hash-change | 是否在 hashchange 时关闭 MessageBox | boolean | — | true |
  | show-input | 是否显示输入框 | boolean | — | false（以 prompt 方式调用时为 true） |
  | input-placeholder | 输入框的占位符 | string | — | — |
  | input-type | 输入框的类型 | string | — | text |
  | input-value | 输入框的初始文本 | string | — | — |
  | input-pattern | 输入框的校验表达式 | regexp | — | — |
  | input-validator | 输入框的校验函数。 应该返回一个 boolean 或者 string， 如果返回的是一个 string 类型，那么该返回值会被赋值给 inputErrorMessage 用于向用户展示错误消息。 | function | — | — |
  | input-error-message | 校验未通过时的提示文本 | string | — | Illegal input |
  | center | 是否居中布局 | boolean | — | false |
  | draggable | messageBox是否可拖放 | boolean | — | false |
  | round-button | 是否使用圆角按钮 | boolean | — | false |
  | button-size | 自定义确认和取消按钮的尺寸 | string | small / default / large | default |
  `,
  "el-notification": `|  属性 | 说明 | 类型 | 可选值 | 默认值 |
  | :--- | :--- | :--- | :--- | :--- |
  | title | 标题 | string | — | — |
  | message | 通知栏正文内容 | string/Vue.VNode | — | — |
  | dangerouslyUseHTMLString | 是否将 message 属性作为 HTML 片段处理 | boolean | — | false |
  | type | 通知的类型 | string | success/warning/info/error | — |
  | icon | 自定义图标。 若设置了 type，则 icon 会被覆盖 | string / Component | — | — |
  | custom-class | 自定义类名 | string | — | — |
  | duration | 显示时间, 单位为毫秒。 值为 0 则不会自动关闭 | number | — | 4500 |
  | position | 自定义弹出位置 | string | top-right/top-left/bottom-right/bottom-left | top-right |
  | show-close | 是否显示关闭按钮 | boolean | — | true |
  | on-close | 关闭时的回调函数 | function | — | — |
  | on-click | 点击 Notification 时的回调函数 | function | — | — |
  | offset | 相对屏幕顶部的偏移量 偏移的距离，在同一时刻，所有的 Notification 实例应当具有一个相同的偏移量 | number | — | 0 |
  | appendTo | 设置通知栏在 DOM 中的\b亲元素 | string / HTMLElement | - | document.body |
  \n
  |  属性 | 说明 | 类型 | 可选值 | 默认值 |
  | :--- | :--- | :--- | :--- | :--- |
  | title | 标题 | String | — | — |
  | confirmButtonText | 确认按钮文字 | String | — | — |
  | cancelButtonText | 取消按钮文字 | String | — | — |
  | confirmButtonType | 确认按钮类型 | String | — | Primary |
  | cancelButtonType | 取消按钮类型 | String | — | Text |
  | icon | 自定义图标 | String / Component | — | QuestionFilled |
  | icon-color | Icon 颜色 | String | — | #f90 |
  | hide-icon | 是否隐藏 Icon | Boolean | — | false |
  | teleported | 是否将 popover 的下拉列表插入至 body 元素 | boolean | true / false | true |
  | persistent | 当 popover 组件长时间不触发且 persistent 属性设置为 false 时, popover 将会被删除 | boolean | — | false |
  \n
  |  插槽名 | 说明 |
  | :--- | :--- |
  | reference | 触发 Popconfirm 显示的 HTML 元素 |
  \n
  |  事件名 | 说明 | 回调参数 |
  | :--- | :--- | :--- |
  | confirm | 点击确认按钮时触发 | — |
  | cancel | 点击取消按钮时触发 | — |
  `,
  "el-popover": `|  属性 | 说明 | 类型 | 可选值 | 默认值 |
  | :--- | :--- | :--- | :--- | :--- |
  | trigger | 触发方式 | string | click/focus/hover/contextmenu | click |
  | title | 标题 | string | — | — |
  | effect | Tooltip 主题，Element Plus 内置了 dark / light 两种主题 | string | string | dark |
  | content | 显示的内容，也可以通过写入默认 slot 修改显示内容 | string | — | — |
  | width | 宽度 | string / number | — | 最小宽度 150px |
  | placement | 出现位置 | string | top/top-start/top-end/bottom/bottom-start/bottom-end/left/left-start/left-end/right/right-start/right-end | bottom |
  | disabled | Popover 是否可用 | boolean | — | false |
  | visible / v-model:visible | Popover 是否显示 | Boolean | — | false |
  | offset | 出现位置的偏移量 | number | — | 0 |
  | transition | 定义渐变动画 | string | — | el-fade-in-linear |
  | show-arrow | 是否显示 Tooltip 箭头， 欲了解更多信息，请参考 ElPopper | boolean | — | true |
  | popper-options | popper.js 的参数 | object | 详情参考 popper.js | { boundariesElement: 'body', gpuAcceleration: false } |
  | popper-class | 为 popper 添加类名 | string | — | — |
  | show-after | 延迟出现，单位毫秒 | number | — | 0 |
  | hide-after | 延迟关闭，单位毫秒 | number | — | 200 |
  | auto-close | Tooltip 出现后自动隐藏延时，单位毫秒，为 0 则不会自动隐藏 | number | — | 0 |
  | tabindex | Popover 组件的 tabindex | number | — | — |
  | teleported | 是否将 popover 的下拉列表插入至 body 元素 | boolean | true / false | true |
  | persistent | 当 popover 组件长时间不触发且 persistent 属性设置为 false 时, popover 将会被删除 | boolean | — | true |
  \n
  |  插槽名 | 说明 |
  | :--- | :--- |
  | — | Popover 内嵌 HTML 文本 |
  | reference | 触发 Popover 显示的 HTML 元素 |
  \n
  |  事件名 | 说明 | 回调参数 |
  | :--- | :--- | :--- |
  | show | 显示时触发 | — |
  | before-enter | 显示动画播放前触发 | — |
  | after-enter | 显示动画播放完毕后触发 | — |
  | hide | 隐藏时触发 | — |
  | before-leave | 隐藏动画播放前触发 | — |
  | after-leave | 隐藏动画播放完毕后触发 | — |
  \n
  |  属性 | 说明 | 类型 | 可选值 | 默认值 |
  | :--- | :--- | :--- | :--- | :--- |
  | append-to | 指示 Tooltip 的内容将附加在哪一个网页元素上 | CSSSelector \\ | HTMLElement | — |
  | effect | Tooltip 主题，内置了 dark / light 两种 | string | string | dark |
  | content | 显示的内容，也可被 slot#content 覆盖 | String | — | — |
  | raw-content | content 中的内容是否作为 HTML 字符串处理 | boolean | — | false |
  | placement | Tooltip 组件出现的位置 | string | top/top-start/top-end/bottom/bottom-start/bottom-end/left/left-start/left-end/right/right-start/right-end | bottom |
  | visible / v-model:visible | Tooltip 组件可见性 | boolean | — | false |
  | disabled | Tooltip 组件是否禁用 | boolean | — | false |
  | offset | 出现位置的偏移量 | number | — | 0 |
  | transition | 动画名称 | string | — | el-fade-in-linear |
  | visible-arrow (will deprecate in 2.1.0 ) | 是否显示箭头。 想了解更多信息，请查看 ElPopper 页面 | boolean | — | true |
  | popper-options | popper.js 参数 | Object | refer to popper.js doc | { boundariesElement: 'body', gpuAcceleration: false } |
  | show-after | 延迟出现，单位毫秒 | number | — | 0 |
  | show-arrow | tooltip 的内容是否有箭头 | boolean | true / false | true |
  | hide-after | 延迟关闭，单位毫秒 | number | — | 200 |
  | auto-close | tooltip 出现后自动隐藏延时，单位毫秒 | number | — | 0 |
  | manual | 是否手动控制 Tooltip。 如果设置为 true，mouseenter 和 mouseleave 将不会生效 | boolean | — | false |
  | popper-class | 为 Tooltip 的 popper 添加自定义类名 | string | — | — |
  | enterable | 鼠标是否可进入到 tooltip 中 | Boolean | — | true |
  | tabindex | Tooltip 的 tabindex | number | — | 0 |
  | teleported | 是否使用 teleport。设置成 true则会被追加到 append-to 的位置 | boolean | true / false | true |
  | trigger | 如何触发 tooltip (来显示) | string | hover / click / focus / contextmenu | hover |
  | virtual-triggering | 用来标识虚拟触发是否被启用 | boolean | — | false |
  | virtual-ref | 表明 tooltip 绑定到哪个 html 元素 | HTMLElement | — | — |
  \n
  |  插槽名 | 说明 |
  | :--- | :--- |
  | — | Tooltip 触发 &amp; 引用的元素 |
  | content | 自定义内容 |
  `,
  "el-divider": `|  属性 | 说明 | 类型 | 可选值 | 默认值 |
  | :--- | :--- | :--- | :--- | :--- |
  | direction | 设置分割线方向 | string | horizontal / vertical | horizontal |
  | border-style | 设置分隔符样式 | string | CSS/border-style | solid |
  | content-position | 自定义分隔线内容的位置 | string | left / right / center | center |
  \n
  |  事件名 | Description |
  | :--- | :--- |
  | — | 设置分割线文案的位置 | \n`
}