// jeecg-boot代码生成器
import * as fs from 'fs'
import * as path from 'path'
import { winRootPathHandle } from './util'

interface GenerateParams {
  api: {
    list: string
    add: string
    edit: string
    delete: string
    batchDelete: string
    import: string
    export: string
  }
  apiPrefix: string
  page: string
  path: string
  description: string,
  fields: {
    name: string
    key: string
    show: boolean
    componentType: string
    query: boolean
    length: string
  }[]
}

export function generate(params:any) {
  generateList(params)
  generateData(params)
  generateApi(params)
  generateForm(params)
  generateModal(params)
}

function generateList(params:GenerateParams) {
let list = `<template>
<div>
  <!--引用表格-->
 <BasicTable @register="registerTable" :rowSelection="rowSelection">
   <!--插槽:table标题-->
    <template #tableTitle>
        <a-button type="primary" @click="handleAdd" preIcon="ant-design:plus-outlined"> 新增</a-button>
`
if (params.api.export) {
  list += `\n        <a-button  type="primary" preIcon="ant-design:export-outlined" @click="onExportXls"> 导出</a-button>`
}
if (params.api.import) {
  list += `\n        <j-upload-button  type="primary" preIcon="ant-design:import-outlined" @click="onImportXls">导入</j-upload-button>`
}
if (params.api.delete) {
  if (params.api.batchDelete) {
    list += `\n      <a-dropdown v-if="selectedRowKeys.length > 0">
          <template #overlay>
            <a-menu>
              <a-menu-item key="1" @click="batchHandleDelete">
                <Icon icon="ant-design:delete-outlined"></Icon>
                删除
              </a-menu-item>
            </a-menu>
          </template>
          <a-button>批量操作
            <Icon icon="mdi:chevron-down"></Icon>
          </a-button>
      </a-dropdown>`
  } else {
    list += `\n      <a-dropdown v-if="selectedRowKeys.length > 0">
          <template #overlay>
            <a-menu>
              <a-menu-item key="1" @click="batchHandleDelete">
                <Icon icon="ant-design:delete-outlined"></Icon>
                删除
              </a-menu-item>
            </a-menu>
          </template>
      </a-dropdown>`
  }
}
list +=`\n      <!-- 高级查询 -->
      <super-query :config="superQueryConfig" @search="handleSuperQuery" />
    </template>
     <!--操作栏-->
    <template #action="{ record }">
      <TableAction :actions="getTableAction(record)" :dropDownActions="getDropDownAction(record)"/>
    </template>
    <!--字段回显插槽-->
    <template v-slot:bodyCell="{ column, record, index, text }">
    </template>
  </BasicTable>
  <!-- 表单区域 -->
  <${params.page}Modal @register="registerModal" @success="handleSuccess"></${params.page}Modal>
</div>
</template>

<script lang="ts" setup>
import {ref, reactive, computed, unref} from 'vue';
import {BasicTable, useTable, TableAction} from '/@/components/Table';
import {useModal} from '/@/components/Modal';
import { useListPage } from '/@/hooks/system/useListPage'
import ${params.page}Modal from './components/${params.page}Modal.vue'
import {columns, searchFormSchema, superQuerySchema} from './${params.page}.data';
import {list, deleteOne, batchDelete, getImportUrl, getExportUrl} from './${params.page}.api';
import { downloadFile } from '/@/utils/common/renderUtils';
import { useUserStore } from '/@/store/modules/user';
const queryParam = reactive<any>({});
const checkedKeys = ref<Array<string | number>>([]);
const userStore = useUserStore();
//注册model
const [registerModal, {openModal}] = useModal();
//注册table数据
const { prefixCls,tableContext,onExportXls,onImportXls } = useListPage({
    tableProps:{
         title: '${params.description}',
         api: list,
         columns,
         canResize:false,
         formConfig: {
            //labelWidth: 120,
            schemas: searchFormSchema,
            autoSubmitOnEnter:true,
            showAdvancedButton:true,
            fieldMapToNumber: [
            ],
            fieldMapToTime: [
            ],
          },
         actionColumn: {
             width: 120,
             fixed:'right'
          },
          beforeFetch: (params) => {
            return Object.assign(params, queryParam);
          },
     },`
if (params.api.export) {
  list += `\n     exportConfig: {
    name:"${params.description}",
    url: getExportUrl,
    params: queryParam,
  },`
}     
if (params.api.import) {
  list += `\n        importConfig: {
    url: getImportUrl,
    success: handleSuccess
  },`
}
list += `\n})

const [registerTable, {reload},{ rowSelection, selectedRowKeys }] = tableContext

// 高级查询配置
const superQueryConfig = reactive(superQuerySchema);

/**
 * 高级查询事件
 */
function handleSuperQuery(params) {
  Object.keys(params).map((k) => {
    queryParam[k] = params[k];
  });
  reload();
}
`
if (params.api.add) {
  list +=`\n /**
  * 新增事件
  */
function handleAdd() {
   openModal(true, {
     isUpdate: false,
     showFooter: true,
   });
}`
}
if (params.api.edit) {
  list +=`\n /**
  * 编辑事件
  */
function handleEdit(record: Recordable) {
   openModal(true, {
     record,
     isUpdate: true,
     showFooter: true,
   });
 }`
}
list += `\n /**
* 详情
*/
function handleDetail(record: Recordable) {
 openModal(true, {
   record,
   isUpdate: true,
   showFooter: false,
 });
}`
if (params.api.delete) {
  list += `\n /**
  * 删除事件
  */
async function handleDelete(record) {
   await deleteOne({id: record.id}, handleSuccess);
 }`
}
if (params.api.batchDelete) {
  list += `\n /**
  * 批量删除事件
  */
async function batchHandleDelete() {
   await batchDelete({ids: selectedRowKeys.value}, handleSuccess);
 }`
}
list +=`\n /**
* 成功回调
*/
function handleSuccess() {
  (selectedRowKeys.value = []) && reload();
}
/**
  * 操作栏
  */
function getTableAction(record){`
if (params.api.edit) {
  list += `\n     return [
    {
      label: '编辑',
      onClick: handleEdit.bind(null, record),
    }
  ]`
}
list += `\n }
/**
   * 下拉操作栏
   */
function getDropDownAction(record){
  return [
    {
      label: '详情',
      onClick: handleDetail.bind(null, record),`
if (params.api.delete) {
  list += `\n       }, {
    label: '删除',
    popConfirm: {
      title: '是否确认删除',
      confirm: handleDelete.bind(null, record),
      placement: 'topLeft',
    }
  }`
} else {
  list += `\n       },`
}
list += `\n     ]
}


</script>

<style scoped>

</style>`
fs.writeFileSync(winRootPathHandle(path.join(params.path, params.page + 'List.vue')), list, 'utf-8')
}

function generateData(params: GenerateParams) {
  let code = `import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';`

code += `\n//列表数据
export const columns: BasicColumn[] = [`
params.fields.forEach(field => {
  if (field.show) {
    code += `\n   {
      title: '${field.name}',
      align:"center",
      dataIndex: '${field.key}'
     },`
  }
});
code +=`\n];
//查询数据
export const searchFormSchema: FormSchema[] = [`

params.fields.forEach(field => {
  if (field.query) {
    code += `\n	{
      label: "${field.name}",
      field: '${field.key}',
      component: '${field.componentType}',
      //colProps: {span: 6},
   },`
  }
});
code += `\n];
//表单数据
export const formSchema: FormSchema[] = [`
params.fields.forEach(field => {
  if (field.show) {
    code += `\n	{
      label: "${field.name}",
      field: '${field.key}',
      component: '${field.componentType}',`
    if (field.componentType === 'JDictSelectTag') {
      code += `\n    componentProps:{
        dictCode:""
     },`
    }
    code += `\n   },`
  }
});

code += `\n];

// 高级查询数据
export const superQuerySchema = {`

let advanceNum = 1
params.fields.forEach(field => {
  if (field.query) {
    switch (field.componentType) {
      case 'Input':
        code += `\n  ${field.key}: {title: '${field.name}',order: ${advanceNum}, view: 'text', type: 'string',},`
        break;
      case 'InputNumber':
        code += `\n  ${field.key}: {title: '${field.name}',order: ${advanceNum}, view: 'number', type: 'number',},`
        break;
      case 'JDictSelectTag':
        code += `\n  ${field.key}: {title: '${field.name}',order: ${advanceNum}, view: 'list', type: 'string', dictCode: '',},`
        break;
      case 'DatePicker':
        code += `\n  ${field.key}: {title: '${field.name}',order: ${advanceNum}, view: 'date', type: 'string',},`
        break;
      case 'TimePicker':
        code += `\n  ${field.key}: {title: '${field.name}',order: ${advanceNum}, view: 'date', type: 'string',},`
        break;
        
      default:
        break;
    }
    advanceNum++
  }
});

code += `\n};

/**
* 流程表单调用这个方法获取formSchema
* @param param
*/
export function getBpmFormSchema(_formData): FormSchema[]{
  // 默认和原始表单保持一致 如果流程中配置了权限数据，这里需要单独处理formSchema
  return formSchema;
}`

  fs.writeFileSync(winRootPathHandle(path.join(params.path, params.page + '.data.ts')), code, 'utf-8')
}

function generateApi(params:GenerateParams) {
  let code = ''

  code +=  `import {defHttp} from '/@/utils/http/axios';
import { useMessage } from "/@/hooks/web/useMessage";

const { createConfirm } = useMessage();

enum Api {`

if (params.api.list) {
  code +=  `\n  list = '${params.api.list}',`
}
if (params.api.add) {
  code +=  `\n  save = '${params.api.add}',`
}
if (params.api.edit) {
  code +=  `\n  edit = '${params.api.edit}',`
}
if (params.api.delete) {
  code +=  `\n  deleteOne = '${params.api.delete}',`
}
if (params.api.batchDelete) {
  code +=  `\n  deleteBatch = '${params.api.batchDelete}',`
}
if (params.api.import) {
  code +=  `\n  importExcel = '${params.api.import}',`
}
if (params.api.export) {
  code +=  `\n  exportXls = '${params.api.export}',`
}
code += `\n}`

if (params.api.list) {
  code +=  `\n/**
  * 列表接口
  * @param params
  */
 export const list = (params) =>
   defHttp.get({url: Api.list, params});
 `
}
if (params.api.delete) {
  code +=  `\n/**
  * 删除单个
  */
 export const deleteOne = (params,handleSuccess) => {
   return defHttp.delete({url: Api.deleteOne, params}, {joinParamsToUrl: true}).then(() => {
     handleSuccess();
   });
 }`
}
if (params.api.batchDelete) {
  code +=  `\n/**
  * 批量删除
  * @param params
  */
 export const batchDelete = (params, handleSuccess) => {
   createConfirm({
     iconType: 'warning',
     title: '确认删除',
     content: '是否删除选中数据',
     okText: '确认',
     cancelText: '取消',
     onOk: () => {
       return defHttp.delete({url: Api.deleteBatch, data: params}, {joinParamsToUrl: true}).then(() => {
         handleSuccess();
       });
     }
   });
 }`
}
if (params.api.import) {
  code +=  `\n/**
  * 导入api
  */
 export const getImportUrl = Api.importExcel;`
}
if (params.api.export) {
  code +=  `\n/**
  * 导出api
  * @param params
  */
 export const getExportUrl = Api.exportXls;`
}
if (params.api.add) {
  code +=  `\n/**
  * 保存或者更新
  * @param params
  */
 export const saveOrUpdate = (params, isUpdate) => {
   let url = isUpdate ? Api.edit : Api.save;
   return defHttp.post({url: url, params});
 }`
}

  fs.writeFileSync(winRootPathHandle(path.join(params.path, params.page + '.api.ts')), code, 'utf-8')
}

function generateForm(params:GenerateParams) {
  let code = `<template>
  <div style="min-height: 400px">
      <BasicForm @register="registerForm"></BasicForm>
      <div style="width: 100%;text-align: center" v-if="!formDisabled">
          <a-button @click="submitForm" pre-icon="ant-design:check" type="primary">提 交</a-button>
      </div>
  </div>
</template>

<script lang="ts">
  import {BasicForm, useForm} from '/@/components/Form/index';
  import {computed, defineComponent} from 'vue';
  import {defHttp} from '/@/utils/http/axios';
  import { propTypes } from '/@/utils/propTypes';
  import {getBpmFormSchema} from '../${params.page}.data';
  import {saveOrUpdate} from '../${params.page}.api';
  
  export default defineComponent({
      name: "${params.page}Form",
      components:{
          BasicForm
      },
      props:{
          formData: propTypes.object.def({}),
          formBpm: propTypes.bool.def(true),
      },
      setup(props){
          const [registerForm, { setFieldsValue, setProps, getFieldsValue }] = useForm({
              labelWidth: 150,
              schemas: getBpmFormSchema(props.formData),
              showActionButtonGroup: false,
              baseColProps: {span: 24}
          });

          const formDisabled = computed(()=>{
              if(props.formData.disabled === false){
                  return false;
              }
              return true;
          });

          let formData = {};
          const queryByIdUrl = '${params.apiPrefix || ''}/queryById';
          async function initFormData(){
              let params = {id: props.formData.dataId};
              const data = await defHttp.get({url: queryByIdUrl, params});
              formData = {...data}
              //设置表单的值
              await setFieldsValue(formData);
              //默认是禁用
              await setProps({disabled: formDisabled.value})
          }

          async function submitForm() {
              let data = getFieldsValue();
              let params = Object.assign({}, formData, data);
              console.log('表单数据', params)
              await saveOrUpdate(params, true)
          }

          initFormData();
          
          return {
              registerForm,
              formDisabled,
              submitForm,
          }
      }
  });
</script>`
  let componentsPath = winRootPathHandle(path.join(params.path, 'components'))
  let componentsExists = fs.existsSync(componentsPath)

  if (!componentsExists) {
    fs.mkdirSync(componentsPath)
  }

  fs.writeFileSync(winRootPathHandle(path.join(params.path, 'components', params.page + 'Form.vue')), code, 'utf-8')
}

function generateModal(params:GenerateParams) {
  let code = `<template>
  <BasicModal v-bind="$attrs" @register="registerModal" destroyOnClose :title="title" :width="800" @ok="handleSubmit">
      <BasicForm @register="registerForm"/>
  </BasicModal>
</template>

<script lang="ts" setup>
    import {ref, computed, unref} from 'vue';
    import {BasicModal, useModalInner} from '/@/components/Modal';
    import {BasicForm, useForm} from '/@/components/Form/index';
    import {formSchema} from '../${params.page}.data';
    import {saveOrUpdate} from '../${params.page}.api';
    // Emits声明
    const emit = defineEmits(['register','success']);
    const isUpdate = ref(true);
    //表单配置
    const [registerForm, {setProps,resetFields, setFieldsValue, validate}] = useForm({
        //labelWidth: 150,
        schemas: formSchema,
        showActionButtonGroup: false,
        baseColProps: {span: 24}
    });
    //表单赋值
    const [registerModal, {setModalProps, closeModal}] = useModalInner(async (data) => {
        //重置表单
        await resetFields();
        setModalProps({confirmLoading: false,showCancelBtn:!!data?.showFooter,showOkBtn:!!data?.showFooter});
        isUpdate.value = !!data?.isUpdate;
        if (unref(isUpdate)) {
            //表单赋值
            await setFieldsValue({
                ...data.record,
            });
        }
        // 隐藏底部时禁用整个表单
       setProps({ disabled: !data?.showFooter })
    });
    //设置标题
    const title = computed(() => (!unref(isUpdate) ? '新增' : '编辑'));
    //表单提交事件
    async function handleSubmit(v) {
        try {
            let values = await validate();
            setModalProps({confirmLoading: true});
            //提交表单
            await saveOrUpdate(values, isUpdate.value);
            //关闭弹窗
            closeModal();
            //刷新列表
            emit('success');
        } finally {
            setModalProps({confirmLoading: false});
        }
    }
</script>

<style lang="less" scoped>
	/** 时间和数字输入框样式 */
  :deep(.ant-input-number){
		width: 100%
	}

	:deep(.ant-calendar-picker){
		width: 100%
	}
</style>`

  fs.writeFileSync(winRootPathHandle(path.join(params.path, 'components', params.page + 'Modal.vue')), code, 'utf-8')
}