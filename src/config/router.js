import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from '../views/Login.vue';
import Registration from '../views/Registration.vue';
import Quizzes from '../views/Quizzes.vue';
import Evaluation from '../views/Evaluation.vue';
import Result from '../views/Result.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Quizzes,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/registration',
    name: 'Registration',
    component: Registration,
  },
  {
    path: '/quizzes',
    name: 'Quizzes',
    component: Quizzes,
  },
  {
    path: '/evaluation/:pin',
    name: 'Evaluation',
    component: Evaluation,
    props: true,
  },
  {
    path: '/result/:score',
    name: 'Result',
    component: Result,
    props: true,
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
  {
    path: '/license',
    name: 'License',
    component: () => import(/* webpackChunkName: "license" */ '../views/License.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
