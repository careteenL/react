## FAQ

### 如何引入src文件夹外的文件？

```shell
which falls outside of the project src/ directory. Relative imports outside of src/ are not supported.
```
如上由于使用`create-react-app`后不能引入src文件夹外的文件。

解决方案为：
借助`react-app-rewired`重写webpack配置。
```shell
npm i --save-dev react-app-rewired customize-cra
```
修改`package.json`
```diff
"scripts": {
-  "start": "react-scripts start"
+  "start": "react-app-rewired start",
},
```
根目录下新建`config-overrides.js`
```js
const { removeModuleScopePlugin } = require('customize-cra')

module.exports = removeModuleScopePlugin()
```
