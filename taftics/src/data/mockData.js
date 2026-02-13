
export const USERS = [
    {
        id: 1,
        username: "leelanczers",
        password: "password123",
        name: "Leelancze Pacomio",
        email: "lee@dlsu.edu.ph",
        idSeries: "124",
        bio: "CS Student @ DLSU | Love coffee and coding",
        followers: 67,
        helpfulCount: 42,
        contributions: 15,
        avatar: "https://ui-avatars.com/api/?name=Leelancze+Pacomio&background=0D8ABC&color=fff",
        isAdmin: true,
    },
    {
        id: 2,
        username: "archer_dc",
        password: "password123",
        name: "Archer Dela Cruz",
        email: "archer@dlsu.edu.ph",
        idSeries: "121",
        bio: "Just a regular Archer",
        followers: 12,
        helpfulCount: 5,
        contributions: 3,
        avatar: "https://ui-avatars.com/api/?name=Archer+Dela+Cruz&background=00441B&color=fff",
    },
    {
        id: 3,
        username: "pro_student",
        password: "password123",
        name: "Maria Santos",
        email: "maria@dlsu.edu.ph",
        idSeries: "123",
        bio: "Academic achiever | 4.0 GPA wanter",
        followers: 120,
        helpfulCount: 89,
        contributions: 45,
        avatar: "https://ui-avatars.com/api/?name=Maria+Santos&background=FF5733&color=fff",
    },
    {
        id: 4,
        username: "foodie_king",
        password: "password123",
        name: "Juan Karlos",
        email: "jk@dlsu.edu.ph",
        idSeries: "122",
        bio: "Living for Agno food trips",
        followers: 230,
        helpfulCount: 150,
        contributions: 80,
        avatar: "https://ui-avatars.com/api/?name=Juan+Karlos&background=C70039&color=fff",
    },
    {
        id: 5,
        username: "gym_rat_dlsu",
        password: "password123",
        name: "Sam Smith",
        email: "sam@dlsu.edu.ph",
        idSeries: "120",
        bio: "Gains over grades (jk)",
        followers: 45,
        helpfulCount: 20,
        contributions: 10,
        avatar: "https://ui-avatars.com/api/?name=Sam+Smith&background=900C3F&color=fff",
    }
];

export const ESTABLISHMENTS = [
    {
        id: 1,
        name: "National Book Store",
        category: "School Supplies",
        location: "Inside Yuchengco Hall",
        rating: 4.7,
        reviewCount: 14,
        image: "https://images.summitmedia-digital.com/spotph/images/2020/08/24/nbs-statement-closure-640-1598256966.jpg",
        description: "Your go-to place for all school requirements, books, and art materials right inside the campus.",
        businessHours: "8:00 AM - 6:00 PM",
        contactNumber: "02-8888-1234",
        email: "support@nationalbookstore.com",
        website: "https://www.nationalbookstore.com",
        address: "Yuchengco Hall, De La Salle University, Taft Ave, Manila"
    },
    {
        id: 2,
        name: "Anytime Fitness",
        category: "Fitness",
        location: "Inside R Square",
        rating: 4.2,
        reviewCount: 9,
        image: "https://classpass-res.cloudinary.com/image/upload/f_auto/q_auto,w_1125/media_venue/a84kycuvqo9jblnfro8r.jpg",
        description: "24/7 gym access with top-tier equipment and friendly coaches.",
        businessHours: "24/7",
        contactNumber: "0917-555-6789",
        email: "rsquare@anytimefitness.ph",
        website: "https://www.anytimefitness.ph",
        address: "R Square Mall, Taft Ave, Malate, Manila"
    },
    {
        id: 3,
        name: "Ate Rica's Bacsilog",
        category: "Food",
        location: "Agno Food Court",
        rating: 4.8,
        reviewCount: 16,
        image: "https://pbs.twimg.com/media/GAeKw8KaYAAis3s.jpg",
        description: "The home of the famous Bacsilog. Affordable and delicious student meals.",
        businessHours: "7:00 AM - 7:00 PM",
        contactNumber: "0999-123-4567",
        email: "atericas@yahoo.com",
        website: "https://www.facebook.com/AteRicasBacsilog",
        address: "Agno Food Court, De La Salle University, Taft Ave, Manila"
    },
    {
        id: 4,
        name: "Green Residences",
        category: "Dorms/Condos",
        location: "Right beside DLSU",
        rating: 4.4,
        reviewCount: 12,
        image: "https://www.preselling.com.ph/wp-content/uploads/2017/05/Green-Residences-Facade.jpg",
        description: "Convenient high-rise living for students with complete amenities.",
        businessHours: "24/7 (Lobby)",
        contactNumber: "02-7777-8888",
        email: "inquiries@smdc.com",
        website: "https://smdc.com/properties/green-residences",
        address: "Taft Ave, Malate, Manila, Metro Manila"
    },
    {
        id: 5,
        name: "ZUS Coffee",
        category: "Coffee",
        location: "Inside Green Mall",
        rating: 4.9,
        reviewCount: 17,
        image: "https://www.sunwayvelocitymall.com/static/shops/21a1980b9e338ce99e2c272e85b548c5/w768.jpg",
        description: "Specialty coffee that doesn't break the bank. Perfect for study sessions.",
        businessHours: "8:00 AM - 10:00 PM",
        contactNumber: "0917-111-2222",
        email: "hello@zuscoffee.ph",
        website: "https://zuscoffee.ph",
        address: "Ground Floor, Green Mall, Taft Ave, Manila"
    },
    {
        id: 6,
        name: "De La Salle Laundry",
        category: "Laundry",
        location: "Near EGI",
        rating: 4.5,
        reviewCount: 120,
        image: "https://laundryheap.com/blog/wp-content/uploads/2021/04/laundry-service-1.jpg", // Generic laundry image
        description: "Our laundry service offers quick turnaround times, competitive pricing, and exceptional customer service. Experience the convenience of our laundry service today!",
        businessHours: "8:00 AM - 8:00 PM",
        contactNumber: "091-234-5678",
        email: "dlsu@laundry.com",
        website: "www.dlsu-laundry.com",
        address: "2401 Taft Ave, Malate, Manila, 1004 Metro Manila"
    }
];

// Helper to get relative date from ISO string
// We will implement the actual logic in the components, stored as ISO strings here for portability
const getPastDate = (daysAgo) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString();
};

export const REVIEWS = [
    // Reviews for De La Salle Laundry (ID 6)
    {
        id: 1,
        establishmentId: 6,
        userId: 1, // leelanczers
        rating: 4,
        title: "Pretty nice!",
        comment: "The service was okay but a bit crowded during peak hours.",
        date: getPastDate(2),
        helpfulVotes: 9,
        unhelpfulVotes: 3,
    },
    {
        id: 2,
        establishmentId: 6,
        userId: 2, // archer_dc
        rating: 2,
        title: "Bad experience.",
        comment: "Too many people and slow service. Not recommended on weekends.",
        date: getPastDate(5),
        helpfulVotes: 3,
        unhelpfulVotes: 12,
    },
    {
        id: 3,
        establishmentId: 6,
        userId: 3, // pro_student
        rating: 5,
        title: "Excellent service!",
        comment: "Great service and fast turnaround! Highly recommend.",
        date: getPastDate(10),
        helpfulVotes: 10,
        unhelpfulVotes: 2,
    },
    {
        id: 4,
        establishmentId: 6,
        userId: 4, // foodie_king
        rating: 5,
        title: "Best laundry in town",
        comment: "Quick service and very friendly staff. Will come back again! Also they have free wifi while you wait which is a huge plus for students.",
        date: getPastDate(1),
        helpfulVotes: 8,
        unhelpfulVotes: 1,
    },
    {
        id: 5,
        establishmentId: 6,
        userId: 5, // gym_rat_dlsu
        rating: 3,
        title: "Average experience",
        comment: "The service was okay but a bit pricey compared to others nearby.",
        date: getPastDate(20),
        helpfulVotes: 5,
        unhelpfulVotes: 3,
    },

    // Reviews for Ate Rica's (ID 3)
    {
        id: 6,
        establishmentId: 3,
        userId: 1, // leelanczers
        rating: 5,
        title: "The best budget friendly meals on campus!",
        comment: "Ate Rica's remains the gold standard for a quick and affordable meal between classes at Andrew. That signature liquid cheese sauce combined with the smoky bacon bits is an elite flavor combination that never misses.",
        date: getPastDate(3),
        helpfulVotes: 42,
        unhelpfulVotes: 2,
    },
    {
        id: 7,
        establishmentId: 3,
        userId: 4, // foodie_king
        rating: 5,
        title: "Always consistent",
        comment: "You know what you're getting. Heavy on the rice, heavy on the sauce. Perfect.",
        date: getPastDate(1),
        helpfulVotes: 15,
        unhelpfulVotes: 0,
    },

    // Reviews for National Book Store (ID 1)
    {
        id: 8,
        establishmentId: 1,
        userId: 3, // pro_student
        rating: 4,
        title: "Convenient but sometimes out of stock",
        comment: "It's super convenient being inside the campus, but they run out of yellow pads quickly during exams.",
        date: getPastDate(7),
        helpfulVotes: 20,
        unhelpfulVotes: 1,
    },

    // Reviews for Anytime Fitness (ID 2)
    {
        id: 9,
        establishmentId: 2,
        userId: 5, // gym_rat_dlsu
        rating: 5,
        title: "Great facility",
        comment: "Equipment is always clean and the staff are helpful. It gets busy at 5PM though.",
        date: getPastDate(4),
        helpfulVotes: 12,
        unhelpfulVotes: 0,
    },

    // Reviews for ZUS Coffee (ID 5)
    {
        id: 10,
        establishmentId: 5,
        userId: 1, // leelanczers
        rating: 5,
        title: "Spanish Latte is the bomb",
        comment: "My daily fuel. The app makes ordering so easy.",
        date: getPastDate(0), // Today
        helpfulVotes: 5,
        unhelpfulVotes: 0,
    }
];
