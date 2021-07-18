module.exports = {
  port: 2222,
  title: '黄秤砣的博客',
  description: '基于vuePress搭建的个人博客',
  head: [['link', { rel: 'icon', href: '/logo.png' }]],
  themeConfig: {
    nav: [
      { text: '首页', link: 'http://www.huangchengtuo.com' },
      { text: '文章', link: '/article/' },
      { text: '笔记', link: '/note/' },
      { text: '个人简历', link: '/resume.md' },
      { text: 'Gitee', link: 'https://gitee.com/HuangChengtuo' }
    ],
    logo: 'https://s1.huangchengtuo.com/img/pureDD.png',
    displayAllHeaders: true,
    sidebar: {
      '/note/': ['', 'browser', 'css', 'js', 'react', 'ts'],
      '/resume/': ['/resume'],
      '/article/anime': ['/article/anime'],
      '/article/stateManagement': ['/article/stateManagement']
    },
    sidebarDepth: 2,
    smoothScroll: true
  }
}
