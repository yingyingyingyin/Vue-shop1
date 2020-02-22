# vue_shop

> 电商后台管理系统
>应用技术栈：vue.js+element-ui+node.js+axios+webpack
#### 记录以下几点在开发时遇到的小问题
* 设置背景图片时要加URL
```
  background-image: url('../assets/img/backgroundImg.jpg');
```
* 给导航菜单submenu设置uniqueOpened时要把index设置成唯一标识，index前要加冒号：
```
      <el-submenu v-for="item in menuList" :key="item.id" :index="item.id+''" uniqueOpened>
```
