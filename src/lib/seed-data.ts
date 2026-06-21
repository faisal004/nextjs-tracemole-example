export interface RestaurantDocument {
  name: string;
  borough: string;
  cuisine: string;
  address: {
    building: string;
    street: string;
    zipcode: string;
  };
  grades?: { date: string; grade: string }[];
}

export const SEED_RESTAURANTS: RestaurantDocument[] = [
  {
    name: "Blue Moon Diner",
    borough: "Queens",
    cuisine: "American",
    address: { building: "42-15", street: "Queens Blvd", zipcode: "11104" },
    grades: [{ date: "2024-03-12", grade: "A" }],
  },
  {
    name: "Half Moon Cafe",
    borough: "Queens",
    cuisine: "Caribbean",
    address: { building: "108-05", street: "Corona Ave", zipcode: "11368" },
    grades: [{ date: "2024-01-08", grade: "B" }],
  },
  {
    name: "Moonlight Noodle House",
    borough: "Queens",
    cuisine: "Chinese",
    address: { building: "136-20", street: "Roosevelt Ave", zipcode: "11354" },
    grades: [{ date: "2024-06-22", grade: "A" }],
  },
  {
    name: "Luna Pizza",
    borough: "Brooklyn",
    cuisine: "Pizza",
    address: { building: "123", street: "Bedford Ave", zipcode: "11211" },
    grades: [{ date: "2024-02-14", grade: "A" }],
  },
  {
    name: "Sakura Ramen",
    borough: "Manhattan",
    cuisine: "Japanese",
    address: { building: "14", street: "St Marks Pl", zipcode: "10003" },
    grades: [{ date: "2024-05-01", grade: "A" }],
  },
  {
    name: "Tacos El Sol",
    borough: "Bronx",
    cuisine: "Mexican",
    address: { building: "890", street: "Grand Concourse", zipcode: "10451" },
    grades: [{ date: "2024-04-18", grade: "B" }],
  },
  {
    name: "Harbor Fish Market",
    borough: "Staten Island",
    cuisine: "Seafood",
    address: { building: "200", street: "Bay St", zipcode: "10301" },
    grades: [{ date: "2024-07-03", grade: "A" }],
  },
  {
    name: "Green Leaf Vegan",
    borough: "Manhattan",
    cuisine: "Vegetarian",
    address: { building: "55", street: "Carmine St", zipcode: "10014" },
    grades: [{ date: "2024-08-11", grade: "A" }],
  },
  {
    name: "Brooklyn Burger Co",
    borough: "Brooklyn",
    cuisine: "American",
    address: { building: "456", street: "Atlantic Ave", zipcode: "11217" },
    grades: [{ date: "2024-03-30", grade: "A" }],
  },
  {
    name: "Spice Route",
    borough: "Queens",
    cuisine: "Indian",
    address: { building: "74-09", street: "37th Ave", zipcode: "11372" },
    grades: [{ date: "2024-09-05", grade: "A" }],
  },
  {
    name: "Morning Moon Bakery",
    borough: "Queens",
    cuisine: "Bakery",
    address: { building: "40-12", street: "Main St", zipcode: "11354" },
    grades: [{ date: "2024-02-28", grade: "A" }],
  },
  {
    name: "Riverside Thai",
    borough: "Manhattan",
    cuisine: "Thai",
    address: { building: "301", street: "Amsterdam Ave", zipcode: "10023" },
    grades: [{ date: "2024-06-09", grade: "B" }],
  },
  {
    name: "Nonna's Kitchen",
    borough: "Brooklyn",
    cuisine: "Italian",
    address: { building: "88", street: "Smith St", zipcode: "11201" },
    grades: [{ date: "2024-01-20", grade: "A" }],
  },
  {
    name: "Bronx Coffee Lab",
    borough: "Bronx",
    cuisine: "Cafe",
    address: { building: "310", street: "E 204th St", zipcode: "10467" },
    grades: [{ date: "2024-10-15", grade: "A" }],
  },
  {
    name: "Island Grill House",
    borough: "Staten Island",
    cuisine: "American",
    address: { building: "150", street: "Richmond Rd", zipcode: "10304" },
    grades: [{ date: "2024-04-02", grade: "B" }],
  },
  {
    name: "Midnight Moon Tacos",
    borough: "Queens",
    cuisine: "Mexican",
    address: { building: "90-15", street: "Roosevelt Ave", zipcode: "11372" },
    grades: [{ date: "2024-11-01", grade: "A" }],
  },
  {
    name: "East Village Falafel",
    borough: "Manhattan",
    cuisine: "Middle Eastern",
    address: { building: "77", street: "St Marks Pl", zipcode: "10003" },
    grades: [{ date: "2024-05-19", grade: "A" }],
  },
  {
    name: "Williamsburg Taproom",
    borough: "Brooklyn",
    cuisine: "Bar",
    address: { building: "220", street: "Kent Ave", zipcode: "11249" },
    grades: [{ date: "2024-07-27", grade: "A" }],
  },
  {
    name: "Queens Dumpling House",
    borough: "Queens",
    cuisine: "Chinese",
    address: { building: "135-02", street: "40th Rd", zipcode: "11354" },
    grades: [{ date: "2024-08-30", grade: "A" }],
  },
  {
    name: "Park Slope Deli",
    borough: "Brooklyn",
    cuisine: "Deli",
    address: { building: "512", street: "7th Ave", zipcode: "11215" },
    grades: [{ date: "2024-12-04", grade: "A" }],
  },
];
