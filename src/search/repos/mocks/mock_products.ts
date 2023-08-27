import Product from '../../../types/product';

const MockProducts: Product[] = [
  {
    id: "1",
    name: "name",
    price: 1,
    keywords: ["keywords"],
  },
  {
    id: "2",
    name: "grapes",
    price: 10,
    keywords: ["fruit", "grapes", "snack"]
  },
  {
    id: "3",
    name: "gluten-free crackers",
    price: 5,
    keywords: ["crackers", "gluten-free", "snack"]
  }
];

export default MockProducts;
