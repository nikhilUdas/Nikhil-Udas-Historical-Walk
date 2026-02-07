import prisma from '../models/index.js';
// Preview configuration - first 200 characters of content as free preview
const PREVIEW_LENGTH = 200;
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
                story_id: 'desc',
            },
        });
        // Return preview version of stories (truncated content)
        const storiesWithPreview = stories.map((story) => ({
            story_id: story.story_id,
            site_id: story.site_id,
            title: story.title,
            preview: story.content.length > PREVIEW_LENGTH
                ? story.content.substring(0, PREVIEW_LENGTH) + '...'
                : story.content,
            god_or_goddess_name: story.god_or_goddess_name,
            media_url: story.media_url,
            has_full_content: story.content.length > PREVIEW_LENGTH,
            site: story.site,
        }));
        return res.status(200).json({
            message: 'Story previews retrieved successfully',
            count: storiesWithPreview.length,
            stories: storiesWithPreview,
        });
    }
    catch (error) {
        console.error('Error fetching story previews:', error);
        return res.status(500).json({
            message: 'Error fetching story previews',
            error: error.message,
        });
    }
};
// Get single story preview by ID (public - no auth required)
export const getStoryPreviewById = async (req, res) => {
    const { story_id } = req.params;
    if (!story_id) {
        return res.status(400).json({ message: 'Story ID is required' });
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
            return res.status(404).json({ message: 'Story not found' });
        }
        // Return preview version of the story
        const storyPreview = {
            story_id: story.story_id,
            site_id: story.site_id,
            title: story.title,
            preview: story.content.length > PREVIEW_LENGTH
                ? story.content.substring(0, PREVIEW_LENGTH) + '...'
                : story.content,
            god_or_goddess_name: story.god_or_goddess_name,
            media_url: story.media_url,
            has_full_content: story.content.length > PREVIEW_LENGTH,
            site: story.site,
        };
        return res.status(200).json({
            message: 'Story preview retrieved successfully',
            story: storyPreview,
        });
    }
    catch (error) {
        console.error('Error fetching story preview:', error);
        return res.status(500).json({
            message: 'Error fetching story preview',
            error: error.message,
        });
    }
};
// Get stories by heritage site (public - no auth required)
export const getStoriesPreviewBySite = async (req, res) => {
    const { site_id } = req.params;
    if (!site_id) {
        return res.status(400).json({ message: 'Site ID is required' });
    }
    try {
        // Verify site exists
        const site = await prisma.heritageSite.findUnique({
            where: { site_id: Number(site_id) },
        });
        if (!site) {
            return res.status(404).json({ message: 'Heritage site not found' });
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
                story_id: 'desc',
            },
        });
        // Return preview version of stories
        const storiesWithPreview = stories.map((story) => ({
            story_id: story.story_id,
            site_id: story.site_id,
            title: story.title,
            preview: story.content.length > PREVIEW_LENGTH
                ? story.content.substring(0, PREVIEW_LENGTH) + '...'
                : story.content,
            god_or_goddess_name: story.god_or_goddess_name,
            media_url: story.media_url,
            has_full_content: story.content.length > PREVIEW_LENGTH,
            site: story.site,
        }));
        return res.status(200).json({
            message: 'Story previews for site retrieved successfully',
            site_id: Number(site_id),
            site_name: site.name,
            count: storiesWithPreview.length,
            stories: storiesWithPreview,
        });
    }
    catch (error) {
        console.error('Error fetching story previews by site:', error);
        return res.status(500).json({
            message: 'Error fetching story previews by site',
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
            message: 'Authentication required to access full story. Please purchase access.'
        });
    }
    if (!story_id) {
        return res.status(400).json({ message: 'Story ID is required' });
    }
    try {
        const story = await prisma.story.findUnique({
            where: { story_id: Number(story_id) },
            include: {
                site: true,
            },
        });
        if (!story) {
            return res.status(404).json({ message: 'Story not found' });
        }
        // TODO: Add logic to verify user has purchased access to this story
        // For now, authenticated users can access full content
        // You can add a Purchase/Payment verification here
        return res.status(200).json({
            message: 'Full story retrieved successfully',
            story: {
                story_id: story.story_id,
                site_id: story.site_id,
                title: story.title,
                content: story.content, // Full content
                god_or_goddess_name: story.god_or_goddess_name,
                media_url: story.media_url,
                site: story.site,
            },
        });
    }
    catch (error) {
        console.error('Error fetching full story:', error);
        return res.status(500).json({
            message: 'Error fetching full story',
            error: error.message,
        });
    }
};
//# sourceMappingURL=storyController.js.map