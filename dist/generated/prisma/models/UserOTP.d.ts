import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model UserOTP
 *
 */
export type UserOTPModel = runtime.Types.Result.DefaultSelection<Prisma.$UserOTPPayload>;
export type AggregateUserOTP = {
    _count: UserOTPCountAggregateOutputType | null;
    _avg: UserOTPAvgAggregateOutputType | null;
    _sum: UserOTPSumAggregateOutputType | null;
    _min: UserOTPMinAggregateOutputType | null;
    _max: UserOTPMaxAggregateOutputType | null;
};
export type UserOTPAvgAggregateOutputType = {
    otp_id: number | null;
    user_id: number | null;
};
export type UserOTPSumAggregateOutputType = {
    otp_id: number | null;
    user_id: number | null;
};
export type UserOTPMinAggregateOutputType = {
    otp_id: number | null;
    user_id: number | null;
    otp_code: string | null;
    created_at: Date | null;
    expires_at: Date | null;
    is_verified: boolean | null;
};
export type UserOTPMaxAggregateOutputType = {
    otp_id: number | null;
    user_id: number | null;
    otp_code: string | null;
    created_at: Date | null;
    expires_at: Date | null;
    is_verified: boolean | null;
};
export type UserOTPCountAggregateOutputType = {
    otp_id: number;
    user_id: number;
    otp_code: number;
    created_at: number;
    expires_at: number;
    is_verified: number;
    _all: number;
};
export type UserOTPAvgAggregateInputType = {
    otp_id?: true;
    user_id?: true;
};
export type UserOTPSumAggregateInputType = {
    otp_id?: true;
    user_id?: true;
};
export type UserOTPMinAggregateInputType = {
    otp_id?: true;
    user_id?: true;
    otp_code?: true;
    created_at?: true;
    expires_at?: true;
    is_verified?: true;
};
export type UserOTPMaxAggregateInputType = {
    otp_id?: true;
    user_id?: true;
    otp_code?: true;
    created_at?: true;
    expires_at?: true;
    is_verified?: true;
};
export type UserOTPCountAggregateInputType = {
    otp_id?: true;
    user_id?: true;
    otp_code?: true;
    created_at?: true;
    expires_at?: true;
    is_verified?: true;
    _all?: true;
};
export type UserOTPAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which UserOTP to aggregate.
     */
    where?: Prisma.UserOTPWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of UserOTPS to fetch.
     */
    orderBy?: Prisma.UserOTPOrderByWithRelationInput | Prisma.UserOTPOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.UserOTPWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` UserOTPS from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` UserOTPS.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned UserOTPS
    **/
    _count?: true | UserOTPCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: UserOTPAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: UserOTPSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: UserOTPMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: UserOTPMaxAggregateInputType;
};
export type GetUserOTPAggregateType<T extends UserOTPAggregateArgs> = {
    [P in keyof T & keyof AggregateUserOTP]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateUserOTP[P]> : Prisma.GetScalarType<T[P], AggregateUserOTP[P]>;
};
export type UserOTPGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserOTPWhereInput;
    orderBy?: Prisma.UserOTPOrderByWithAggregationInput | Prisma.UserOTPOrderByWithAggregationInput[];
    by: Prisma.UserOTPScalarFieldEnum[] | Prisma.UserOTPScalarFieldEnum;
    having?: Prisma.UserOTPScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: UserOTPCountAggregateInputType | true;
    _avg?: UserOTPAvgAggregateInputType;
    _sum?: UserOTPSumAggregateInputType;
    _min?: UserOTPMinAggregateInputType;
    _max?: UserOTPMaxAggregateInputType;
};
export type UserOTPGroupByOutputType = {
    otp_id: number;
    user_id: number;
    otp_code: string;
    created_at: Date;
    expires_at: Date;
    is_verified: boolean;
    _count: UserOTPCountAggregateOutputType | null;
    _avg: UserOTPAvgAggregateOutputType | null;
    _sum: UserOTPSumAggregateOutputType | null;
    _min: UserOTPMinAggregateOutputType | null;
    _max: UserOTPMaxAggregateOutputType | null;
};
type GetUserOTPGroupByPayload<T extends UserOTPGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<UserOTPGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof UserOTPGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], UserOTPGroupByOutputType[P]> : Prisma.GetScalarType<T[P], UserOTPGroupByOutputType[P]>;
}>>;
export type UserOTPWhereInput = {
    AND?: Prisma.UserOTPWhereInput | Prisma.UserOTPWhereInput[];
    OR?: Prisma.UserOTPWhereInput[];
    NOT?: Prisma.UserOTPWhereInput | Prisma.UserOTPWhereInput[];
    otp_id?: Prisma.IntFilter<"UserOTP"> | number;
    user_id?: Prisma.IntFilter<"UserOTP"> | number;
    otp_code?: Prisma.StringFilter<"UserOTP"> | string;
    created_at?: Prisma.DateTimeFilter<"UserOTP"> | Date | string;
    expires_at?: Prisma.DateTimeFilter<"UserOTP"> | Date | string;
    is_verified?: Prisma.BoolFilter<"UserOTP"> | boolean;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type UserOTPOrderByWithRelationInput = {
    otp_id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    otp_code?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    expires_at?: Prisma.SortOrder;
    is_verified?: Prisma.SortOrder;
    user?: Prisma.UserOrderByWithRelationInput;
};
export type UserOTPWhereUniqueInput = Prisma.AtLeast<{
    otp_id?: number;
    AND?: Prisma.UserOTPWhereInput | Prisma.UserOTPWhereInput[];
    OR?: Prisma.UserOTPWhereInput[];
    NOT?: Prisma.UserOTPWhereInput | Prisma.UserOTPWhereInput[];
    user_id?: Prisma.IntFilter<"UserOTP"> | number;
    otp_code?: Prisma.StringFilter<"UserOTP"> | string;
    created_at?: Prisma.DateTimeFilter<"UserOTP"> | Date | string;
    expires_at?: Prisma.DateTimeFilter<"UserOTP"> | Date | string;
    is_verified?: Prisma.BoolFilter<"UserOTP"> | boolean;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "otp_id">;
export type UserOTPOrderByWithAggregationInput = {
    otp_id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    otp_code?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    expires_at?: Prisma.SortOrder;
    is_verified?: Prisma.SortOrder;
    _count?: Prisma.UserOTPCountOrderByAggregateInput;
    _avg?: Prisma.UserOTPAvgOrderByAggregateInput;
    _max?: Prisma.UserOTPMaxOrderByAggregateInput;
    _min?: Prisma.UserOTPMinOrderByAggregateInput;
    _sum?: Prisma.UserOTPSumOrderByAggregateInput;
};
export type UserOTPScalarWhereWithAggregatesInput = {
    AND?: Prisma.UserOTPScalarWhereWithAggregatesInput | Prisma.UserOTPScalarWhereWithAggregatesInput[];
    OR?: Prisma.UserOTPScalarWhereWithAggregatesInput[];
    NOT?: Prisma.UserOTPScalarWhereWithAggregatesInput | Prisma.UserOTPScalarWhereWithAggregatesInput[];
    otp_id?: Prisma.IntWithAggregatesFilter<"UserOTP"> | number;
    user_id?: Prisma.IntWithAggregatesFilter<"UserOTP"> | number;
    otp_code?: Prisma.StringWithAggregatesFilter<"UserOTP"> | string;
    created_at?: Prisma.DateTimeWithAggregatesFilter<"UserOTP"> | Date | string;
    expires_at?: Prisma.DateTimeWithAggregatesFilter<"UserOTP"> | Date | string;
    is_verified?: Prisma.BoolWithAggregatesFilter<"UserOTP"> | boolean;
};
export type UserOTPCreateInput = {
    otp_code: string;
    created_at?: Date | string;
    expires_at: Date | string;
    is_verified?: boolean;
    user: Prisma.UserCreateNestedOneWithoutOtpVerificationsInput;
};
export type UserOTPUncheckedCreateInput = {
    otp_id?: number;
    user_id: number;
    otp_code: string;
    created_at?: Date | string;
    expires_at: Date | string;
    is_verified?: boolean;
};
export type UserOTPUpdateInput = {
    otp_code?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    expires_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    is_verified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    user?: Prisma.UserUpdateOneRequiredWithoutOtpVerificationsNestedInput;
};
export type UserOTPUncheckedUpdateInput = {
    otp_id?: Prisma.IntFieldUpdateOperationsInput | number;
    user_id?: Prisma.IntFieldUpdateOperationsInput | number;
    otp_code?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    expires_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    is_verified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type UserOTPCreateManyInput = {
    otp_id?: number;
    user_id: number;
    otp_code: string;
    created_at?: Date | string;
    expires_at: Date | string;
    is_verified?: boolean;
};
export type UserOTPUpdateManyMutationInput = {
    otp_code?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    expires_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    is_verified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type UserOTPUncheckedUpdateManyInput = {
    otp_id?: Prisma.IntFieldUpdateOperationsInput | number;
    user_id?: Prisma.IntFieldUpdateOperationsInput | number;
    otp_code?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    expires_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    is_verified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type UserOTPListRelationFilter = {
    every?: Prisma.UserOTPWhereInput;
    some?: Prisma.UserOTPWhereInput;
    none?: Prisma.UserOTPWhereInput;
};
export type UserOTPOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type UserOTPCountOrderByAggregateInput = {
    otp_id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    otp_code?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    expires_at?: Prisma.SortOrder;
    is_verified?: Prisma.SortOrder;
};
export type UserOTPAvgOrderByAggregateInput = {
    otp_id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
};
export type UserOTPMaxOrderByAggregateInput = {
    otp_id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    otp_code?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    expires_at?: Prisma.SortOrder;
    is_verified?: Prisma.SortOrder;
};
export type UserOTPMinOrderByAggregateInput = {
    otp_id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    otp_code?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    expires_at?: Prisma.SortOrder;
    is_verified?: Prisma.SortOrder;
};
export type UserOTPSumOrderByAggregateInput = {
    otp_id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
};
export type UserOTPCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.UserOTPCreateWithoutUserInput, Prisma.UserOTPUncheckedCreateWithoutUserInput> | Prisma.UserOTPCreateWithoutUserInput[] | Prisma.UserOTPUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.UserOTPCreateOrConnectWithoutUserInput | Prisma.UserOTPCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.UserOTPCreateManyUserInputEnvelope;
    connect?: Prisma.UserOTPWhereUniqueInput | Prisma.UserOTPWhereUniqueInput[];
};
export type UserOTPUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.UserOTPCreateWithoutUserInput, Prisma.UserOTPUncheckedCreateWithoutUserInput> | Prisma.UserOTPCreateWithoutUserInput[] | Prisma.UserOTPUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.UserOTPCreateOrConnectWithoutUserInput | Prisma.UserOTPCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.UserOTPCreateManyUserInputEnvelope;
    connect?: Prisma.UserOTPWhereUniqueInput | Prisma.UserOTPWhereUniqueInput[];
};
export type UserOTPUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.UserOTPCreateWithoutUserInput, Prisma.UserOTPUncheckedCreateWithoutUserInput> | Prisma.UserOTPCreateWithoutUserInput[] | Prisma.UserOTPUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.UserOTPCreateOrConnectWithoutUserInput | Prisma.UserOTPCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.UserOTPUpsertWithWhereUniqueWithoutUserInput | Prisma.UserOTPUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.UserOTPCreateManyUserInputEnvelope;
    set?: Prisma.UserOTPWhereUniqueInput | Prisma.UserOTPWhereUniqueInput[];
    disconnect?: Prisma.UserOTPWhereUniqueInput | Prisma.UserOTPWhereUniqueInput[];
    delete?: Prisma.UserOTPWhereUniqueInput | Prisma.UserOTPWhereUniqueInput[];
    connect?: Prisma.UserOTPWhereUniqueInput | Prisma.UserOTPWhereUniqueInput[];
    update?: Prisma.UserOTPUpdateWithWhereUniqueWithoutUserInput | Prisma.UserOTPUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.UserOTPUpdateManyWithWhereWithoutUserInput | Prisma.UserOTPUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.UserOTPScalarWhereInput | Prisma.UserOTPScalarWhereInput[];
};
export type UserOTPUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.UserOTPCreateWithoutUserInput, Prisma.UserOTPUncheckedCreateWithoutUserInput> | Prisma.UserOTPCreateWithoutUserInput[] | Prisma.UserOTPUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.UserOTPCreateOrConnectWithoutUserInput | Prisma.UserOTPCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.UserOTPUpsertWithWhereUniqueWithoutUserInput | Prisma.UserOTPUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.UserOTPCreateManyUserInputEnvelope;
    set?: Prisma.UserOTPWhereUniqueInput | Prisma.UserOTPWhereUniqueInput[];
    disconnect?: Prisma.UserOTPWhereUniqueInput | Prisma.UserOTPWhereUniqueInput[];
    delete?: Prisma.UserOTPWhereUniqueInput | Prisma.UserOTPWhereUniqueInput[];
    connect?: Prisma.UserOTPWhereUniqueInput | Prisma.UserOTPWhereUniqueInput[];
    update?: Prisma.UserOTPUpdateWithWhereUniqueWithoutUserInput | Prisma.UserOTPUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.UserOTPUpdateManyWithWhereWithoutUserInput | Prisma.UserOTPUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.UserOTPScalarWhereInput | Prisma.UserOTPScalarWhereInput[];
};
export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string;
};
export type UserOTPCreateWithoutUserInput = {
    otp_code: string;
    created_at?: Date | string;
    expires_at: Date | string;
    is_verified?: boolean;
};
export type UserOTPUncheckedCreateWithoutUserInput = {
    otp_id?: number;
    otp_code: string;
    created_at?: Date | string;
    expires_at: Date | string;
    is_verified?: boolean;
};
export type UserOTPCreateOrConnectWithoutUserInput = {
    where: Prisma.UserOTPWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserOTPCreateWithoutUserInput, Prisma.UserOTPUncheckedCreateWithoutUserInput>;
};
export type UserOTPCreateManyUserInputEnvelope = {
    data: Prisma.UserOTPCreateManyUserInput | Prisma.UserOTPCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type UserOTPUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.UserOTPWhereUniqueInput;
    update: Prisma.XOR<Prisma.UserOTPUpdateWithoutUserInput, Prisma.UserOTPUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.UserOTPCreateWithoutUserInput, Prisma.UserOTPUncheckedCreateWithoutUserInput>;
};
export type UserOTPUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.UserOTPWhereUniqueInput;
    data: Prisma.XOR<Prisma.UserOTPUpdateWithoutUserInput, Prisma.UserOTPUncheckedUpdateWithoutUserInput>;
};
export type UserOTPUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.UserOTPScalarWhereInput;
    data: Prisma.XOR<Prisma.UserOTPUpdateManyMutationInput, Prisma.UserOTPUncheckedUpdateManyWithoutUserInput>;
};
export type UserOTPScalarWhereInput = {
    AND?: Prisma.UserOTPScalarWhereInput | Prisma.UserOTPScalarWhereInput[];
    OR?: Prisma.UserOTPScalarWhereInput[];
    NOT?: Prisma.UserOTPScalarWhereInput | Prisma.UserOTPScalarWhereInput[];
    otp_id?: Prisma.IntFilter<"UserOTP"> | number;
    user_id?: Prisma.IntFilter<"UserOTP"> | number;
    otp_code?: Prisma.StringFilter<"UserOTP"> | string;
    created_at?: Prisma.DateTimeFilter<"UserOTP"> | Date | string;
    expires_at?: Prisma.DateTimeFilter<"UserOTP"> | Date | string;
    is_verified?: Prisma.BoolFilter<"UserOTP"> | boolean;
};
export type UserOTPCreateManyUserInput = {
    otp_id?: number;
    otp_code: string;
    created_at?: Date | string;
    expires_at: Date | string;
    is_verified?: boolean;
};
export type UserOTPUpdateWithoutUserInput = {
    otp_code?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    expires_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    is_verified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type UserOTPUncheckedUpdateWithoutUserInput = {
    otp_id?: Prisma.IntFieldUpdateOperationsInput | number;
    otp_code?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    expires_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    is_verified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type UserOTPUncheckedUpdateManyWithoutUserInput = {
    otp_id?: Prisma.IntFieldUpdateOperationsInput | number;
    otp_code?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    expires_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    is_verified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type UserOTPSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    otp_id?: boolean;
    user_id?: boolean;
    otp_code?: boolean;
    created_at?: boolean;
    expires_at?: boolean;
    is_verified?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["userOTP"]>;
export type UserOTPSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    otp_id?: boolean;
    user_id?: boolean;
    otp_code?: boolean;
    created_at?: boolean;
    expires_at?: boolean;
    is_verified?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["userOTP"]>;
export type UserOTPSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    otp_id?: boolean;
    user_id?: boolean;
    otp_code?: boolean;
    created_at?: boolean;
    expires_at?: boolean;
    is_verified?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["userOTP"]>;
export type UserOTPSelectScalar = {
    otp_id?: boolean;
    user_id?: boolean;
    otp_code?: boolean;
    created_at?: boolean;
    expires_at?: boolean;
    is_verified?: boolean;
};
export type UserOTPOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"otp_id" | "user_id" | "otp_code" | "created_at" | "expires_at" | "is_verified", ExtArgs["result"]["userOTP"]>;
export type UserOTPInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type UserOTPIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type UserOTPIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $UserOTPPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "UserOTP";
    objects: {
        user: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        otp_id: number;
        user_id: number;
        otp_code: string;
        created_at: Date;
        expires_at: Date;
        is_verified: boolean;
    }, ExtArgs["result"]["userOTP"]>;
    composites: {};
};
export type UserOTPGetPayload<S extends boolean | null | undefined | UserOTPDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$UserOTPPayload, S>;
export type UserOTPCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<UserOTPFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: UserOTPCountAggregateInputType | true;
};
export interface UserOTPDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['UserOTP'];
        meta: {
            name: 'UserOTP';
        };
    };
    /**
     * Find zero or one UserOTP that matches the filter.
     * @param {UserOTPFindUniqueArgs} args - Arguments to find a UserOTP
     * @example
     * // Get one UserOTP
     * const userOTP = await prisma.userOTP.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserOTPFindUniqueArgs>(args: Prisma.SelectSubset<T, UserOTPFindUniqueArgs<ExtArgs>>): Prisma.Prisma__UserOTPClient<runtime.Types.Result.GetResult<Prisma.$UserOTPPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one UserOTP that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserOTPFindUniqueOrThrowArgs} args - Arguments to find a UserOTP
     * @example
     * // Get one UserOTP
     * const userOTP = await prisma.userOTP.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserOTPFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, UserOTPFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__UserOTPClient<runtime.Types.Result.GetResult<Prisma.$UserOTPPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first UserOTP that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserOTPFindFirstArgs} args - Arguments to find a UserOTP
     * @example
     * // Get one UserOTP
     * const userOTP = await prisma.userOTP.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserOTPFindFirstArgs>(args?: Prisma.SelectSubset<T, UserOTPFindFirstArgs<ExtArgs>>): Prisma.Prisma__UserOTPClient<runtime.Types.Result.GetResult<Prisma.$UserOTPPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first UserOTP that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserOTPFindFirstOrThrowArgs} args - Arguments to find a UserOTP
     * @example
     * // Get one UserOTP
     * const userOTP = await prisma.userOTP.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserOTPFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, UserOTPFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__UserOTPClient<runtime.Types.Result.GetResult<Prisma.$UserOTPPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more UserOTPS that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserOTPFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserOTPS
     * const userOTPS = await prisma.userOTP.findMany()
     *
     * // Get first 10 UserOTPS
     * const userOTPS = await prisma.userOTP.findMany({ take: 10 })
     *
     * // Only select the `otp_id`
     * const userOTPWithOtp_idOnly = await prisma.userOTP.findMany({ select: { otp_id: true } })
     *
     */
    findMany<T extends UserOTPFindManyArgs>(args?: Prisma.SelectSubset<T, UserOTPFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserOTPPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a UserOTP.
     * @param {UserOTPCreateArgs} args - Arguments to create a UserOTP.
     * @example
     * // Create one UserOTP
     * const UserOTP = await prisma.userOTP.create({
     *   data: {
     *     // ... data to create a UserOTP
     *   }
     * })
     *
     */
    create<T extends UserOTPCreateArgs>(args: Prisma.SelectSubset<T, UserOTPCreateArgs<ExtArgs>>): Prisma.Prisma__UserOTPClient<runtime.Types.Result.GetResult<Prisma.$UserOTPPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many UserOTPS.
     * @param {UserOTPCreateManyArgs} args - Arguments to create many UserOTPS.
     * @example
     * // Create many UserOTPS
     * const userOTP = await prisma.userOTP.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends UserOTPCreateManyArgs>(args?: Prisma.SelectSubset<T, UserOTPCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many UserOTPS and returns the data saved in the database.
     * @param {UserOTPCreateManyAndReturnArgs} args - Arguments to create many UserOTPS.
     * @example
     * // Create many UserOTPS
     * const userOTP = await prisma.userOTP.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many UserOTPS and only return the `otp_id`
     * const userOTPWithOtp_idOnly = await prisma.userOTP.createManyAndReturn({
     *   select: { otp_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends UserOTPCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, UserOTPCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserOTPPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a UserOTP.
     * @param {UserOTPDeleteArgs} args - Arguments to delete one UserOTP.
     * @example
     * // Delete one UserOTP
     * const UserOTP = await prisma.userOTP.delete({
     *   where: {
     *     // ... filter to delete one UserOTP
     *   }
     * })
     *
     */
    delete<T extends UserOTPDeleteArgs>(args: Prisma.SelectSubset<T, UserOTPDeleteArgs<ExtArgs>>): Prisma.Prisma__UserOTPClient<runtime.Types.Result.GetResult<Prisma.$UserOTPPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one UserOTP.
     * @param {UserOTPUpdateArgs} args - Arguments to update one UserOTP.
     * @example
     * // Update one UserOTP
     * const userOTP = await prisma.userOTP.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends UserOTPUpdateArgs>(args: Prisma.SelectSubset<T, UserOTPUpdateArgs<ExtArgs>>): Prisma.Prisma__UserOTPClient<runtime.Types.Result.GetResult<Prisma.$UserOTPPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more UserOTPS.
     * @param {UserOTPDeleteManyArgs} args - Arguments to filter UserOTPS to delete.
     * @example
     * // Delete a few UserOTPS
     * const { count } = await prisma.userOTP.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends UserOTPDeleteManyArgs>(args?: Prisma.SelectSubset<T, UserOTPDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more UserOTPS.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserOTPUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserOTPS
     * const userOTP = await prisma.userOTP.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends UserOTPUpdateManyArgs>(args: Prisma.SelectSubset<T, UserOTPUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more UserOTPS and returns the data updated in the database.
     * @param {UserOTPUpdateManyAndReturnArgs} args - Arguments to update many UserOTPS.
     * @example
     * // Update many UserOTPS
     * const userOTP = await prisma.userOTP.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more UserOTPS and only return the `otp_id`
     * const userOTPWithOtp_idOnly = await prisma.userOTP.updateManyAndReturn({
     *   select: { otp_id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends UserOTPUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, UserOTPUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserOTPPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one UserOTP.
     * @param {UserOTPUpsertArgs} args - Arguments to update or create a UserOTP.
     * @example
     * // Update or create a UserOTP
     * const userOTP = await prisma.userOTP.upsert({
     *   create: {
     *     // ... data to create a UserOTP
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserOTP we want to update
     *   }
     * })
     */
    upsert<T extends UserOTPUpsertArgs>(args: Prisma.SelectSubset<T, UserOTPUpsertArgs<ExtArgs>>): Prisma.Prisma__UserOTPClient<runtime.Types.Result.GetResult<Prisma.$UserOTPPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of UserOTPS.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserOTPCountArgs} args - Arguments to filter UserOTPS to count.
     * @example
     * // Count the number of UserOTPS
     * const count = await prisma.userOTP.count({
     *   where: {
     *     // ... the filter for the UserOTPS we want to count
     *   }
     * })
    **/
    count<T extends UserOTPCountArgs>(args?: Prisma.Subset<T, UserOTPCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], UserOTPCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a UserOTP.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserOTPAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserOTPAggregateArgs>(args: Prisma.Subset<T, UserOTPAggregateArgs>): Prisma.PrismaPromise<GetUserOTPAggregateType<T>>;
    /**
     * Group by UserOTP.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserOTPGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
    **/
    groupBy<T extends UserOTPGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: UserOTPGroupByArgs['orderBy'];
    } : {
        orderBy?: UserOTPGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, UserOTPGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserOTPGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the UserOTP model
     */
    readonly fields: UserOTPFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for UserOTP.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__UserOTPClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
/**
 * Fields of the UserOTP model
 */
export interface UserOTPFieldRefs {
    readonly otp_id: Prisma.FieldRef<"UserOTP", 'Int'>;
    readonly user_id: Prisma.FieldRef<"UserOTP", 'Int'>;
    readonly otp_code: Prisma.FieldRef<"UserOTP", 'String'>;
    readonly created_at: Prisma.FieldRef<"UserOTP", 'DateTime'>;
    readonly expires_at: Prisma.FieldRef<"UserOTP", 'DateTime'>;
    readonly is_verified: Prisma.FieldRef<"UserOTP", 'Boolean'>;
}
/**
 * UserOTP findUnique
 */
export type UserOTPFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserOTP
     */
    select?: Prisma.UserOTPSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the UserOTP
     */
    omit?: Prisma.UserOTPOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserOTPInclude<ExtArgs> | null;
    /**
     * Filter, which UserOTP to fetch.
     */
    where: Prisma.UserOTPWhereUniqueInput;
};
/**
 * UserOTP findUniqueOrThrow
 */
export type UserOTPFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserOTP
     */
    select?: Prisma.UserOTPSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the UserOTP
     */
    omit?: Prisma.UserOTPOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserOTPInclude<ExtArgs> | null;
    /**
     * Filter, which UserOTP to fetch.
     */
    where: Prisma.UserOTPWhereUniqueInput;
};
/**
 * UserOTP findFirst
 */
export type UserOTPFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserOTP
     */
    select?: Prisma.UserOTPSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the UserOTP
     */
    omit?: Prisma.UserOTPOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserOTPInclude<ExtArgs> | null;
    /**
     * Filter, which UserOTP to fetch.
     */
    where?: Prisma.UserOTPWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of UserOTPS to fetch.
     */
    orderBy?: Prisma.UserOTPOrderByWithRelationInput | Prisma.UserOTPOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for UserOTPS.
     */
    cursor?: Prisma.UserOTPWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` UserOTPS from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` UserOTPS.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of UserOTPS.
     */
    distinct?: Prisma.UserOTPScalarFieldEnum | Prisma.UserOTPScalarFieldEnum[];
};
/**
 * UserOTP findFirstOrThrow
 */
export type UserOTPFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserOTP
     */
    select?: Prisma.UserOTPSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the UserOTP
     */
    omit?: Prisma.UserOTPOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserOTPInclude<ExtArgs> | null;
    /**
     * Filter, which UserOTP to fetch.
     */
    where?: Prisma.UserOTPWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of UserOTPS to fetch.
     */
    orderBy?: Prisma.UserOTPOrderByWithRelationInput | Prisma.UserOTPOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for UserOTPS.
     */
    cursor?: Prisma.UserOTPWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` UserOTPS from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` UserOTPS.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of UserOTPS.
     */
    distinct?: Prisma.UserOTPScalarFieldEnum | Prisma.UserOTPScalarFieldEnum[];
};
/**
 * UserOTP findMany
 */
export type UserOTPFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserOTP
     */
    select?: Prisma.UserOTPSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the UserOTP
     */
    omit?: Prisma.UserOTPOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserOTPInclude<ExtArgs> | null;
    /**
     * Filter, which UserOTPS to fetch.
     */
    where?: Prisma.UserOTPWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of UserOTPS to fetch.
     */
    orderBy?: Prisma.UserOTPOrderByWithRelationInput | Prisma.UserOTPOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing UserOTPS.
     */
    cursor?: Prisma.UserOTPWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` UserOTPS from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` UserOTPS.
     */
    skip?: number;
    distinct?: Prisma.UserOTPScalarFieldEnum | Prisma.UserOTPScalarFieldEnum[];
};
/**
 * UserOTP create
 */
export type UserOTPCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserOTP
     */
    select?: Prisma.UserOTPSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the UserOTP
     */
    omit?: Prisma.UserOTPOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserOTPInclude<ExtArgs> | null;
    /**
     * The data needed to create a UserOTP.
     */
    data: Prisma.XOR<Prisma.UserOTPCreateInput, Prisma.UserOTPUncheckedCreateInput>;
};
/**
 * UserOTP createMany
 */
export type UserOTPCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserOTPS.
     */
    data: Prisma.UserOTPCreateManyInput | Prisma.UserOTPCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * UserOTP createManyAndReturn
 */
export type UserOTPCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserOTP
     */
    select?: Prisma.UserOTPSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the UserOTP
     */
    omit?: Prisma.UserOTPOmit<ExtArgs> | null;
    /**
     * The data used to create many UserOTPS.
     */
    data: Prisma.UserOTPCreateManyInput | Prisma.UserOTPCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserOTPIncludeCreateManyAndReturn<ExtArgs> | null;
};
/**
 * UserOTP update
 */
export type UserOTPUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserOTP
     */
    select?: Prisma.UserOTPSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the UserOTP
     */
    omit?: Prisma.UserOTPOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserOTPInclude<ExtArgs> | null;
    /**
     * The data needed to update a UserOTP.
     */
    data: Prisma.XOR<Prisma.UserOTPUpdateInput, Prisma.UserOTPUncheckedUpdateInput>;
    /**
     * Choose, which UserOTP to update.
     */
    where: Prisma.UserOTPWhereUniqueInput;
};
/**
 * UserOTP updateMany
 */
export type UserOTPUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update UserOTPS.
     */
    data: Prisma.XOR<Prisma.UserOTPUpdateManyMutationInput, Prisma.UserOTPUncheckedUpdateManyInput>;
    /**
     * Filter which UserOTPS to update
     */
    where?: Prisma.UserOTPWhereInput;
    /**
     * Limit how many UserOTPS to update.
     */
    limit?: number;
};
/**
 * UserOTP updateManyAndReturn
 */
export type UserOTPUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserOTP
     */
    select?: Prisma.UserOTPSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the UserOTP
     */
    omit?: Prisma.UserOTPOmit<ExtArgs> | null;
    /**
     * The data used to update UserOTPS.
     */
    data: Prisma.XOR<Prisma.UserOTPUpdateManyMutationInput, Prisma.UserOTPUncheckedUpdateManyInput>;
    /**
     * Filter which UserOTPS to update
     */
    where?: Prisma.UserOTPWhereInput;
    /**
     * Limit how many UserOTPS to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserOTPIncludeUpdateManyAndReturn<ExtArgs> | null;
};
/**
 * UserOTP upsert
 */
export type UserOTPUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserOTP
     */
    select?: Prisma.UserOTPSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the UserOTP
     */
    omit?: Prisma.UserOTPOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserOTPInclude<ExtArgs> | null;
    /**
     * The filter to search for the UserOTP to update in case it exists.
     */
    where: Prisma.UserOTPWhereUniqueInput;
    /**
     * In case the UserOTP found by the `where` argument doesn't exist, create a new UserOTP with this data.
     */
    create: Prisma.XOR<Prisma.UserOTPCreateInput, Prisma.UserOTPUncheckedCreateInput>;
    /**
     * In case the UserOTP was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.UserOTPUpdateInput, Prisma.UserOTPUncheckedUpdateInput>;
};
/**
 * UserOTP delete
 */
export type UserOTPDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserOTP
     */
    select?: Prisma.UserOTPSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the UserOTP
     */
    omit?: Prisma.UserOTPOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserOTPInclude<ExtArgs> | null;
    /**
     * Filter which UserOTP to delete.
     */
    where: Prisma.UserOTPWhereUniqueInput;
};
/**
 * UserOTP deleteMany
 */
export type UserOTPDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which UserOTPS to delete
     */
    where?: Prisma.UserOTPWhereInput;
    /**
     * Limit how many UserOTPS to delete.
     */
    limit?: number;
};
/**
 * UserOTP without action
 */
export type UserOTPDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserOTP
     */
    select?: Prisma.UserOTPSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the UserOTP
     */
    omit?: Prisma.UserOTPOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserOTPInclude<ExtArgs> | null;
};
export {};
//# sourceMappingURL=UserOTP.d.ts.map