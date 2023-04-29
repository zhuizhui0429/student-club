import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
/**
 * 转化响应体拦截器,route handler一定在所有的自定义拦截器执行完之前就执行完毕了, 因此可以在next.handle()执行后获取到
 * 最初的响应对象从而进行转化
 */
@Injectable()
export class TransformInterceptor implements NestInterceptor {
    constructor(private reflector: Reflector) { }
    intercept(
        context: ExecutionContext,
        next: CallHandler<any>,
    ): Observable<any> | Promise<Observable<any>> {
        /**
         * 通过nest提供的reflector配合setMetaData装饰器给route handler注入请求成功对应的message信息，实现不同请求的message定制化
         */
        const successMessage = this.reflector.get<string>(
            'successMessage',
            context.getHandler(),
        );
        return next.handle().pipe(
            map((originRes) => {
                return {
                    success: true,
                    message: successMessage || '请求成功',
                    data: originRes,
                    timestamp: new Date().toISOString(),
                };
            }),
        );
    }
}