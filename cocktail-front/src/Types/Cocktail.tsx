export type Cocktail = {
  id: string;
  name: string;
  image: string;
  ingredients: string[];
  instructions: string;
  category?: string;
  alcoholic?: string;
  glass?: string;
};
