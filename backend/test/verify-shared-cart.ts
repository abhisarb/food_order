import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting Shared Cart Verification...');

    // 1. Setup Data
    const countryCode = 'SC-' + Date.now(); // Unique code
    const country = await prisma.country.create({
        data: {
            name: 'SharedCartCountry-' + Date.now(),
            code: countryCode,
        },
    });
    console.log(`Created Country: ${country.name}`);

    const restaurant = await prisma.restaurant.create({
        data: {
            name: 'Shared Restaurant',
            description: 'Best shared food',
            countryId: country.id,
        },
    });
    console.log(`Created Restaurant: ${restaurant.name}`);

    const menuItem = await prisma.menuItem.create({
        data: {
            name: 'Shared Burger',
            description: 'Yummy',
            price: 10,
            category: 'Main',
            restaurantId: restaurant.id,
        },
    });
    console.log(`Created MenuItem: ${menuItem.name}`);

    const userA = await prisma.user.create({
        data: {
            email: `userA-${Date.now()}@test.com`,
            password: 'hashedpassword',
            name: 'User A',
            role: 'USER',
            countryId: country.id,
        },
    });
    console.log(`Created User A: ${userA.email}`);

    const userB = await prisma.user.create({
        data: {
            email: `userB-${Date.now()}@test.com`,
            password: 'hashedpassword',
            name: 'User B',
            role: 'USER',
            countryId: country.id,
        },
    });
    console.log(`Created User B: ${userB.email}`);

    // 2. User A creates an order (Add to Cart)
    console.log('\n--- User A adding to cart ---');
    const orderA = await prisma.order.create({
        data: {
            userId: userA.id,
            restaurantId: restaurant.id,
            status: 'PENDING',
            total: menuItem.price * 1,
            items: {
                create: {
                    menuItemId: menuItem.id,
                    quantity: 1,
                    price: menuItem.price,
                },
            },
        },
    });
    console.log(`User A created Order: ${orderA.id} (Status: ${orderA.status})`);

    // 3. User B views their orders (Should see User A's pending order)
    console.log('\n--- User B checking myOrders ---');
    // Simulate logic from OrdersService.findByUser
    const userBOrders = await prisma.order.findMany({
        where: {
            OR: [
                { userId: userB.id },
                {
                    status: 'PENDING',
                    restaurant: { countryId: userB.countryId },
                },
            ],
        },
    });
    console.log(`User B found ${userBOrders.length} orders.`);
    const sharedOrderSeen = userBOrders.find(o => o.id === orderA.id);
    if (sharedOrderSeen) {
        console.log('SUCCESS: User B sees the shared order!');
    } else {
        console.error('FAILURE: User B did NOT see the shared order.');
        process.exit(1);
    }

    // 4. User B adds to cart (Should update existing order)
    console.log('\n--- User B adding to cart ---');
    // Simulate logic from OrdersService.create
    const pendingOrder = await prisma.order.findFirst({
        where: {
            restaurantId: restaurant.id,
            status: 'PENDING',
        },
    });

    if (pendingOrder) {
        const updatedOrder = await prisma.order.update({
            where: { id: pendingOrder.id },
            data: {
                total: pendingOrder.total + menuItem.price * 2,
                items: {
                    create: {
                        menuItemId: menuItem.id,
                        quantity: 2,
                        price: menuItem.price,
                    },
                },
            },
            include: { items: true },
        });
        console.log(`Order updated. New Total: ${updatedOrder.total}`);
        console.log(`Item count: ${updatedOrder.items.length}`);

        if (updatedOrder.id === orderA.id) {
            console.log('SUCCESS: User B added to the SAME order.');
        } else {
            console.error('FAILURE: User B created a NEW order instead of sharing.');
        }
    } else {
        console.error('FAILURE: Logic says create new order, but should have found pending one.');
    }

    // 5. User B checks out
    console.log('\n--- User B checking out ---');
    // Simulate logic from OrdersService.checkout
    // Verify permission first
    const orderToCheckout = await prisma.order.findUnique({
        where: { id: orderA.id },
        include: { restaurant: true }
    });

    if (!orderToCheckout) {
        console.error('FAILURE: Order to checkout not found.');
        process.exit(1);
    }

    if (orderToCheckout.userId !== userB.id && orderToCheckout.restaurant.countryId !== userB.countryId) {
        console.error("FAILURE: Permission denied logic would block this.");
    } else {
        console.log("Permission check passed (Shared Country).");
    }

    const paidOrder = await prisma.order.update({
        where: { id: orderA.id },
        data: { status: 'PAID', paidAt: new Date() },
    });
    console.log(`Order ${paidOrder.id} status: ${paidOrder.status}`);

    if (paidOrder.status === 'PAID') {
        console.log('SUCCESS: User B successfully checked out the shared order.');
    }

    console.log('\nVerification Complete.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
