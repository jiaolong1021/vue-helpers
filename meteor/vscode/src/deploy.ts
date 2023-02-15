import { ExtensionContext, commands, window } from "vscode";
import { ExplorerProvider } from "./explorer";
import * as fs from 'fs'
import * as path from 'path'
import { PkgProvider } from "./pkg";
import { v4 as uuid } from 'uuid'

interface DeployConfig {
  cloudUrl: string,
  cloudUsername: string,
  cloudPassword: string,
  cloudeEnv: string,
  cloudeGroup: string,
  cloudeAccess: string,
}

export class DeployProvider {
  public context: ExtensionContext
  public explorer: ExplorerProvider
  public token: string = ''
  public config: DeployConfig = {
    cloudUrl: '',
    cloudUsername: '',
    cloudPassword: '',
    cloudeEnv: '',
    cloudeGroup: '',
    cloudeAccess: '',
  };
  public serviceGroupList: any[] = []
  public envList: any[] = []
  public pkg: PkgProvider

  constructor(context: ExtensionContext, explorer: ExplorerProvider, pkg: PkgProvider) {
    this.context = context
    this.explorer = explorer
    this.pkg = pkg
  }

  public register() {
    this.context.subscriptions.push(commands.registerCommand('meteor.deploySetting', () => {
      this.explorer.openConfigInKey('cloudUrl')
      this.getConfig()
      this.syncInfo()
    }))
    this.context.subscriptions.push(commands.registerCommand('meteor.deploySync', () => {
      this.getConfig()
      this.syncInfo()
    }))
    this.context.subscriptions.push(commands.registerCommand('meteor.deployRun', () => {
      this.getConfig()
      this.deploy()
    }))
    this.context.subscriptions.push(commands.registerCommand('meteor.deployVisit', () => {
      this.getConfig()
      if (this.config.cloudeEnv) {
        let envs = this.config.cloudeEnv.split(',')
        if (envs.length === 2) {
          this.explorer.open(`${this.config.cloudUrl}/home/environment/${envs[1]}/info`)
        } else {
          this.explorer.open(this.config.cloudUrl)
        }
      }
    }))
    this.context.subscriptions.push(commands.registerCommand('meteor.deployWebVisit', () => {
      this.getConfig()
      this.visitWeb()
    }))
  }

  public async visitWeb() {
    await this.login()
    if (!this.config.cloudUrl) {
      return window.showInformationMessage('请输入容器云地址')
    }
    if (!this.config.cloudUsername) {
      return window.showInformationMessage('请输入容器云账号')
    }
    if (!this.config.cloudPassword) {
      return window.showInformationMessage('请输入容器云密码')
    }
    if (!this.config.cloudeEnv) {
      return window.showInformationMessage('请输入容器云环境')
    }
    if (!this.config.cloudeGroup) {
      return window.showInformationMessage('请输入容器云服务组')
    }
    if (!this.config.cloudeAccess) {
      return window.showInformationMessage('请输入容器云访问权')
    }
    let envId = ''
    let project = this.explorer.project
    let envs = this.config.cloudeEnv.split(',')
    if (envs.length === 2) {
      envId = envs[1]
    } else {
      envId = envs[0]
    }
    const serviceRes = await this.explorer.fetch({
      url: `${this.config.cloudUrl}/api/service/info`,
      method: 'get',
      params: {
        environmentId: envId,
        serviceId: project
      },
      headers: {
        token: this.token
      }
    })
    if (serviceRes.data.data && serviceRes.data.data.ingress) {
      let ingressList: string[] = Object.values(serviceRes.data.data.ingress)
      if (ingressList.length > 0) {
        this.explorer.open('http://' + ingressList[0])
      } else {
        window.showInformationMessage('未找到访问地址')
      }
    }
  }

  public async deploy() {
    // 获取镜像
    const pkgDocker = await this.pkg.run('version', false)
    if (!pkgDocker) {
      return window.showInformationMessage('未获取到镜像，请先打包')
    } else {
      window.showInformationMessage('本次部署镜像为: ' + pkgDocker)
    }
    
    await this.login()
    if (!this.config.cloudUrl) {
      return window.showInformationMessage('请输入容器云地址')
    }
    if (!this.config.cloudUsername) {
      return window.showInformationMessage('请输入容器云账号')
    }
    if (!this.config.cloudPassword) {
      return window.showInformationMessage('请输入容器云密码')
    }
    if (!this.config.cloudeEnv) {
      return window.showInformationMessage('请输入容器云环境')
    }
    if (!this.config.cloudeGroup) {
      return window.showInformationMessage('请输入容器云服务组')
    }
    if (!this.config.cloudeAccess) {
      return window.showInformationMessage('请输入容器云访问权')
    }
    let envId = ''
    let groupId = ''
    let project = this.explorer.project
    let envs = this.config.cloudeEnv.split(',')
    if (envs.length === 2) {
      envId = envs[1]
    } else {
      envId = envs[0]
    }
    let groups = this.config.cloudeGroup.split(',')
    if (groups.length === 2) {
      groupId = groups[1]
    } else {
      // 新增服务组
      const groupRes = await this.explorer.fetch({
        url: `${this.config.cloudUrl}/serviceGroup/add`,
        method: 'post',
        data: {
          bg: false,
          environmentId: envId,
          name: groups[0]
        },
        headers: {
          token: this.token
        }
      })
      groupId = groupRes.data.data.id
    }
    // 查询配置集是否存在
    const configRes = await this.explorer.fetch({
      url: `${this.config.cloudUrl}/api/environments/${envId}/configmaps`,
      headers: {
        token: this.token
      }
    })
    let isExistConfig = false
    configRes.data.data.forEach((config: any) => {
      if (config.id === project) {
        isExistConfig = true
      }
    });
    if (!isExistConfig) {
      // 上传配置信息
      let configPath = path.join(this.explorer.projectRootPath, this.explorer.config.rootPath.config, this.explorer.activeEnv)
      const dirList = fs.readdirSync(configPath)
      let configData = {
        id: project,
        description: '',
        environmentId: envId,
        data: {} as any
      }
      dirList.forEach((dir: string) => {
        configData.data[dir] = fs.readFileSync(path.join(configPath, dir), 'utf-8')
      });
      await this.explorer.fetch({
        url: `${this.config.cloudUrl}/api/environments/${envId}/configmaps`,
        method: 'post',
        data: configData,
        headers: {
          token: this.token
        }
      })
    }

    // 获取环境基本信息
    const envRes = await this.explorer.fetch({
      url: `${this.config.cloudUrl}/api/environments/${envId}/basicInfo`,
      headers: {
        token: this.token
      }
    })

    const serviceRes = await this.explorer.fetch({
      url: `${this.config.cloudUrl}/api/service/info`,
      method: 'get',
      params: {
        environmentId: envId,
        serviceId: project
      },
      headers: {
        token: this.token
      }
    })
    if (serviceRes.data.data) {
      if (pkgDocker === serviceRes.data.data.image) {
        this.explorer.fetch({
          url: `${this.config.cloudUrl}/api/environments/${envId}/groups/${groupId}/services/${project}/reboot?deploymentName=${project}`,
          method: 'DELETE',
          headers: {
            token: this.token
          }
        })
        window.showInformationMessage('服务镜像已为最新，本次重启了服务。[立即访问](command:meteor.deployVisit)')
      } else {
        serviceRes.data.data.image = pkgDocker
        this.explorer.fetch({
          url: `${this.config.cloudUrl}/api/environments/${envId}/groups/${groupId}/services/${project}/upgrade?upgradeType=roll&autoUpgrade=false`,
          method: 'put',
          data: serviceRes.data.data,
          headers: {
            token: this.token
          }
        })
        window.showInformationMessage('服务升级成功！[立即访问](command:meteor.deployVisit)')
      }
    } else {
      // 服务不存在, 添加访问权
      const accessListRes = await this.explorer.fetch({
        url: `${this.config.cloudUrl}/api/environments/${envId}/ingresses`,
        method: 'get',
        headers: {
          token: this.token
        }
      })
      let hasAccess = false
      accessListRes.data.data.forEach((access: any) => {
        if (access.id === this.config.cloudeAccess) {
          hasAccess = true
        }
      });
      if (!hasAccess) {
        await this.explorer.fetch({
          url: `${this.config.cloudUrl}/api/environments/${envId}/ingresses`,
          method: 'post',
          data: {
            id: this.config.cloudeAccess,
            level3domen: this.config.cloudeAccess,
            maxBodySize: "8",
            environmentName: envId,
            paths: [
              {
                id: uuid(),
                path: "/",
                serviceId: project,
                servicePort: "80",
                error: false
              }
            ],
            host: `${this.config.cloudeAccess}.${envRes.data.data.secondaryDomain}.${this.explorer.config.rootPath.domain}`,
            secondaryDomain: `${envRes.data.data.secondaryDomain}.${this.explorer.config.rootPath.domain}`
          },
          headers: {
            token: this.token
          }
        })
      }

      let ingress: any = {}
      ingress[this.config.cloudeAccess] = `${this.config.cloudeAccess}.${envRes.data.data.secondaryDomain}.${this.explorer.config.rootPath.domain}`

      // 新建服务
      this.explorer.fetch({
        url: `${this.config.cloudUrl}/api/service/add`,
        method: 'post',
        headers: {
          token: this.token
        },
        data: {
          groupName: groupId,
          id: project,
          type: "deployment",
          replicas: 1,
          description: "",
          cpu: 0.999,
          requestCpu: 0.1,
          memory: 2,
          requestMemory: 0.5,
          command: "",
          image: pkgDocker,
          args: "",
          ports: [{ "port": "80", "protocol": "TCP" }],
          env: [],
          ingress: ingress,
          pvcFlag: false,
          pvcVos: [],
          pvcStorageSize: 1,
          mountPath: "",
          pvcName: "",
          accessModes: "ReadWriteMany",
          configMapParamVos: [{ "containerMountPath": "/home/work/dist/static/conf/", "configMapName": project }],
          secretVos: [],
          concurrencyPolicy: "Forbid",
          healthCheckFlag: false,
          hpaFlag: false,
          hostFlag: false,
          hostAliases: [],
          environmentId: envId,
          groupId: groupId
        }
      })
      window.showInformationMessage('新建服务：' + project + '成功. [立即访问](command:meteor.deployVisit)')
    }

  }

  public async syncInfo() {
    await this.login()
    await this.getEnvList()
  }

  public async getEnvList() {
    const res = await this.explorer.fetch({
      url: `${this.config.cloudUrl}/api/environment`,
      headers: {
        token: this.token
      }
    })
    this.envList = res.data.data
    this.explorer.setCloudEnvSuggestions(this.envList, this.config.cloudUrl, this.token)
  }

  public async login() {
    const res = await this.explorer.fetch({
      url: `${this.config.cloudUrl}/api/login`,
      method: 'post',
      data: {
        username: this.config.cloudUsername,
        password: this.explorer.decrypt(this.config.cloudPassword)
      }
    })
    this.token = res.data.data.token
  }

  public getConfig() {
    this.config = this.explorer.config[this.explorer.activeEnv].deploy
  }
}