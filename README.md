# XXX

### 项目目录结构

```
.
├── build                                     webpack配置文件（使用vue-cli自动生成）
├── config                                    项目配置文件
├── src                                       项目源码
    ├── api                                           数据请求
    ├── assets                                        图片资源
    ├── components                                    公共组件
    ├── iconfont                                      字体图标
    ├── pages                                         页面
    ├── router                                        路由配置
    └── styles                                        全局样式
    └── utils                                         工具函数
    └── main.js                                       项目入口
├── static                                    静态资源目录
├── .babelrc                                  babel配置文件
├── .editconfig                               编辑器设置
├── .gitignore                                git忽略文件配置
├── index.html                                webapck模板文件
```

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
