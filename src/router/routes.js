
const routes = [
  {
    path: '/signin',
    component: () => import('pages/SignIn.vue'),
    beforeEnter(to, from, next) {
      if (window.localStorage.getItem('token')) next('/seminars');
      else next();
    },
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    beforeEnter(to, from, next) {
      if (!window.localStorage.getItem('token')) next('/signin');
      else next();
    },
    children: [
      { path: 'seminars', component: () => import('pages/Seminars.vue') },
      { path: 'preachers', component: () => import('pages/Preachers.vue') },
      { path: 'listeners', component: () => import('pages/Listeners.vue') },
      { path: 'lessons', component: () => import('pages/Lessons.vue') },
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
