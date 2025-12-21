/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Card } from '../models/Card';
import type { CardRequest } from '../models/CardRequest';
import type { HttpStatusCode } from '../models/HttpStatusCode';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CardControllerService {
    /**
     * @param requestBody
     * @returns Card OK
     * @throws ApiError
     */
    public static updateCard(
        requestBody: CardRequest,
    ): CancelablePromise<Card> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/card/update',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns Card OK
     * @throws ApiError
     */
    public static addCard(
        requestBody: CardRequest,
    ): CancelablePromise<Card> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/card/add',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns Card OK
     * @throws ApiError
     */
    public static card(): CancelablePromise<Array<Card>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/card',
        });
    }
    /**
     * @param requestBody
     * @returns HttpStatusCode OK
     * @throws ApiError
     */
    public static deleteCard(
        requestBody: number,
    ): CancelablePromise<HttpStatusCode> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/card/delete',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
