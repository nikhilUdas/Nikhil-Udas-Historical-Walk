import type { Request, Response } from "express";
import "../middleware/auth.js";
import prisma from "../models/index.js";
import { broadcastNotificationToAll } from "../services/socketService.js";
import { toStoredPath } from "../utils/fileUpload.js";
import { sendStoredFile } from "../utils/mediaPath.js";
import { createNotification } from "./notificationController.js";

// ==================== ADMIN OPERATIONS ====================

// Add a new museum (Admin only)
export const addMuseum = async (req: Request, res: Response) => {
  const { name, description, opening_hours, gps_coordinates } = req.body;
  const files = (req as any).files;
  const file =
    files && Array.isArray(files) && files.length > 0
      ? files[0]
      : (req as any).file;

  // Verify user is admin
  if (req.user?.type !== "admin") {
    return res
      .status(403)
      .json({ message: "Forbidden: Only admins can add museums" });
  }

  // Validate required fields
  if (!name || !description || !opening_hours || !gps_coordinates) {
    return res.status(400).json({
      message:
        "Missing required fields: name, description, opening_hours, and gps_coordinates are required",
    });
  }

  try {
    // Check if museum with same name already exists
    const existingMuseum = await prisma.museum.findFirst({
      where: { name: name },
    });

    if (existingMuseum) {
      return res
        .status(400)
        .json({ message: "Museum with this name already exists" });
    }

    const imagePath = file?.path ? toStoredPath(file.path) : undefined;

    // Create the museum
    const museum = await prisma.museum.create({
      data: {
        name,
        description,
        opening_hours,
        gps_coordinates,
        image_path: imagePath as any,
      },
    });

    // Handle multiple images if provided
    if (files && Array.isArray(files)) {
      const additionalFiles = files.length > 1 ? files.slice(1) : [];

      const imagePromises = additionalFiles.map(async (file: any) => {
        try {
          return prisma.museumImage.create({
            data: {
              museum_id: museum.museum_id,
              image_path: toStoredPath(file.path),
            },
          });
        } catch (err) {
          console.error("Error processing additional museum image:", err);
        }
      });
      await Promise.all(imagePromises);
    }

    // Broadcast notification to all users about new museum
    const notification = {
      type: "museum_added",
      title: "New Museum Added",
      message: `A new museum "${name}" has been added! Visit it during ${opening_hours}`,
      related_id: museum.museum_id,
    };
    await broadcastNotificationToAll(notification);

    return res.status(201).json({
      message: "Museum added successfully",
      museum: {
        ...museum,
        image_url: museum.image_path || null,
        additional_images: [],
      },
    });
  } catch (error: any) {
    console.error("Error adding museum:", error);
    return res.status(500).json({
      message: "Error adding museum",
      error: error.message,
    });
  }
};

// Update a museum (Admin only)
export const updateMuseum = async (req: Request, res: Response) => {
  const { museum_id } = req.params;
  const { name, description, opening_hours, gps_coordinates } = req.body;
  const files = (req as any).files;
  const file =
    files && Array.isArray(files) && files.length > 0 ? files[0] : null;

  // Verify user is admin
  if (req.user?.type !== "admin") {
    return res
      .status(403)
      .json({ message: "Forbidden: Only admins can edit museums" });
  }

  if (!museum_id) {
    return res.status(400).json({ message: "Museum ID is required" });
  }

  try {
    // Check if museum exists
    const existingMuseum = await prisma.museum.findUnique({
      where: { museum_id: Number(museum_id) },
    });

    if (!existingMuseum) {
      return res.status(404).json({ message: "Museum not found" });
    }

    // Build update data object with only provided fields
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (opening_hours !== undefined) updateData.opening_hours = opening_hours;
    if (gps_coordinates !== undefined)
      updateData.gps_coordinates = gps_coordinates;

    // Handle image update if file is provided
    if (file) {
      updateData.image_path = toStoredPath(file.path);
    }

    // Check if there's anything to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    // Check if new name already exists (if name is being changed)
    if (name && name !== existingMuseum.name) {
      const museumWithName = await prisma.museum.findFirst({
        where: { name: name },
      });
      if (museumWithName) {
        return res
          .status(400)
          .json({ message: "Museum with this name already exists" });
      }
    }

    // Update the museum
    const updatedMuseum = await prisma.museum.update({
      where: { museum_id: Number(museum_id) },
      data: updateData,
    });

    // Handle multiple images update (Append new images)
    if (files && Array.isArray(files) && files.length > 0) {
      // If we used the first file for updateData.image_data, skip it here?
      // Actually, museum update might want to append all as additional if they choose to?
      // But typically the first one is meant to replace the main image.
      const additionalFiles = files.length > 1 ? files.slice(1) : [];

      const imagePromises = additionalFiles.map(async (f: any) => {
        try {
          return prisma.museumImage.create({
            data: {
              museum_id: updatedMuseum.museum_id,
              image_path: toStoredPath(f.path),
            },
          });
        } catch (err) {
          console.error(
            "Error processing additional museum image during update:",
            err,
          );
        }
      });
      await Promise.all(imagePromises);
    }

    return res.status(200).json({
      message: "Museum updated successfully",
      museum: {
        ...updatedMuseum,
        image_url: updatedMuseum.image_path || null,
      },
    });
  } catch (error: any) {
    console.error("Error updating museum:", error);
    return res.status(500).json({
      message: "Error updating museum",
      error: error.message,
    });
  }
};

// Delete a museum (Admin only)
export const deleteMuseum = async (req: Request, res: Response) => {
  const { museum_id } = req.params;

  // Verify user is admin
  if (req.user?.type !== "admin") {
    return res
      .status(403)
      .json({ message: "Forbidden: Only admins can delete museums" });
  }

  if (!museum_id) {
    return res.status(400).json({ message: "Museum ID is required" });
  }

  try {
    // Check if museum exists
    const existingMuseum = await prisma.museum.findUnique({
      where: { museum_id: Number(museum_id) },
    });

    if (!existingMuseum) {
      return res.status(404).json({ message: "Museum not found" });
    }

    // Delete the museum (cascades to related tickets)
    await prisma.museum.delete({
      where: { museum_id: Number(museum_id) },
    });

    return res.status(200).json({
      message: "Museum deleted successfully",
      deletedMuseumId: Number(museum_id),
    });
  } catch (error: any) {
    console.error("Error deleting museum:", error);
    return res.status(500).json({
      message: "Error deleting museum",
      error: error.message,
    });
  }
};

// ==================== PUBLIC OPERATIONS ====================

// Get all museums (Public)
export const getAllMuseums = async (req: Request, res: Response) => {
  try {
    const museums = await prisma.museum.findMany({
      include: {
        images: {
          select: {
            image_id: true,
            image_path: true,
          },
        },
      },
      orderBy: {
        museum_id: "desc",
      },
    });

    // Transform museums to include image URLs
    const museumsWithImages = museums.map((museum) => ({
      ...museum,
      image_url: museum.image_path || null,
      additional_images: museum.images.map((img) => img.image_path),
    }));

    return res.status(200).json({
      message: "Museums retrieved successfully",
      count: museumsWithImages.length,
      museums: museumsWithImages,
    });
  } catch (error: any) {
    console.error("Error fetching museums:", error);
    return res.status(500).json({
      message: "Error fetching museums",
      error: error.message,
    });
  }
};

// Get a single museum by ID (Public)
export const getMuseumById = async (req: Request, res: Response) => {
  const { museum_id } = req.params;

  if (!museum_id) {
    return res.status(400).json({ message: "Museum ID is required" });
  }

  try {
    const museum = await prisma.museum.findUnique({
      where: { museum_id: Number(museum_id) },
      include: {
        tickets: {
          select: {
            ticket_id: true,
            price: true,
            purchase_date: true,
          },
        },
        images: {
          select: {
            image_id: true,
            image_path: true,
          },
        },
      },
    });

    if (!museum) {
      return res.status(404).json({ message: "Museum not found" });
    }

    return res.status(200).json({
      message: "Museum retrieved successfully",
      museum: {
        ...museum,
        image_url: museum.image_path || null,
        additional_images: museum.images.map((img) => img.image_path),
      },
    });
  } catch (error: any) {
    console.error("Error fetching museum:", error);
    return res.status(500).json({
      message: "Error fetching museum",
      error: error.message,
    });
  }
};

// Get museum image by ID (Public)
export const getMuseumImage = async (req: Request, res: Response) => {
  const { museum_id } = req.params;

  if (!museum_id) {
    return res.status(400).json({ message: "Museum ID is required" });
  }

  try {
    const museum = await prisma.museum.findUnique({
      where: { museum_id: Number(museum_id) },
      select: {
        museum_id: true,
        name: true,
        image_path: true,
      },
    });

    if (!museum) {
      return res.status(404).json({ message: "Museum not found" });
    }

    if (!museum.image_path) {
      return res
        .status(404)
        .json({ message: "No image available for this museum" });
    }

    return sendStoredFile(
      res,
      museum.image_path,
      "No image available for this museum",
    );
  } catch (error: any) {
    console.error("Error fetching museum image:", error);
    return res.status(500).json({
      message: "Error fetching museum image",
      error: error.message,
    });
  }
};

// ==================== USER TICKET PURCHASE ====================

// Purchase a ticket (User only)
export const purchaseTicket = async (req: Request, res: Response) => {
  const { museum_id, price, payment_method } = req.body;

  // Verify user is authenticated
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized: Please log in" });
  }

  // Verify user is a regular user (not admin)
  if (req.user.type === "admin") {
    return res
      .status(403)
      .json({ message: "Forbidden: Admins cannot purchase tickets" });
  }

  // Validate required fields
  if (!museum_id || !price || !payment_method) {
    return res.status(400).json({
      message:
        "Missing required fields: museum_id, price, and payment_method are required",
    });
  }

  try {
    // Check if museum exists
    const museum = await prisma.museum.findUnique({
      where: { museum_id: Number(museum_id) },
    });

    if (!museum) {
      return res.status(404).json({ message: "Museum not found" });
    }

    // Validate price
    if (price <= 0) {
      return res.status(400).json({ message: "Price must be greater than 0" });
    }

    // Create ticket and payment in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the ticket
      const ticket = await tx.ticket.create({
        data: {
          user_id: req.user!.userId,
          museum_id: Number(museum_id),
          purchase_date: new Date(),
          ticket_pdf: `ticket_${Date.now()}.pdf`, // Placeholder - implement actual PDF generation
          price: Number(price),
          payment_status: "completed",
        },
      });

      // Create the payment record
      const payment = await tx.payment.create({
        data: {
          ticket_id: ticket.ticket_id,
          payment_method: payment_method,
          amount: Number(price),
          payment_date: new Date(),
        },
      });

      return { ticket, payment };
    });

    // Create and emit notification to user
    await createNotification(
      req.user!.userId,
      "ticket_purchased",
      "Ticket Purchased Successfully",
      `Your ticket for ${museum.name} has been purchased successfully. Amount: Rs. ${price}`,
      museum.museum_id,
    );

    return res.status(201).json({
      message: "Ticket purchased successfully",
      ticket: result.ticket,
      payment: result.payment,
    });
  } catch (error: any) {
    console.error("Error purchasing ticket:", error);
    return res.status(500).json({
      message: "Error purchasing ticket",
      error: error.message,
    });
  }
};

// Get user's tickets (User only)
export const getUserTickets = async (req: Request, res: Response) => {
  // Verify user is authenticated
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized: Please log in" });
  }

  try {
    const tickets = await prisma.ticket.findMany({
      where: { user_id: req.user.userId },
      include: {
        museum: true,
        payments: true,
      },
      orderBy: {
        purchase_date: "desc",
      },
    });

    return res.status(200).json({
      message: "Tickets retrieved successfully",
      count: tickets.length,
      tickets,
    });
  } catch (error: any) {
    console.error("Error fetching user tickets:", error);
    return res.status(500).json({
      message: "Error fetching tickets",
      error: error.message,
    });
  }
};

// Get a single ticket by ID (User only - must own the ticket)
export const getTicketById = async (req: Request, res: Response) => {
  const { ticket_id } = req.params;

  // Verify user is authenticated
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized: Please log in" });
  }

  if (!ticket_id) {
    return res.status(400).json({ message: "Ticket ID is required" });
  }

  try {
    const ticket = await prisma.ticket.findUnique({
      where: { ticket_id: Number(ticket_id) },
      include: {
        museum: true,
        payments: true,
      },
    });

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Check if user owns this ticket or is an admin
    if (ticket.user_id !== req.user.userId && req.user.type !== "admin") {
      return res
        .status(403)
        .json({ message: "Forbidden: You do not own this ticket" });
    }

    return res.status(200).json({
      message: "Ticket retrieved successfully",
      ticket,
    });
  } catch (error: any) {
    console.error("Error fetching ticket:", error);
    return res.status(500).json({
      message: "Error fetching ticket",
      error: error.message,
    });
  }
};
