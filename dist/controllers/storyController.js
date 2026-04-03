import prisma from "../models/index.js";
// Preview configuration - First 20% of content as free preview (min 50 chars)
const getPreviewLength = (content) => {
    if (!content)
        return 0;
    return Math.max(50, Math.floor(content.length * 0.2));
};
// Get all stories with preview (public - no auth required)
export const getStoriesPreview = async (req, res) => {
    try {
        const stories = await prisma.story.findMany({
            include: {
                site: {
                    select: {
                        site_id: true,
                        name: true,
                        gps_coordinates: true,
                        photo_url: true,
                    },
                },
            },
            orderBy: {
                story_id: "desc",
            },
        });
        // Get user id if authenticated to check purchased stories
        const userId = req.user?.userId;
        let purchasedStoryIds = [];
        if (userId) {
            const purchases = await prisma.storyPayment.findMany({
                where: { user_id: userId, status: "completed" },
                select: { story_id: true },
            });
            purchasedStoryIds = purchases.map((p) => p.story_id);
        }
        // Return preview version of stories (truncated content)
        const storiesWithPreview = stories.map((story) => {
            const previewLen = getPreviewLength(story.content);
            return {
                story_id: story.story_id,
                site_id: story.site_id,
                title: story.title,
                preview: story.content.length > previewLen
                    ? story.content.substring(0, previewLen) + "..."
                    : story.content,
                god_or_goddess_name: story.god_or_goddess_name,
                media_url: story.media_path || null,
                has_full_content: story.content.length > previewLen,
                is_unlocked: purchasedStoryIds.includes(story.story_id),
                site: story.site,
            };
        });
        return res.status(200).json({
            message: "Story previews retrieved successfully",
            count: storiesWithPreview.length,
            stories: storiesWithPreview,
        });
    }
    catch (error) {
        console.error("Error fetching story previews:", error);
        return res.status(500).json({
            message: "Error fetching story previews",
            error: error.message,
        });
    }
};
// Get single story preview by ID (public - no auth required)
export const getStoryPreviewById = async (req, res) => {
    const { story_id } = req.params;
    if (!story_id) {
        return res.status(400).json({ message: "Story ID is required" });
    }
    try {
        const story = await prisma.story.findUnique({
            where: { story_id: Number(story_id) },
            include: {
                site: {
                    select: {
                        site_id: true,
                        name: true,
                        description: true,
                        photo_url: true,
                        gps_coordinates: true,
                    },
                },
            },
        });
        if (!story) {
            return res.status(404).json({ message: "Story not found" });
        }
        // Return preview version of the story
        const previewLen = getPreviewLength(story.content);
        const storyPreview = {
            story_id: story.story_id,
            site_id: story.site_id,
            title: story.title,
            preview: story.content.length > previewLen
                ? story.content.substring(0, previewLen) + "..."
                : story.content,
            god_or_goddess_name: story.god_or_goddess_name,
            media_url: story.media_path || null,
            has_full_content: story.content.length > previewLen,
            site: story.site,
        };
        return res.status(200).json({
            message: "Story preview retrieved successfully",
            story: storyPreview,
        });
    }
    catch (error) {
        console.error("Error fetching story preview:", error);
        return res.status(500).json({
            message: "Error fetching story preview",
            error: error.message,
        });
    }
};
// Get stories by heritage site (public - no auth required)
export const getStoriesPreviewBySite = async (req, res) => {
    const { site_id } = req.params;
    if (!site_id) {
        return res.status(400).json({ message: "Site ID is required" });
    }
    try {
        // Verify site exists
        const site = await prisma.heritageSite.findUnique({
            where: { site_id: Number(site_id) },
        });
        if (!site) {
            return res.status(404).json({ message: "Heritage site not found" });
        }
        const stories = await prisma.story.findMany({
            where: { site_id: Number(site_id) },
            include: {
                site: {
                    select: {
                        site_id: true,
                        name: true,
                        gps_coordinates: true,
                        photo_url: true,
                    },
                },
            },
            orderBy: {
                story_id: "desc",
            },
        });
        // Return preview version of stories
        const storiesWithPreview = stories.map((story) => {
            const previewLen = getPreviewLength(story.content);
            return {
                story_id: story.story_id,
                site_id: story.site_id,
                title: story.title,
                preview: story.content.length > previewLen
                    ? story.content.substring(0, previewLen) + "..."
                    : story.content,
                god_or_goddess_name: story.god_or_goddess_name,
                media_url: story.media_path || null,
                has_full_content: story.content.length > previewLen,
                site: story.site,
            };
        });
        return res.status(200).json({
            message: "Story previews for site retrieved successfully",
            site_id: Number(site_id),
            site_name: site.name,
            count: storiesWithPreview.length,
            stories: storiesWithPreview,
        });
    }
    catch (error) {
        console.error("Error fetching story previews by site:", error);
        return res.status(500).json({
            message: "Error fetching story previews by site",
            error: error.message,
        });
    }
};
// Get full story (requires authentication - for purchased access)
// This would be used after user purchases full story access
export const getFullStory = async (req, res) => {
    const { story_id } = req.params;
    // Require authentication for full story access
    if (!req.user) {
        return res.status(401).json({
            message: "Authentication required to access full story. Please purchase access.",
        });
    }
    if (!story_id) {
        return res.status(400).json({ message: "Story ID is required" });
    }
    try {
        const story = await prisma.story.findUnique({
            where: { story_id: Number(story_id) },
            include: {
                site: true,
            },
        });
        if (!story) {
            return res.status(404).json({ message: "Story not found" });
        }
        // Check if user has purchased access to this story
        const hasAccess = await prisma.storyPayment.findFirst({
            where: {
                user_id: req.user.userId,
                story_id: Number(story_id),
                status: "completed",
            },
        });
        const previewLen = getPreviewLength(story.content);
        if (!hasAccess && story.content.length > previewLen) {
            return res.status(403).json({
                message: "You have not purchased access to this full story.",
            });
        }
        return res.status(200).json({
            message: "Full story retrieved successfully",
            story: {
                story_id: story.story_id,
                site_id: story.site_id,
                title: story.title,
                content: story.content, // Full content
                god_or_goddess_name: story.god_or_goddess_name,
                media_url: story.media_path || null,
                site: story.site,
            },
        });
    }
    catch (error) {
        console.error("Error fetching full story:", error);
        return res.status(500).json({
            message: "Error fetching full story",
            error: error.message,
        });
    }
};
//# sourceMappingURL=storyController.js.map