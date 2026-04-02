import prisma from '../models/index.js';
import '../middleware/auth.js';
import { broadcastNotificationToAll } from '../services/socketService.js';
import { toStoredPath } from '../utils/fileUpload.js';
// US-8: Add a new story
export const addStory = async (req, res) => {
    const { site_id, title, content, god_or_goddess_name } = req.body;
    const file = req.file;
    // Verify user is admin
    if (req.user?.type !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: Only admins can add stories' });
    }
    // Validate required fields
    if (!site_id || !title || !content || !god_or_goddess_name || !file) {
        return res.status(400).json({
            message: 'Missing required fields: site_id, title, content, god_or_goddess_name, and media file are required'
        });
    }
    try {
        // Verify that the heritage site exists
        const site = await prisma.heritageSite.findUnique({
            where: { site_id: Number(site_id) },
        });
        if (!site) {
            return res.status(404).json({ message: 'Heritage site not found' });
        }
        // Create the story
        const story = await prisma.story.create({
            data: {
                site_id: Number(site_id),
                title,
                content,
                god_or_goddess_name,
                media_data: toStoredPath(file.path),
            },
            include: {
                site: true,
            },
        });
        // Broadcast notification to all users about new story
        const notification = {
            type: 'story_added',
            title: 'New Story Added',
            message: `A new story "${title}" has been added to ${site.name}. Learn about ${god_or_goddess_name}!`,
            related_id: site_id,
        };
        await broadcastNotificationToAll(notification);
        return res.status(201).json({
            message: 'Story added successfully',
            story: {
                ...story,
                media_url: story.media_data,
            },
        });
    }
    catch (error) {
        console.error('Error adding story:', error);
        return res.status(500).json({
            message: 'Error adding story',
            error: error.message
        });
    }
};
// US-9: Edit/Update an existing story
export const updateStory = async (req, res) => {
    const { story_id } = req.params;
    const { site_id, title, content, god_or_goddess_name } = req.body;
    const file = req.file;
    // Verify user is admin
    if (req.user?.type !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: Only admins can edit stories' });
    }
    if (!story_id) {
        return res.status(400).json({ message: 'Story ID is required' });
    }
    try {
        // Check if story exists
        const existingStory = await prisma.story.findUnique({
            where: { story_id: Number(story_id) },
        });
        if (!existingStory) {
            return res.status(404).json({ message: 'Story not found' });
        }
        // Build update data object with only provided fields
        const updateData = {};
        if (site_id !== undefined) {
            // Verify that the heritage site exists
            const site = await prisma.heritageSite.findUnique({
                where: { site_id: Number(site_id) },
            });
            if (!site) {
                return res.status(404).json({ message: 'Heritage site not found' });
            }
            updateData.site_id = Number(site_id);
        }
        if (title !== undefined)
            updateData.title = title;
        if (content !== undefined)
            updateData.content = content;
        if (god_or_goddess_name !== undefined)
            updateData.god_or_goddess_name = god_or_goddess_name;
        if (file)
            updateData.media_data = toStoredPath(file.path);
        // Check if there's anything to update
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: 'No fields to update' });
        }
        // Update the story
        const updatedStory = await prisma.story.update({
            where: { story_id: Number(story_id) },
            data: updateData,
            include: {
                site: true,
            },
        });
        return res.status(200).json({
            message: 'Story updated successfully',
            story: {
                ...updatedStory,
                media_url: updatedStory.media_data || null,
            },
        });
    }
    catch (error) {
        console.error('Error updating story:', error);
        return res.status(500).json({
            message: 'Error updating story',
            error: error.message
        });
    }
};
// US-10: Delete a story
export const deleteStory = async (req, res) => {
    const { story_id } = req.params;
    // Verify user is admin
    if (req.user?.type !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: Only admins can delete stories' });
    }
    if (!story_id) {
        return res.status(400).json({ message: 'Story ID is required' });
    }
    try {
        // Check if story exists
        const existingStory = await prisma.story.findUnique({
            where: { story_id: Number(story_id) },
        });
        if (!existingStory) {
            return res.status(404).json({ message: 'Story not found' });
        }
        // Delete the story
        await prisma.story.delete({
            where: { story_id: Number(story_id) },
        });
        return res.status(200).json({
            message: 'Story deleted successfully',
            deletedStoryId: Number(story_id),
        });
    }
    catch (error) {
        console.error('Error deleting story:', error);
        return res.status(500).json({
            message: 'Error deleting story',
            error: error.message
        });
    }
};
// Additional helper function: Get all stories (useful for admin to view)
export const getAllStories = async (req, res) => {
    try {
        const stories = await prisma.story.findMany({
            include: {
                site: true,
            },
            orderBy: {
                story_id: 'desc',
            },
        });
        return res.status(200).json({
            message: 'Stories retrieved successfully',
            count: stories.length,
            stories: stories.map(s => ({
                ...s,
                media_url: s.media_data || null,
            })),
        });
    }
    catch (error) {
        console.error('Error fetching stories:', error);
        return res.status(500).json({
            message: 'Error fetching stories',
            error: error.message
        });
    }
};
// Get a single story by ID
export const getStoryById = async (req, res) => {
    const { story_id } = req.params;
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
        return res.status(200).json({
            message: 'Story retrieved successfully',
            story: {
                ...story,
                media_url: story.media_data || null,
            },
        });
    }
    catch (error) {
        console.error('Error fetching story:', error);
        return res.status(500).json({
            message: 'Error fetching story',
            error: error.message
        });
    }
};
//# sourceMappingURL=adminStoryController.js.map