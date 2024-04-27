
var Minio = require('minio')

let minioClient: any = null

interface UploadOption {
  uploadFilePath: string
  filePath:string
  success?: Function
  fail?: Function
}

function generateClient() {
  minioClient = new Minio.Client({
    "endPoint": "47.92.64.132",
    "port": 9001,
    "useSSL": false,
    "accessKey":"EkwKULwrzhXCqg2O4oMJ",
    "secretKey":"ENeqb03Nwq0TNh7tmJvEKtTNZZnHPnESktTsHIDA"
  })
}

export function minioUpload(option: UploadOption) {
  if (!minioClient) {
    generateClient()
  }
  uploadFile(option)
}

function uploadFile(option:UploadOption) {
  minioClient.fPutObject('common', option.uploadFilePath, option.filePath, {
    'Content-Type': 'application/octet-stream'
  }, function (err: any) {
    if (err) return option.fail && option.fail()
    option.success && option.success()
  })
}

export function minioGet(option: UploadOption) {
  if (!minioClient) {
    generateClient()
  }
  minioClient.fGetObject('common', option.uploadFilePath, option.filePath, function (err: any) {
    if (err) return option.fail && option.fail()
    option.success && option.success()
  })
}