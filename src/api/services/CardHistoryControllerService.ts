/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CardBalanceHistoryResponse } from '../models/CardBalanceHistoryResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CardHistoryControllerService {
    /**
     * @param cardId
     * @returns CardBalanceHistoryResponse OK
     * @throws ApiError
     */
    public static getAllCardHistories(
        cardId: number,
    ): CancelablePromise<Array<CardBalanceHistoryResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/card-history',
            query: {
                'cardId': cardId,
            },
        });
    }
}
