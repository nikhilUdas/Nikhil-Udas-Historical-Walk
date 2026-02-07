import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model Museum
 *
 */
export type MuseumModel = runtime.Types.Result.DefaultSelection<Prisma.$MuseumPayload>;
export type AggregateMuseum = {
    _count: MuseumCountAggregateOutputType | null;
    _avg: MuseumAvgAggregateOutputType | null;
    _sum: MuseumSumAggregateOutputType | null;
    _min: MuseumMinAggregateOutputType | null;
    _max: MuseumMaxAggregateOutputType | null;
};
export type MuseumAvgAggregateOutputType = {
    museum_id: number | null;
};
export type MuseumSumAggregateOutputType = {
    museum_id: number | null;
};
export type MuseumMinAggregateOutputType = {
    museum_id: number | null;
    name: string | null;
    description: string | null;
    opening_hours: string | null;
    gps_coordinates: string | null;
    image_data: string | null;
};
export type MuseumMaxAggregateOutputType = {
    museum_id: number | null;
    name: string | null;
    description: string | null;
    opening_hours: string | null;
    gps_coordinates: string | null;
    image_data: string | null;
};
export type MuseumCountAggregateOutputType = {
    museum_id: number;
    name: number;
    description: number;
    opening_hours: number;
    gps_coordinates: number;
    image_data: number;
    _all: number;
};
export type MuseumAvgAggregateInputType = {
    museum_id?: true;
};
export type MuseumSumAggregateInputType = {
    museum_id?: true;
};
export type MuseumMinAggregateInputType = {
    museum_id?: true;
    name?: true;
    description?: true;
    opening_hours?: true;
    gps_coordinates?: true;
    image_data?: true;
};
export type MuseumMaxAggregateInputType = {
    museum_id?: true;
    name?: true;
    description?: true;
    opening_hours?: true;
    gps_coordinates?: true;
    image_data?: true;
};
export type MuseumCountAggregateInputType = {
    museum_id?: true;
    name?: true;
    description?: true;
    opening_hours?: true;
    gps_coordinates?: true;
    image_data?: true;
    _all?: true;
};
export type MuseumAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which Museum to aggregate.
     */
    where?: Prisma.MuseumWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Museums to fetch.
     */
    orderBy?: Prisma.MuseumOrderByWithRelationInput | Prisma.MuseumOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.MuseumWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Museums from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Museums.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Museums
    **/
    _count?: true | MuseumCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: MuseumAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: MuseumSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: MuseumMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: MuseumMaxAggregateInputType;
};
export type GetMuseumAggregateType<T extends MuseumAggregateArgs> = {
    [P in keyof T & keyof AggregateMuseum]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateMuseum[P]> : Prisma.GetScalarType<T[P], AggregateMuseum[P]>;
};
export type MuseumGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MuseumWhereInput;
    orderBy?: Prisma.MuseumOrderByWithAggregationInput | Prisma.MuseumOrderByWithAggregationInput[];
    by: Prisma.MuseumScalarFieldEnum[] | Prisma.MuseumScalarFieldEnum;
    having?: Prisma.MuseumScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: MuseumCountAggregateInputType | true;
    _avg?: MuseumAvgAggregateInputType;
    _sum?: MuseumSumAggregateInputType;
    _min?: MuseumMinAggregateInputType;
    _max?: MuseumMaxAggregateInputType;
};
export type MuseumGroupByOutputType = {
    museum_id: number;
    name: string;
    description: string;
    opening_hours: string;
    gps_coordinates: string;
    image_data: string | null;
    _count: MuseumCountAggregateOutputType | null;
    _avg: MuseumAvgAggregateOutputType | null;
    _sum: MuseumSumAggregateOutputType | null;
    _min: MuseumMinAggregateOutputType | null;
    _max: MuseumMaxAggregateOutputType | null;
};
type GetMuseumGroupByPayload<T extends MuseumGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<MuseumGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof MuseumGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], MuseumGroupByOutputType[P]> : Prisma.GetScalarType<T[P], MuseumGroupByOutputType[P]>;
}>>;
export type MuseumWhereInput = {
    AND?: Prisma.MuseumWhereInput | Prisma.MuseumWhereInput[];
    OR?: Prisma.MuseumWhereInput[];
    NOT?: Prisma.MuseumWhereInput | Prisma.MuseumWhereInput[];
    museum_id?: Prisma.IntFilter<"Museum"> | number;
    name?: Prisma.StringFilter<"Museum"> | string;
    description?: Prisma.StringFilter<"Museum"> | string;
    opening_hours?: Prisma.StringFilter<"Museum"> | string;
    gps_coordinates?: Prisma.StringFilter<"Museum"> | string;
    image_data?: Prisma.StringNullableFilter<"Museum"> | string | null;
    tickets?: Prisma.TicketListRelationFilter;
    reviews?: Prisma.ReviewListRelationFilter;
};
export type MuseumOrderByWithRelationInput = {
    museum_id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    opening_hours?: Prisma.SortOrder;
    gps_coordinates?: Prisma.SortOrder;
    image_data?: Prisma.SortOrderInput | Prisma.SortOrder;
    tickets?: Prisma.TicketOrderByRelationAggregateInput;
    reviews?: Prisma.ReviewOrderByRelationAggregateInput;
};
export type MuseumWhereUniqueInput = Prisma.AtLeast<{
    museum_id?: number;
    AND?: Prisma.MuseumWhereInput | Prisma.MuseumWhereInput[];
    OR?: Prisma.MuseumWhereInput[];
    NOT?: Prisma.MuseumWhereInput | Prisma.MuseumWhereInput[];
    name?: Prisma.StringFilter<"Museum"> | string;
    description?: Prisma.StringFilter<"Museum"> | string;
    opening_hours?: Prisma.StringFilter<"Museum"> | string;
    gps_coordinates?: Prisma.StringFilter<"Museum"> | string;
    image_data?: Prisma.StringNullableFilter<"Museum"> | string | null;
    tickets?: Prisma.TicketListRelationFilter;
    reviews?: Prisma.ReviewListRelationFilter;
}, "museum_id">;
export type MuseumOrderByWithAggregationInput = {
    museum_id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    opening_hours?: Prisma.SortOrder;
    gps_coordinates?: Prisma.SortOrder;
    image_data?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.MuseumCountOrderByAggregateInput;
    _avg?: Prisma.MuseumAvgOrderByAggregateInput;
    _max?: Prisma.MuseumMaxOrderByAggregateInput;
    _min?: Prisma.MuseumMinOrderByAggregateInput;
    _sum?: Prisma.MuseumSumOrderByAggregateInput;
};
export type MuseumScalarWhereWithAggregatesInput = {
    AND?: Prisma.MuseumScalarWhereWithAggregatesInput | Prisma.MuseumScalarWhereWithAggregatesInput[];
    OR?: Prisma.MuseumScalarWhereWithAggregatesInput[];
    NOT?: Prisma.MuseumScalarWhereWithAggregatesInput | Prisma.MuseumScalarWhereWithAggregatesInput[];
    museum_id?: Prisma.IntWithAggregatesFilter<"Museum"> | number;
    name?: Prisma.StringWithAggregatesFilter<"Museum"> | string;
    description?: Prisma.StringWithAggregatesFilter<"Museum"> | string;
    opening_hours?: Prisma.StringWithAggregatesFilter<"Museum"> | string;
    gps_coordinates?: Prisma.StringWithAggregatesFilter<"Museum"> | string;
    image_data?: Prisma.StringNullableWithAggregatesFilter<"Museum"> | string | null;
};
export type MuseumCreateInput = {
    name: string;
    description: string;
    opening_hours: string;
    gps_coordinates: string;
    image_data?: string | null;
    tickets?: Prisma.TicketCreateNestedManyWithoutMuseumInput;
    reviews?: Prisma.ReviewCreateNestedManyWithoutMuseumInput;
};
export type MuseumUncheckedCreateInput = {
    museum_id?: number;
    name: string;
    description: string;
    opening_hours: string;
    gps_coordinates: string;
    image_data?: string | null;
    tickets?: Prisma.TicketUncheckedCreateNestedManyWithoutMuseumInput;
    reviews?: Prisma.ReviewUncheckedCreateNestedManyWithoutMuseumInput;
};
export type MuseumUpdateInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    opening_hours?: Prisma.StringFieldUpdateOperationsInput | string;
    gps_coordinates?: Prisma.StringFieldUpdateOperationsInput | string;
    image_data?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    tickets?: Prisma.TicketUpdateManyWithoutMuseumNestedInput;
    reviews?: Prisma.ReviewUpdateManyWithoutMuseumNestedInput;
};
export type MuseumUncheckedUpdateInput = {
    museum_id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    opening_hours?: Prisma.StringFieldUpdateOperationsInput | string;
    gps_coordinates?: Prisma.StringFieldUpdateOperationsInput | string;
    image_data?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    tickets?: Prisma.TicketUncheckedUpdateManyWithoutMuseumNestedInput;
    reviews?: Prisma.ReviewUncheckedUpdateManyWithoutMuseumNestedInput;
};
export type MuseumCreateManyInput = {
    museum_id?: number;
    name: string;
    description: string;
    opening_hours: string;
    gps_coordinates: string;
    image_data?: string | null;
};
export type MuseumUpdateManyMutationInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    opening_hours?: Prisma.StringFieldUpdateOperationsInput | string;
    gps_coordinates?: Prisma.StringFieldUpdateOperationsInput | string;
    image_data?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type MuseumUncheckedUpdateManyInput = {
    museum_id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    opening_hours?: Prisma.StringFieldUpdateOperationsInput | string;
    gps_coordinates?: Prisma.StringFieldUpdateOperationsInput | string;
    image_data?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type MuseumCountOrderByAggregateInput = {
    museum_id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    opening_hours?: Prisma.SortOrder;
    gps_coordinates?: Prisma.SortOrder;
    image_data?: Prisma.SortOrder;
};
export type MuseumAvgOrderByAggregateInput = {
    museum_id?: Prisma.SortOrder;
};
export type MuseumMaxOrderByAggregateInput = {
    museum_id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    opening_hours?: Prisma.SortOrder;
    gps_coordinates?: Prisma.SortOrder;
    image_data?: Prisma.SortOrder;
};
export type MuseumMinOrderByAggregateInput = {
    museum_id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    opening_hours?: Prisma.SortOrder;
    gps_coordinates?: Prisma.SortOrder;
    image_data?: Prisma.SortOrder;
};
export type MuseumSumOrderByAggregateInput = {
    museum_id?: Prisma.SortOrder;
};
export type MuseumScalarRelationFilter = {
    is?: Prisma.MuseumWhereInput;
    isNot?: Prisma.MuseumWhereInput;
};
export type MuseumCreateNestedOneWithoutTicketsInput = {
    create?: Prisma.XOR<Prisma.MuseumCreateWithoutTicketsInput, Prisma.MuseumUncheckedCreateWithoutTicketsInput>;
    connectOrCreate?: Prisma.MuseumCreateOrConnectWithoutTicketsInput;
    connect?: Prisma.MuseumWhereUniqueInput;
};
export type MuseumUpdateOneRequiredWithoutTicketsNestedInput = {
    create?: Prisma.XOR<Prisma.MuseumCreateWithoutTicketsInput, Prisma.MuseumUncheckedCreateWithoutTicketsInput>;
    connectOrCreate?: Prisma.MuseumCreateOrConnectWithoutTicketsInput;
    upsert?: Prisma.MuseumUpsertWithoutTicketsInput;
    connect?: Prisma.MuseumWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.MuseumUpdateToOneWithWhereWithoutTicketsInput, Prisma.MuseumUpdateWithoutTicketsInput>, Prisma.MuseumUncheckedUpdateWithoutTicketsInput>;
};
export type MuseumCreateNestedOneWithoutReviewsInput = {
    create?: Prisma.XOR<Prisma.MuseumCreateWithoutReviewsInput, Prisma.MuseumUncheckedCreateWithoutReviewsInput>;
    connectOrCreate?: Prisma.MuseumCreateOrConnectWithoutReviewsInput;
    connect?: Prisma.MuseumWhereUniqueInput;
};
export type MuseumUpdateOneRequiredWithoutReviewsNestedInput = {
    create?: Prisma.XOR<Prisma.MuseumCreateWithoutReviewsInput, Prisma.MuseumUncheckedCreateWithoutReviewsInput>;
    connectOrCreate?: Prisma.MuseumCreateOrConnectWithoutReviewsInput;
    upsert?: Prisma.MuseumUpsertWithoutReviewsInput;
    connect?: Prisma.MuseumWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.MuseumUpdateToOneWithWhereWithoutReviewsInput, Prisma.MuseumUpdateWithoutReviewsInput>, Prisma.MuseumUncheckedUpdateWithoutReviewsInput>;
};
export type MuseumCreateWithoutTicketsInput = {
    name: string;
    description: string;
    opening_hours: string;
    gps_coordinates: string;
    image_data?: string | null;
    reviews?: Prisma.ReviewCreateNestedManyWithoutMuseumInput;
};
export type MuseumUncheckedCreateWithoutTicketsInput = {
    museum_id?: number;
    name: string;
    description: string;
    opening_hours: string;
    gps_coordinates: string;
    image_data?: string | null;
    reviews?: Prisma.ReviewUncheckedCreateNestedManyWithoutMuseumInput;
};
export type MuseumCreateOrConnectWithoutTicketsInput = {
    where: Prisma.MuseumWhereUniqueInput;
    create: Prisma.XOR<Prisma.MuseumCreateWithoutTicketsInput, Prisma.MuseumUncheckedCreateWithoutTicketsInput>;
};
export type MuseumUpsertWithoutTicketsInput = {
    update: Prisma.XOR<Prisma.MuseumUpdateWithoutTicketsInput, Prisma.MuseumUncheckedUpdateWithoutTicketsInput>;
    create: Prisma.XOR<Prisma.MuseumCreateWithoutTicketsInput, Prisma.MuseumUncheckedCreateWithoutTicketsInput>;
    where?: Prisma.MuseumWhereInput;
};
export type MuseumUpdateToOneWithWhereWithoutTicketsInput = {
    where?: Prisma.MuseumWhereInput;
    data: Prisma.XOR<Prisma.MuseumUpdateWithoutTicketsInput, Prisma.MuseumUncheckedUpdateWithoutTicketsInput>;
};
export type MuseumUpdateWithoutTicketsInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    opening_hours?: Prisma.StringFieldUpdateOperationsInput | string;
    gps_coordinates?: Prisma.StringFieldUpdateOperationsInput | string;
    image_data?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reviews?: Prisma.ReviewUpdateManyWithoutMuseumNestedInput;
};
export type MuseumUncheckedUpdateWithoutTicketsInput = {
    museum_id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    opening_hours?: Prisma.StringFieldUpdateOperationsInput | string;
    gps_coordinates?: Prisma.StringFieldUpdateOperationsInput | string;
    image_data?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reviews?: Prisma.ReviewUncheckedUpdateManyWithoutMuseumNestedInput;
};
export type MuseumCreateWithoutReviewsInput = {
    name: string;
    description: string;
    opening_hours: string;
    gps_coordinates: string;
    image_data?: string | null;
    tickets?: Prisma.TicketCreateNestedManyWithoutMuseumInput;
};
export type MuseumUncheckedCreateWithoutReviewsInput = {
    museum_id?: number;
    name: string;
    description: string;
    opening_hours: string;
    gps_coordinates: string;
    image_data?: string | null;
    tickets?: Prisma.TicketUncheckedCreateNestedManyWithoutMuseumInput;
};
export type MuseumCreateOrConnectWithoutReviewsInput = {
    where: Prisma.MuseumWhereUniqueInput;
    create: Prisma.XOR<Prisma.MuseumCreateWithoutReviewsInput, Prisma.MuseumUncheckedCreateWithoutReviewsInput>;
};
export type MuseumUpsertWithoutReviewsInput = {
    update: Prisma.XOR<Prisma.MuseumUpdateWithoutReviewsInput, Prisma.MuseumUncheckedUpdateWithoutReviewsInput>;
    create: Prisma.XOR<Prisma.MuseumCreateWithoutReviewsInput, Prisma.MuseumUncheckedCreateWithoutReviewsInput>;
    where?: Prisma.MuseumWhereInput;
};
export type MuseumUpdateToOneWithWhereWithoutReviewsInput = {
    where?: Prisma.MuseumWhereInput;
    data: Prisma.XOR<Prisma.MuseumUpdateWithoutReviewsInput, Prisma.MuseumUncheckedUpdateWithoutReviewsInput>;
};
export type MuseumUpdateWithoutReviewsInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    opening_hours?: Prisma.StringFieldUpdateOperationsInput | string;
    gps_coordinates?: Prisma.StringFieldUpdateOperationsInput | string;
    image_data?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    tickets?: Prisma.TicketUpdateManyWithoutMuseumNestedInput;
};
export type MuseumUncheckedUpdateWithoutReviewsInput = {
    museum_id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    opening_hours?: Prisma.StringFieldUpdateOperationsInput | string;
    gps_coordinates?: Prisma.StringFieldUpdateOperationsInput | string;
    image_data?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    tickets?: Prisma.TicketUncheckedUpdateManyWithoutMuseumNestedInput;
};
/**
 * Count Type MuseumCountOutputType
 */
export type MuseumCountOutputType = {
    tickets: number;
    reviews: number;
};
export type MuseumCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    tickets?: boolean | MuseumCountOutputTypeCountTicketsArgs;
    reviews?: boolean | MuseumCountOutputTypeCountReviewsArgs;
};
/**
 * MuseumCountOutputType without action
 */
export type MuseumCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MuseumCountOutputType
     */
    select?: Prisma.MuseumCountOutputTypeSelect<ExtArgs> | null;
};
/**
 * MuseumCountOutputType without action
 */
export type MuseumCountOutputTypeCountTicketsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TicketWhereInput;
};
/**
 * MuseumCountOutputType without action
 */
export type MuseumCountOutputTypeCountReviewsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ReviewWhereInput;
};
export type MuseumSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    museum_id?: boolean;
    name?: boolean;
    description?: boolean;
    opening_hours?: boolean;
    gps_coordinates?: boolean;
    image_data?: boolean;
    tickets?: boolean | Prisma.Museum$ticketsArgs<ExtArgs>;
    reviews?: boolean | Prisma.Museum$reviewsArgs<ExtArgs>;
    _count?: boolean | Prisma.MuseumCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["museum"]>;
export type MuseumSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    museum_id?: boolean;
    name?: boolean;
    description?: boolean;
    opening_hours?: boolean;
    gps_coordinates?: boolean;
    image_data?: boolean;
}, ExtArgs["result"]["museum"]>;
export type MuseumSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    museum_id?: boolean;
    name?: boolean;
    description?: boolean;
    opening_hours?: boolean;
    gps_coordinates?: boolean;
    image_data?: boolean;
}, ExtArgs["result"]["museum"]>;
export type MuseumSelectScalar = {
    museum_id?: boolean;
    name?: boolean;
    description?: boolean;
    opening_hours?: boolean;
    gps_coordinates?: boolean;
    image_data?: boolean;
};
export type MuseumOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"museum_id" | "name" | "description" | "opening_hours" | "gps_coordinates" | "image_data", ExtArgs["result"]["museum"]>;
export type MuseumInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    tickets?: boolean | Prisma.Museum$ticketsArgs<ExtArgs>;
    reviews?: boolean | Prisma.Museum$reviewsArgs<ExtArgs>;
    _count?: boolean | Prisma.MuseumCountOutputTypeDefaultArgs<ExtArgs>;
};
export type MuseumIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type MuseumIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $MuseumPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Museum";
    objects: {
        tickets: Prisma.$TicketPayload<ExtArgs>[];
        reviews: Prisma.$ReviewPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        museum_id: number;
        name: string;
        description: string;
        opening_hours: string;
        gps_coordinates: string;
        image_data: string | null;
    }, ExtArgs["result"]["museum"]>;
    composites: {};
};
export type MuseumGetPayload<S extends boolean | null | undefined | MuseumDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$MuseumPayload, S>;
export type MuseumCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<MuseumFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: MuseumCountAggregateInputType | true;
};
export interface MuseumDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Museum'];
        meta: {
            name: 'Museum';
        };
    };
    /**
     * Find zero or one Museum that matches the filter.
     * @param {MuseumFindUniqueArgs} args - Arguments to find a Museum
     * @example
     * // Get one Museum
     * const museum = await prisma.museum.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MuseumFindUniqueArgs>(args: Prisma.SelectSubset<T, MuseumFindUniqueArgs<ExtArgs>>): Prisma.Prisma__MuseumClient<runtime.Types.Result.GetResult<Prisma.$MuseumPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one Museum that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MuseumFindUniqueOrThrowArgs} args - Arguments to find a Museum
     * @example
     * // Get one Museum
     * const museum = await prisma.museum.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MuseumFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, MuseumFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__MuseumClient<runtime.Types.Result.GetResult<Prisma.$MuseumPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Museum that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MuseumFindFirstArgs} args - Arguments to find a Museum
     * @example
     * // Get one Museum
     * const museum = await prisma.museum.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MuseumFindFirstArgs>(args?: Prisma.SelectSubset<T, MuseumFindFirstArgs<ExtArgs>>): Prisma.Prisma__MuseumClient<runtime.Types.Result.GetResult<Prisma.$MuseumPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Museum that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MuseumFindFirstOrThrowArgs} args - Arguments to find a Museum
     * @example
     * // Get one Museum
     * const museum = await prisma.museum.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MuseumFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, MuseumFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__MuseumClient<runtime.Types.Result.GetResult<Prisma.$MuseumPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more Museums that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MuseumFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Museums
     * const museums = await prisma.museum.findMany()
     *
     * // Get first 10 Museums
     * const museums = await prisma.museum.findMany({ take: 10 })
     *
     * // Only select the `museum_id`
     * const museumWithMuseum_idOnly = await prisma.museum.findMany({ select: { museum_id: true } })
     *
     */
    findMany<T extends MuseumFindManyArgs>(args?: Prisma.SelectSubset<T, MuseumFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MuseumPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a Museum.
     * @param {MuseumCreateArgs} args - Arguments to create a Museum.
     * @example
     * // Create one Museum
     * const Museum = await prisma.museum.create({
     *   data: {
     *     // ... data to create a Museum
     *   }
     * })
     *
     */
    create<T extends MuseumCreateArgs>(args: Prisma.SelectSubset<T, MuseumCreateArgs<ExtArgs>>): Prisma.Prisma__MuseumClient<runtime.Types.Result.GetResult<Prisma.$MuseumPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many Museums.
     * @param {MuseumCreateManyArgs} args - Arguments to create many Museums.
     * @example
     * // Create many Museums
     * const museum = await prisma.museum.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends MuseumCreateManyArgs>(args?: Prisma.SelectSubset<T, MuseumCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many Museums and returns the data saved in the database.
     * @param {MuseumCreateManyAndReturnArgs} args - Arguments to create many Museums.
     * @example
     * // Create many Museums
     * const museum = await prisma.museum.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Museums and only return the `museum_id`
     * const museumWithMuseum_idOnly = await prisma.museum.createManyAndReturn({
     *   select: { museum_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends MuseumCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, MuseumCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MuseumPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a Museum.
     * @param {MuseumDeleteArgs} args - Arguments to delete one Museum.
     * @example
     * // Delete one Museum
     * const Museum = await prisma.museum.delete({
     *   where: {
     *     // ... filter to delete one Museum
     *   }
     * })
     *
     */
    delete<T extends MuseumDeleteArgs>(args: Prisma.SelectSubset<T, MuseumDeleteArgs<ExtArgs>>): Prisma.Prisma__MuseumClient<runtime.Types.Result.GetResult<Prisma.$MuseumPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one Museum.
     * @param {MuseumUpdateArgs} args - Arguments to update one Museum.
     * @example
     * // Update one Museum
     * const museum = await prisma.museum.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends MuseumUpdateArgs>(args: Prisma.SelectSubset<T, MuseumUpdateArgs<ExtArgs>>): Prisma.Prisma__MuseumClient<runtime.Types.Result.GetResult<Prisma.$MuseumPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more Museums.
     * @param {MuseumDeleteManyArgs} args - Arguments to filter Museums to delete.
     * @example
     * // Delete a few Museums
     * const { count } = await prisma.museum.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends MuseumDeleteManyArgs>(args?: Prisma.SelectSubset<T, MuseumDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Museums.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MuseumUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Museums
     * const museum = await prisma.museum.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends MuseumUpdateManyArgs>(args: Prisma.SelectSubset<T, MuseumUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Museums and returns the data updated in the database.
     * @param {MuseumUpdateManyAndReturnArgs} args - Arguments to update many Museums.
     * @example
     * // Update many Museums
     * const museum = await prisma.museum.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Museums and only return the `museum_id`
     * const museumWithMuseum_idOnly = await prisma.museum.updateManyAndReturn({
     *   select: { museum_id: true },
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
    updateManyAndReturn<T extends MuseumUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, MuseumUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MuseumPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one Museum.
     * @param {MuseumUpsertArgs} args - Arguments to update or create a Museum.
     * @example
     * // Update or create a Museum
     * const museum = await prisma.museum.upsert({
     *   create: {
     *     // ... data to create a Museum
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Museum we want to update
     *   }
     * })
     */
    upsert<T extends MuseumUpsertArgs>(args: Prisma.SelectSubset<T, MuseumUpsertArgs<ExtArgs>>): Prisma.Prisma__MuseumClient<runtime.Types.Result.GetResult<Prisma.$MuseumPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of Museums.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MuseumCountArgs} args - Arguments to filter Museums to count.
     * @example
     * // Count the number of Museums
     * const count = await prisma.museum.count({
     *   where: {
     *     // ... the filter for the Museums we want to count
     *   }
     * })
    **/
    count<T extends MuseumCountArgs>(args?: Prisma.Subset<T, MuseumCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], MuseumCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a Museum.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MuseumAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends MuseumAggregateArgs>(args: Prisma.Subset<T, MuseumAggregateArgs>): Prisma.PrismaPromise<GetMuseumAggregateType<T>>;
    /**
     * Group by Museum.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MuseumGroupByArgs} args - Group by arguments.
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
    groupBy<T extends MuseumGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: MuseumGroupByArgs['orderBy'];
    } : {
        orderBy?: MuseumGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, MuseumGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMuseumGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Museum model
     */
    readonly fields: MuseumFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for Museum.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__MuseumClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    tickets<T extends Prisma.Museum$ticketsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Museum$ticketsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    reviews<T extends Prisma.Museum$reviewsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Museum$reviewsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ReviewPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
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
 * Fields of the Museum model
 */
export interface MuseumFieldRefs {
    readonly museum_id: Prisma.FieldRef<"Museum", 'Int'>;
    readonly name: Prisma.FieldRef<"Museum", 'String'>;
    readonly description: Prisma.FieldRef<"Museum", 'String'>;
    readonly opening_hours: Prisma.FieldRef<"Museum", 'String'>;
    readonly gps_coordinates: Prisma.FieldRef<"Museum", 'String'>;
    readonly image_data: Prisma.FieldRef<"Museum", 'String'>;
}
/**
 * Museum findUnique
 */
export type MuseumFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Museum
     */
    select?: Prisma.MuseumSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Museum
     */
    omit?: Prisma.MuseumOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MuseumInclude<ExtArgs> | null;
    /**
     * Filter, which Museum to fetch.
     */
    where: Prisma.MuseumWhereUniqueInput;
};
/**
 * Museum findUniqueOrThrow
 */
export type MuseumFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Museum
     */
    select?: Prisma.MuseumSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Museum
     */
    omit?: Prisma.MuseumOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MuseumInclude<ExtArgs> | null;
    /**
     * Filter, which Museum to fetch.
     */
    where: Prisma.MuseumWhereUniqueInput;
};
/**
 * Museum findFirst
 */
export type MuseumFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Museum
     */
    select?: Prisma.MuseumSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Museum
     */
    omit?: Prisma.MuseumOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MuseumInclude<ExtArgs> | null;
    /**
     * Filter, which Museum to fetch.
     */
    where?: Prisma.MuseumWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Museums to fetch.
     */
    orderBy?: Prisma.MuseumOrderByWithRelationInput | Prisma.MuseumOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Museums.
     */
    cursor?: Prisma.MuseumWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Museums from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Museums.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Museums.
     */
    distinct?: Prisma.MuseumScalarFieldEnum | Prisma.MuseumScalarFieldEnum[];
};
/**
 * Museum findFirstOrThrow
 */
export type MuseumFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Museum
     */
    select?: Prisma.MuseumSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Museum
     */
    omit?: Prisma.MuseumOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MuseumInclude<ExtArgs> | null;
    /**
     * Filter, which Museum to fetch.
     */
    where?: Prisma.MuseumWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Museums to fetch.
     */
    orderBy?: Prisma.MuseumOrderByWithRelationInput | Prisma.MuseumOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Museums.
     */
    cursor?: Prisma.MuseumWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Museums from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Museums.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Museums.
     */
    distinct?: Prisma.MuseumScalarFieldEnum | Prisma.MuseumScalarFieldEnum[];
};
/**
 * Museum findMany
 */
export type MuseumFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Museum
     */
    select?: Prisma.MuseumSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Museum
     */
    omit?: Prisma.MuseumOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MuseumInclude<ExtArgs> | null;
    /**
     * Filter, which Museums to fetch.
     */
    where?: Prisma.MuseumWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Museums to fetch.
     */
    orderBy?: Prisma.MuseumOrderByWithRelationInput | Prisma.MuseumOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Museums.
     */
    cursor?: Prisma.MuseumWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Museums from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Museums.
     */
    skip?: number;
    distinct?: Prisma.MuseumScalarFieldEnum | Prisma.MuseumScalarFieldEnum[];
};
/**
 * Museum create
 */
export type MuseumCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Museum
     */
    select?: Prisma.MuseumSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Museum
     */
    omit?: Prisma.MuseumOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MuseumInclude<ExtArgs> | null;
    /**
     * The data needed to create a Museum.
     */
    data: Prisma.XOR<Prisma.MuseumCreateInput, Prisma.MuseumUncheckedCreateInput>;
};
/**
 * Museum createMany
 */
export type MuseumCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many Museums.
     */
    data: Prisma.MuseumCreateManyInput | Prisma.MuseumCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * Museum createManyAndReturn
 */
export type MuseumCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Museum
     */
    select?: Prisma.MuseumSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Museum
     */
    omit?: Prisma.MuseumOmit<ExtArgs> | null;
    /**
     * The data used to create many Museums.
     */
    data: Prisma.MuseumCreateManyInput | Prisma.MuseumCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * Museum update
 */
export type MuseumUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Museum
     */
    select?: Prisma.MuseumSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Museum
     */
    omit?: Prisma.MuseumOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MuseumInclude<ExtArgs> | null;
    /**
     * The data needed to update a Museum.
     */
    data: Prisma.XOR<Prisma.MuseumUpdateInput, Prisma.MuseumUncheckedUpdateInput>;
    /**
     * Choose, which Museum to update.
     */
    where: Prisma.MuseumWhereUniqueInput;
};
/**
 * Museum updateMany
 */
export type MuseumUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update Museums.
     */
    data: Prisma.XOR<Prisma.MuseumUpdateManyMutationInput, Prisma.MuseumUncheckedUpdateManyInput>;
    /**
     * Filter which Museums to update
     */
    where?: Prisma.MuseumWhereInput;
    /**
     * Limit how many Museums to update.
     */
    limit?: number;
};
/**
 * Museum updateManyAndReturn
 */
export type MuseumUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Museum
     */
    select?: Prisma.MuseumSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Museum
     */
    omit?: Prisma.MuseumOmit<ExtArgs> | null;
    /**
     * The data used to update Museums.
     */
    data: Prisma.XOR<Prisma.MuseumUpdateManyMutationInput, Prisma.MuseumUncheckedUpdateManyInput>;
    /**
     * Filter which Museums to update
     */
    where?: Prisma.MuseumWhereInput;
    /**
     * Limit how many Museums to update.
     */
    limit?: number;
};
/**
 * Museum upsert
 */
export type MuseumUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Museum
     */
    select?: Prisma.MuseumSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Museum
     */
    omit?: Prisma.MuseumOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MuseumInclude<ExtArgs> | null;
    /**
     * The filter to search for the Museum to update in case it exists.
     */
    where: Prisma.MuseumWhereUniqueInput;
    /**
     * In case the Museum found by the `where` argument doesn't exist, create a new Museum with this data.
     */
    create: Prisma.XOR<Prisma.MuseumCreateInput, Prisma.MuseumUncheckedCreateInput>;
    /**
     * In case the Museum was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.MuseumUpdateInput, Prisma.MuseumUncheckedUpdateInput>;
};
/**
 * Museum delete
 */
export type MuseumDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Museum
     */
    select?: Prisma.MuseumSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Museum
     */
    omit?: Prisma.MuseumOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MuseumInclude<ExtArgs> | null;
    /**
     * Filter which Museum to delete.
     */
    where: Prisma.MuseumWhereUniqueInput;
};
/**
 * Museum deleteMany
 */
export type MuseumDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which Museums to delete
     */
    where?: Prisma.MuseumWhereInput;
    /**
     * Limit how many Museums to delete.
     */
    limit?: number;
};
/**
 * Museum.tickets
 */
export type Museum$ticketsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: Prisma.TicketSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Ticket
     */
    omit?: Prisma.TicketOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.TicketInclude<ExtArgs> | null;
    where?: Prisma.TicketWhereInput;
    orderBy?: Prisma.TicketOrderByWithRelationInput | Prisma.TicketOrderByWithRelationInput[];
    cursor?: Prisma.TicketWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TicketScalarFieldEnum | Prisma.TicketScalarFieldEnum[];
};
/**
 * Museum.reviews
 */
export type Museum$reviewsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Review
     */
    select?: Prisma.ReviewSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Review
     */
    omit?: Prisma.ReviewOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ReviewInclude<ExtArgs> | null;
    where?: Prisma.ReviewWhereInput;
    orderBy?: Prisma.ReviewOrderByWithRelationInput | Prisma.ReviewOrderByWithRelationInput[];
    cursor?: Prisma.ReviewWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ReviewScalarFieldEnum | Prisma.ReviewScalarFieldEnum[];
};
/**
 * Museum without action
 */
export type MuseumDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Museum
     */
    select?: Prisma.MuseumSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Museum
     */
    omit?: Prisma.MuseumOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MuseumInclude<ExtArgs> | null;
};
export {};
//# sourceMappingURL=Museum.d.ts.map