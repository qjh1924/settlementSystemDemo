# settlementSystemDemo

# 联通代理售卡结算系统Demo

项目目前已在[Github](https://github.com/qjh1924/settlementSystemDemo)开源，欢迎标星下载和收藏。使用方法，在文件目录下

安装依赖：

```
npm install
```

启动项目：

```
npm run serve
```

打包发布：

```
npm run build
```

## 项目背景

每到开学季，大部分新生都会有办理一张学校所属地电话卡的需求，运营商为了吸引新生办卡，会举行很多促销活动，其中以老带新，即招聘部分在校生作为临时代理，向新生推销电话卡，是一种普遍有效的手段。学生代理每售出一张卡都会有相应的现金奖励，为了更好地记录代理售卡的情况，特制作了本系统，用于记录订单情况和相应奖励结算。

## 业务逻辑

系统的使用者分为三类：超级管理员、一级代理和二级代理

其中，超级管理员拥有最高权限，可以直接在系统中增删改查一级、二级代理信息并查看所有订单信息

一级代理的职责是发展二级代理，通常为某一个学校或地区的总负责人，一级代理可以在系统增删改查二级代理信息，查看相关的订单信息

二级代理的职责就是推销电话卡，其只能在系统中增删改查订单信息，没有其他的权限。

## 具体实现

本项目目前完成了用户管理、订单记录功能，在线演示地址：[Demo](http://qiujianhui.top/vue)