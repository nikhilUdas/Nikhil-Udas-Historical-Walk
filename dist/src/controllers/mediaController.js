import prisma from '../models/index.js';
// Get Story image
export const getStoryImage = async (req, res) => {
    const { story_id } = req.params;
    try {
        const story = await prisma.story.findUnique({
            where: { story_id: Number(story_id) },
            select: { media_data: true }
        });
        if (!story || !story.media_data) {
            return res.status(404).json({ message: 'Image not found' });
        }
        res.setHeader('Content-Type', 'image/jpeg');
        return res.send(Buffer.from(story.media_data));
    }
    catch (error) {
        return res.status(500).json({ message: 'Error retrieving image', error: error.message });
    }
};
// Get Additional Heritage Site Image
export const getHeritageSiteAdditionalImage = async (req, res) => {
    const { image_id } = req.params;
    try {
        const image = await prisma.heritageSiteImage.findUnique({
            where: { image_id: Number(image_id) },
            select: { image_data: true }
        });
        if (!image || !image.image_data) {
            return res.status(404).json({ message: 'Image not found' });
        }
        res.setHeader('Content-Type', 'image/jpeg');
        return res.send(Buffer.from(image.image_data));
    }
    catch (error) {
        return res.status(500).json({ message: 'Error retrieving image', error: error.message });
    }
};
// Get Additional Museum Image
export const getMuseumAdditionalImage = async (req, res) => {
    const { image_id } = req.params;
    try {
        const image = await prisma.museumImage.findUnique({
            where: { image_id: Number(image_id) },
            select: { image_data: true }
        });
        if (!image || !image.image_data) {
            return res.status(404).json({ message: 'Image not found' });
        }
        res.setHeader('Content-Type', 'image/jpeg');
        return res.send(Buffer.from(image.image_data));
    }
    catch (error) {
        return res.status(500).json({ message: 'Error retrieving image', error: error.message });
    }
};
// Get User Profile Image
export const getUserProfileImage = async (req, res) => {
    const { user_id } = req.params;
    try {
        const user = await prisma.user.findUnique({
            where: { user_id: Number(user_id) },
            select: { profile_image: true }
        });
        if (!user || !user.profile_image) {
            console.log(`[Media] Profile image not found for user ${user_id}`);
            return res.status(404).json({ message: 'Profile image not found' });
        }
        res.setHeader('Content-Type', 'image/jpeg');
        return res.send(Buffer.from(user.profile_image));
    }
    catch (error) {
        return res.status(500).json({ message: 'Error retrieving image', error: error.message });
    }
};
// Get Heritage Site main image
export const getHeritageSiteImage = async (req, res) => {
    const { site_id } = req.params;
    try {
        const site = await prisma.heritageSite.findUnique({
            where: { site_id: Number(site_id) },
            select: { image_data: true }
        });
        if (!site || !site.image_data) {
            return res.status(404).json({ message: 'Image not found' });
        }
        res.setHeader('Content-Type', 'image/jpeg');
        return res.send(Buffer.from(site.image_data));
    }
    catch (error) {
        return res.status(500).json({ message: 'Error retrieving image', error: error.message });
    }
};
// Get Museum main image
export const getMuseumImage = async (req, res) => {
    const { museum_id } = req.params;
    try {
        const museum = await prisma.museum.findUnique({
            where: { museum_id: Number(museum_id) },
            select: { image_data: true }
        });
        if (!museum || !museum.image_data) {
            return res.status(404).json({ message: 'Image not found' });
        }
        res.setHeader('Content-Type', 'image/jpeg');
        return res.send(Buffer.from(museum.image_data));
    }
    catch (error) {
        return res.status(500).json({ message: 'Error retrieving image', error: error.message });
    }
};
//# sourceMappingURL=mediaController.js.map