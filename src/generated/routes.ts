/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from '@tsoa/runtime';
import {  fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { ZAIController } from './../controllers/zaicontroller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { OAIController } from './../controllers/oaicontroller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { GAIController } from './../controllers/gaicontroller';
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from 'express';



// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
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


    
        const argsZAIController_zaiProxy: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"dataType":"any"},
                authorization: {"in":"header","name":"authorization","dataType":"string"},
                logReasoning: {"in":"query","name":"logReasoning","dataType":"boolean"},
        };
        app.post('/api/zai/thinky',
            ...(fetchMiddlewares<RequestHandler>(ZAIController)),
            ...(fetchMiddlewares<RequestHandler>(ZAIController.prototype.zaiProxy)),

            async function ZAIController_zaiProxy(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsZAIController_zaiProxy, request, response });

                const controller = new ZAIController();

              await templateService.apiHandler({
                methodName: 'zaiProxy',
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
        const argsOAIController_oaiProxy: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"dataType":"any"},
                preset: {"in":"query","name":"preset","dataType":"string"},
                logReasoning: {"in":"query","name":"logReasoning","dataType":"boolean"},
                authorization: {"in":"header","name":"authorization","dataType":"string"},
        };
        app.post('/api/oai/thinky',
            ...(fetchMiddlewares<RequestHandler>(OAIController)),
            ...(fetchMiddlewares<RequestHandler>(OAIController.prototype.oaiProxy)),

            async function OAIController_oaiProxy(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsOAIController_oaiProxy, request, response });

                const controller = new OAIController();

              await templateService.apiHandler({
                methodName: 'oaiProxy',
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
