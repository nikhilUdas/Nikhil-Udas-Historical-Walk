import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model FavoriteSite
 *
 */
export type FavoriteSiteModel = runtime.Types.Result.DefaultSelection<Prisma.$FavoriteSitePayload>;
export type AggregateFavoriteSite = {
    _count: FavoriteSiteCountAggregateOutputType | null;
    _avg: FavoriteSiteAvgAggregateOutputType | null;
    _sum: FavoriteSiteSumAggregateOutputType | null;
    _min: FavoriteSiteMinAggregateOutputType | null;
    _max: FavoriteSiteMaxAggregateOutputType | null;
};
export type FavoriteSiteAvgAggregateOutputType = {
    fav_id: number | null;
    user_id: number | null;
    site_id: number | null;
};
export type FavoriteSiteSumAggregateOutputType = {
    fav_id: number | null;
    user_id: number | null;
    site_id: number | null;
};
export type FavoriteSiteMinAggregateOutputType = {
    fav_id: number | null;
    user_id: number | null;
    site_id: number | null;
    added_date: Date | null;
};
export type FavoriteSiteMaxAggregateOutputType = {
    fav_id: number | null;
    user_id: number | null;
    site_id: number | null;
    added_date: Date | null;
};
export type FavoriteSiteCountAggregateOutputType = {
    fav_id: number;
    user_id: number;
    site_id: number;
    added_date: number;
    _all: number;
};
export type FavoriteSiteAvgAggregateInputType = {
    fav_id?: true;
    user_id?: true;
    site_id?: true;
};
export type FavoriteSiteSumAggregateInputType = {
    fav_id?: true;
    user_id?: true;
    site_id?: true;
};
export type FavoriteSiteMinAggregateInputType = {
    fav_id?: true;
    user_id?: true;
    site_id?: true;
    added_date?: true;
};
export type FavoriteSiteMaxAggregateInputType = {
    fav_id?: true;
    user_id?: true;
    site_id?: true;
    added_date?: true;
};
export type FavoriteSiteCountAggregateInputType = {
    fav_id?: true;
    user_id?: true;
    site_id?: true;
    added_date?: true;
    _all?: true;
};
export type FavoriteSiteAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which FavoriteSite to aggregate.
     */
    where?: Prisma.FavoriteSiteWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of FavoriteSites to fetch.
     */
    orderBy?: Prisma.FavoriteSiteOrderByWithRelationInput | Prisma.FavoriteSiteOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.FavoriteSiteWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` FavoriteSites from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` FavoriteSites.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned FavoriteSites
    **/
    _count?: true | FavoriteSiteCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: FavoriteSiteAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: FavoriteSiteSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: FavoriteSiteMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: FavoriteSiteMaxAggregateInputType;
};
export type GetFavoriteSiteAggregateType<T extends FavoriteSiteAggregateArgs> = {
    [P in keyof T & keyof AggregateFavoriteSite]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateFavoriteSite[P]> : Prisma.GetScalarType<T[P], AggregateFavoriteSite[P]>;
};
export type FavoriteSiteGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.FavoriteSiteWhereInput;
    orderBy?: Prisma.FavoriteSiteOrderByWithAggregationInput | Prisma.FavoriteSiteOrderByWithAggregationInput[];
    by: Prisma.FavoriteSiteScalarFieldEnum[] | Prisma.FavoriteSiteScalarFieldEnum;
    having?: Prisma.FavoriteSiteScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: FavoriteSiteCountAggregateInputType | true;
    _avg?: FavoriteSiteAvgAggregateInputType;
    _sum?: FavoriteSiteSumAggregateInputType;
    _min?: FavoriteSiteMinAggregateInputType;
    _max?: FavoriteSiteMaxAggregateInputType;
};
export type FavoriteSiteGroupByOutputType = {
    fav_id: number;
    user_id: number;
    site_id: number;
    added_date: Date;
    _count: FavoriteSiteCountAggregateOutputType | null;
    _avg: FavoriteSiteAvgAggregateOutputType | null;
    _sum: FavoriteSiteSumAggregateOutputType | null;
    _min: FavoriteSiteMinAggregateOutputType | null;
    _max: FavoriteSiteMaxAggregateOutputType | null;
};
type GetFavoriteSiteGroupByPayload<T extends FavoriteSiteGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<FavoriteSiteGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof FavoriteSiteGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], FavoriteSiteGroupByOutputType[P]> : Prisma.GetScalarType<T[P], FavoriteSiteGroupByOutputType[P]>;
}>>;
export type FavoriteSiteWhereInput = {
    AND?: Prisma.FavoriteSiteWhereInput | Prisma.FavoriteSiteWhereInput[];
    OR?: Prisma.FavoriteSiteWhereInput[];
    NOT?: Prisma.FavoriteSiteWhereInput | Prisma.FavoriteSiteWhereInput[];
    fav_id?: Prisma.IntFilter<"FavoriteSite"> | number;
    user_id?: Prisma.IntFilter<"FavoriteSite"> | number;
    site_id?: Prisma.IntFilter<"FavoriteSite"> | number;
    added_date?: Prisma.DateTimeFilter<"FavoriteSite"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    site?: Prisma.XOR<Prisma.HeritageSiteScalarRelationFilter, Prisma.HeritageSiteWhereInput>;
};
export type FavoriteSiteOrderByWithRelationInput = {
    fav_id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    site_id?: Prisma.SortOrder;
    added_date?: Prisma.SortOrder;
    user?: Prisma.UserOrderByWithRelationInput;
    site?: Prisma.HeritageSiteOrderByWithRelationInput;
};
export type FavoriteSiteWhereUniqueInput = Prisma.AtLeast<{
    fav_id?: number;
    user_id_site_id?: Prisma.FavoriteSiteUser_idSite_idCompoundUniqueInput;
    AND?: Prisma.FavoriteSiteWhereInput | Prisma.FavoriteSiteWhereInput[];
    OR?: Prisma.FavoriteSiteWhereInput[];
    NOT?: Prisma.FavoriteSiteWhereInput | Prisma.FavoriteSiteWhereInput[];
    user_id?: Prisma.IntFilter<"FavoriteSite"> | number;
    site_id?: Prisma.IntFilter<"FavoriteSite"> | number;
    added_date?: Prisma.DateTimeFilter<"FavoriteSite"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    site?: Prisma.XOR<Prisma.HeritageSiteScalarRelationFilter, Prisma.HeritageSiteWhereInput>;
}, "fav_id" | "user_id_site_id">;
export type FavoriteSiteOrderByWithAggregationInput = {
    fav_id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    site_id?: Prisma.SortOrder;
    added_date?: Prisma.SortOrder;
    _count?: Prisma.FavoriteSiteCountOrderByAggregateInput;
    _avg?: Prisma.FavoriteSiteAvgOrderByAggregateInput;
    _max?: Prisma.FavoriteSiteMaxOrderByAggregateInput;
    _min?: Prisma.FavoriteSiteMinOrderByAggregateInput;
    _sum?: Prisma.FavoriteSiteSumOrderByAggregateInput;
};
export type FavoriteSiteScalarWhereWithAggregatesInput = {
    AND?: Prisma.FavoriteSiteScalarWhereWithAggregatesInput | Prisma.FavoriteSiteScalarWhereWithAggregatesInput[];
    OR?: Prisma.FavoriteSiteScalarWhereWithAggregatesInput[];
    NOT?: Prisma.FavoriteSiteScalarWhereWithAggregatesInput | Prisma.FavoriteSiteScalarWhereWithAggregatesInput[];
    fav_id?: Prisma.IntWithAggregatesFilter<"FavoriteSite"> | number;
    user_id?: Prisma.IntWithAggregatesFilter<"FavoriteSite"> | number;
    site_id?: Prisma.IntWithAggregatesFilter<"FavoriteSite"> | number;
    added_date?: Prisma.DateTimeWithAggregatesFilter<"FavoriteSite"> | Date | string;
};
export type FavoriteSiteCreateInput = {
    added_date?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutFavoritesInput;
    site: Prisma.HeritageSiteCreateNestedOneWithoutFavoritesInput;
};
export type FavoriteSiteUncheckedCreateInput = {
    fav_id?: number;
    user_id: number;
    site_id: number;
    added_date?: Date | string;
};
export type FavoriteSiteUpdateInput = {
    added_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutFavoritesNestedInput;
    site?: Prisma.HeritageSiteUpdateOneRequiredWithoutFavoritesNestedInput;
};
export type FavoriteSiteUncheckedUpdateInput = {
    fav_id?: Prisma.IntFieldUpdateOperationsInput | number;
    user_id?: Prisma.IntFieldUpdateOperationsInput | number;
    site_id?: Prisma.IntFieldUpdateOperationsInput | number;
    added_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type FavoriteSiteCreateManyInput = {
    fav_id?: number;
    user_id: number;
    site_id: number;
    added_date?: Date | string;
};
export type FavoriteSiteUpdateManyMutationInput = {
    added_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type FavoriteSiteUncheckedUpdateManyInput = {
    fav_id?: Prisma.IntFieldUpdateOperationsInput | number;
    user_id?: Prisma.IntFieldUpdateOperationsInput | number;
    site_id?: Prisma.IntFieldUpdateOperationsInput | number;
    added_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type FavoriteSiteListRelationFilter = {
    every?: Prisma.FavoriteSiteWhereInput;
    some?: Prisma.FavoriteSiteWhereInput;
    none?: Prisma.FavoriteSiteWhereInput;
};
export type FavoriteSiteOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type FavoriteSiteUser_idSite_idCompoundUniqueInput = {
    user_id: number;
    site_id: number;
};
export type FavoriteSiteCountOrderByAggregateInput = {
    fav_id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    site_id?: Prisma.SortOrder;
    added_date?: Prisma.SortOrder;
};
export type FavoriteSiteAvgOrderByAggregateInput = {
    fav_id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    site_id?: Prisma.SortOrder;
};
export type FavoriteSiteMaxOrderByAggregateInput = {
    fav_id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    site_id?: Prisma.SortOrder;
    added_date?: Prisma.SortOrder;
};
export type FavoriteSiteMinOrderByAggregateInput = {
    fav_id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    site_id?: Prisma.SortOrder;
    added_date?: Prisma.SortOrder;
};
export type FavoriteSiteSumOrderByAggregateInput = {
    fav_id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    site_id?: Prisma.SortOrder;
};
export type FavoriteSiteCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.FavoriteSiteCreateWithoutUserInput, Prisma.FavoriteSiteUncheckedCreateWithoutUserInput> | Prisma.FavoriteSiteCreateWithoutUserInput[] | Prisma.FavoriteSiteUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.FavoriteSiteCreateOrConnectWithoutUserInput | Prisma.FavoriteSiteCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.FavoriteSiteCreateManyUserInputEnvelope;
    connect?: Prisma.FavoriteSiteWhereUniqueInput | Prisma.FavoriteSiteWhereUniqueInput[];
};
export type FavoriteSiteUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.FavoriteSiteCreateWithoutUserInput, Prisma.FavoriteSiteUncheckedCreateWithoutUserInput> | Prisma.FavoriteSiteCreateWithoutUserInput[] | Prisma.FavoriteSiteUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.FavoriteSiteCreateOrConnectWithoutUserInput | Prisma.FavoriteSiteCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.FavoriteSiteCreateManyUserInputEnvelope;
    connect?: Prisma.FavoriteSiteWhereUniqueInput | Prisma.FavoriteSiteWhereUniqueInput[];
};
export type FavoriteSiteUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.FavoriteSiteCreateWithoutUserInput, Prisma.FavoriteSiteUncheckedCreateWithoutUserInput> | Prisma.FavoriteSiteCreateWithoutUserInput[] | Prisma.FavoriteSiteUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.FavoriteSiteCreateOrConnectWithoutUserInput | Prisma.FavoriteSiteCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.FavoriteSiteUpsertWithWhereUniqueWithoutUserInput | Prisma.FavoriteSiteUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.FavoriteSiteCreateManyUserInputEnvelope;
    set?: Prisma.FavoriteSiteWhereUniqueInput | Prisma.FavoriteSiteWhereUniqueInput[];
    disconnect?: Prisma.FavoriteSiteWhereUniqueInput | Prisma.FavoriteSiteWhereUniqueInput[];
    delete?: Prisma.FavoriteSiteWhereUniqueInput | Prisma.FavoriteSiteWhereUniqueInput[];
    connect?: Prisma.FavoriteSiteWhereUniqueInput | Prisma.FavoriteSiteWhereUniqueInput[];
    update?: Prisma.FavoriteSiteUpdateWithWhereUniqueWithoutUserInput | Prisma.FavoriteSiteUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.FavoriteSiteUpdateManyWithWhereWithoutUserInput | Prisma.FavoriteSiteUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.FavoriteSiteScalarWhereInput | Prisma.FavoriteSiteScalarWhereInput[];
};
export type FavoriteSiteUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.FavoriteSiteCreateWithoutUserInput, Prisma.FavoriteSiteUncheckedCreateWithoutUserInput> | Prisma.FavoriteSiteCreateWithoutUserInput[] | Prisma.FavoriteSiteUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.FavoriteSiteCreateOrConnectWithoutUserInput | Prisma.FavoriteSiteCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.FavoriteSiteUpsertWithWhereUniqueWithoutUserInput | Prisma.FavoriteSiteUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.FavoriteSiteCreateManyUserInputEnvelope;
    set?: Prisma.FavoriteSiteWhereUniqueInput | Prisma.FavoriteSiteWhereUniqueInput[];
    disconnect?: Prisma.FavoriteSiteWhereUniqueInput | Prisma.FavoriteSiteWhereUniqueInput[];
    delete?: Prisma.FavoriteSiteWhereUniqueInput | Prisma.FavoriteSiteWhereUniqueInput[];
    connect?: Prisma.FavoriteSiteWhereUniqueInput | Prisma.FavoriteSiteWhereUniqueInput[];
    update?: Prisma.FavoriteSiteUpdateWithWhereUniqueWithoutUserInput | Prisma.FavoriteSiteUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.FavoriteSiteUpdateManyWithWhereWithoutUserInput | Prisma.FavoriteSiteUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.FavoriteSiteScalarWhereInput | Prisma.FavoriteSiteScalarWhereInput[];
};
export type FavoriteSiteCreateNestedManyWithoutSiteInput = {
    create?: Prisma.XOR<Prisma.FavoriteSiteCreateWithoutSiteInput, Prisma.FavoriteSiteUncheckedCreateWithoutSiteInput> | Prisma.FavoriteSiteCreateWithoutSiteInput[] | Prisma.FavoriteSiteUncheckedCreateWithoutSiteInput[];
    connectOrCreate?: Prisma.FavoriteSiteCreateOrConnectWithoutSiteInput | Prisma.FavoriteSiteCreateOrConnectWithoutSiteInput[];
    createMany?: Prisma.FavoriteSiteCreateManySiteInputEnvelope;
    connect?: Prisma.FavoriteSiteWhereUniqueInput | Prisma.FavoriteSiteWhereUniqueInput[];
};
export type FavoriteSiteUncheckedCreateNestedManyWithoutSiteInput = {
    create?: Prisma.XOR<Prisma.FavoriteSiteCreateWithoutSiteInput, Prisma.FavoriteSiteUncheckedCreateWithoutSiteInput> | Prisma.FavoriteSiteCreateWithoutSiteInput[] | Prisma.FavoriteSiteUncheckedCreateWithoutSiteInput[];
    connectOrCreate?: Prisma.FavoriteSiteCreateOrConnectWithoutSiteInput | Prisma.FavoriteSiteCreateOrConnectWithoutSiteInput[];
    createMany?: Prisma.FavoriteSiteCreateManySiteInputEnvelope;
    connect?: Prisma.FavoriteSiteWhereUniqueInput | Prisma.FavoriteSiteWhereUniqueInput[];
};
export type FavoriteSiteUpdateManyWithoutSiteNestedInput = {
    create?: Prisma.XOR<Prisma.FavoriteSiteCreateWithoutSiteInput, Prisma.FavoriteSiteUncheckedCreateWithoutSiteInput> | Prisma.FavoriteSiteCreateWithoutSiteInput[] | Prisma.FavoriteSiteUncheckedCreateWithoutSiteInput[];
    connectOrCreate?: Prisma.FavoriteSiteCreateOrConnectWithoutSiteInput | Prisma.FavoriteSiteCreateOrConnectWithoutSiteInput[];
    upsert?: Prisma.FavoriteSiteUpsertWithWhereUniqueWithoutSiteInput | Prisma.FavoriteSiteUpsertWithWhereUniqueWithoutSiteInput[];
    createMany?: Prisma.FavoriteSiteCreateManySiteInputEnvelope;
    set?: Prisma.FavoriteSiteWhereUniqueInput | Prisma.FavoriteSiteWhereUniqueInput[];
    disconnect?: Prisma.FavoriteSiteWhereUniqueInput | Prisma.FavoriteSiteWhereUniqueInput[];
    delete?: Prisma.FavoriteSiteWhereUniqueInput | Prisma.FavoriteSiteWhereUniqueInput[];
    connect?: Prisma.FavoriteSiteWhereUniqueInput | Prisma.FavoriteSiteWhereUniqueInput[];
    update?: Prisma.FavoriteSiteUpdateWithWhereUniqueWithoutSiteInput | Prisma.FavoriteSiteUpdateWithWhereUniqueWithoutSiteInput[];
    updateMany?: Prisma.FavoriteSiteUpdateManyWithWhereWithoutSiteInput | Prisma.FavoriteSiteUpdateManyWithWhereWithoutSiteInput[];
    deleteMany?: Prisma.FavoriteSiteScalarWhereInput | Prisma.FavoriteSiteScalarWhereInput[];
};
export type FavoriteSiteUncheckedUpdateManyWithoutSiteNestedInput = {
    create?: Prisma.XOR<Prisma.FavoriteSiteCreateWithoutSiteInput, Prisma.FavoriteSiteUncheckedCreateWithoutSiteInput> | Prisma.FavoriteSiteCreateWithoutSiteInput[] | Prisma.FavoriteSiteUncheckedCreateWithoutSiteInput[];
    connectOrCreate?: Prisma.FavoriteSiteCreateOrConnectWithoutSiteInput | Prisma.FavoriteSiteCreateOrConnectWithoutSiteInput[];
    upsert?: Prisma.FavoriteSiteUpsertWithWhereUniqueWithoutSiteInput | Prisma.FavoriteSiteUpsertWithWhereUniqueWithoutSiteInput[];
    createMany?: Prisma.FavoriteSiteCreateManySiteInputEnvelope;
    set?: Prisma.FavoriteSiteWhereUniqueInput | Prisma.FavoriteSiteWhereUniqueInput[];
    disconnect?: Prisma.FavoriteSiteWhereUniqueInput | Prisma.FavoriteSiteWhereUniqueInput[];
    delete?: Prisma.FavoriteSiteWhereUniqueInput | Prisma.FavoriteSiteWhereUniqueInput[];
    connect?: Prisma.FavoriteSiteWhereUniqueInput | Prisma.FavoriteSiteWhereUniqueInput[];
    update?: Prisma.FavoriteSiteUpdateWithWhereUniqueWithoutSiteInput | Prisma.FavoriteSiteUpdateWithWhereUniqueWithoutSiteInput[];
    updateMany?: Prisma.FavoriteSiteUpdateManyWithWhereWithoutSiteInput | Prisma.FavoriteSiteUpdateManyWithWhereWithoutSiteInput[];
    deleteMany?: Prisma.FavoriteSiteScalarWhereInput | Prisma.FavoriteSiteScalarWhereInput[];
};
export type FavoriteSiteCreateWithoutUserInput = {
    added_date?: Date | string;
    site: Prisma.HeritageSiteCreateNestedOneWithoutFavoritesInput;
};
export type FavoriteSiteUncheckedCreateWithoutUserInput = {
    fav_id?: number;
    site_id: number;
    added_date?: Date | string;
};
export type FavoriteSiteCreateOrConnectWithoutUserInput = {
    where: Prisma.FavoriteSiteWhereUniqueInput;
    create: Prisma.XOR<Prisma.FavoriteSiteCreateWithoutUserInput, Prisma.FavoriteSiteUncheckedCreateWithoutUserInput>;
};
export type FavoriteSiteCreateManyUserInputEnvelope = {
    data: Prisma.FavoriteSiteCreateManyUserInput | Prisma.FavoriteSiteCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type FavoriteSiteUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.FavoriteSiteWhereUniqueInput;
    update: Prisma.XOR<Prisma.FavoriteSiteUpdateWithoutUserInput, Prisma.FavoriteSiteUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.FavoriteSiteCreateWithoutUserInput, Prisma.FavoriteSiteUncheckedCreateWithoutUserInput>;
};
export type FavoriteSiteUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.FavoriteSiteWhereUniqueInput;
    data: Prisma.XOR<Prisma.FavoriteSiteUpdateWithoutUserInput, Prisma.FavoriteSiteUncheckedUpdateWithoutUserInput>;
};
export type FavoriteSiteUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.FavoriteSiteScalarWhereInput;
    data: Prisma.XOR<Prisma.FavoriteSiteUpdateManyMutationInput, Prisma.FavoriteSiteUncheckedUpdateManyWithoutUserInput>;
};
export type FavoriteSiteScalarWhereInput = {
    AND?: Prisma.FavoriteSiteScalarWhereInput | Prisma.FavoriteSiteScalarWhereInput[];
    OR?: Prisma.FavoriteSiteScalarWhereInput[];
    NOT?: Prisma.FavoriteSiteScalarWhereInput | Prisma.FavoriteSiteScalarWhereInput[];
    fav_id?: Prisma.IntFilter<"FavoriteSite"> | number;
    user_id?: Prisma.IntFilter<"FavoriteSite"> | number;
    site_id?: Prisma.IntFilter<"FavoriteSite"> | number;
    added_date?: Prisma.DateTimeFilter<"FavoriteSite"> | Date | string;
};
export type FavoriteSiteCreateWithoutSiteInput = {
    added_date?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutFavoritesInput;
};
export type FavoriteSiteUncheckedCreateWithoutSiteInput = {
    fav_id?: number;
    user_id: number;
    added_date?: Date | string;
};
export type FavoriteSiteCreateOrConnectWithoutSiteInput = {
    where: Prisma.FavoriteSiteWhereUniqueInput;
    create: Prisma.XOR<Prisma.FavoriteSiteCreateWithoutSiteInput, Prisma.FavoriteSiteUncheckedCreateWithoutSiteInput>;
};
export type FavoriteSiteCreateManySiteInputEnvelope = {
    data: Prisma.FavoriteSiteCreateManySiteInput | Prisma.FavoriteSiteCreateManySiteInput[];
    skipDuplicates?: boolean;
};
export type FavoriteSiteUpsertWithWhereUniqueWithoutSiteInput = {
    where: Prisma.FavoriteSiteWhereUniqueInput;
    update: Prisma.XOR<Prisma.FavoriteSiteUpdateWithoutSiteInput, Prisma.FavoriteSiteUncheckedUpdateWithoutSiteInput>;
    create: Prisma.XOR<Prisma.FavoriteSiteCreateWithoutSiteInput, Prisma.FavoriteSiteUncheckedCreateWithoutSiteInput>;
};
export type FavoriteSiteUpdateWithWhereUniqueWithoutSiteInput = {
    where: Prisma.FavoriteSiteWhereUniqueInput;
    data: Prisma.XOR<Prisma.FavoriteSiteUpdateWithoutSiteInput, Prisma.FavoriteSiteUncheckedUpdateWithoutSiteInput>;
};
export type FavoriteSiteUpdateManyWithWhereWithoutSiteInput = {
    where: Prisma.FavoriteSiteScalarWhereInput;
    data: Prisma.XOR<Prisma.FavoriteSiteUpdateManyMutationInput, Prisma.FavoriteSiteUncheckedUpdateManyWithoutSiteInput>;
};
export type FavoriteSiteCreateManyUserInput = {
    fav_id?: number;
    site_id: number;
    added_date?: Date | string;
};
export type FavoriteSiteUpdateWithoutUserInput = {
    added_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    site?: Prisma.HeritageSiteUpdateOneRequiredWithoutFavoritesNestedInput;
};
export type FavoriteSiteUncheckedUpdateWithoutUserInput = {
    fav_id?: Prisma.IntFieldUpdateOperationsInput | number;
    site_id?: Prisma.IntFieldUpdateOperationsInput | number;
    added_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type FavoriteSiteUncheckedUpdateManyWithoutUserInput = {
    fav_id?: Prisma.IntFieldUpdateOperationsInput | number;
    site_id?: Prisma.IntFieldUpdateOperationsInput | number;
    added_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type FavoriteSiteCreateManySiteInput = {
    fav_id?: number;
    user_id: number;
    added_date?: Date | string;
};
export type FavoriteSiteUpdateWithoutSiteInput = {
    added_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutFavoritesNestedInput;
};
export type FavoriteSiteUncheckedUpdateWithoutSiteInput = {
    fav_id?: Prisma.IntFieldUpdateOperationsInput | number;
    user_id?: Prisma.IntFieldUpdateOperationsInput | number;
    added_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type FavoriteSiteUncheckedUpdateManyWithoutSiteInput = {
    fav_id?: Prisma.IntFieldUpdateOperationsInput | number;
    user_id?: Prisma.IntFieldUpdateOperationsInput | number;
    added_date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type FavoriteSiteSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    fav_id?: boolean;
    user_id?: boolean;
    site_id?: boolean;
    added_date?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    site?: boolean | Prisma.HeritageSiteDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["favoriteSite"]>;
export type FavoriteSiteSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    fav_id?: boolean;
    user_id?: boolean;
    site_id?: boolean;
    added_date?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    site?: boolean | Prisma.HeritageSiteDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["favoriteSite"]>;
export type FavoriteSiteSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    fav_id?: boolean;
    user_id?: boolean;
    site_id?: boolean;
    added_date?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    site?: boolean | Prisma.HeritageSiteDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["favoriteSite"]>;
export type FavoriteSiteSelectScalar = {
    fav_id?: boolean;
    user_id?: boolean;
    site_id?: boolean;
    added_date?: boolean;
};
export type FavoriteSiteOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"fav_id" | "user_id" | "site_id" | "added_date", ExtArgs["result"]["favoriteSite"]>;
export type FavoriteSiteInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    site?: boolean | Prisma.HeritageSiteDefaultArgs<ExtArgs>;
};
export type FavoriteSiteIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    site?: boolean | Prisma.HeritageSiteDefaultArgs<ExtArgs>;
};
export type FavoriteSiteIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    site?: boolean | Prisma.HeritageSiteDefaultArgs<ExtArgs>;
};
export type $FavoriteSitePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "FavoriteSite";
    objects: {
        user: Prisma.$UserPayload<ExtArgs>;
        site: Prisma.$HeritageSitePayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        fav_id: number;
        user_id: number;
        site_id: number;
        added_date: Date;
    }, ExtArgs["result"]["favoriteSite"]>;
    composites: {};
};
export type FavoriteSiteGetPayload<S extends boolean | null | undefined | FavoriteSiteDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$FavoriteSitePayload, S>;
export type FavoriteSiteCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<FavoriteSiteFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: FavoriteSiteCountAggregateInputType | true;
};
export interface FavoriteSiteDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['FavoriteSite'];
        meta: {
            name: 'FavoriteSite';
        };
    };
    /**
     * Find zero or one FavoriteSite that matches the filter.
     * @param {FavoriteSiteFindUniqueArgs} args - Arguments to find a FavoriteSite
     * @example
     * // Get one FavoriteSite
     * const favoriteSite = await prisma.favoriteSite.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FavoriteSiteFindUniqueArgs>(args: Prisma.SelectSubset<T, FavoriteSiteFindUniqueArgs<ExtArgs>>): Prisma.Prisma__FavoriteSiteClient<runtime.Types.Result.GetResult<Prisma.$FavoriteSitePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one FavoriteSite that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FavoriteSiteFindUniqueOrThrowArgs} args - Arguments to find a FavoriteSite
     * @example
     * // Get one FavoriteSite
     * const favoriteSite = await prisma.favoriteSite.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FavoriteSiteFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, FavoriteSiteFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__FavoriteSiteClient<runtime.Types.Result.GetResult<Prisma.$FavoriteSitePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first FavoriteSite that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FavoriteSiteFindFirstArgs} args - Arguments to find a FavoriteSite
     * @example
     * // Get one FavoriteSite
     * const favoriteSite = await prisma.favoriteSite.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FavoriteSiteFindFirstArgs>(args?: Prisma.SelectSubset<T, FavoriteSiteFindFirstArgs<ExtArgs>>): Prisma.Prisma__FavoriteSiteClient<runtime.Types.Result.GetResult<Prisma.$FavoriteSitePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first FavoriteSite that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FavoriteSiteFindFirstOrThrowArgs} args - Arguments to find a FavoriteSite
     * @example
     * // Get one FavoriteSite
     * const favoriteSite = await prisma.favoriteSite.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FavoriteSiteFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, FavoriteSiteFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__FavoriteSiteClient<runtime.Types.Result.GetResult<Prisma.$FavoriteSitePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more FavoriteSites that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FavoriteSiteFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all FavoriteSites
     * const favoriteSites = await prisma.favoriteSite.findMany()
     *
     * // Get first 10 FavoriteSites
     * const favoriteSites = await prisma.favoriteSite.findMany({ take: 10 })
     *
     * // Only select the `fav_id`
     * const favoriteSiteWithFav_idOnly = await prisma.favoriteSite.findMany({ select: { fav_id: true } })
     *
     */
    findMany<T extends FavoriteSiteFindManyArgs>(args?: Prisma.SelectSubset<T, FavoriteSiteFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$FavoriteSitePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a FavoriteSite.
     * @param {FavoriteSiteCreateArgs} args - Arguments to create a FavoriteSite.
     * @example
     * // Create one FavoriteSite
     * const FavoriteSite = await prisma.favoriteSite.create({
     *   data: {
     *     // ... data to create a FavoriteSite
     *   }
     * })
     *
     */
    create<T extends FavoriteSiteCreateArgs>(args: Prisma.SelectSubset<T, FavoriteSiteCreateArgs<ExtArgs>>): Prisma.Prisma__FavoriteSiteClient<runtime.Types.Result.GetResult<Prisma.$FavoriteSitePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many FavoriteSites.
     * @param {FavoriteSiteCreateManyArgs} args - Arguments to create many FavoriteSites.
     * @example
     * // Create many FavoriteSites
     * const favoriteSite = await prisma.favoriteSite.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends FavoriteSiteCreateManyArgs>(args?: Prisma.SelectSubset<T, FavoriteSiteCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many FavoriteSites and returns the data saved in the database.
     * @param {FavoriteSiteCreateManyAndReturnArgs} args - Arguments to create many FavoriteSites.
     * @example
     * // Create many FavoriteSites
     * const favoriteSite = await prisma.favoriteSite.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many FavoriteSites and only return the `fav_id`
     * const favoriteSiteWithFav_idOnly = await prisma.favoriteSite.createManyAndReturn({
     *   select: { fav_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends FavoriteSiteCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, FavoriteSiteCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$FavoriteSitePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a FavoriteSite.
     * @param {FavoriteSiteDeleteArgs} args - Arguments to delete one FavoriteSite.
     * @example
     * // Delete one FavoriteSite
     * const FavoriteSite = await prisma.favoriteSite.delete({
     *   where: {
     *     // ... filter to delete one FavoriteSite
     *   }
     * })
     *
     */
    delete<T extends FavoriteSiteDeleteArgs>(args: Prisma.SelectSubset<T, FavoriteSiteDeleteArgs<ExtArgs>>): Prisma.Prisma__FavoriteSiteClient<runtime.Types.Result.GetResult<Prisma.$FavoriteSitePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one FavoriteSite.
     * @param {FavoriteSiteUpdateArgs} args - Arguments to update one FavoriteSite.
     * @example
     * // Update one FavoriteSite
     * const favoriteSite = await prisma.favoriteSite.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends FavoriteSiteUpdateArgs>(args: Prisma.SelectSubset<T, FavoriteSiteUpdateArgs<ExtArgs>>): Prisma.Prisma__FavoriteSiteClient<runtime.Types.Result.GetResult<Prisma.$FavoriteSitePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more FavoriteSites.
     * @param {FavoriteSiteDeleteManyArgs} args - Arguments to filter FavoriteSites to delete.
     * @example
     * // Delete a few FavoriteSites
     * const { count } = await prisma.favoriteSite.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends FavoriteSiteDeleteManyArgs>(args?: Prisma.SelectSubset<T, FavoriteSiteDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more FavoriteSites.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FavoriteSiteUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many FavoriteSites
     * const favoriteSite = await prisma.favoriteSite.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends FavoriteSiteUpdateManyArgs>(args: Prisma.SelectSubset<T, FavoriteSiteUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more FavoriteSites and returns the data updated in the database.
     * @param {FavoriteSiteUpdateManyAndReturnArgs} args - Arguments to update many FavoriteSites.
     * @example
     * // Update many FavoriteSites
     * const favoriteSite = await prisma.favoriteSite.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more FavoriteSites and only return the `fav_id`
     * const favoriteSiteWithFav_idOnly = await prisma.favoriteSite.updateManyAndReturn({
     *   select: { fav_id: true },
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
    updateManyAndReturn<T extends FavoriteSiteUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, FavoriteSiteUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$FavoriteSitePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one FavoriteSite.
     * @param {FavoriteSiteUpsertArgs} args - Arguments to update or create a FavoriteSite.
     * @example
     * // Update or create a FavoriteSite
     * const favoriteSite = await prisma.favoriteSite.upsert({
     *   create: {
     *     // ... data to create a FavoriteSite
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the FavoriteSite we want to update
     *   }
     * })
     */
    upsert<T extends FavoriteSiteUpsertArgs>(args: Prisma.SelectSubset<T, FavoriteSiteUpsertArgs<ExtArgs>>): Prisma.Prisma__FavoriteSiteClient<runtime.Types.Result.GetResult<Prisma.$FavoriteSitePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of FavoriteSites.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FavoriteSiteCountArgs} args - Arguments to filter FavoriteSites to count.
     * @example
     * // Count the number of FavoriteSites
     * const count = await prisma.favoriteSite.count({
     *   where: {
     *     // ... the filter for the FavoriteSites we want to count
     *   }
     * })
    **/
    count<T extends FavoriteSiteCountArgs>(args?: Prisma.Subset<T, FavoriteSiteCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], FavoriteSiteCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a FavoriteSite.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FavoriteSiteAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends FavoriteSiteAggregateArgs>(args: Prisma.Subset<T, FavoriteSiteAggregateArgs>): Prisma.PrismaPromise<GetFavoriteSiteAggregateType<T>>;
    /**
     * Group by FavoriteSite.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FavoriteSiteGroupByArgs} args - Group by arguments.
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
    groupBy<T extends FavoriteSiteGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: FavoriteSiteGroupByArgs['orderBy'];
    } : {
        orderBy?: FavoriteSiteGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, FavoriteSiteGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFavoriteSiteGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the FavoriteSite model
     */
    readonly fields: FavoriteSiteFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for FavoriteSite.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__FavoriteSiteClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    site<T extends Prisma.HeritageSiteDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.HeritageSiteDefaultArgs<ExtArgs>>): Prisma.Prisma__HeritageSiteClient<runtime.Types.Result.GetResult<Prisma.$HeritageSitePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
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
 * Fields of the FavoriteSite model
 */
export interface FavoriteSiteFieldRefs {
    readonly fav_id: Prisma.FieldRef<"FavoriteSite", 'Int'>;
    readonly user_id: Prisma.FieldRef<"FavoriteSite", 'Int'>;
    readonly site_id: Prisma.FieldRef<"FavoriteSite", 'Int'>;
    readonly added_date: Prisma.FieldRef<"FavoriteSite", 'DateTime'>;
}
/**
 * FavoriteSite findUnique
 */
export type FavoriteSiteFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FavoriteSite
     */
    select?: Prisma.FavoriteSiteSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the FavoriteSite
     */
    omit?: Prisma.FavoriteSiteOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.FavoriteSiteInclude<ExtArgs> | null;
    /**
     * Filter, which FavoriteSite to fetch.
     */
    where: Prisma.FavoriteSiteWhereUniqueInput;
};
/**
 * FavoriteSite findUniqueOrThrow
 */
export type FavoriteSiteFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FavoriteSite
     */
    select?: Prisma.FavoriteSiteSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the FavoriteSite
     */
    omit?: Prisma.FavoriteSiteOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.FavoriteSiteInclude<ExtArgs> | null;
    /**
     * Filter, which FavoriteSite to fetch.
     */
    where: Prisma.FavoriteSiteWhereUniqueInput;
};
/**
 * FavoriteSite findFirst
 */
export type FavoriteSiteFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FavoriteSite
     */
    select?: Prisma.FavoriteSiteSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the FavoriteSite
     */
    omit?: Prisma.FavoriteSiteOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.FavoriteSiteInclude<ExtArgs> | null;
    /**
     * Filter, which FavoriteSite to fetch.
     */
    where?: Prisma.FavoriteSiteWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of FavoriteSites to fetch.
     */
    orderBy?: Prisma.FavoriteSiteOrderByWithRelationInput | Prisma.FavoriteSiteOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for FavoriteSites.
     */
    cursor?: Prisma.FavoriteSiteWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` FavoriteSites from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` FavoriteSites.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of FavoriteSites.
     */
    distinct?: Prisma.FavoriteSiteScalarFieldEnum | Prisma.FavoriteSiteScalarFieldEnum[];
};
/**
 * FavoriteSite findFirstOrThrow
 */
export type FavoriteSiteFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FavoriteSite
     */
    select?: Prisma.FavoriteSiteSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the FavoriteSite
     */
    omit?: Prisma.FavoriteSiteOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.FavoriteSiteInclude<ExtArgs> | null;
    /**
     * Filter, which FavoriteSite to fetch.
     */
    where?: Prisma.FavoriteSiteWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of FavoriteSites to fetch.
     */
    orderBy?: Prisma.FavoriteSiteOrderByWithRelationInput | Prisma.FavoriteSiteOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for FavoriteSites.
     */
    cursor?: Prisma.FavoriteSiteWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` FavoriteSites from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` FavoriteSites.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of FavoriteSites.
     */
    distinct?: Prisma.FavoriteSiteScalarFieldEnum | Prisma.FavoriteSiteScalarFieldEnum[];
};
/**
 * FavoriteSite findMany
 */
export type FavoriteSiteFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FavoriteSite
     */
    select?: Prisma.FavoriteSiteSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the FavoriteSite
     */
    omit?: Prisma.FavoriteSiteOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.FavoriteSiteInclude<ExtArgs> | null;
    /**
     * Filter, which FavoriteSites to fetch.
     */
    where?: Prisma.FavoriteSiteWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of FavoriteSites to fetch.
     */
    orderBy?: Prisma.FavoriteSiteOrderByWithRelationInput | Prisma.FavoriteSiteOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing FavoriteSites.
     */
    cursor?: Prisma.FavoriteSiteWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` FavoriteSites from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` FavoriteSites.
     */
    skip?: number;
    distinct?: Prisma.FavoriteSiteScalarFieldEnum | Prisma.FavoriteSiteScalarFieldEnum[];
};
/**
 * FavoriteSite create
 */
export type FavoriteSiteCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FavoriteSite
     */
    select?: Prisma.FavoriteSiteSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the FavoriteSite
     */
    omit?: Prisma.FavoriteSiteOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.FavoriteSiteInclude<ExtArgs> | null;
    /**
     * The data needed to create a FavoriteSite.
     */
    data: Prisma.XOR<Prisma.FavoriteSiteCreateInput, Prisma.FavoriteSiteUncheckedCreateInput>;
};
/**
 * FavoriteSite createMany
 */
export type FavoriteSiteCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many FavoriteSites.
     */
    data: Prisma.FavoriteSiteCreateManyInput | Prisma.FavoriteSiteCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * FavoriteSite createManyAndReturn
 */
export type FavoriteSiteCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FavoriteSite
     */
    select?: Prisma.FavoriteSiteSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the FavoriteSite
     */
    omit?: Prisma.FavoriteSiteOmit<ExtArgs> | null;
    /**
     * The data used to create many FavoriteSites.
     */
    data: Prisma.FavoriteSiteCreateManyInput | Prisma.FavoriteSiteCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.FavoriteSiteIncludeCreateManyAndReturn<ExtArgs> | null;
};
/**
 * FavoriteSite update
 */
export type FavoriteSiteUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FavoriteSite
     */
    select?: Prisma.FavoriteSiteSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the FavoriteSite
     */
    omit?: Prisma.FavoriteSiteOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.FavoriteSiteInclude<ExtArgs> | null;
    /**
     * The data needed to update a FavoriteSite.
     */
    data: Prisma.XOR<Prisma.FavoriteSiteUpdateInput, Prisma.FavoriteSiteUncheckedUpdateInput>;
    /**
     * Choose, which FavoriteSite to update.
     */
    where: Prisma.FavoriteSiteWhereUniqueInput;
};
/**
 * FavoriteSite updateMany
 */
export type FavoriteSiteUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update FavoriteSites.
     */
    data: Prisma.XOR<Prisma.FavoriteSiteUpdateManyMutationInput, Prisma.FavoriteSiteUncheckedUpdateManyInput>;
    /**
     * Filter which FavoriteSites to update
     */
    where?: Prisma.FavoriteSiteWhereInput;
    /**
     * Limit how many FavoriteSites to update.
     */
    limit?: number;
};
/**
 * FavoriteSite updateManyAndReturn
 */
export type FavoriteSiteUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FavoriteSite
     */
    select?: Prisma.FavoriteSiteSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the FavoriteSite
     */
    omit?: Prisma.FavoriteSiteOmit<ExtArgs> | null;
    /**
     * The data used to update FavoriteSites.
     */
    data: Prisma.XOR<Prisma.FavoriteSiteUpdateManyMutationInput, Prisma.FavoriteSiteUncheckedUpdateManyInput>;
    /**
     * Filter which FavoriteSites to update
     */
    where?: Prisma.FavoriteSiteWhereInput;
    /**
     * Limit how many FavoriteSites to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.FavoriteSiteIncludeUpdateManyAndReturn<ExtArgs> | null;
};
/**
 * FavoriteSite upsert
 */
export type FavoriteSiteUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FavoriteSite
     */
    select?: Prisma.FavoriteSiteSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the FavoriteSite
     */
    omit?: Prisma.FavoriteSiteOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.FavoriteSiteInclude<ExtArgs> | null;
    /**
     * The filter to search for the FavoriteSite to update in case it exists.
     */
    where: Prisma.FavoriteSiteWhereUniqueInput;
    /**
     * In case the FavoriteSite found by the `where` argument doesn't exist, create a new FavoriteSite with this data.
     */
    create: Prisma.XOR<Prisma.FavoriteSiteCreateInput, Prisma.FavoriteSiteUncheckedCreateInput>;
    /**
     * In case the FavoriteSite was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.FavoriteSiteUpdateInput, Prisma.FavoriteSiteUncheckedUpdateInput>;
};
/**
 * FavoriteSite delete
 */
export type FavoriteSiteDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FavoriteSite
     */
    select?: Prisma.FavoriteSiteSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the FavoriteSite
     */
    omit?: Prisma.FavoriteSiteOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.FavoriteSiteInclude<ExtArgs> | null;
    /**
     * Filter which FavoriteSite to delete.
     */
    where: Prisma.FavoriteSiteWhereUniqueInput;
};
/**
 * FavoriteSite deleteMany
 */
export type FavoriteSiteDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which FavoriteSites to delete
     */
    where?: Prisma.FavoriteSiteWhereInput;
    /**
     * Limit how many FavoriteSites to delete.
     */
    limit?: number;
};
/**
 * FavoriteSite without action
 */
export type FavoriteSiteDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FavoriteSite
     */
    select?: Prisma.FavoriteSiteSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the FavoriteSite
     */
    omit?: Prisma.FavoriteSiteOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.FavoriteSiteInclude<ExtArgs> | null;
};
export {};
//# sourceMappingURL=FavoriteSite.d.ts.map