
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: 'seminars', component: () => import('pages/Seminars.vue') },
      { path: 'preachers', component: () => import('pages/Preachers.vue') },
      { path: 'listeners', component: () => import('pages/Listeners.vue') },
      { path: '', component: () => import('pages/Seminars.vue') },
    ],
  },
];

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue'),
  });
}

export default routes;
