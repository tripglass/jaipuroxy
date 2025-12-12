/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from '@tsoa/runtime';
import {  fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { ZAIController } from './../controllers/zaicontroller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { OROController } from './../controllers/orocontroller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { GAIController } from './../controllers/gaicontroller';
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from 'express';



// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "OROReasoningEffort": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["minimal"]},{"dataType":"enum","enums":["low"]},{"dataType":"enum","enums":["medium"]},{"dataType":"enum","enums":["high"]},{"dataType":"enum","enums":["xhigh"]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GAISystemPromptMode": {
        "dataType": "refEnum",
        "enums": ["LOCAL","CONTEXT"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new ExpressTemplateService(models, {"noImplicitAdditionalProperties":"silently-remove-extras","bodyCoercion":true});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa




export function RegisterRoutes(app: Router) {

    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################


    
        const argsZAIController_zaiProxyChat: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"dataType":"any"},
                authorization: {"in":"header","name":"authorization","dataType":"string"},
                logReasoning: {"in":"query","name":"logReasoning","dataType":"boolean"},
        };
        app.post('/api/zai/thinky/chat',
            ...(fetchMiddlewares<RequestHandler>(ZAIController)),
            ...(fetchMiddlewares<RequestHandler>(ZAIController.prototype.zaiProxyChat)),

            async function ZAIController_zaiProxyChat(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsZAIController_zaiProxyChat, request, response });

                const controller = new ZAIController();

              await templateService.apiHandler({
                methodName: 'zaiProxyChat',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsZAIController_zaiProxyCoding: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"dataType":"any"},
                authorization: {"in":"header","name":"authorization","dataType":"string"},
                logReasoning: {"in":"query","name":"logReasoning","dataType":"boolean"},
        };
        app.post('/api/zai/thinky/coding',
            ...(fetchMiddlewares<RequestHandler>(ZAIController)),
            ...(fetchMiddlewares<RequestHandler>(ZAIController.prototype.zaiProxyCoding)),

            async function ZAIController_zaiProxyCoding(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsZAIController_zaiProxyCoding, request, response });

                const controller = new ZAIController();

              await templateService.apiHandler({
                methodName: 'zaiProxyCoding',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsOROController_oroProxy: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"dataType":"any"},
                preset: {"in":"query","name":"preset","dataType":"string"},
                reasoningEffort: {"in":"query","name":"reasoningEffort","ref":"OROReasoningEffort"},
                logReasoning: {"in":"query","name":"logReasoning","dataType":"boolean"},
                authorization: {"in":"header","name":"authorization","dataType":"string"},
        };
        app.post('/api/oro/thinky',
            ...(fetchMiddlewares<RequestHandler>(OROController)),
            ...(fetchMiddlewares<RequestHandler>(OROController.prototype.oroProxy)),

            async function OROController_oroProxy(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsOROController_oroProxy, request, response });

                const controller = new OROController();

              await templateService.apiHandler({
                methodName: 'oroProxy',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsGAIController_gaiProxy: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"dataType":"any"},
                authorization: {"in":"header","name":"authorization","dataType":"string"},
                systemPromptMode: {"in":"query","name":"systemPromptMode","ref":"GAISystemPromptMode"},
                reasoningEffort: {"in":"query","name":"reasoningEffort","dataType":"double"},
                logReasoning: {"in":"query","name":"logReasoning","dataType":"boolean"},
        };
        app.post('/api/gai/proxy',
            ...(fetchMiddlewares<RequestHandler>(GAIController)),
            ...(fetchMiddlewares<RequestHandler>(GAIController.prototype.gaiProxy)),

            async function GAIController_gaiProxy(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsGAIController_gaiProxy, request, response });

                const controller = new GAIController();

              await templateService.apiHandler({
                methodName: 'gaiProxy',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
