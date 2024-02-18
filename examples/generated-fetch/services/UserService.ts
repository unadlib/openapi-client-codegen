/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { User } from '../models/User';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class UserService {

    /**
     * Create user
     * This can only be done by the logged in user.
     * @param requestBody Created user object
     * @returns User successful operation
     * @throws ApiError
     */
    public static createUser(
        requestBody?: User,
    ): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/user',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Creates list of users with given input array
     * Creates list of users with given input array
     * @param requestBody
     * @returns User Successful operation
     * @returns any successful operation
     * @throws ApiError
     */
    public static createUsersWithListInput(
        requestBody?: Array<User>,
    ): CancelablePromise<User | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/user/createWithList',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Logs user into the system
     * @param username The user name for login
     * @param password The password for login in clear text
     * @returns string successful operation
     * @throws ApiError
     */
    public static loginUser(
        username?: string,
        password?: string,
    ): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/login',
            query: {
                'username': username,
                'password': password,
            },
            errors: {
                400: `Invalid username/password supplied`,
            },
        });
    }

    /**
     * Logs out current logged in user session
     * @returns any successful operation
     * @throws ApiError
     */
    public static logoutUser(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/logout',
        });
    }

    /**
     * Get user by user name
     * @param username The name that needs to be fetched. Use user1 for testing.
     * @returns User successful operation
     * @throws ApiError
     */
    public static getUserByName(
        username: string,
    ): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/{username}',
            path: {
                'username': username,
            },
            errors: {
                400: `Invalid username supplied`,
                404: `User not found`,
            },
        });
    }

    /**
     * Update user
     * This can only be done by the logged in user.
     * @param username name that need to be deleted
     * @param requestBody Update an existent user in the store
     * @returns any successful operation
     * @throws ApiError
     */
    public static updateUser(
        username: string,
        requestBody?: User,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/user/{username}',
            path: {
                'username': username,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Delete user
     * This can only be done by the logged in user.
     * @param username The name that needs to be deleted
     * @returns void
     * @throws ApiError
     */
    public static deleteUser(
        username: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/user/{username}',
            path: {
                'username': username,
            },
            errors: {
                400: `Invalid username supplied`,
                404: `User not found`,
            },
        });
    }

}
