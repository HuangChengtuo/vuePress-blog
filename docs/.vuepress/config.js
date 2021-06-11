module.exports = {
  port: 2222,
  title: '黄秤砣的博客',
  description: '基于vuePress搭建的个人网站',
  themeConfig: {
    nav: [
      { text: '首页', link: 'https://www.huangchengtuo.com' },
      { text: '文章', link: '/article/anime.md' },
      { text: '笔记', link: '/note/basic.md' },
      { text: '个人简历', link: '/resume.md' },
      { text: 'Gitee', link: 'https://gitee.com/HuangChengtuo' }
    ],
    logo: 'https://s1.huangchengtuo.com/img/pureDD.png',
    displayAllHeaders: true,
    sidebar: {
      '/note/': ['basic', 'browser', 'js', 'ts', 'css'],
      '/resume/': ['/resume'],
      '/article/': ['anime']
    },
    sidebarDepth: 1,
    smoothScroll: true
  }
}
