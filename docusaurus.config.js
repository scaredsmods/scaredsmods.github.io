// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config


import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'ScaredsMods Wiki',
  tagline: 'I like coding',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://scaredrabbitnl.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/wiki/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'ScaredsMods', // Usually your GitHub org/user name.
  projectName: 'scaredsmods.github.io', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use Hernationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/ScaredsMods/scaredsmods.github.io/docs/',
          
          /*
          lastVersion: "current",
          includeCurrentVersion: true,
          versions: {
            current: {
              label: "1.20.4",
            },
            
          },
          */
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/ScaredsMods/scaredsmods.github.io/blog/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'Scaredsmods Wiki',
        logo: {
          alt: 'Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'wikiSidebar',
            position: 'left',
            label: 'Wiki',
          },
          /*
          {
            type: 'docsVersionDropdown',
            position: 'right',
          },
          */
          
          {to: '/blog', label: 'Blog', position: 'left'},
          //{to: 'about', label: 'About', position: 'left'},
          {
            href: 'https://github.com/ScaredsMods/scaredsmods.github.io',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
    
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Wiki',
                to: '/docs',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: '/blog',
              },
              {
                label: 'ScaredsMods on GitHub',
                href: 'https://github.com/ScaredsMods',
              },
              {
                label: 'Source',
                href: 'https://github.com/ScaredsMods/scaredsmods.github.io'
              },

            ],
          },
        ],
        copyright: `Copyright © 2024-${new Date().getFullYear()} Scared's Wiki, ScaredsMods. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['java' ,'groovy'],
  
      },
    }),
};


export default config;



