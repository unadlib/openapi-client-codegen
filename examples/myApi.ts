/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface Order {
  /**
   * @format int64
   * @example 10
   */
  id?: number;
  /**
   * @format int64
   * @example 198772
   */
  petId?: number;
  /**
   * @format int32
   * @example 7
   */
  quantity?: number;
  /** @format date-time */
  shipDate?: string;
  /**
   * Order Status
   * @example "approved"
   */
  status?: 'placed' | 'approved' | 'delivered';
  complete?: boolean;
}

export interface Customer {
  /**
   * @format int64
   * @example 100000
   */
  id?: number;
  /** @example "fehguy" */
  username?: string;
  address?: Address[];
}

export interface Address {
  /** @example "437 Lytton" */
  street?: string;
  /** @example "Palo Alto" */
  city?: string;
  /** @example "CA" */
  state?: string;
  /** @example "94301" */
  zip?: string;
}

export interface Category {
  /**
   * @format int64
   * @example 1
   */
  id?: number;
  /** @example "Dogs" */
  name?: string;
}

export interface User {
  /**
   * @format int64
   * @example 10
   */
  id?: number;
  /** @example "theUser" */
  username?: string;
  /** @example "John" */
  firstName?: string;
  /** @example "James" */
  lastName?: string;
  /** @example "john@email.com" */
  email?: string;
  /** @example "12345" */
  password?: string;
  /** @example "12345" */
  phone?: string;
  /**
   * User Status
   * @format int32
   * @example 1
   */
  userStatus?: number;
}

export interface Tag {
  /** @format int64 */
  id?: number;
  name?: string;
}

export interface Pet {
  /**
   * @format int64
   * @example 10
   */
  id?: number;
  /** @example "doggie" */
  name: string;
  category?: Category;
  photoUrls: string[];
  tags?: Tag[];
  /** pet status in the store */
  status?: 'available' | 'pending' | 'sold';
}

export interface ApiResponse {
  /** @format int32 */
  code?: number;
  type?: string;
  message?: string;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, 'body' | 'bodyUsed'>;

export interface FullRequestParams extends Omit<RequestInit, 'body'> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, 'body' | 'method' | 'query' | 'path'>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, 'baseUrl' | 'cancelToken' | 'signal'>;
  securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = 'application/json',
  FormData = 'multipart/form-data',
  UrlEncoded = 'application/x-www-form-urlencoded',
  Text = 'text/plain',
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = 'https://petstore3.swagger.io/api/v3';
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>['securityWorker'];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: 'same-origin',
    headers: {},
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === 'number' ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join('&');
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => 'undefined' !== typeof query[key]);
    return keys
      .map((key) => (Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)))
      .join('&');
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : '';
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === 'object' || typeof input === 'string') ? JSON.stringify(input) : input,
    [ContentType.Text]: (input: any) => (input !== null && typeof input !== 'string' ? JSON.stringify(input) : input),
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === 'object' && property !== null
            ? JSON.stringify(property)
            : `${property}`
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === 'boolean' ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(`${baseUrl || this.baseUrl || ''}${path}${queryString ? `?${queryString}` : ''}`, {
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData ? { 'Content-Type': type } : {}),
      },
      signal: (cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal) || null,
      body: typeof body === 'undefined' || body === null ? null : payloadFormatter(body),
    }).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title Swagger Petstore - OpenAPI 3.0
 * @version 1.0.11
 * @license Apache 2.0 (http://www.apache.org/licenses/LICENSE-2.0.html)
 * @termsOfService http://swagger.io/terms/
 * @baseUrl https://petstore3.swagger.io/api/v3
 * @externalDocs http://swagger.io
 * @contact <apiteam@swagger.io>
 *
 * This is a sample Pet Store Server based on the OpenAPI 3.0 specification.  You can find out more about
 * Swagger at [https://swagger.io](https://swagger.io). In the third iteration of the pet store, we've switched to the design first approach!
 * You can now help us improve the API whether it's by making changes to the definition itself or to the code.
 * That way, with time, we can improve the API in general, and expose some of the new features in OAS3.
 *
 * _If you're looking for the Swagger 2.0/OAS 2.0 version of Petstore, then click [here](https://editor.swagger.io/?url=https://petstore.swagger.io/v2/swagger.yaml). Alternatively, you can load via the `Edit > Load Petstore OAS 2.0` menu option!_
 *
 * Some useful links:
 * - [The Pet Store repository](https://github.com/swagger-api/swagger-petstore)
 * - [The source API definition for the Pet Store](https://github.com/swagger-api/swagger-petstore/blob/master/src/main/resources/openapi.yaml)
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  pet = {
    /**
     * @description Update an existing pet by Id
     *
     * @tags pet
     * @name UpdatePet
     * @summary Update an existing pet
     * @request PUT:/pet
     * @secure
     */
    updatePet: (data: Pet, params: RequestParams = {}) =>
      this.request<Pet, void>({
        path: `/pet`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Add a new pet to the store
     *
     * @tags pet
     * @name AddPet
     * @summary Add a new pet to the store
     * @request POST:/pet
     * @secure
     */
    addPet: (data: Pet, params: RequestParams = {}) =>
      this.request<Pet, void>({
        path: `/pet`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Multiple status values can be provided with comma separated strings
     *
     * @tags pet
     * @name FindPetsByStatus
     * @summary Finds Pets by status
     * @request GET:/pet/findByStatus
     * @secure
     */
    findPetsByStatus: (
      query?: {
        /**
         * Status values that need to be considered for filter
         * @default "available"
         */
        status?: 'available' | 'pending' | 'sold';
      },
      params: RequestParams = {}
    ) =>
      this.request<Pet[], void>({
        path: `/pet/findByStatus`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description Multiple tags can be provided with comma separated strings. Use tag1, tag2, tag3 for testing.
     *
     * @tags pet
     * @name FindPetsByTags
     * @summary Finds Pets by tags
     * @request GET:/pet/findByTags
     * @secure
     */
    findPetsByTags: (
      query?: {
        /** Tags to filter by */
        tags?: string[];
      },
      params: RequestParams = {}
    ) =>
      this.request<Pet[], void>({
        path: `/pet/findByTags`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description Returns a single pet
     *
     * @tags pet
     * @name GetPetById
     * @summary Find pet by ID
     * @request GET:/pet/{petId}
     * @secure
     */
    getPetById: (petId: number, params: RequestParams = {}) =>
      this.request<Pet, void>({
        path: `/pet/${petId}`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags pet
     * @name UpdatePetWithForm
     * @summary Updates a pet in the store with form data
     * @request POST:/pet/{petId}
     * @secure
     */
    updatePetWithForm: (
      petId: number,
      query?: {
        /** Name of pet that needs to be updated */
        name?: string;
        /** Status of pet that needs to be updated */
        status?: string;
      },
      params: RequestParams = {}
    ) =>
      this.request<any, void>({
        path: `/pet/${petId}`,
        method: 'POST',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description delete a pet
     *
     * @tags pet
     * @name DeletePet
     * @summary Deletes a pet
     * @request DELETE:/pet/{petId}
     * @secure
     */
    deletePet: (petId: number, params: RequestParams = {}) =>
      this.request<any, void>({
        path: `/pet/${petId}`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags pet
     * @name UploadFile
     * @summary uploads an image
     * @request POST:/pet/{petId}/uploadImage
     * @secure
     */
    uploadFile: (
      petId: number,
      data: File,
      query?: {
        /** Additional Metadata */
        additionalMetadata?: string;
      },
      params: RequestParams = {}
    ) =>
      this.request<ApiResponse, any>({
        path: `/pet/${petId}/uploadImage`,
        method: 'POST',
        query: query,
        body: data,
        secure: true,
        format: 'json',
        ...params,
      }),
  };
  store = {
    /**
     * @description Returns a map of status codes to quantities
     *
     * @tags store
     * @name GetInventory
     * @summary Returns pet inventories by status
     * @request GET:/store/inventory
     * @secure
     */
    getInventory: (params: RequestParams = {}) =>
      this.request<Record<string, number>, any>({
        path: `/store/inventory`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description Place a new order in the store
     *
     * @tags store
     * @name PlaceOrder
     * @summary Place an order for a pet
     * @request POST:/store/order
     */
    placeOrder: (data: Order, params: RequestParams = {}) =>
      this.request<Order, void>({
        path: `/store/order`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description For valid response try integer IDs with value <= 5 or > 10. Other values will generate exceptions.
     *
     * @tags store
     * @name GetOrderById
     * @summary Find purchase order by ID
     * @request GET:/store/order/{orderId}
     */
    getOrderById: (orderId: number, params: RequestParams = {}) =>
      this.request<Order, void>({
        path: `/store/order/${orderId}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * @description For valid response try integer IDs with value < 1000. Anything above 1000 or nonintegers will generate API errors
     *
     * @tags store
     * @name DeleteOrder
     * @summary Delete purchase order by ID
     * @request DELETE:/store/order/{orderId}
     */
    deleteOrder: (orderId: number, params: RequestParams = {}) =>
      this.request<any, void>({
        path: `/store/order/${orderId}`,
        method: 'DELETE',
        ...params,
      }),
  };
  user = {
    /**
     * @description This can only be done by the logged in user.
     *
     * @tags user
     * @name CreateUser
     * @summary Create user
     * @request POST:/user
     */
    createUser: (data: User, params: RequestParams = {}) =>
      this.request<any, User>({
        path: `/user`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Creates list of users with given input array
     *
     * @tags user
     * @name CreateUsersWithListInput
     * @summary Creates list of users with given input array
     * @request POST:/user/createWithList
     */
    createUsersWithListInput: (data: User[], params: RequestParams = {}) =>
      this.request<User, void>({
        path: `/user/createWithList`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name LoginUser
     * @summary Logs user into the system
     * @request GET:/user/login
     */
    loginUser: (
      query?: {
        /** The user name for login */
        username?: string;
        /** The password for login in clear text */
        password?: string;
      },
      params: RequestParams = {}
    ) =>
      this.request<string, void>({
        path: `/user/login`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name LogoutUser
     * @summary Logs out current logged in user session
     * @request GET:/user/logout
     */
    logoutUser: (params: RequestParams = {}) =>
      this.request<any, void>({
        path: `/user/logout`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name GetUserByName
     * @summary Get user by user name
     * @request GET:/user/{username}
     */
    getUserByName: (username: string, params: RequestParams = {}) =>
      this.request<User, void>({
        path: `/user/${username}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * @description This can only be done by the logged in user.
     *
     * @tags user
     * @name UpdateUser
     * @summary Update user
     * @request PUT:/user/{username}
     */
    updateUser: (username: string, data: User, params: RequestParams = {}) =>
      this.request<any, void>({
        path: `/user/${username}`,
        method: 'PUT',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description This can only be done by the logged in user.
     *
     * @tags user
     * @name DeleteUser
     * @summary Delete user
     * @request DELETE:/user/{username}
     */
    deleteUser: (username: string, params: RequestParams = {}) =>
      this.request<any, void>({
        path: `/user/${username}`,
        method: 'DELETE',
        ...params,
      }),
  };
}
