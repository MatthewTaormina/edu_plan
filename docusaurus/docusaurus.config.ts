import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: "Open Learner's Guide",
  tagline: 'A neurodivergent-friendly, open-source guide to IT, Programming, and DevOps.',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://localhost',
  baseUrl: '/',
  organizationName: 'open-contributors',
  projectName: 'edu_plan',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  markdown: {
    mermaid: true,
  },

  themes: ['@docusaurus/theme-mermaid'],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/your-username/edu_plan/edit/main/docusaurus/',
          showLastUpdateTime: true,
          routeBasePath: 'learn',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },

    mermaid: {
      theme: { light: 'neutral', dark: 'dark' },
    },

    navbar: {
      title: "Open Learner's Guide",
      hideOnScroll: true,
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'paths',
          position: 'left',
          label: '🗺️ Learning Paths',
        },
        {
          type: 'docSidebar',
          sidebarId: 'courses',
          position: 'left',
          label: '📚 Courses',
        },
        {
          type: 'docSidebar',
          sidebarId: 'wiki',
          position: 'left',
          label: '📖 Wiki',
        },
        {
          type: 'docSidebar',
          sidebarId: 'projects',
          position: 'left',
          label: '🏗️ Projects',
        },
        {
          to: '/progress',
          label: '✅ My Progress',
          position: 'right',
        },
        {
          href: 'https://github.com/your-username/edu_plan',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },

    footer: {
      style: 'dark',
      links: [
        {
          title: 'Learn',
          items: [
            { label: 'Learning Paths', to: '/learn/paths/beginner' },
            { label: 'All Courses', to: '/learn/courses' },
            { label: 'Projects', to: '/learn/projects' },
          ],
        },
        {
          title: 'Reference',
          items: [
            { label: 'Wiki', to: '/learn/wiki' },
            { label: 'Pseudocode Standard', to: '/learn/meta/pseudocode_standard' },
            { label: 'Style Guide', to: '/learn/meta/style_guide' },
          ],
        },
        {
          title: 'Community',
          items: [
            { label: 'GitHub', href: 'https://github.com/your-username/edu_plan' },
          ],
        },
      ],
      copyright: `Open Learner's Guide — Open Source, Open to All. Built with Docusaurus.`,
    },

    prism: {
      theme: prismThemes.oneDark,
      darkTheme: prismThemes.oneDark,
      additionalLanguages: ['bash', 'powershell', 'python', 'typescript', 'rust', 'c', 'yaml', 'toml', 'json', 'php'],
    },

    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: true,
      },
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
