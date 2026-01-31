import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const router = Router();
const prisma = new PrismaClient();

// Zod schema for order validation
const orderSchema = z.object({
    customerName: z.string().min(1, "Customer name is required."),
    customerEmail: z.string().email("Invalid email address."),
    items: z.array(z.object({
        beverageId: z.string().uuid(),
        quantity: z.number().int().positive(),
    })).min(1, "Order must contain at least one item.")
})

router.post('/', async (req, res) => {
    try {
        // Validate request body
        const validatedOrder = orderSchema.parse(req.body);
        let totalPrice = 0;
        const orderItemsData = [];
        
        // Loop through items to fetch beverage prices and calculate the total price
        for (const item of validatedOrder.items) {
            const beverage = await prisma.beverage.findUnique({
                where: { id: item.beverageId }
            });
            if (!beverage) {
                return res.status(400).json({ error: `Beverage with ID ${item.beverageId} not found.` });
            }
            totalPrice += Number(beverage.price) * item.quantity;
            orderItemsData.push({
                beverageId: item.beverageId,
                quantity: item.quantity,
                price: Number(beverage.price)
            });
        }

        // Create the order in the database
        const order = await prisma.order.create({
            data: {
                customerName: validatedOrder.customerName,
                customerEmail: validatedOrder.customerEmail,
                totalPrice: totalPrice,
                orderItems: {
                    create: orderItemsData
                }
            },
            include: { orderItems: true} // Include order items in response
        });

        res.status(201).json(order);
    } catch (error) {
        // Handling validation errors
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.issues });
        }
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;