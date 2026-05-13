import calculusImg from "../assets/products/calculus.jpeg";
import organicImg from "../assets/products/organic.jpg";
import fridgeImg from "../assets/products/fridge.jpeg";
import lampImg from "../assets/products/led.jpeg";
import macbookImg from "../assets/products/mac.jpeg";
import calculatorImg from "../assets/products/calculator.jpg";
import jacketImg from "../assets/products/jacket.jpeg";
import yogaImg from "../assets/products/yoga_mats.jpeg";
import skateboardImg from "../assets/products/skateboard.jpeg";
import coffeeImg from "../assets/products/coffee.jpeg";

export const CATEGORIES = [
  { id: "all",        label: "All",         icon: "🏠" },
  { id: "textbooks",  label: "Textbooks",   icon: "📚" },
  { id: "electronics",label: "Electronics", icon: "💻" },
  { id: "furniture",  label: "Furniture",   icon: "🛋️" },
  { id: "clothing",   label: "Clothing",    icon: "👕" },
  { id: "sports",     label: "Sports",      icon: "🏋️" },
  { id: "kitchen",    label: "Kitchen",     icon: "🍴" },
];

export const products = [
  {
    id: 1,
    title: "Calculus Textbook (12th Edition)",
    category: "textbooks",
    available: true,
    condition: "Like New",
    rentPrice: 15,
    buyPrice: 45,
    seller: "Sarah M.",
    rentable: true,
    forSale: true,
    image: calculusImg,
    description:
      "Barely used calculus textbook for MATH 101. No markings. Excellent condition.",
  },
  {
    id: 2,
    title: "Organic Chemistry Notes",
    category: "textbooks",
    available: false,
    condition: "Excellent",
    rentPrice: null,
    buyPrice: 30,
    seller: "Casey D.",
    rentable: false,
    forSale: true,
    image: organicImg,
    description:
      "Handwritten organic chemistry notes with reactions and mechanisms.",
  },
  {
    id: 3,
    title: "Mini Fridge",
    category: "furniture",
    available: true,
    condition: "Excellent",
    rentPrice: 80,
    buyPrice: 25,
    seller: "Alex T.",
    rentable: true,
    forSale: true,
    image: fridgeImg,
    description:
      "Compact mini fridge suitable for dorm rooms and small apartments.",
  },
  {
    id: 4,
    title: "Desk Lamp LED",
    category: "furniture",
    available: true,
    condition: "Excellent",
    rentPrice: null,
    buyPrice: 20,
    seller: "Maya R.",
    rentable: false,
    forSale: true,
    image: lampImg,
    description: "Energy efficient LED desk lamp with adjustable brightness.",
  },
  {
    id: 5,
    title: "MacBook Air M1",
    category: "electronics",
    available: true,
    condition: "Excellent",
    rentPrice: 80,
    buyPrice: 650,
    seller: "Jamie L.",
    rentable: true,
    forSale: true,
    image: macbookImg,
    description:
      "Apple MacBook Air M1 in excellent condition. Perfect for coding and classes.",
  },
  {
    id: 6,
    title: "Graphing Calculator TI-84",
    category: "electronics",
    available: true,
    condition: "Like New",
    rentPrice: 20,
    buyPrice: 75,
    seller: "Riley B.",
    rentable: true,
    forSale: true,
    image: calculatorImg,
    description:
      "TI-84 graphing calculator, ideal for math and engineering students.",
  },
  {
    id: 7,
    title: "North Face Jacket",
    category: "clothing",
    available: true,
    condition: "Like New",
    rentPrice: 20,
    buyPrice: 60,
    seller: "Chris P.",
    rentable: true,
    forSale: true,
    image: jacketImg,
    description: "Warm and durable North Face jacket. Great for winter wear.",
  },
  {
    id: 8,
    title: "Yoga Mat & Blocks",
    category: "sports",
    available: true,
    condition: "Excellent",
    rentPrice: 10,
    buyPrice: 25,
    seller: "Taylor R.",
    rentable: true,
    forSale: true,
    image: yogaImg,
    description:
      "Yoga mat with blocks. Ideal for stretching, yoga, and workouts.",
  },
  {
    id: 9,
    title: "Skateboard - Complete Setup",
    category: "sports",
    available: true,
    condition: "Good",
    rentPrice: 30,
    buyPrice: 90,
    seller: "Avery S.",
    rentable: true,
    forSale: true,
    image: skateboardImg,
    description:
      "Complete skateboard setup suitable for beginners and casual riders.",
  },
  {
    id: 10,
    title: "Coffee Maker - Keurig",
    category: "kitchen",
    available: true,
    condition: "Good",
    rentPrice: 15,
    buyPrice: 40,
    seller: "Jordan W.",
    rentable: true,
    forSale: true,
    image: coffeeImg,
    description:
      "Keurig coffee maker, perfect for dorm rooms and quick coffee.",
  },
];

export const DUMMY_PRODUCTS = products;

export const MY_LISTINGS = [
  {
    id: "my1",
    title: "MacBook Air M1",
    category: "electronics",
    price: 650,
    buyPrice: 650,
    rentPrice: 80,
    image: macbookImg,
    condition: "Excellent",
    rentable: true,
    forSale: true,
    type: "both",
    location: "Campus",
    status: "Active",
  },
  {
    id: "my2",
    title: "Yoga Mat & Blocks",
    category: "sports",
    price: 25,
    buyPrice: 25,
    rentPrice: 10,
    image: yogaImg,
    condition: "Excellent",
    rentable: true,
    forSale: true,
    type: "both",
    location: "Campus",
    status: "Active",
  },
];
