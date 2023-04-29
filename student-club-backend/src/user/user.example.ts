import type { RegisterPayloadType, LoginPayloadType } from './user.service'

export const RegisterPayloadExample: RegisterPayloadType = {
    account: '19891925871',
    password: 'zzxcxy666',
    type: 'student'
}

export const LoginPayloadExample: LoginPayloadType = {
    account: '19891925871',
    password: 'zzxcxy666'
}
