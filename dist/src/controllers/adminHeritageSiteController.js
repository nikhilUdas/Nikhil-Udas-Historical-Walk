import prisma from '../models/index.js';
import '../middleware/auth.js';
import { fileToBase64 } from '../utils/fileUpload.js';
import { broadcastNotificationToAll } from '../services/socketService.js';
// Add a new heritage site
export const addHeritageSite = async (req, res) => {
    const { name, description, photo_url, gps_coordinates } = req.body;
    const file = req.file;
    // Verify user is admin
    if (req.user?.type !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: Only admins can add heritage sites' });
    }
    // Validate required fields
    if (!name || !description || !photo_url || !gps_coordinates) {
        return res.status(400).json({
            message: 'Missing required fields: name, description, photo_url, and gps_coordinates are required',
        });
    }
    try {
        // Check if site with same name already exists
        const existingSite = await prisma.heritageSite.findFirst({
            where: { name: name },
        });
        if (existingSite) {
            return res.status(400).json({ message: 'Heritage site with this name already exists' });
        }
        // Convert image to base64 if provided
        let imageData;
        if (file) {
            try {
                imageData = fileToBase64(file);
            }
            catch (error) {
                return res.status(400).json({
                    message: 'Error processing image',
                    error: error.message,
                });
            }
        }
        // Create the heritage site
        const site = await prisma.heritageSite.create({
            data: {
                name,
                description,
                photo_url,
                gps_coordinates,
                image_data: imageData,
            },
        });
        // Broadcast notification to all users about new heritage site
        const notification = {
            type: 'heritage_site_added',
            title: 'New Heritage Site Added',
            message: `A new heritage site "${name}" has been added! Explore its rich history and cultural significance.`,
            related_id: site.site_id,
        };
        await broadcastNotificationToAll(notification);
        return res.status(201).json({
            message: 'Heritage site added successfully',
            site: {
                ...site,
                image_data: site.image_data ? `[Image stored - ${(site.image_data.length / 1024).toFixed(2)} KB]` : null,
            },
        });
    }
    catch (error) {
        console.error('Error adding heritage site:', error);
        return res.status(500).json({
            message: 'Error adding heritage site',
            error: error.message,
        });
    }
};
// Update a heritage site
export const updateHeritageSite = async (req, res) => {
    const { site_id } = req.params;
    const { name, description, photo_url, gps_coordinates } = req.body;
    const file = req.file;
    // Verify user is admin
    if (req.user?.type !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: Only admins can edit heritage sites' });
    }
    if (!site_id) {
        return res.status(400).json({ message: 'Site ID is required' });
    }
    try {
        // Check if site exists
        const existingSite = await prisma.heritageSite.findUnique({
            where: { site_id: Number(site_id) },
        });
        if (!existingSite) {
            return res.status(404).json({ message: 'Heritage site not found' });
        }
        // Build update data object with only provided fields
        const updateData = {};
        if (name !== undefined)
            updateData.name = name;
        if (description !== undefined)
            updateData.description = description;
        if (photo_url !== undefined)
            updateData.photo_url = photo_url;
        if (gps_coordinates !== undefined)
            updateData.gps_coordinates = gps_coordinates;
        // Handle image update if file is provided
        if (file) {
            try {
                updateData.image_data = fileToBase64(file);
            }
            catch (error) {
                return res.status(400).json({
                    message: 'Error processing image',
                    error: error.message,
                });
            }
        }
        // Check if there's anything to update
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: 'No fields to update' });
        }
        // Check if new name already exists (if name is being changed)
        if (name && name !== existingSite.name) {
            const siteWithName = await prisma.heritageSite.findFirst({
                where: { name: name },
            });
            if (siteWithName) {
                return res.status(400).json({ message: 'Heritage site with this name already exists' });
            }
        }
        // Update the heritage site
        const updatedSite = await prisma.heritageSite.update({
            where: { site_id: Number(site_id) },
            data: updateData,
        });
        return res.status(200).json({
            message: 'Heritage site updated successfully',
            site: {
                ...updatedSite,
                image_data: updatedSite.image_data ? `[Image stored - ${(updatedSite.image_data.length / 1024).toFixed(2)} KB]` : null,
            },
        });
    }
    catch (error) {
        console.error('Error updating heritage site:', error);
        return res.status(500).json({
            message: 'Error updating heritage site',
            error: error.message,
        });
    }
};
// Delete a heritage site
export const deleteHeritageSite = async (req, res) => {
    const { site_id } = req.params;
    // Verify user is admin
    if (req.user?.type !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: Only admins can delete heritage sites' });
    }
    if (!site_id) {
        return res.status(400).json({ message: 'Site ID is required' });
    }
    try {
        // Check if site exists
        const existingSite = await prisma.heritageSite.findUnique({
            where: { site_id: Number(site_id) },
        });
        if (!existingSite) {
            return res.status(404).json({ message: 'Heritage site not found' });
        }
        // Delete the heritage site (cascades to related stories, routes, favorites)
        await prisma.heritageSite.delete({
            where: { site_id: Number(site_id) },
        });
        return res.status(200).json({
            message: 'Heritage site deleted successfully',
            deletedSiteId: Number(site_id),
        });
    }
    catch (error) {
        console.error('Error deleting heritage site:', error);
        return res.status(500).json({
            message: 'Error deleting heritage site',
            error: error.message,
        });
    }
};
// Get all heritage sites (public - admin can view all)
export const getAllHeritageSites = async (req, res) => {
    try {
        const sites = await prisma.heritageSite.findMany({
            include: {
                stories: true,
                routes: true,
            },
            orderBy: {
                site_id: 'desc',
            },
        });
        // Transform sites to include image data as data URLs
        const sitesWithImages = sites.map(site => ({
            ...site,
            image_url: site.image_data ? `data:image/jpeg;base64,${site.image_data}` : null,
        }));
        return res.status(200).json({
            message: 'Heritage sites retrieved successfully',
            count: sitesWithImages.length,
            sites: sitesWithImages,
        });
    }
    catch (error) {
        console.error('Error fetching heritage sites:', error);
        return res.status(500).json({
            message: 'Error fetching heritage sites',
            error: error.message,
        });
    }
};
// Get a single heritage site by ID
export const getHeritageSiteById = async (req, res) => {
    const { site_id } = req.params;
    if (!site_id) {
        return res.status(400).json({ message: 'Site ID is required' });
    }
    try {
        const site = await prisma.heritageSite.findUnique({
            where: { site_id: Number(site_id) },
            include: {
                stories: true,
                routes: true,
            },
        });
        if (!site) {
            return res.status(404).json({ message: 'Heritage site not found' });
        }
        return res.status(200).json({
            message: 'Heritage site retrieved successfully',
            site: {
                ...site,
                image_url: site.image_data ? `data:image/jpeg;base64,${site.image_data}` : null,
            },
        });
    }
    catch (error) {
        console.error('Error fetching heritage site:', error);
        return res.status(500).json({
            message: 'Error fetching heritage site',
            error: error.message,
        });
    }
};
// Get heritage site image by ID (Public)
export const getHeritageSiteImage = async (req, res) => {
    const { site_id } = req.params;
    if (!site_id) {
        return res.status(400).json({ message: 'Site ID is required' });
    }
    try {
        const site = await prisma.heritageSite.findUnique({
            where: { site_id: Number(site_id) },
            select: {
                site_id: true,
                name: true,
                image_data: true,
            },
        });
        if (!site) {
            return res.status(404).json({ message: 'Heritage site not found' });
        }
        if (!site.image_data) {
            return res.status(404).json({ message: 'No image available for this heritage site' });
        }
        // Convert base64 to buffer and send as image
        const imageBuffer = Buffer.from(site.image_data, 'base64');
        res.setHeader('Content-Type', 'image/jpeg');
        res.setHeader('Content-Disposition', `inline; filename="site_${site_id}.jpg"`);
        return res.send(imageBuffer);
    }
    catch (error) {
        console.error('Error fetching heritage site image:', error);
        return res.status(500).json({
            message: 'Error fetching heritage site image', error: error.message,
        });
    }
};
//# sourceMappingURL=adminHeritageSiteController.js.map