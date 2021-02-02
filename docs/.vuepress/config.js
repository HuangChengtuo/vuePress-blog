module.exports = {
  title: '黄秤砣',
  description: '基于vuePress搭建的个人网站',
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '笔记', link: '/note/basic.md' },
      { text: '个人简历', link: '/CV.md' },
      { text: 'GitHub', link: 'https://github.com/HuangChengtuo' }
    ],
    logo: 'https://s1.huangchengtuo.com/img/pureDD.png',
    displayAllHeaders: true,
    sidebar: {
      '/note/': ['basic', 'browser', 'js', 'css'],
      '/': ['/CV']
    },
    sidebarDepth: 2,
    smoothScroll: true
  }
}
