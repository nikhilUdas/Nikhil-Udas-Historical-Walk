import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model MapRoute
 *
 */
export type MapRouteModel = runtime.Types.Result.DefaultSelection<Prisma.$MapRoutePayload>;
export type AggregateMapRoute = {
    _count: MapRouteCountAggregateOutputType | null;
    _avg: MapRouteAvgAggregateOutputType | null;
    _sum: MapRouteSumAggregateOutputType | null;
    _min: MapRouteMinAggregateOutputType | null;
    _max: MapRouteMaxAggregateOutputType | null;
};
export type MapRouteAvgAggregateOutputType = {
    route_id: number | null;
    site_id: number | null;
};
export type MapRouteSumAggregateOutputType = {
    route_id: number | null;
    site_id: number | null;
};
export type MapRouteMinAggregateOutputType = {
    route_id: number | null;
    site_id: number | null;
    start_location: string | null;
    end_location: string | null;
    distance: string | null;
    estimated_time: string | null;
};
export type MapRouteMaxAggregateOutputType = {
    route_id: number | null;
    site_id: number | null;
    start_location: string | null;
    end_location: string | null;
    distance: string | null;
    estimated_time: string | null;
};
export type MapRouteCountAggregateOutputType = {
    route_id: number;
    site_id: number;
    start_location: number;
    end_location: number;
    distance: number;
    estimated_time: number;
    _all: number;
};
export type MapRouteAvgAggregateInputType = {
    route_id?: true;
    site_id?: true;
};
export type MapRouteSumAggregateInputType = {
    route_id?: true;
    site_id?: true;
};
export type MapRouteMinAggregateInputType = {
    route_id?: true;
    site_id?: true;
    start_location?: true;
    end_location?: true;
    distance?: true;
    estimated_time?: true;
};
export type MapRouteMaxAggregateInputType = {
    route_id?: true;
    site_id?: true;
    start_location?: true;
    end_location?: true;
    distance?: true;
    estimated_time?: true;
};
export type MapRouteCountAggregateInputType = {
    route_id?: true;
    site_id?: true;
    start_location?: true;
    end_location?: true;
    distance?: true;
    estimated_time?: true;
    _all?: true;
};
export type MapRouteAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which MapRoute to aggregate.
     */
    where?: Prisma.MapRouteWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of MapRoutes to fetch.
     */
    orderBy?: Prisma.MapRouteOrderByWithRelationInput | Prisma.MapRouteOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.MapRouteWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` MapRoutes from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` MapRoutes.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned MapRoutes
    **/
    _count?: true | MapRouteCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: MapRouteAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: MapRouteSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: MapRouteMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: MapRouteMaxAggregateInputType;
};
export type GetMapRouteAggregateType<T extends MapRouteAggregateArgs> = {
    [P in keyof T & keyof AggregateMapRoute]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateMapRoute[P]> : Prisma.GetScalarType<T[P], AggregateMapRoute[P]>;
};
export type MapRouteGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MapRouteWhereInput;
    orderBy?: Prisma.MapRouteOrderByWithAggregationInput | Prisma.MapRouteOrderByWithAggregationInput[];
    by: Prisma.MapRouteScalarFieldEnum[] | Prisma.MapRouteScalarFieldEnum;
    having?: Prisma.MapRouteScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: MapRouteCountAggregateInputType | true;
    _avg?: MapRouteAvgAggregateInputType;
    _sum?: MapRouteSumAggregateInputType;
    _min?: MapRouteMinAggregateInputType;
    _max?: MapRouteMaxAggregateInputType;
};
export type MapRouteGroupByOutputType = {
    route_id: number;
    site_id: number;
    start_location: string;
    end_location: string;
    distance: string;
    estimated_time: string;
    _count: MapRouteCountAggregateOutputType | null;
    _avg: MapRouteAvgAggregateOutputType | null;
    _sum: MapRouteSumAggregateOutputType | null;
    _min: MapRouteMinAggregateOutputType | null;
    _max: MapRouteMaxAggregateOutputType | null;
};
type GetMapRouteGroupByPayload<T extends MapRouteGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<MapRouteGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof MapRouteGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], MapRouteGroupByOutputType[P]> : Prisma.GetScalarType<T[P], MapRouteGroupByOutputType[P]>;
}>>;
export type MapRouteWhereInput = {
    AND?: Prisma.MapRouteWhereInput | Prisma.MapRouteWhereInput[];
    OR?: Prisma.MapRouteWhereInput[];
    NOT?: Prisma.MapRouteWhereInput | Prisma.MapRouteWhereInput[];
    route_id?: Prisma.IntFilter<"MapRoute"> | number;
    site_id?: Prisma.IntFilter<"MapRoute"> | number;
    start_location?: Prisma.StringFilter<"MapRoute"> | string;
    end_location?: Prisma.StringFilter<"MapRoute"> | string;
    distance?: Prisma.StringFilter<"MapRoute"> | string;
    estimated_time?: Prisma.StringFilter<"MapRoute"> | string;
    site?: Prisma.XOR<Prisma.HeritageSiteScalarRelationFilter, Prisma.HeritageSiteWhereInput>;
};
export type MapRouteOrderByWithRelationInput = {
    route_id?: Prisma.SortOrder;
    site_id?: Prisma.SortOrder;
    start_location?: Prisma.SortOrder;
    end_location?: Prisma.SortOrder;
    distance?: Prisma.SortOrder;
    estimated_time?: Prisma.SortOrder;
    site?: Prisma.HeritageSiteOrderByWithRelationInput;
};
export type MapRouteWhereUniqueInput = Prisma.AtLeast<{
    route_id?: number;
    AND?: Prisma.MapRouteWhereInput | Prisma.MapRouteWhereInput[];
    OR?: Prisma.MapRouteWhereInput[];
    NOT?: Prisma.MapRouteWhereInput | Prisma.MapRouteWhereInput[];
    site_id?: Prisma.IntFilter<"MapRoute"> | number;
    start_location?: Prisma.StringFilter<"MapRoute"> | string;
    end_location?: Prisma.StringFilter<"MapRoute"> | string;
    distance?: Prisma.StringFilter<"MapRoute"> | string;
    estimated_time?: Prisma.StringFilter<"MapRoute"> | string;
    site?: Prisma.XOR<Prisma.HeritageSiteScalarRelationFilter, Prisma.HeritageSiteWhereInput>;
}, "route_id">;
export type MapRouteOrderByWithAggregationInput = {
    route_id?: Prisma.SortOrder;
    site_id?: Prisma.SortOrder;
    start_location?: Prisma.SortOrder;
    end_location?: Prisma.SortOrder;
    distance?: Prisma.SortOrder;
    estimated_time?: Prisma.SortOrder;
    _count?: Prisma.MapRouteCountOrderByAggregateInput;
    _avg?: Prisma.MapRouteAvgOrderByAggregateInput;
    _max?: Prisma.MapRouteMaxOrderByAggregateInput;
    _min?: Prisma.MapRouteMinOrderByAggregateInput;
    _sum?: Prisma.MapRouteSumOrderByAggregateInput;
};
export type MapRouteScalarWhereWithAggregatesInput = {
    AND?: Prisma.MapRouteScalarWhereWithAggregatesInput | Prisma.MapRouteScalarWhereWithAggregatesInput[];
    OR?: Prisma.MapRouteScalarWhereWithAggregatesInput[];
    NOT?: Prisma.MapRouteScalarWhereWithAggregatesInput | Prisma.MapRouteScalarWhereWithAggregatesInput[];
    route_id?: Prisma.IntWithAggregatesFilter<"MapRoute"> | number;
    site_id?: Prisma.IntWithAggregatesFilter<"MapRoute"> | number;
    start_location?: Prisma.StringWithAggregatesFilter<"MapRoute"> | string;
    end_location?: Prisma.StringWithAggregatesFilter<"MapRoute"> | string;
    distance?: Prisma.StringWithAggregatesFilter<"MapRoute"> | string;
    estimated_time?: Prisma.StringWithAggregatesFilter<"MapRoute"> | string;
};
export type MapRouteCreateInput = {
    start_location: string;
    end_location: string;
    distance: string;
    estimated_time: string;
    site: Prisma.HeritageSiteCreateNestedOneWithoutRoutesInput;
};
export type MapRouteUncheckedCreateInput = {
    route_id?: number;
    site_id: number;
    start_location: string;
    end_location: string;
    distance: string;
    estimated_time: string;
};
export type MapRouteUpdateInput = {
    start_location?: Prisma.StringFieldUpdateOperationsInput | string;
    end_location?: Prisma.StringFieldUpdateOperationsInput | string;
    distance?: Prisma.StringFieldUpdateOperationsInput | string;
    estimated_time?: Prisma.StringFieldUpdateOperationsInput | string;
    site?: Prisma.HeritageSiteUpdateOneRequiredWithoutRoutesNestedInput;
};
export type MapRouteUncheckedUpdateInput = {
    route_id?: Prisma.IntFieldUpdateOperationsInput | number;
    site_id?: Prisma.IntFieldUpdateOperationsInput | number;
    start_location?: Prisma.StringFieldUpdateOperationsInput | string;
    end_location?: Prisma.StringFieldUpdateOperationsInput | string;
    distance?: Prisma.StringFieldUpdateOperationsInput | string;
    estimated_time?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type MapRouteCreateManyInput = {
    route_id?: number;
    site_id: number;
    start_location: string;
    end_location: string;
    distance: string;
    estimated_time: string;
};
export type MapRouteUpdateManyMutationInput = {
    start_location?: Prisma.StringFieldUpdateOperationsInput | string;
    end_location?: Prisma.StringFieldUpdateOperationsInput | string;
    distance?: Prisma.StringFieldUpdateOperationsInput | string;
    estimated_time?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type MapRouteUncheckedUpdateManyInput = {
    route_id?: Prisma.IntFieldUpdateOperationsInput | number;
    site_id?: Prisma.IntFieldUpdateOperationsInput | number;
    start_location?: Prisma.StringFieldUpdateOperationsInput | string;
    end_location?: Prisma.StringFieldUpdateOperationsInput | string;
    distance?: Prisma.StringFieldUpdateOperationsInput | string;
    estimated_time?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type MapRouteListRelationFilter = {
    every?: Prisma.MapRouteWhereInput;
    some?: Prisma.MapRouteWhereInput;
    none?: Prisma.MapRouteWhereInput;
};
export type MapRouteOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type MapRouteCountOrderByAggregateInput = {
    route_id?: Prisma.SortOrder;
    site_id?: Prisma.SortOrder;
    start_location?: Prisma.SortOrder;
    end_location?: Prisma.SortOrder;
    distance?: Prisma.SortOrder;
    estimated_time?: Prisma.SortOrder;
};
export type MapRouteAvgOrderByAggregateInput = {
    route_id?: Prisma.SortOrder;
    site_id?: Prisma.SortOrder;
};
export type MapRouteMaxOrderByAggregateInput = {
    route_id?: Prisma.SortOrder;
    site_id?: Prisma.SortOrder;
    start_location?: Prisma.SortOrder;
    end_location?: Prisma.SortOrder;
    distance?: Prisma.SortOrder;
    estimated_time?: Prisma.SortOrder;
};
export type MapRouteMinOrderByAggregateInput = {
    route_id?: Prisma.SortOrder;
    site_id?: Prisma.SortOrder;
    start_location?: Prisma.SortOrder;
    end_location?: Prisma.SortOrder;
    distance?: Prisma.SortOrder;
    estimated_time?: Prisma.SortOrder;
};
export type MapRouteSumOrderByAggregateInput = {
    route_id?: Prisma.SortOrder;
    site_id?: Prisma.SortOrder;
};
export type MapRouteCreateNestedManyWithoutSiteInput = {
    create?: Prisma.XOR<Prisma.MapRouteCreateWithoutSiteInput, Prisma.MapRouteUncheckedCreateWithoutSiteInput> | Prisma.MapRouteCreateWithoutSiteInput[] | Prisma.MapRouteUncheckedCreateWithoutSiteInput[];
    connectOrCreate?: Prisma.MapRouteCreateOrConnectWithoutSiteInput | Prisma.MapRouteCreateOrConnectWithoutSiteInput[];
    createMany?: Prisma.MapRouteCreateManySiteInputEnvelope;
    connect?: Prisma.MapRouteWhereUniqueInput | Prisma.MapRouteWhereUniqueInput[];
};
export type MapRouteUncheckedCreateNestedManyWithoutSiteInput = {
    create?: Prisma.XOR<Prisma.MapRouteCreateWithoutSiteInput, Prisma.MapRouteUncheckedCreateWithoutSiteInput> | Prisma.MapRouteCreateWithoutSiteInput[] | Prisma.MapRouteUncheckedCreateWithoutSiteInput[];
    connectOrCreate?: Prisma.MapRouteCreateOrConnectWithoutSiteInput | Prisma.MapRouteCreateOrConnectWithoutSiteInput[];
    createMany?: Prisma.MapRouteCreateManySiteInputEnvelope;
    connect?: Prisma.MapRouteWhereUniqueInput | Prisma.MapRouteWhereUniqueInput[];
};
export type MapRouteUpdateManyWithoutSiteNestedInput = {
    create?: Prisma.XOR<Prisma.MapRouteCreateWithoutSiteInput, Prisma.MapRouteUncheckedCreateWithoutSiteInput> | Prisma.MapRouteCreateWithoutSiteInput[] | Prisma.MapRouteUncheckedCreateWithoutSiteInput[];
    connectOrCreate?: Prisma.MapRouteCreateOrConnectWithoutSiteInput | Prisma.MapRouteCreateOrConnectWithoutSiteInput[];
    upsert?: Prisma.MapRouteUpsertWithWhereUniqueWithoutSiteInput | Prisma.MapRouteUpsertWithWhereUniqueWithoutSiteInput[];
    createMany?: Prisma.MapRouteCreateManySiteInputEnvelope;
    set?: Prisma.MapRouteWhereUniqueInput | Prisma.MapRouteWhereUniqueInput[];
    disconnect?: Prisma.MapRouteWhereUniqueInput | Prisma.MapRouteWhereUniqueInput[];
    delete?: Prisma.MapRouteWhereUniqueInput | Prisma.MapRouteWhereUniqueInput[];
    connect?: Prisma.MapRouteWhereUniqueInput | Prisma.MapRouteWhereUniqueInput[];
    update?: Prisma.MapRouteUpdateWithWhereUniqueWithoutSiteInput | Prisma.MapRouteUpdateWithWhereUniqueWithoutSiteInput[];
    updateMany?: Prisma.MapRouteUpdateManyWithWhereWithoutSiteInput | Prisma.MapRouteUpdateManyWithWhereWithoutSiteInput[];
    deleteMany?: Prisma.MapRouteScalarWhereInput | Prisma.MapRouteScalarWhereInput[];
};
export type MapRouteUncheckedUpdateManyWithoutSiteNestedInput = {
    create?: Prisma.XOR<Prisma.MapRouteCreateWithoutSiteInput, Prisma.MapRouteUncheckedCreateWithoutSiteInput> | Prisma.MapRouteCreateWithoutSiteInput[] | Prisma.MapRouteUncheckedCreateWithoutSiteInput[];
    connectOrCreate?: Prisma.MapRouteCreateOrConnectWithoutSiteInput | Prisma.MapRouteCreateOrConnectWithoutSiteInput[];
    upsert?: Prisma.MapRouteUpsertWithWhereUniqueWithoutSiteInput | Prisma.MapRouteUpsertWithWhereUniqueWithoutSiteInput[];
    createMany?: Prisma.MapRouteCreateManySiteInputEnvelope;
    set?: Prisma.MapRouteWhereUniqueInput | Prisma.MapRouteWhereUniqueInput[];
    disconnect?: Prisma.MapRouteWhereUniqueInput | Prisma.MapRouteWhereUniqueInput[];
    delete?: Prisma.MapRouteWhereUniqueInput | Prisma.MapRouteWhereUniqueInput[];
    connect?: Prisma.MapRouteWhereUniqueInput | Prisma.MapRouteWhereUniqueInput[];
    update?: Prisma.MapRouteUpdateWithWhereUniqueWithoutSiteInput | Prisma.MapRouteUpdateWithWhereUniqueWithoutSiteInput[];
    updateMany?: Prisma.MapRouteUpdateManyWithWhereWithoutSiteInput | Prisma.MapRouteUpdateManyWithWhereWithoutSiteInput[];
    deleteMany?: Prisma.MapRouteScalarWhereInput | Prisma.MapRouteScalarWhereInput[];
};
export type MapRouteCreateWithoutSiteInput = {
    start_location: string;
    end_location: string;
    distance: string;
    estimated_time: string;
};
export type MapRouteUncheckedCreateWithoutSiteInput = {
    route_id?: number;
    start_location: string;
    end_location: string;
    distance: string;
    estimated_time: string;
};
export type MapRouteCreateOrConnectWithoutSiteInput = {
    where: Prisma.MapRouteWhereUniqueInput;
    create: Prisma.XOR<Prisma.MapRouteCreateWithoutSiteInput, Prisma.MapRouteUncheckedCreateWithoutSiteInput>;
};
export type MapRouteCreateManySiteInputEnvelope = {
    data: Prisma.MapRouteCreateManySiteInput | Prisma.MapRouteCreateManySiteInput[];
    skipDuplicates?: boolean;
};
export type MapRouteUpsertWithWhereUniqueWithoutSiteInput = {
    where: Prisma.MapRouteWhereUniqueInput;
    update: Prisma.XOR<Prisma.MapRouteUpdateWithoutSiteInput, Prisma.MapRouteUncheckedUpdateWithoutSiteInput>;
    create: Prisma.XOR<Prisma.MapRouteCreateWithoutSiteInput, Prisma.MapRouteUncheckedCreateWithoutSiteInput>;
};
export type MapRouteUpdateWithWhereUniqueWithoutSiteInput = {
    where: Prisma.MapRouteWhereUniqueInput;
    data: Prisma.XOR<Prisma.MapRouteUpdateWithoutSiteInput, Prisma.MapRouteUncheckedUpdateWithoutSiteInput>;
};
export type MapRouteUpdateManyWithWhereWithoutSiteInput = {
    where: Prisma.MapRouteScalarWhereInput;
    data: Prisma.XOR<Prisma.MapRouteUpdateManyMutationInput, Prisma.MapRouteUncheckedUpdateManyWithoutSiteInput>;
};
export type MapRouteScalarWhereInput = {
    AND?: Prisma.MapRouteScalarWhereInput | Prisma.MapRouteScalarWhereInput[];
    OR?: Prisma.MapRouteScalarWhereInput[];
    NOT?: Prisma.MapRouteScalarWhereInput | Prisma.MapRouteScalarWhereInput[];
    route_id?: Prisma.IntFilter<"MapRoute"> | number;
    site_id?: Prisma.IntFilter<"MapRoute"> | number;
    start_location?: Prisma.StringFilter<"MapRoute"> | string;
    end_location?: Prisma.StringFilter<"MapRoute"> | string;
    distance?: Prisma.StringFilter<"MapRoute"> | string;
    estimated_time?: Prisma.StringFilter<"MapRoute"> | string;
};
export type MapRouteCreateManySiteInput = {
    route_id?: number;
    start_location: string;
    end_location: string;
    distance: string;
    estimated_time: string;
};
export type MapRouteUpdateWithoutSiteInput = {
    start_location?: Prisma.StringFieldUpdateOperationsInput | string;
    end_location?: Prisma.StringFieldUpdateOperationsInput | string;
    distance?: Prisma.StringFieldUpdateOperationsInput | string;
    estimated_time?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type MapRouteUncheckedUpdateWithoutSiteInput = {
    route_id?: Prisma.IntFieldUpdateOperationsInput | number;
    start_location?: Prisma.StringFieldUpdateOperationsInput | string;
    end_location?: Prisma.StringFieldUpdateOperationsInput | string;
    distance?: Prisma.StringFieldUpdateOperationsInput | string;
    estimated_time?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type MapRouteUncheckedUpdateManyWithoutSiteInput = {
    route_id?: Prisma.IntFieldUpdateOperationsInput | number;
    start_location?: Prisma.StringFieldUpdateOperationsInput | string;
    end_location?: Prisma.StringFieldUpdateOperationsInput | string;
    distance?: Prisma.StringFieldUpdateOperationsInput | string;
    estimated_time?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type MapRouteSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    route_id?: boolean;
    site_id?: boolean;
    start_location?: boolean;
    end_location?: boolean;
    distance?: boolean;
    estimated_time?: boolean;
    site?: boolean | Prisma.HeritageSiteDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["mapRoute"]>;
export type MapRouteSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    route_id?: boolean;
    site_id?: boolean;
    start_location?: boolean;
    end_location?: boolean;
    distance?: boolean;
    estimated_time?: boolean;
    site?: boolean | Prisma.HeritageSiteDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["mapRoute"]>;
export type MapRouteSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    route_id?: boolean;
    site_id?: boolean;
    start_location?: boolean;
    end_location?: boolean;
    distance?: boolean;
    estimated_time?: boolean;
    site?: boolean | Prisma.HeritageSiteDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["mapRoute"]>;
export type MapRouteSelectScalar = {
    route_id?: boolean;
    site_id?: boolean;
    start_location?: boolean;
    end_location?: boolean;
    distance?: boolean;
    estimated_time?: boolean;
};
export type MapRouteOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"route_id" | "site_id" | "start_location" | "end_location" | "distance" | "estimated_time", ExtArgs["result"]["mapRoute"]>;
export type MapRouteInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    site?: boolean | Prisma.HeritageSiteDefaultArgs<ExtArgs>;
};
export type MapRouteIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    site?: boolean | Prisma.HeritageSiteDefaultArgs<ExtArgs>;
};
export type MapRouteIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    site?: boolean | Prisma.HeritageSiteDefaultArgs<ExtArgs>;
};
export type $MapRoutePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "MapRoute";
    objects: {
        site: Prisma.$HeritageSitePayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        route_id: number;
        site_id: number;
        start_location: string;
        end_location: string;
        distance: string;
        estimated_time: string;
    }, ExtArgs["result"]["mapRoute"]>;
    composites: {};
};
export type MapRouteGetPayload<S extends boolean | null | undefined | MapRouteDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$MapRoutePayload, S>;
export type MapRouteCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<MapRouteFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: MapRouteCountAggregateInputType | true;
};
export interface MapRouteDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['MapRoute'];
        meta: {
            name: 'MapRoute';
        };
    };
    /**
     * Find zero or one MapRoute that matches the filter.
     * @param {MapRouteFindUniqueArgs} args - Arguments to find a MapRoute
     * @example
     * // Get one MapRoute
     * const mapRoute = await prisma.mapRoute.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MapRouteFindUniqueArgs>(args: Prisma.SelectSubset<T, MapRouteFindUniqueArgs<ExtArgs>>): Prisma.Prisma__MapRouteClient<runtime.Types.Result.GetResult<Prisma.$MapRoutePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one MapRoute that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MapRouteFindUniqueOrThrowArgs} args - Arguments to find a MapRoute
     * @example
     * // Get one MapRoute
     * const mapRoute = await prisma.mapRoute.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MapRouteFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, MapRouteFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__MapRouteClient<runtime.Types.Result.GetResult<Prisma.$MapRoutePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first MapRoute that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MapRouteFindFirstArgs} args - Arguments to find a MapRoute
     * @example
     * // Get one MapRoute
     * const mapRoute = await prisma.mapRoute.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MapRouteFindFirstArgs>(args?: Prisma.SelectSubset<T, MapRouteFindFirstArgs<ExtArgs>>): Prisma.Prisma__MapRouteClient<runtime.Types.Result.GetResult<Prisma.$MapRoutePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first MapRoute that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MapRouteFindFirstOrThrowArgs} args - Arguments to find a MapRoute
     * @example
     * // Get one MapRoute
     * const mapRoute = await prisma.mapRoute.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MapRouteFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, MapRouteFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__MapRouteClient<runtime.Types.Result.GetResult<Prisma.$MapRoutePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more MapRoutes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MapRouteFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MapRoutes
     * const mapRoutes = await prisma.mapRoute.findMany()
     *
     * // Get first 10 MapRoutes
     * const mapRoutes = await prisma.mapRoute.findMany({ take: 10 })
     *
     * // Only select the `route_id`
     * const mapRouteWithRoute_idOnly = await prisma.mapRoute.findMany({ select: { route_id: true } })
     *
     */
    findMany<T extends MapRouteFindManyArgs>(args?: Prisma.SelectSubset<T, MapRouteFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MapRoutePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a MapRoute.
     * @param {MapRouteCreateArgs} args - Arguments to create a MapRoute.
     * @example
     * // Create one MapRoute
     * const MapRoute = await prisma.mapRoute.create({
     *   data: {
     *     // ... data to create a MapRoute
     *   }
     * })
     *
     */
    create<T extends MapRouteCreateArgs>(args: Prisma.SelectSubset<T, MapRouteCreateArgs<ExtArgs>>): Prisma.Prisma__MapRouteClient<runtime.Types.Result.GetResult<Prisma.$MapRoutePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many MapRoutes.
     * @param {MapRouteCreateManyArgs} args - Arguments to create many MapRoutes.
     * @example
     * // Create many MapRoutes
     * const mapRoute = await prisma.mapRoute.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends MapRouteCreateManyArgs>(args?: Prisma.SelectSubset<T, MapRouteCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many MapRoutes and returns the data saved in the database.
     * @param {MapRouteCreateManyAndReturnArgs} args - Arguments to create many MapRoutes.
     * @example
     * // Create many MapRoutes
     * const mapRoute = await prisma.mapRoute.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many MapRoutes and only return the `route_id`
     * const mapRouteWithRoute_idOnly = await prisma.mapRoute.createManyAndReturn({
     *   select: { route_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends MapRouteCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, MapRouteCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MapRoutePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a MapRoute.
     * @param {MapRouteDeleteArgs} args - Arguments to delete one MapRoute.
     * @example
     * // Delete one MapRoute
     * const MapRoute = await prisma.mapRoute.delete({
     *   where: {
     *     // ... filter to delete one MapRoute
     *   }
     * })
     *
     */
    delete<T extends MapRouteDeleteArgs>(args: Prisma.SelectSubset<T, MapRouteDeleteArgs<ExtArgs>>): Prisma.Prisma__MapRouteClient<runtime.Types.Result.GetResult<Prisma.$MapRoutePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one MapRoute.
     * @param {MapRouteUpdateArgs} args - Arguments to update one MapRoute.
     * @example
     * // Update one MapRoute
     * const mapRoute = await prisma.mapRoute.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends MapRouteUpdateArgs>(args: Prisma.SelectSubset<T, MapRouteUpdateArgs<ExtArgs>>): Prisma.Prisma__MapRouteClient<runtime.Types.Result.GetResult<Prisma.$MapRoutePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more MapRoutes.
     * @param {MapRouteDeleteManyArgs} args - Arguments to filter MapRoutes to delete.
     * @example
     * // Delete a few MapRoutes
     * const { count } = await prisma.mapRoute.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends MapRouteDeleteManyArgs>(args?: Prisma.SelectSubset<T, MapRouteDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more MapRoutes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MapRouteUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MapRoutes
     * const mapRoute = await prisma.mapRoute.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends MapRouteUpdateManyArgs>(args: Prisma.SelectSubset<T, MapRouteUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more MapRoutes and returns the data updated in the database.
     * @param {MapRouteUpdateManyAndReturnArgs} args - Arguments to update many MapRoutes.
     * @example
     * // Update many MapRoutes
     * const mapRoute = await prisma.mapRoute.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more MapRoutes and only return the `route_id`
     * const mapRouteWithRoute_idOnly = await prisma.mapRoute.updateManyAndReturn({
     *   select: { route_id: true },
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
    updateManyAndReturn<T extends MapRouteUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, MapRouteUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MapRoutePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one MapRoute.
     * @param {MapRouteUpsertArgs} args - Arguments to update or create a MapRoute.
     * @example
     * // Update or create a MapRoute
     * const mapRoute = await prisma.mapRoute.upsert({
     *   create: {
     *     // ... data to create a MapRoute
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MapRoute we want to update
     *   }
     * })
     */
    upsert<T extends MapRouteUpsertArgs>(args: Prisma.SelectSubset<T, MapRouteUpsertArgs<ExtArgs>>): Prisma.Prisma__MapRouteClient<runtime.Types.Result.GetResult<Prisma.$MapRoutePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of MapRoutes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MapRouteCountArgs} args - Arguments to filter MapRoutes to count.
     * @example
     * // Count the number of MapRoutes
     * const count = await prisma.mapRoute.count({
     *   where: {
     *     // ... the filter for the MapRoutes we want to count
     *   }
     * })
    **/
    count<T extends MapRouteCountArgs>(args?: Prisma.Subset<T, MapRouteCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], MapRouteCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a MapRoute.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MapRouteAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends MapRouteAggregateArgs>(args: Prisma.Subset<T, MapRouteAggregateArgs>): Prisma.PrismaPromise<GetMapRouteAggregateType<T>>;
    /**
     * Group by MapRoute.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MapRouteGroupByArgs} args - Group by arguments.
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
    groupBy<T extends MapRouteGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: MapRouteGroupByArgs['orderBy'];
    } : {
        orderBy?: MapRouteGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, MapRouteGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMapRouteGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the MapRoute model
     */
    readonly fields: MapRouteFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for MapRoute.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__MapRouteClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
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
 * Fields of the MapRoute model
 */
export interface MapRouteFieldRefs {
    readonly route_id: Prisma.FieldRef<"MapRoute", 'Int'>;
    readonly site_id: Prisma.FieldRef<"MapRoute", 'Int'>;
    readonly start_location: Prisma.FieldRef<"MapRoute", 'String'>;
    readonly end_location: Prisma.FieldRef<"MapRoute", 'String'>;
    readonly distance: Prisma.FieldRef<"MapRoute", 'String'>;
    readonly estimated_time: Prisma.FieldRef<"MapRoute", 'String'>;
}
/**
 * MapRoute findUnique
 */
export type MapRouteFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which MapRoute to fetch.
     */
    where: Prisma.MapRouteWhereUniqueInput;
};
/**
 * MapRoute findUniqueOrThrow
 */
export type MapRouteFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which MapRoute to fetch.
     */
    where: Prisma.MapRouteWhereUniqueInput;
};
/**
 * MapRoute findFirst
 */
export type MapRouteFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which MapRoute to fetch.
     */
    where?: Prisma.MapRouteWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of MapRoutes to fetch.
     */
    orderBy?: Prisma.MapRouteOrderByWithRelationInput | Prisma.MapRouteOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for MapRoutes.
     */
    cursor?: Prisma.MapRouteWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` MapRoutes from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` MapRoutes.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of MapRoutes.
     */
    distinct?: Prisma.MapRouteScalarFieldEnum | Prisma.MapRouteScalarFieldEnum[];
};
/**
 * MapRoute findFirstOrThrow
 */
export type MapRouteFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which MapRoute to fetch.
     */
    where?: Prisma.MapRouteWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of MapRoutes to fetch.
     */
    orderBy?: Prisma.MapRouteOrderByWithRelationInput | Prisma.MapRouteOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for MapRoutes.
     */
    cursor?: Prisma.MapRouteWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` MapRoutes from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` MapRoutes.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of MapRoutes.
     */
    distinct?: Prisma.MapRouteScalarFieldEnum | Prisma.MapRouteScalarFieldEnum[];
};
/**
 * MapRoute findMany
 */
export type MapRouteFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which MapRoutes to fetch.
     */
    where?: Prisma.MapRouteWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of MapRoutes to fetch.
     */
    orderBy?: Prisma.MapRouteOrderByWithRelationInput | Prisma.MapRouteOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing MapRoutes.
     */
    cursor?: Prisma.MapRouteWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` MapRoutes from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` MapRoutes.
     */
    skip?: number;
    distinct?: Prisma.MapRouteScalarFieldEnum | Prisma.MapRouteScalarFieldEnum[];
};
/**
 * MapRoute create
 */
export type MapRouteCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to create a MapRoute.
     */
    data: Prisma.XOR<Prisma.MapRouteCreateInput, Prisma.MapRouteUncheckedCreateInput>;
};
/**
 * MapRoute createMany
 */
export type MapRouteCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many MapRoutes.
     */
    data: Prisma.MapRouteCreateManyInput | Prisma.MapRouteCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * MapRoute createManyAndReturn
 */
export type MapRouteCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MapRoute
     */
    select?: Prisma.MapRouteSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the MapRoute
     */
    omit?: Prisma.MapRouteOmit<ExtArgs> | null;
    /**
     * The data used to create many MapRoutes.
     */
    data: Prisma.MapRouteCreateManyInput | Prisma.MapRouteCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MapRouteIncludeCreateManyAndReturn<ExtArgs> | null;
};
/**
 * MapRoute update
 */
export type MapRouteUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to update a MapRoute.
     */
    data: Prisma.XOR<Prisma.MapRouteUpdateInput, Prisma.MapRouteUncheckedUpdateInput>;
    /**
     * Choose, which MapRoute to update.
     */
    where: Prisma.MapRouteWhereUniqueInput;
};
/**
 * MapRoute updateMany
 */
export type MapRouteUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update MapRoutes.
     */
    data: Prisma.XOR<Prisma.MapRouteUpdateManyMutationInput, Prisma.MapRouteUncheckedUpdateManyInput>;
    /**
     * Filter which MapRoutes to update
     */
    where?: Prisma.MapRouteWhereInput;
    /**
     * Limit how many MapRoutes to update.
     */
    limit?: number;
};
/**
 * MapRoute updateManyAndReturn
 */
export type MapRouteUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MapRoute
     */
    select?: Prisma.MapRouteSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the MapRoute
     */
    omit?: Prisma.MapRouteOmit<ExtArgs> | null;
    /**
     * The data used to update MapRoutes.
     */
    data: Prisma.XOR<Prisma.MapRouteUpdateManyMutationInput, Prisma.MapRouteUncheckedUpdateManyInput>;
    /**
     * Filter which MapRoutes to update
     */
    where?: Prisma.MapRouteWhereInput;
    /**
     * Limit how many MapRoutes to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MapRouteIncludeUpdateManyAndReturn<ExtArgs> | null;
};
/**
 * MapRoute upsert
 */
export type MapRouteUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The filter to search for the MapRoute to update in case it exists.
     */
    where: Prisma.MapRouteWhereUniqueInput;
    /**
     * In case the MapRoute found by the `where` argument doesn't exist, create a new MapRoute with this data.
     */
    create: Prisma.XOR<Prisma.MapRouteCreateInput, Prisma.MapRouteUncheckedCreateInput>;
    /**
     * In case the MapRoute was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.MapRouteUpdateInput, Prisma.MapRouteUncheckedUpdateInput>;
};
/**
 * MapRoute delete
 */
export type MapRouteDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter which MapRoute to delete.
     */
    where: Prisma.MapRouteWhereUniqueInput;
};
/**
 * MapRoute deleteMany
 */
export type MapRouteDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which MapRoutes to delete
     */
    where?: Prisma.MapRouteWhereInput;
    /**
     * Limit how many MapRoutes to delete.
     */
    limit?: number;
};
/**
 * MapRoute without action
 */
export type MapRouteDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
};
export {};
//# sourceMappingURL=MapRoute.d.ts.map