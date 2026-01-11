import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Clear existing data
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.menuItem.deleteMany();
    await prisma.restaurant.deleteMany();
    await prisma.paymentMethod.deleteMany();
    await prisma.user.deleteMany();
    await prisma.country.deleteMany();

    console.log('🧹 Database cleared');

    const india = await prisma.country.create({
        data: {
            name: 'India',
            code: 'IN',
        },
    });

    const america = await prisma.country.create({
        data: {
            name: 'America',
            code: 'US',
        },
    });

    console.log('✅ Countries created');

    const hashedPassword = await bcrypt.hash('password123', 10);

    const adminIndia = await prisma.user.create({
        data: {
            email: 'admin@india.com',
            password: hashedPassword,
            name: 'Admin India',
            role: 'ADMIN',
            countryId: india.id,
        },
    });

    const managerIndia = await prisma.user.create({
        data: {
            email: 'manager@india.com',
            password: hashedPassword,
            name: 'Manager India',
            role: 'MANAGER',
            countryId: india.id,
        },
    });

    const memberIndia = await prisma.user.create({
        data: {
            email: 'member@india.com',
            password: hashedPassword,
            name: 'Member India',
            role: 'MEMBER',
            countryId: india.id,
        },
    });

    const adminUSA = await prisma.user.create({
        data: {
            email: 'admin@usa.com',
            password: hashedPassword,
            name: 'Admin USA',
            role: 'ADMIN',
            countryId: america.id,
        },
    });

    const managerUSA = await prisma.user.create({
        data: {
            email: 'manager@usa.com',
            password: hashedPassword,
            name: 'Manager USA',
            role: 'MANAGER',
            countryId: america.id,
        },
    });

    const memberUSA = await prisma.user.create({
        data: {
            email: 'member@usa.com',
            password: hashedPassword,
            name: 'Member USA',
            role: 'MEMBER',
            countryId: america.id,
        },
    });

    console.log('✅ Users created');

    const indianRestaurants = [
        {
            name: 'Spice Garden',
            description:
                'Authentic Indian cuisine with aromatic spices and traditional flavors',
            imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe',
            countryId: india.id,
        },
        {
            name: 'Tandoor House',
            description: 'Classic North Indian tandoori specialties and curries',
            imageUrl: 'https://images.unsplash.com/photo-1517244683847-7456b63c5969',
            countryId: india.id,
        },
        {
            name: 'Biryani Paradise',
            description: 'Fragrant biryanis and Hyderabadi delicacies',
            imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8',
            countryId: india.id,
        },
    ];

    const americanRestaurants = [
        {
            name: 'Burger Avenue',
            description: 'Gourmet burgers and classic American comfort food',
            imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349',
            countryId: america.id,
        },
        {
            name: 'Pizza Paradise',
            description: 'Wood-fired pizzas with artisanal toppings',
            imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591',
            countryId: america.id,
        },
        {
            name: 'Steakhouse Prime',
            description: 'Premium cuts and fine dining experience',
            imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947',
            countryId: america.id,
        },
    ];

    for (const restaurant of indianRestaurants) {
        await prisma.restaurant.create({ data: restaurant });
    }

    for (const restaurant of americanRestaurants) {
        await prisma.restaurant.create({ data: restaurant });
    }

    console.log('✅ Restaurants created');

    const restaurants = await prisma.restaurant.findMany();

    const spiceGarden = restaurants.find((r) => r.name === 'Spice Garden')!;
    const tandoorHouse = restaurants.find((r) => r.name === 'Tandoor House')!;
    const biryaniParadise = restaurants.find((r) => r.name === 'Biryani Paradise')!;
    const burgerAvenue = restaurants.find((r) => r.name === 'Burger Avenue')!;
    const pizzaParadise = restaurants.find((r) => r.name === 'Pizza Paradise')!;
    const steakhousePrime = restaurants.find((r) => r.name === 'Steakhouse Prime')!;

    const menuItems = [
        {
            restaurantId: spiceGarden.id,
            name: 'Butter Chicken',
            description: 'Creamy tomato-based curry with tender chicken',
            price: 12.99,
            category: 'Main Course',
            imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398',
        },
        {
            restaurantId: spiceGarden.id,
            name: 'Palak Paneer',
            description: 'Cottage cheese in spinach gravy',
            price: 10.99,
            category: 'Main Course',
            imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950',
        },
        {
            restaurantId: spiceGarden.id,
            name: 'Garlic Naan',
            description: 'Soft flatbread with garlic and butter',
            price: 3.99,
            category: 'Breads',
            imageUrl: 'https://images.unsplash.com/photo-1601050690117-90ac8c250689',
        },
        {
            restaurantId: spiceGarden.id,
            name: 'Samosa',
            description: 'Crispy pastry with spiced potato filling',
            price: 4.99,
            category: 'Appetizers',
            imageUrl: 'https://images.unsplash.com/photo-1601050690104-e5fb3e2c4aed',
        },
        {
            restaurantId: tandoorHouse.id,
            name: 'Chicken Tikka',
            description: 'Marinated chicken grilled in tandoor',
            price: 14.99,
            category: 'Main Course',
            imageUrl: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0',
        },
        {
            restaurantId: tandoorHouse.id,
            name: 'Dal Makhani',
            description: 'Creamy black lentils with butter',
            price: 9.99,
            category: 'Main Course',
            imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d',
        },
        {
            restaurantId: tandoorHouse.id,
            name: 'Paneer Tikka',
            description: 'Grilled cottage cheese with spices',
            price: 11.99,
            category: 'Appetizers',
            imageUrl: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8',
        },
        {
            restaurantId: tandoorHouse.id,
            name: 'Mango Lassi',
            description: 'Sweet yogurt drink with mango',
            price: 4.99,
            category: 'Beverages',
            imageUrl: 'https://images.unsplash.com/photo-1589994965851-a8f479c573a9',
        },
        {
            restaurantId: biryaniParadise.id,
            name: 'Chicken Biryani',
            description: 'Fragrant rice with spiced chicken',
            price: 15.99,
            category: 'Main Course',
            imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8',
        },
        {
            restaurantId: biryaniParadise.id,
            name: 'Mutton Biryani',
            description: 'Aromatic rice with tender mutton',
            price: 17.99,
            category: 'Main Course',
            imageUrl: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0',
        },
        {
            restaurantId: biryaniParadise.id,
            name: 'Raita',
            description: 'Yogurt with cucumber and spices',
            price: 3.99,
            category: 'Sides',
            imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398',
        },
        {
            restaurantId: biryaniParadise.id,
            name: 'Gulab Jamun',
            description: 'Sweet fried dumplings in syrup',
            price: 5.99,
            category: 'Desserts',
            imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc',
        },
        {
            restaurantId: burgerAvenue.id,
            name: 'Classic Cheeseburger',
            description: 'Beef patty with cheese, lettuce, and tomato',
            price: 11.99,
            category: 'Burgers',
            imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd',
        },
        {
            restaurantId: burgerAvenue.id,
            name: 'Bacon Burger',
            description: 'Burger with crispy bacon and BBQ sauce',
            price: 13.99,
            category: 'Burgers',
            imageUrl: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b',
        },
        {
            restaurantId: burgerAvenue.id,
            name: 'French Fries',
            description: 'Crispy golden fries',
            price: 4.99,
            category: 'Sides',
            imageUrl: 'https://images.unsplash.com/photo-1576107232684-1279f390859f',
        },
        {
            restaurantId: burgerAvenue.id,
            name: 'Milkshake',
            description: 'Creamy vanilla milkshake',
            price: 5.99,
            category: 'Beverages',
            imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699',
        },
        {
            restaurantId: pizzaParadise.id,
            name: 'Margherita Pizza',
            description: 'Classic pizza with tomato and mozzarella',
            price: 14.99,
            category: 'Pizza',
            imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002',
        },
        {
            restaurantId: pizzaParadise.id,
            name: 'Pepperoni Pizza',
            description: 'Pizza topped with pepperoni slices',
            price: 16.99,
            category: 'Pizza',
            imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e',
        },
        {
            restaurantId: pizzaParadise.id,
            name: 'Caesar Salad',
            description: 'Romaine lettuce with Caesar dressing',
            price: 8.99,
            category: 'Salads',
            imageUrl: 'https://images.unsplash.com/photo-1546793665-c74683f339c1',
        },
        {
            restaurantId: pizzaParadise.id,
            name: 'Garlic Bread',
            description: 'Toasted bread with garlic butter',
            price: 5.99,
            category: 'Sides',
            imageUrl: 'https://images.unsplash.com/photo-1573140401552-388e415f9f93',
        },
        {
            restaurantId: steakhousePrime.id,
            name: 'Ribeye Steak',
            description: '12oz premium ribeye grilled to perfection',
            price: 32.99,
            category: 'Steaks',
            imageUrl: 'https://images.unsplash.com/photo-1600891964092-4316c288032e',
        },
        {
            restaurantId: steakhousePrime.id,
            name: 'Filet Mignon',
            description: 'Tender 8oz filet with red wine reduction',
            price: 38.99,
            category: 'Steaks',
            imageUrl: 'https://images.unsplash.com/photo-1558030137-a74f6ca0e2e7',
        },
        {
            restaurantId: steakhousePrime.id,
            name: 'Mashed Potatoes',
            description: 'Creamy mashed potatoes with butter',
            price: 6.99,
            category: 'Sides',
            imageUrl: 'https://images.unsplash.com/photo-1585505008861-b5e446d2c6ef',
        },
        {
            restaurantId: steakhousePrime.id,
            name: 'Red Wine',
            description: 'Premium red wine selection',
            price: 12.99,
            category: 'Beverages',
            imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3',
        },
    ];

    for (const item of menuItems) {
        await prisma.menuItem.create({ data: item });
    }

    console.log('✅ Menu items created');

    await prisma.paymentMethod.createMany({
        data: [
            {
                userId: adminIndia.id,
                type: 'Credit Card',
                lastFour: '4242',
                isDefault: true,
            },
            {
                userId: adminIndia.id,
                type: 'Debit Card',
                lastFour: '5555',
                isDefault: false,
            },
            {
                userId: adminUSA.id,
                type: 'Credit Card',
                lastFour: '1234',
                isDefault: true,
            },
        ],
    });

    console.log('✅ Payment methods created');
    console.log('🎉 Database seeded successfully!');
    console.log('\n📧 Test Accounts:');
    console.log('  India Admin: admin@india.com / password123');
    console.log('  India Manager: manager@india.com / password123');
    console.log('  India Member: member@india.com / password123');
    console.log('  USA Admin: admin@usa.com / password123');
    console.log('  USA Manager: manager@usa.com / password123');
    console.log('  USA Member: member@usa.com / password123');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
