module.exports = {
  port: 2222,
  title: '黄秤砣的博客',
  description: '基于vuePress搭建的个人博客',
  head: [['link', { rel: 'icon', href: '/logo.png' }]],
  themeConfig: {
    nav: [
      { text: '首页', link: 'https://www.huangchengtuo.com', target: '_self' },
      { text: '文章', link: '/article/' },
      { text: '笔记', link: '/note/' },
      { text: '个人简历', link: '/resume.md' },
      {
        text: 'Git',
        items: [
          { text: 'Gitee', link: 'https://gitee.com/HuangChengtuo' },
          { text: 'GitHub', link: 'https://github.com/HuangChengtuo' }
        ]
      }
    ],
    logo: 'https://s1.huangchengtuo.com/img/pureDD.png',
    displayAllHeaders: true,
    sidebar: {
      '/note/': ['', 'browser', 'css', 'js', 'react', 'ts', 'setup'],
      '/resume/': ['/resume'],
      '/article/anime': ['/article/anime'],
      '/article/stateManagement': ['/article/stateManagement'],
      '/article/swiper': ['/article/swiper'],
      '/article/reactivity': ['/article/reactivity'],
      '/article/setup': ['/article/setup']
    },
    sidebarDepth: 2,
    smoothScroll: true
  }
}
