import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model HeritageSite
 *
 */
export type HeritageSiteModel = runtime.Types.Result.DefaultSelection<Prisma.$HeritageSitePayload>;
export type AggregateHeritageSite = {
    _count: HeritageSiteCountAggregateOutputType | null;
    _avg: HeritageSiteAvgAggregateOutputType | null;
    _sum: HeritageSiteSumAggregateOutputType | null;
    _min: HeritageSiteMinAggregateOutputType | null;
    _max: HeritageSiteMaxAggregateOutputType | null;
};
export type HeritageSiteAvgAggregateOutputType = {
    site_id: number | null;
};
export type HeritageSiteSumAggregateOutputType = {
    site_id: number | null;
};
export type HeritageSiteMinAggregateOutputType = {
    site_id: number | null;
    name: string | null;
    description: string | null;
    photo_url: string | null;
    gps_coordinates: string | null;
    image_data: string | null;
};
export type HeritageSiteMaxAggregateOutputType = {
    site_id: number | null;
    name: string | null;
    description: string | null;
    photo_url: string | null;
    gps_coordinates: string | null;
    image_data: string | null;
};
export type HeritageSiteCountAggregateOutputType = {
    site_id: number;
    name: number;
    description: number;
    photo_url: number;
    gps_coordinates: number;
    image_data: number;
    _all: number;
};
export type HeritageSiteAvgAggregateInputType = {
    site_id?: true;
};
export type HeritageSiteSumAggregateInputType = {
    site_id?: true;
};
export type HeritageSiteMinAggregateInputType = {
    site_id?: true;
    name?: true;
    description?: true;
    photo_url?: true;
    gps_coordinates?: true;
    image_data?: true;
};
export type HeritageSiteMaxAggregateInputType = {
    site_id?: true;
    name?: true;
    description?: true;
    photo_url?: true;
    gps_coordinates?: true;
    image_data?: true;
};
export type HeritageSiteCountAggregateInputType = {
    site_id?: true;
    name?: true;
    description?: true;
    photo_url?: true;
    gps_coordinates?: true;
    image_data?: true;
    _all?: true;
};
export type HeritageSiteAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which HeritageSite to aggregate.
     */
    where?: Prisma.HeritageSiteWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of HeritageSites to fetch.
     */
    orderBy?: Prisma.HeritageSiteOrderByWithRelationInput | Prisma.HeritageSiteOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.HeritageSiteWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` HeritageSites from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` HeritageSites.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned HeritageSites
    **/
    _count?: true | HeritageSiteCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: HeritageSiteAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: HeritageSiteSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: HeritageSiteMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: HeritageSiteMaxAggregateInputType;
};
export type GetHeritageSiteAggregateType<T extends HeritageSiteAggregateArgs> = {
    [P in keyof T & keyof AggregateHeritageSite]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateHeritageSite[P]> : Prisma.GetScalarType<T[P], AggregateHeritageSite[P]>;
};
export type HeritageSiteGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.HeritageSiteWhereInput;
    orderBy?: Prisma.HeritageSiteOrderByWithAggregationInput | Prisma.HeritageSiteOrderByWithAggregationInput[];
    by: Prisma.HeritageSiteScalarFieldEnum[] | Prisma.HeritageSiteScalarFieldEnum;
    having?: Prisma.HeritageSiteScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: HeritageSiteCountAggregateInputType | true;
    _avg?: HeritageSiteAvgAggregateInputType;
    _sum?: HeritageSiteSumAggregateInputType;
    _min?: HeritageSiteMinAggregateInputType;
    _max?: HeritageSiteMaxAggregateInputType;
};
export type HeritageSiteGroupByOutputType = {
    site_id: number;
    name: string;
    description: string;
    photo_url: string;
    gps_coordinates: string;
    image_data: string | null;
    _count: HeritageSiteCountAggregateOutputType | null;
    _avg: HeritageSiteAvgAggregateOutputType | null;
    _sum: HeritageSiteSumAggregateOutputType | null;
    _min: HeritageSiteMinAggregateOutputType | null;
    _max: HeritageSiteMaxAggregateOutputType | null;
};
type GetHeritageSiteGroupByPayload<T extends HeritageSiteGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<HeritageSiteGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof HeritageSiteGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], HeritageSiteGroupByOutputType[P]> : Prisma.GetScalarType<T[P], HeritageSiteGroupByOutputType[P]>;
}>>;
export type HeritageSiteWhereInput = {
    AND?: Prisma.HeritageSiteWhereInput | Prisma.HeritageSiteWhereInput[];
    OR?: Prisma.HeritageSiteWhereInput[];
    NOT?: Prisma.HeritageSiteWhereInput | Prisma.HeritageSiteWhereInput[];
    site_id?: Prisma.IntFilter<"HeritageSite"> | number;
    name?: Prisma.StringFilter<"HeritageSite"> | string;
    description?: Prisma.StringFilter<"HeritageSite"> | string;
    photo_url?: Prisma.StringFilter<"HeritageSite"> | string;
    gps_coordinates?: Prisma.StringFilter<"HeritageSite"> | string;
    image_data?: Prisma.StringNullableFilter<"HeritageSite"> | string | null;
    stories?: Prisma.StoryListRelationFilter;
    routes?: Prisma.MapRouteListRelationFilter;
    favorites?: Prisma.FavoriteSiteListRelationFilter;
};
export type HeritageSiteOrderByWithRelationInput = {
    site_id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    photo_url?: Prisma.SortOrder;
    gps_coordinates?: Prisma.SortOrder;
    image_data?: Prisma.SortOrderInput | Prisma.SortOrder;
    stories?: Prisma.StoryOrderByRelationAggregateInput;
    routes?: Prisma.MapRouteOrderByRelationAggregateInput;
    favorites?: Prisma.FavoriteSiteOrderByRelationAggregateInput;
};
export type HeritageSiteWhereUniqueInput = Prisma.AtLeast<{
    site_id?: number;
    AND?: Prisma.HeritageSiteWhereInput | Prisma.HeritageSiteWhereInput[];
    OR?: Prisma.HeritageSiteWhereInput[];
    NOT?: Prisma.HeritageSiteWhereInput | Prisma.HeritageSiteWhereInput[];
    name?: Prisma.StringFilter<"HeritageSite"> | string;
    description?: Prisma.StringFilter<"HeritageSite"> | string;
    photo_url?: Prisma.StringFilter<"HeritageSite"> | string;
    gps_coordinates?: Prisma.StringFilter<"HeritageSite"> | string;
    image_data?: Prisma.StringNullableFilter<"HeritageSite"> | string | null;
    stories?: Prisma.StoryListRelationFilter;
    routes?: Prisma.MapRouteListRelationFilter;
    favorites?: Prisma.FavoriteSiteListRelationFilter;
}, "site_id">;
export type HeritageSiteOrderByWithAggregationInput = {
    site_id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    photo_url?: Prisma.SortOrder;
    gps_coordinates?: Prisma.SortOrder;
    image_data?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.HeritageSiteCountOrderByAggregateInput;
    _avg?: Prisma.HeritageSiteAvgOrderByAggregateInput;
    _max?: Prisma.HeritageSiteMaxOrderByAggregateInput;
    _min?: Prisma.HeritageSiteMinOrderByAggregateInput;
    _sum?: Prisma.HeritageSiteSumOrderByAggregateInput;
};
export type HeritageSiteScalarWhereWithAggregatesInput = {
    AND?: Prisma.HeritageSiteScalarWhereWithAggregatesInput | Prisma.HeritageSiteScalarWhereWithAggregatesInput[];
    OR?: Prisma.HeritageSiteScalarWhereWithAggregatesInput[];
    NOT?: Prisma.HeritageSiteScalarWhereWithAggregatesInput | Prisma.HeritageSiteScalarWhereWithAggregatesInput[];
    site_id?: Prisma.IntWithAggregatesFilter<"HeritageSite"> | number;
    name?: Prisma.StringWithAggregatesFilter<"HeritageSite"> | string;
    description?: Prisma.StringWithAggregatesFilter<"HeritageSite"> | string;
    photo_url?: Prisma.StringWithAggregatesFilter<"HeritageSite"> | string;
    gps_coordinates?: Prisma.StringWithAggregatesFilter<"HeritageSite"> | string;
    image_data?: Prisma.StringNullableWithAggregatesFilter<"HeritageSite"> | string | null;
};
export type HeritageSiteCreateInput = {
    name: string;
    description: string;
    photo_url: string;
    gps_coordinates: string;
    image_data?: string | null;
    stories?: Prisma.StoryCreateNestedManyWithoutSiteInput;
    routes?: Prisma.MapRouteCreateNestedManyWithoutSiteInput;
    favorites?: Prisma.FavoriteSiteCreateNestedManyWithoutSiteInput;
};
export type HeritageSiteUncheckedCreateInput = {
    site_id?: number;
    name: string;
    description: string;
    photo_url: string;
    gps_coordinates: string;
    image_data?: string | null;
    stories?: Prisma.StoryUncheckedCreateNestedManyWithoutSiteInput;
    routes?: Prisma.MapRouteUncheckedCreateNestedManyWithoutSiteInput;
    favorites?: Prisma.FavoriteSiteUncheckedCreateNestedManyWithoutSiteInput;
};
export type HeritageSiteUpdateInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    photo_url?: Prisma.StringFieldUpdateOperationsInput | string;
    gps_coordinates?: Prisma.StringFieldUpdateOperationsInput | string;
    image_data?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    stories?: Prisma.StoryUpdateManyWithoutSiteNestedInput;
    routes?: Prisma.MapRouteUpdateManyWithoutSiteNestedInput;
    favorites?: Prisma.FavoriteSiteUpdateManyWithoutSiteNestedInput;
};
export type HeritageSiteUncheckedUpdateInput = {
    site_id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    photo_url?: Prisma.StringFieldUpdateOperationsInput | string;
    gps_coordinates?: Prisma.StringFieldUpdateOperationsInput | string;
    image_data?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    stories?: Prisma.StoryUncheckedUpdateManyWithoutSiteNestedInput;
    routes?: Prisma.MapRouteUncheckedUpdateManyWithoutSiteNestedInput;
    favorites?: Prisma.FavoriteSiteUncheckedUpdateManyWithoutSiteNestedInput;
};
export type HeritageSiteCreateManyInput = {
    site_id?: number;
    name: string;
    description: string;
    photo_url: string;
    gps_coordinates: string;
    image_data?: string | null;
};
export type HeritageSiteUpdateManyMutationInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    photo_url?: Prisma.StringFieldUpdateOperationsInput | string;
    gps_coordinates?: Prisma.StringFieldUpdateOperationsInput | string;
    image_data?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type HeritageSiteUncheckedUpdateManyInput = {
    site_id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    photo_url?: Prisma.StringFieldUpdateOperationsInput | string;
    gps_coordinates?: Prisma.StringFieldUpdateOperationsInput | string;
    image_data?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type HeritageSiteCountOrderByAggregateInput = {
    site_id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    photo_url?: Prisma.SortOrder;
    gps_coordinates?: Prisma.SortOrder;
    image_data?: Prisma.SortOrder;
};
export type HeritageSiteAvgOrderByAggregateInput = {
    site_id?: Prisma.SortOrder;
};
export type HeritageSiteMaxOrderByAggregateInput = {
    site_id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    photo_url?: Prisma.SortOrder;
    gps_coordinates?: Prisma.SortOrder;
    image_data?: Prisma.SortOrder;
};
export type HeritageSiteMinOrderByAggregateInput = {
    site_id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    photo_url?: Prisma.SortOrder;
    gps_coordinates?: Prisma.SortOrder;
    image_data?: Prisma.SortOrder;
};
export type HeritageSiteSumOrderByAggregateInput = {
    site_id?: Prisma.SortOrder;
};
export type HeritageSiteScalarRelationFilter = {
    is?: Prisma.HeritageSiteWhereInput;
    isNot?: Prisma.HeritageSiteWhereInput;
};
export type HeritageSiteCreateNestedOneWithoutStoriesInput = {
    create?: Prisma.XOR<Prisma.HeritageSiteCreateWithoutStoriesInput, Prisma.HeritageSiteUncheckedCreateWithoutStoriesInput>;
    connectOrCreate?: Prisma.HeritageSiteCreateOrConnectWithoutStoriesInput;
    connect?: Prisma.HeritageSiteWhereUniqueInput;
};
export type HeritageSiteUpdateOneRequiredWithoutStoriesNestedInput = {
    create?: Prisma.XOR<Prisma.HeritageSiteCreateWithoutStoriesInput, Prisma.HeritageSiteUncheckedCreateWithoutStoriesInput>;
    connectOrCreate?: Prisma.HeritageSiteCreateOrConnectWithoutStoriesInput;
    upsert?: Prisma.HeritageSiteUpsertWithoutStoriesInput;
    connect?: Prisma.HeritageSiteWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.HeritageSiteUpdateToOneWithWhereWithoutStoriesInput, Prisma.HeritageSiteUpdateWithoutStoriesInput>, Prisma.HeritageSiteUncheckedUpdateWithoutStoriesInput>;
};
export type HeritageSiteCreateNestedOneWithoutRoutesInput = {
    create?: Prisma.XOR<Prisma.HeritageSiteCreateWithoutRoutesInput, Prisma.HeritageSiteUncheckedCreateWithoutRoutesInput>;
    connectOrCreate?: Prisma.HeritageSiteCreateOrConnectWithoutRoutesInput;
    connect?: Prisma.HeritageSiteWhereUniqueInput;
};
export type HeritageSiteUpdateOneRequiredWithoutRoutesNestedInput = {
    create?: Prisma.XOR<Prisma.HeritageSiteCreateWithoutRoutesInput, Prisma.HeritageSiteUncheckedCreateWithoutRoutesInput>;
    connectOrCreate?: Prisma.HeritageSiteCreateOrConnectWithoutRoutesInput;
    upsert?: Prisma.HeritageSiteUpsertWithoutRoutesInput;
    connect?: Prisma.HeritageSiteWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.HeritageSiteUpdateToOneWithWhereWithoutRoutesInput, Prisma.HeritageSiteUpdateWithoutRoutesInput>, Prisma.HeritageSiteUncheckedUpdateWithoutRoutesInput>;
};
export type HeritageSiteCreateNestedOneWithoutFavoritesInput = {
    create?: Prisma.XOR<Prisma.HeritageSiteCreateWithoutFavoritesInput, Prisma.HeritageSiteUncheckedCreateWithoutFavoritesInput>;
    connectOrCreate?: Prisma.HeritageSiteCreateOrConnectWithoutFavoritesInput;
    connect?: Prisma.HeritageSiteWhereUniqueInput;
};
export type HeritageSiteUpdateOneRequiredWithoutFavoritesNestedInput = {
    create?: Prisma.XOR<Prisma.HeritageSiteCreateWithoutFavoritesInput, Prisma.HeritageSiteUncheckedCreateWithoutFavoritesInput>;
    connectOrCreate?: Prisma.HeritageSiteCreateOrConnectWithoutFavoritesInput;
    upsert?: Prisma.HeritageSiteUpsertWithoutFavoritesInput;
    connect?: Prisma.HeritageSiteWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.HeritageSiteUpdateToOneWithWhereWithoutFavoritesInput, Prisma.HeritageSiteUpdateWithoutFavoritesInput>, Prisma.HeritageSiteUncheckedUpdateWithoutFavoritesInput>;
};
export type HeritageSiteCreateWithoutStoriesInput = {
    name: string;
    description: string;
    photo_url: string;
    gps_coordinates: string;
    image_data?: string | null;
    routes?: Prisma.MapRouteCreateNestedManyWithoutSiteInput;
    favorites?: Prisma.FavoriteSiteCreateNestedManyWithoutSiteInput;
};
export type HeritageSiteUncheckedCreateWithoutStoriesInput = {
    site_id?: number;
    name: string;
    description: string;
    photo_url: string;
    gps_coordinates: string;
    image_data?: string | null;
    routes?: Prisma.MapRouteUncheckedCreateNestedManyWithoutSiteInput;
    favorites?: Prisma.FavoriteSiteUncheckedCreateNestedManyWithoutSiteInput;
};
export type HeritageSiteCreateOrConnectWithoutStoriesInput = {
    where: Prisma.HeritageSiteWhereUniqueInput;
    create: Prisma.XOR<Prisma.HeritageSiteCreateWithoutStoriesInput, Prisma.HeritageSiteUncheckedCreateWithoutStoriesInput>;
};
export type HeritageSiteUpsertWithoutStoriesInput = {
    update: Prisma.XOR<Prisma.HeritageSiteUpdateWithoutStoriesInput, Prisma.HeritageSiteUncheckedUpdateWithoutStoriesInput>;
    create: Prisma.XOR<Prisma.HeritageSiteCreateWithoutStoriesInput, Prisma.HeritageSiteUncheckedCreateWithoutStoriesInput>;
    where?: Prisma.HeritageSiteWhereInput;
};
export type HeritageSiteUpdateToOneWithWhereWithoutStoriesInput = {
    where?: Prisma.HeritageSiteWhereInput;
    data: Prisma.XOR<Prisma.HeritageSiteUpdateWithoutStoriesInput, Prisma.HeritageSiteUncheckedUpdateWithoutStoriesInput>;
};
export type HeritageSiteUpdateWithoutStoriesInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    photo_url?: Prisma.StringFieldUpdateOperationsInput | string;
    gps_coordinates?: Prisma.StringFieldUpdateOperationsInput | string;
    image_data?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    routes?: Prisma.MapRouteUpdateManyWithoutSiteNestedInput;
    favorites?: Prisma.FavoriteSiteUpdateManyWithoutSiteNestedInput;
};
export type HeritageSiteUncheckedUpdateWithoutStoriesInput = {
    site_id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    photo_url?: Prisma.StringFieldUpdateOperationsInput | string;
    gps_coordinates?: Prisma.StringFieldUpdateOperationsInput | string;
    image_data?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    routes?: Prisma.MapRouteUncheckedUpdateManyWithoutSiteNestedInput;
    favorites?: Prisma.FavoriteSiteUncheckedUpdateManyWithoutSiteNestedInput;
};
export type HeritageSiteCreateWithoutRoutesInput = {
    name: string;
    description: string;
    photo_url: string;
    gps_coordinates: string;
    image_data?: string | null;
    stories?: Prisma.StoryCreateNestedManyWithoutSiteInput;
    favorites?: Prisma.FavoriteSiteCreateNestedManyWithoutSiteInput;
};
export type HeritageSiteUncheckedCreateWithoutRoutesInput = {
    site_id?: number;
    name: string;
    description: string;
    photo_url: string;
    gps_coordinates: string;
    image_data?: string | null;
    stories?: Prisma.StoryUncheckedCreateNestedManyWithoutSiteInput;
    favorites?: Prisma.FavoriteSiteUncheckedCreateNestedManyWithoutSiteInput;
};
export type HeritageSiteCreateOrConnectWithoutRoutesInput = {
    where: Prisma.HeritageSiteWhereUniqueInput;
    create: Prisma.XOR<Prisma.HeritageSiteCreateWithoutRoutesInput, Prisma.HeritageSiteUncheckedCreateWithoutRoutesInput>;
};
export type HeritageSiteUpsertWithoutRoutesInput = {
    update: Prisma.XOR<Prisma.HeritageSiteUpdateWithoutRoutesInput, Prisma.HeritageSiteUncheckedUpdateWithoutRoutesInput>;
    create: Prisma.XOR<Prisma.HeritageSiteCreateWithoutRoutesInput, Prisma.HeritageSiteUncheckedCreateWithoutRoutesInput>;
    where?: Prisma.HeritageSiteWhereInput;
};
export type HeritageSiteUpdateToOneWithWhereWithoutRoutesInput = {
    where?: Prisma.HeritageSiteWhereInput;
    data: Prisma.XOR<Prisma.HeritageSiteUpdateWithoutRoutesInput, Prisma.HeritageSiteUncheckedUpdateWithoutRoutesInput>;
};
export type HeritageSiteUpdateWithoutRoutesInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    photo_url?: Prisma.StringFieldUpdateOperationsInput | string;
    gps_coordinates?: Prisma.StringFieldUpdateOperationsInput | string;
    image_data?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    stories?: Prisma.StoryUpdateManyWithoutSiteNestedInput;
    favorites?: Prisma.FavoriteSiteUpdateManyWithoutSiteNestedInput;
};
export type HeritageSiteUncheckedUpdateWithoutRoutesInput = {
    site_id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    photo_url?: Prisma.StringFieldUpdateOperationsInput | string;
    gps_coordinates?: Prisma.StringFieldUpdateOperationsInput | string;
    image_data?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    stories?: Prisma.StoryUncheckedUpdateManyWithoutSiteNestedInput;
    favorites?: Prisma.FavoriteSiteUncheckedUpdateManyWithoutSiteNestedInput;
};
export type HeritageSiteCreateWithoutFavoritesInput = {
    name: string;
    description: string;
    photo_url: string;
    gps_coordinates: string;
    image_data?: string | null;
    stories?: Prisma.StoryCreateNestedManyWithoutSiteInput;
    routes?: Prisma.MapRouteCreateNestedManyWithoutSiteInput;
};
export type HeritageSiteUncheckedCreateWithoutFavoritesInput = {
    site_id?: number;
    name: string;
    description: string;
    photo_url: string;
    gps_coordinates: string;
    image_data?: string | null;
    stories?: Prisma.StoryUncheckedCreateNestedManyWithoutSiteInput;
    routes?: Prisma.MapRouteUncheckedCreateNestedManyWithoutSiteInput;
};
export type HeritageSiteCreateOrConnectWithoutFavoritesInput = {
    where: Prisma.HeritageSiteWhereUniqueInput;
    create: Prisma.XOR<Prisma.HeritageSiteCreateWithoutFavoritesInput, Prisma.HeritageSiteUncheckedCreateWithoutFavoritesInput>;
};
export type HeritageSiteUpsertWithoutFavoritesInput = {
    update: Prisma.XOR<Prisma.HeritageSiteUpdateWithoutFavoritesInput, Prisma.HeritageSiteUncheckedUpdateWithoutFavoritesInput>;
    create: Prisma.XOR<Prisma.HeritageSiteCreateWithoutFavoritesInput, Prisma.HeritageSiteUncheckedCreateWithoutFavoritesInput>;
    where?: Prisma.HeritageSiteWhereInput;
};
export type HeritageSiteUpdateToOneWithWhereWithoutFavoritesInput = {
    where?: Prisma.HeritageSiteWhereInput;
    data: Prisma.XOR<Prisma.HeritageSiteUpdateWithoutFavoritesInput, Prisma.HeritageSiteUncheckedUpdateWithoutFavoritesInput>;
};
export type HeritageSiteUpdateWithoutFavoritesInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    photo_url?: Prisma.StringFieldUpdateOperationsInput | string;
    gps_coordinates?: Prisma.StringFieldUpdateOperationsInput | string;
    image_data?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    stories?: Prisma.StoryUpdateManyWithoutSiteNestedInput;
    routes?: Prisma.MapRouteUpdateManyWithoutSiteNestedInput;
};
export type HeritageSiteUncheckedUpdateWithoutFavoritesInput = {
    site_id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    photo_url?: Prisma.StringFieldUpdateOperationsInput | string;
    gps_coordinates?: Prisma.StringFieldUpdateOperationsInput | string;
    image_data?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    stories?: Prisma.StoryUncheckedUpdateManyWithoutSiteNestedInput;
    routes?: Prisma.MapRouteUncheckedUpdateManyWithoutSiteNestedInput;
};
/**
 * Count Type HeritageSiteCountOutputType
 */
export type HeritageSiteCountOutputType = {
    stories: number;
    routes: number;
    favorites: number;
};
export type HeritageSiteCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    stories?: boolean | HeritageSiteCountOutputTypeCountStoriesArgs;
    routes?: boolean | HeritageSiteCountOutputTypeCountRoutesArgs;
    favorites?: boolean | HeritageSiteCountOutputTypeCountFavoritesArgs;
};
/**
 * HeritageSiteCountOutputType without action
 */
export type HeritageSiteCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HeritageSiteCountOutputType
     */
    select?: Prisma.HeritageSiteCountOutputTypeSelect<ExtArgs> | null;
};
/**
 * HeritageSiteCountOutputType without action
 */
export type HeritageSiteCountOutputTypeCountStoriesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StoryWhereInput;
};
/**
 * HeritageSiteCountOutputType without action
 */
export type HeritageSiteCountOutputTypeCountRoutesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MapRouteWhereInput;
};
/**
 * HeritageSiteCountOutputType without action
 */
export type HeritageSiteCountOutputTypeCountFavoritesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.FavoriteSiteWhereInput;
};
export type HeritageSiteSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    site_id?: boolean;
    name?: boolean;
    description?: boolean;
    photo_url?: boolean;
    gps_coordinates?: boolean;
    image_data?: boolean;
    stories?: boolean | Prisma.HeritageSite$storiesArgs<ExtArgs>;
    routes?: boolean | Prisma.HeritageSite$routesArgs<ExtArgs>;
    favorites?: boolean | Prisma.HeritageSite$favoritesArgs<ExtArgs>;
    _count?: boolean | Prisma.HeritageSiteCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["heritageSite"]>;
export type HeritageSiteSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    site_id?: boolean;
    name?: boolean;
    description?: boolean;
    photo_url?: boolean;
    gps_coordinates?: boolean;
    image_data?: boolean;
}, ExtArgs["result"]["heritageSite"]>;
export type HeritageSiteSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    site_id?: boolean;
    name?: boolean;
    description?: boolean;
    photo_url?: boolean;
    gps_coordinates?: boolean;
    image_data?: boolean;
}, ExtArgs["result"]["heritageSite"]>;
export type HeritageSiteSelectScalar = {
    site_id?: boolean;
    name?: boolean;
    description?: boolean;
    photo_url?: boolean;
    gps_coordinates?: boolean;
    image_data?: boolean;
};
export type HeritageSiteOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"site_id" | "name" | "description" | "photo_url" | "gps_coordinates" | "image_data", ExtArgs["result"]["heritageSite"]>;
export type HeritageSiteInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    stories?: boolean | Prisma.HeritageSite$storiesArgs<ExtArgs>;
    routes?: boolean | Prisma.HeritageSite$routesArgs<ExtArgs>;
    favorites?: boolean | Prisma.HeritageSite$favoritesArgs<ExtArgs>;
    _count?: boolean | Prisma.HeritageSiteCountOutputTypeDefaultArgs<ExtArgs>;
};
export type HeritageSiteIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type HeritageSiteIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $HeritageSitePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "HeritageSite";
    objects: {
        stories: Prisma.$StoryPayload<ExtArgs>[];
        routes: Prisma.$MapRoutePayload<ExtArgs>[];
        favorites: Prisma.$FavoriteSitePayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        site_id: number;
        name: string;
        description: string;
        photo_url: string;
        gps_coordinates: string;
        image_data: string | null;
    }, ExtArgs["result"]["heritageSite"]>;
    composites: {};
};
export type HeritageSiteGetPayload<S extends boolean | null | undefined | HeritageSiteDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$HeritageSitePayload, S>;
export type HeritageSiteCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<HeritageSiteFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: HeritageSiteCountAggregateInputType | true;
};
export interface HeritageSiteDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['HeritageSite'];
        meta: {
            name: 'HeritageSite';
        };
    };
    /**
     * Find zero or one HeritageSite that matches the filter.
     * @param {HeritageSiteFindUniqueArgs} args - Arguments to find a HeritageSite
     * @example
     * // Get one HeritageSite
     * const heritageSite = await prisma.heritageSite.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends HeritageSiteFindUniqueArgs>(args: Prisma.SelectSubset<T, HeritageSiteFindUniqueArgs<ExtArgs>>): Prisma.Prisma__HeritageSiteClient<runtime.Types.Result.GetResult<Prisma.$HeritageSitePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one HeritageSite that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {HeritageSiteFindUniqueOrThrowArgs} args - Arguments to find a HeritageSite
     * @example
     * // Get one HeritageSite
     * const heritageSite = await prisma.heritageSite.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends HeritageSiteFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, HeritageSiteFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__HeritageSiteClient<runtime.Types.Result.GetResult<Prisma.$HeritageSitePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first HeritageSite that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HeritageSiteFindFirstArgs} args - Arguments to find a HeritageSite
     * @example
     * // Get one HeritageSite
     * const heritageSite = await prisma.heritageSite.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends HeritageSiteFindFirstArgs>(args?: Prisma.SelectSubset<T, HeritageSiteFindFirstArgs<ExtArgs>>): Prisma.Prisma__HeritageSiteClient<runtime.Types.Result.GetResult<Prisma.$HeritageSitePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first HeritageSite that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HeritageSiteFindFirstOrThrowArgs} args - Arguments to find a HeritageSite
     * @example
     * // Get one HeritageSite
     * const heritageSite = await prisma.heritageSite.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends HeritageSiteFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, HeritageSiteFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__HeritageSiteClient<runtime.Types.Result.GetResult<Prisma.$HeritageSitePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more HeritageSites that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HeritageSiteFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all HeritageSites
     * const heritageSites = await prisma.heritageSite.findMany()
     *
     * // Get first 10 HeritageSites
     * const heritageSites = await prisma.heritageSite.findMany({ take: 10 })
     *
     * // Only select the `site_id`
     * const heritageSiteWithSite_idOnly = await prisma.heritageSite.findMany({ select: { site_id: true } })
     *
     */
    findMany<T extends HeritageSiteFindManyArgs>(args?: Prisma.SelectSubset<T, HeritageSiteFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$HeritageSitePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a HeritageSite.
     * @param {HeritageSiteCreateArgs} args - Arguments to create a HeritageSite.
     * @example
     * // Create one HeritageSite
     * const HeritageSite = await prisma.heritageSite.create({
     *   data: {
     *     // ... data to create a HeritageSite
     *   }
     * })
     *
     */
    create<T extends HeritageSiteCreateArgs>(args: Prisma.SelectSubset<T, HeritageSiteCreateArgs<ExtArgs>>): Prisma.Prisma__HeritageSiteClient<runtime.Types.Result.GetResult<Prisma.$HeritageSitePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many HeritageSites.
     * @param {HeritageSiteCreateManyArgs} args - Arguments to create many HeritageSites.
     * @example
     * // Create many HeritageSites
     * const heritageSite = await prisma.heritageSite.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends HeritageSiteCreateManyArgs>(args?: Prisma.SelectSubset<T, HeritageSiteCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many HeritageSites and returns the data saved in the database.
     * @param {HeritageSiteCreateManyAndReturnArgs} args - Arguments to create many HeritageSites.
     * @example
     * // Create many HeritageSites
     * const heritageSite = await prisma.heritageSite.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many HeritageSites and only return the `site_id`
     * const heritageSiteWithSite_idOnly = await prisma.heritageSite.createManyAndReturn({
     *   select: { site_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends HeritageSiteCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, HeritageSiteCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$HeritageSitePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a HeritageSite.
     * @param {HeritageSiteDeleteArgs} args - Arguments to delete one HeritageSite.
     * @example
     * // Delete one HeritageSite
     * const HeritageSite = await prisma.heritageSite.delete({
     *   where: {
     *     // ... filter to delete one HeritageSite
     *   }
     * })
     *
     */
    delete<T extends HeritageSiteDeleteArgs>(args: Prisma.SelectSubset<T, HeritageSiteDeleteArgs<ExtArgs>>): Prisma.Prisma__HeritageSiteClient<runtime.Types.Result.GetResult<Prisma.$HeritageSitePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one HeritageSite.
     * @param {HeritageSiteUpdateArgs} args - Arguments to update one HeritageSite.
     * @example
     * // Update one HeritageSite
     * const heritageSite = await prisma.heritageSite.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends HeritageSiteUpdateArgs>(args: Prisma.SelectSubset<T, HeritageSiteUpdateArgs<ExtArgs>>): Prisma.Prisma__HeritageSiteClient<runtime.Types.Result.GetResult<Prisma.$HeritageSitePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more HeritageSites.
     * @param {HeritageSiteDeleteManyArgs} args - Arguments to filter HeritageSites to delete.
     * @example
     * // Delete a few HeritageSites
     * const { count } = await prisma.heritageSite.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends HeritageSiteDeleteManyArgs>(args?: Prisma.SelectSubset<T, HeritageSiteDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more HeritageSites.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HeritageSiteUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many HeritageSites
     * const heritageSite = await prisma.heritageSite.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends HeritageSiteUpdateManyArgs>(args: Prisma.SelectSubset<T, HeritageSiteUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more HeritageSites and returns the data updated in the database.
     * @param {HeritageSiteUpdateManyAndReturnArgs} args - Arguments to update many HeritageSites.
     * @example
     * // Update many HeritageSites
     * const heritageSite = await prisma.heritageSite.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more HeritageSites and only return the `site_id`
     * const heritageSiteWithSite_idOnly = await prisma.heritageSite.updateManyAndReturn({
     *   select: { site_id: true },
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
    updateManyAndReturn<T extends HeritageSiteUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, HeritageSiteUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$HeritageSitePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one HeritageSite.
     * @param {HeritageSiteUpsertArgs} args - Arguments to update or create a HeritageSite.
     * @example
     * // Update or create a HeritageSite
     * const heritageSite = await prisma.heritageSite.upsert({
     *   create: {
     *     // ... data to create a HeritageSite
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the HeritageSite we want to update
     *   }
     * })
     */
    upsert<T extends HeritageSiteUpsertArgs>(args: Prisma.SelectSubset<T, HeritageSiteUpsertArgs<ExtArgs>>): Prisma.Prisma__HeritageSiteClient<runtime.Types.Result.GetResult<Prisma.$HeritageSitePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of HeritageSites.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HeritageSiteCountArgs} args - Arguments to filter HeritageSites to count.
     * @example
     * // Count the number of HeritageSites
     * const count = await prisma.heritageSite.count({
     *   where: {
     *     // ... the filter for the HeritageSites we want to count
     *   }
     * })
    **/
    count<T extends HeritageSiteCountArgs>(args?: Prisma.Subset<T, HeritageSiteCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], HeritageSiteCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a HeritageSite.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HeritageSiteAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends HeritageSiteAggregateArgs>(args: Prisma.Subset<T, HeritageSiteAggregateArgs>): Prisma.PrismaPromise<GetHeritageSiteAggregateType<T>>;
    /**
     * Group by HeritageSite.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HeritageSiteGroupByArgs} args - Group by arguments.
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
    groupBy<T extends HeritageSiteGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: HeritageSiteGroupByArgs['orderBy'];
    } : {
        orderBy?: HeritageSiteGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, HeritageSiteGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetHeritageSiteGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the HeritageSite model
     */
    readonly fields: HeritageSiteFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for HeritageSite.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__HeritageSiteClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    stories<T extends Prisma.HeritageSite$storiesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.HeritageSite$storiesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    routes<T extends Prisma.HeritageSite$routesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.HeritageSite$routesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MapRoutePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    favorites<T extends Prisma.HeritageSite$favoritesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.HeritageSite$favoritesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$FavoriteSitePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
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
 * Fields of the HeritageSite model
 */
export interface HeritageSiteFieldRefs {
    readonly site_id: Prisma.FieldRef<"HeritageSite", 'Int'>;
    readonly name: Prisma.FieldRef<"HeritageSite", 'String'>;
    readonly description: Prisma.FieldRef<"HeritageSite", 'String'>;
    readonly photo_url: Prisma.FieldRef<"HeritageSite", 'String'>;
    readonly gps_coordinates: Prisma.FieldRef<"HeritageSite", 'String'>;
    readonly image_data: Prisma.FieldRef<"HeritageSite", 'String'>;
}
/**
 * HeritageSite findUnique
 */
export type HeritageSiteFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HeritageSite
     */
    select?: Prisma.HeritageSiteSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the HeritageSite
     */
    omit?: Prisma.HeritageSiteOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.HeritageSiteInclude<ExtArgs> | null;
    /**
     * Filter, which HeritageSite to fetch.
     */
    where: Prisma.HeritageSiteWhereUniqueInput;
};
/**
 * HeritageSite findUniqueOrThrow
 */
export type HeritageSiteFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HeritageSite
     */
    select?: Prisma.HeritageSiteSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the HeritageSite
     */
    omit?: Prisma.HeritageSiteOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.HeritageSiteInclude<ExtArgs> | null;
    /**
     * Filter, which HeritageSite to fetch.
     */
    where: Prisma.HeritageSiteWhereUniqueInput;
};
/**
 * HeritageSite findFirst
 */
export type HeritageSiteFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HeritageSite
     */
    select?: Prisma.HeritageSiteSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the HeritageSite
     */
    omit?: Prisma.HeritageSiteOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.HeritageSiteInclude<ExtArgs> | null;
    /**
     * Filter, which HeritageSite to fetch.
     */
    where?: Prisma.HeritageSiteWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of HeritageSites to fetch.
     */
    orderBy?: Prisma.HeritageSiteOrderByWithRelationInput | Prisma.HeritageSiteOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for HeritageSites.
     */
    cursor?: Prisma.HeritageSiteWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` HeritageSites from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` HeritageSites.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of HeritageSites.
     */
    distinct?: Prisma.HeritageSiteScalarFieldEnum | Prisma.HeritageSiteScalarFieldEnum[];
};
/**
 * HeritageSite findFirstOrThrow
 */
export type HeritageSiteFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HeritageSite
     */
    select?: Prisma.HeritageSiteSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the HeritageSite
     */
    omit?: Prisma.HeritageSiteOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.HeritageSiteInclude<ExtArgs> | null;
    /**
     * Filter, which HeritageSite to fetch.
     */
    where?: Prisma.HeritageSiteWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of HeritageSites to fetch.
     */
    orderBy?: Prisma.HeritageSiteOrderByWithRelationInput | Prisma.HeritageSiteOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for HeritageSites.
     */
    cursor?: Prisma.HeritageSiteWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` HeritageSites from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` HeritageSites.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of HeritageSites.
     */
    distinct?: Prisma.HeritageSiteScalarFieldEnum | Prisma.HeritageSiteScalarFieldEnum[];
};
/**
 * HeritageSite findMany
 */
export type HeritageSiteFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HeritageSite
     */
    select?: Prisma.HeritageSiteSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the HeritageSite
     */
    omit?: Prisma.HeritageSiteOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.HeritageSiteInclude<ExtArgs> | null;
    /**
     * Filter, which HeritageSites to fetch.
     */
    where?: Prisma.HeritageSiteWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of HeritageSites to fetch.
     */
    orderBy?: Prisma.HeritageSiteOrderByWithRelationInput | Prisma.HeritageSiteOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing HeritageSites.
     */
    cursor?: Prisma.HeritageSiteWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` HeritageSites from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` HeritageSites.
     */
    skip?: number;
    distinct?: Prisma.HeritageSiteScalarFieldEnum | Prisma.HeritageSiteScalarFieldEnum[];
};
/**
 * HeritageSite create
 */
export type HeritageSiteCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HeritageSite
     */
    select?: Prisma.HeritageSiteSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the HeritageSite
     */
    omit?: Prisma.HeritageSiteOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.HeritageSiteInclude<ExtArgs> | null;
    /**
     * The data needed to create a HeritageSite.
     */
    data: Prisma.XOR<Prisma.HeritageSiteCreateInput, Prisma.HeritageSiteUncheckedCreateInput>;
};
/**
 * HeritageSite createMany
 */
export type HeritageSiteCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many HeritageSites.
     */
    data: Prisma.HeritageSiteCreateManyInput | Prisma.HeritageSiteCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * HeritageSite createManyAndReturn
 */
export type HeritageSiteCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HeritageSite
     */
    select?: Prisma.HeritageSiteSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the HeritageSite
     */
    omit?: Prisma.HeritageSiteOmit<ExtArgs> | null;
    /**
     * The data used to create many HeritageSites.
     */
    data: Prisma.HeritageSiteCreateManyInput | Prisma.HeritageSiteCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * HeritageSite update
 */
export type HeritageSiteUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HeritageSite
     */
    select?: Prisma.HeritageSiteSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the HeritageSite
     */
    omit?: Prisma.HeritageSiteOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.HeritageSiteInclude<ExtArgs> | null;
    /**
     * The data needed to update a HeritageSite.
     */
    data: Prisma.XOR<Prisma.HeritageSiteUpdateInput, Prisma.HeritageSiteUncheckedUpdateInput>;
    /**
     * Choose, which HeritageSite to update.
     */
    where: Prisma.HeritageSiteWhereUniqueInput;
};
/**
 * HeritageSite updateMany
 */
export type HeritageSiteUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update HeritageSites.
     */
    data: Prisma.XOR<Prisma.HeritageSiteUpdateManyMutationInput, Prisma.HeritageSiteUncheckedUpdateManyInput>;
    /**
     * Filter which HeritageSites to update
     */
    where?: Prisma.HeritageSiteWhereInput;
    /**
     * Limit how many HeritageSites to update.
     */
    limit?: number;
};
/**
 * HeritageSite updateManyAndReturn
 */
export type HeritageSiteUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HeritageSite
     */
    select?: Prisma.HeritageSiteSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the HeritageSite
     */
    omit?: Prisma.HeritageSiteOmit<ExtArgs> | null;
    /**
     * The data used to update HeritageSites.
     */
    data: Prisma.XOR<Prisma.HeritageSiteUpdateManyMutationInput, Prisma.HeritageSiteUncheckedUpdateManyInput>;
    /**
     * Filter which HeritageSites to update
     */
    where?: Prisma.HeritageSiteWhereInput;
    /**
     * Limit how many HeritageSites to update.
     */
    limit?: number;
};
/**
 * HeritageSite upsert
 */
export type HeritageSiteUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HeritageSite
     */
    select?: Prisma.HeritageSiteSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the HeritageSite
     */
    omit?: Prisma.HeritageSiteOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.HeritageSiteInclude<ExtArgs> | null;
    /**
     * The filter to search for the HeritageSite to update in case it exists.
     */
    where: Prisma.HeritageSiteWhereUniqueInput;
    /**
     * In case the HeritageSite found by the `where` argument doesn't exist, create a new HeritageSite with this data.
     */
    create: Prisma.XOR<Prisma.HeritageSiteCreateInput, Prisma.HeritageSiteUncheckedCreateInput>;
    /**
     * In case the HeritageSite was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.HeritageSiteUpdateInput, Prisma.HeritageSiteUncheckedUpdateInput>;
};
/**
 * HeritageSite delete
 */
export type HeritageSiteDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HeritageSite
     */
    select?: Prisma.HeritageSiteSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the HeritageSite
     */
    omit?: Prisma.HeritageSiteOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.HeritageSiteInclude<ExtArgs> | null;
    /**
     * Filter which HeritageSite to delete.
     */
    where: Prisma.HeritageSiteWhereUniqueInput;
};
/**
 * HeritageSite deleteMany
 */
export type HeritageSiteDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which HeritageSites to delete
     */
    where?: Prisma.HeritageSiteWhereInput;
    /**
     * Limit how many HeritageSites to delete.
     */
    limit?: number;
};
/**
 * HeritageSite.stories
 */
export type HeritageSite$storiesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Story
     */
    select?: Prisma.StorySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Story
     */
    omit?: Prisma.StoryOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.StoryInclude<ExtArgs> | null;
    where?: Prisma.StoryWhereInput;
    orderBy?: Prisma.StoryOrderByWithRelationInput | Prisma.StoryOrderByWithRelationInput[];
    cursor?: Prisma.StoryWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.StoryScalarFieldEnum | Prisma.StoryScalarFieldEnum[];
};
/**
 * HeritageSite.routes
 */
export type HeritageSite$routesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MapRoute
     */
    select?: Prisma.MapRouteSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MapRoute
     */
    omit?: Prisma.MapRouteOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MapRouteInclude<ExtArgs> | null;
    where?: Prisma.MapRouteWhereInput;
    orderBy?: Prisma.MapRouteOrderByWithRelationInput | Prisma.MapRouteOrderByWithRelationInput[];
    cursor?: Prisma.MapRouteWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MapRouteScalarFieldEnum | Prisma.MapRouteScalarFieldEnum[];
};
/**
 * HeritageSite.favorites
 */
export type HeritageSite$favoritesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    where?: Prisma.FavoriteSiteWhereInput;
    orderBy?: Prisma.FavoriteSiteOrderByWithRelationInput | Prisma.FavoriteSiteOrderByWithRelationInput[];
    cursor?: Prisma.FavoriteSiteWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.FavoriteSiteScalarFieldEnum | Prisma.FavoriteSiteScalarFieldEnum[];
};
/**
 * HeritageSite without action
 */
export type HeritageSiteDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HeritageSite
     */
    select?: Prisma.HeritageSiteSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the HeritageSite
     */
    omit?: Prisma.HeritageSiteOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.HeritageSiteInclude<ExtArgs> | null;
};
export {};
//# sourceMappingURL=HeritageSite.d.ts.map