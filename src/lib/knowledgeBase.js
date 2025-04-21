const knowledgeBase = {
    community: {
      name: "ACME Senior Living",
      address: "145 Fake Street, Charlotte, NC, 28203",
      phone: "850-445-8362",
      capacity: "60 residents",
      languages: ["English", "Spanish"]
    },
    
    pricing: {
      independent_living: {
        starting_price: 2000,
        currency: "USD",
        period: "month"
      },
      assisted_living: {
        starting_price: 3000,
        currency: "USD",
        period: "month"
      },
      entrance_fee: 3500,
      included_in_cost: [
        "Basic Cable", 
        "Internet/WiFi", 
        "Linen Service", 
        "Breakfast", 
        "Lunch", 
        "Dinner", 
        "Housekeeping"
      ]
    },
    
    care_types: ["Independent Living", "Assisted Living"],
    
    room_types: [
      "1 Bedroom / 1 Bath",
      "2 Bedroom / 1.5 Bath",
      "Studios"
    ],
    
    amenities: [
      "Elevators", 
      "Party space", 
      "Exercise pool", 
      "Chef-prepared meals with seasonal ingredients", 
      "Outdoor seating", 
      "Housekeeping services",
      "Beauty salon/services", 
      "Gym"
    ],
    
    services: [
      "24-hour staffing",
      "Bathing assistance",
      "Errand assistance",
      "Medication management",
      "Shopping assistance",
      "Dressing assistance",
      "Eating assistance"
    ],
    
    cleaning_services: [
      "Housekeeping", 
      "Linen services"
    ],
    
    activities: [
      "Arts and crafts", 
      "Book clubs", 
      "Card playing", 
      "Cooking classes", 
      "Exercise programs", 
      "Game nights", 
      "Movie nights", 
      "Yoga"
    ],
    
    dietary_options: [
      "Diabetic options",
      "Low sugar/salt",
      "Vegetarian", 
      "Gluten-free"
    ],
    
    room_amenities: [
      "Air conditioning", 
      "Microwaves", 
      "Private kitchenette", 
      "Walk-in shower", 
      "Furnished Rooms"
    ],
    
    religious_services: [
      "Devotional areas"
    ],
    
    dining_areas: [
      "Dining room", 
      "In-room dining", 
      "Restaurant-style meal service"
    ],
    
    outdoor_activities: [
      "Accompanied walks", 
      "Park visits", 
      "Walking trails", 
      "Day trips"
    ],
    
    outdoor_areas: [
      "Courtyard", 
      "Garden", 
      "Outdoor areas suitable for walking"
    ],
    
    fitness_exercise_options: [
      "Gym or fitness room", 
      "Exercise pool", 
      "Yoga"
    ],
    
    policies: {
      minimum_age: 60,
      pets: {
        allowed: true,
        details: [
          "Cats allowed",
          "Small dogs allowed (under 25 lbs.)",
          "Service animals allowed",
          "Fishes",
          "Small birds"
        ]
      },
      smoking: "Outdoor smoking areas only",
      cars: {
        allowed: true,
        parking_available: true
      },
      couples: {
        allowed: true
      },
      visiting: [
        "Guests at mealtimes",
        "Flexible visiting hours",
        "On-site parking for guests"
      ],
      lease_term: 12,
      respite_care: true,
      adult_day_care: false,
      hospice: false,
      skilled_nursing: true,
      physical_therapy: "Onsite physical therapy (third party provider)",
      speech_therapy: false,
      private_aides_allowed: true,
      vision_impaired_friendly: true,
      wheelchair_accessible: true,
      security_measures: ["Staff background checks"]
    },
    
    transportation: [
      "Scheduled local transportation",
      "Transportation to medical appointments"
    ],
    
    payment_options: {
      medicaid: true,
      hud: true,
      long_term_care_insurance: false,
      veterans_benefits: true
    },
    
    tour_availability: {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      hours: {
        start: 9,
        end: 18
      }
    },
    
    careers_link: "https://www.talkfurther.com/events-demo"
  };
  
  export default knowledgeBase;