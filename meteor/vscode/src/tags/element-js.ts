export default {
    "el-upload:method": {
        "_self": {
            "description": "通过点击或者拖拽上传文件",
            "text": ["handleRemove(file, fileList) {\n\t},\n\thandlePreview(file) {\n\t},\n\thandleExceed(files, fileList) {\n\t},\n\tbeforeRemove(file, fileList) {\n\t\treturn this.$confirm('确定移除' + file.name);\n}"]
        }
    },
    "el-message-box": {
        "_self": {
            "description": "",
            "text": ["ElMessageBox.confirm('确定删除标准表？', '提示', {\n\tconfirmButtonText: '确定',\n\tcancelButtonText: '取消',\n\ttype: 'warning',\n}).then(() => {\n\t\n})\n.catch(() => {\n})"]
        }
    }
}