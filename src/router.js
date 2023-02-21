import Vue from 'vue';
import Router from 'vue-router';

import firebase from './services/firebaseConnection';

import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Perfil from './pages/Perfil';

Vue.use(Router);

const router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            component: Home,
            meta: {
                requireAuth: true,
            }
        },
        {
            path: '/dashboard',
            component: Dashboard,
            meta: {
                requireAuth: true,
            }
        },
        {
            path: '/perfil/:userid',
            component: Perfil,
            props: true,
            meta: {
                requireAuth: true,
            }
        },
        {
            path: '/login',
            component: Login,
        },
    ]
})

router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some( x => x.meta.requireAuth);

    if (requiresAuth && !firebase.auth().currentUser) {
        next('/login');
    } else {
        next();
    }
})

export default router;