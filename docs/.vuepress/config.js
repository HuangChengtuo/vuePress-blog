module.exports = {
  base: '/vuePress-blog/',
  title: '黄诚拓',
  description: '基于vuePress搭建的个人网站',
  themeConfig: {
    nav: [
      {text: '首页', link: '/'},
      {text: '个人简历', link: 'CV'},
      {text: 'GitHub', link: 'https://github.com/HuangChengtuo'}
    ],
    sidebar: [
      'CV'
    ],
    sidebarDepth: 2
  }
}
