import { RouterOptions, createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@store'
import * as progress from 'nprogress'

const Login = () => import(('../pages/login'))
const Register = () => import(('../pages/register'))
const HomePage = () => import(('@/pages/homePage'))
const ClubSquare = () => import(('@/pages/clubSquare'))
const personalCenter = () => import(('@/pages/personalCenter'))
const ManageClubMember = () => import(('@/pages/manageClubMember'))
const PublishActivity = () => import(('@/pages/publishActivity'))
const ActivityHistory = () => import(('@/pages/activityHistory'))
const CreateClub = () => import(('@/pages/createClub'))

export function pause(time: number) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(true), time)
    })
}

export function getRandomNum(min: number, max: number) {
    return min + Math.floor(Math.random() * (max - min))
}

export type role = 'student' | 'manager' | 'admin'
declare module 'vue-router' {
    interface RouteMeta {
        requiresAuth: boolean
        role?: role
    }
}
let userStore: ReturnType<typeof useUserStore> = null as any
const getUserStore = () => {
    if (!userStore) {
        userStore = useUserStore()
    }
    return userStore
}

const routes: RouterOptions['routes'] = [
    {
        path: '/',
        component: HomePage,
        meta: {
            requiresAuth: false
        },
        children: [
            {
                path: 'clubSquare',
                component: ClubSquare,
                name: 'clubSquare',
                meta: {
                    requiresAuth: false
                }
            },
            {
                path: 'personalCenter',
                component: personalCenter,
                meta: {
                    requiresAuth: true,
                    role: 'student'
                }
            },
            {
                path: 'manageClubMember',
                component: ManageClubMember,
                meta: {
                    requiresAuth: true,
                    role: 'manager'
                }
            },
            {
                path: 'publishActivity',
                component: PublishActivity,
                meta: {
                    requiresAuth: true,
                    role: 'manager'
                }
            },
            {
                path: 'activityHistory',
                component: ActivityHistory,
                meta: {
                    requiresAuth: true,
                    role: 'manager'
                }
            },
            {
                path: 'createClub',
                component: CreateClub,
                meta: {
                    requiresAuth: true,
                    role: 'admin'
                }
            }
        ]
    },
    {
        path: '/login',
        component: Login,
        name: 'login',
        meta: {
            requiresAuth: false
        }
    },
    {
        path: '/register',
        component: Register,
        name: 'register',
        meta: {
            requiresAuth: false
        }
    }
]


export const router = createRouter({
    routes,
    history: createWebHistory('')
})

router.beforeEach(async (to) => {
    progress.start()
    await pause(getRandomNum(500, 1000))
    const { type, isLogin } = getUserStore()
    const { role, requiresAuth } = to.meta
    if (!requiresAuth) {

        return true
    }
    else if (requiresAuth && !isLogin) {

        return { name: 'login' }
    }
    else if (requiresAuth && isLogin && (type !== role)) {
        return { name: 'clubSquare' }
    }
    return true
})

router.afterEach(() => {
    progress.done()
})


