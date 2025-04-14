import { BrandType, CategoryType, ProductType } from "@/lib/types"
import {
  z,
  ZodSchema,
  ZodObject,
  ZodTypeAny,
  ZodArray,
  ZodString,
  ZodNumber,
  ZodBoolean,
  ZodOptional,
  ZodEnum,
} from "zod";
import { addImageType, addProductType } from "./schema";
export const generateDefaultValues = (schema: ZodSchema) => {
  if (!(schema instanceof ZodObject)) {
    throw new Error("Schema must be a ZodObject");
  }

  const shape = schema.shape;
  const defaultValues: Record<string, any> = {};

  Object.keys(shape).forEach((key) => {
    const fieldSchema = shape[key] as ZodTypeAny;
    if (fieldSchema instanceof ZodString) {
      defaultValues[key] = "";
    } else if (fieldSchema instanceof ZodNumber) {
      defaultValues[key] = 0;
    } else if (fieldSchema instanceof ZodBoolean) {
      defaultValues[key] = false;
    } else if (fieldSchema instanceof ZodOptional) {
      defaultValues[key] = undefined;
    } else if (fieldSchema instanceof ZodArray) {
      // Initialize arrays as empty arrays
      defaultValues[key] = [];
    } else if (fieldSchema instanceof ZodObject) {
      // Recursively handle nested objects
      defaultValues[key] = generateDefaultValues(fieldSchema);
    } else if (fieldSchema instanceof ZodEnum) {
      // Get the first value of the enum
      defaultValues[key] = fieldSchema.options[0];
    } else {
      defaultValues[key] = undefined;
    }
  });
  // console.log("default",defaultValues)
  return defaultValues;
};

export const parseProduct = (product: ProductType): addProductType => {
  const { createdAt, updatedAt, ...parsedProduct } = product;
  const images =
    parsedProduct.images.length > 0
      ? parsedProduct.images.map((image) => ({
          url: image.url as string,
          id: image.id as number,
        })) as addImageType
      : ([{ id: 0, url: "default-image-url.jpg" }] as addImageType);
  const result: addProductType = {
    ...parsedProduct,
    images: images,
  };
  return result;
};

export const parseProductsForTable=(products:ProductType[], brands:BrandType, categories:CategoryType)=>{
  return products.map((product) => ({
    id: product.id,
    name: product.name,
    price: product.price,
    status: product.status,
    stock: product.stock,
    imageUrl: product.images[0]?.url as string,
    fullProduct: product,
    brands: brands,
    categories: categories,
  }));
}
// const parsedProduct: {
//   images: string[];
//   name: string;
//   slug: string;
//   description: string;
//   status: "active" | "draft" | "out_of_stock";
//   discount: number;
//   amount: string;
//   potency: string;
//   stock: number;
//   price: number;
//   dailyIntake: number;
//   categoryId: number | null;
//   brandId: number | null;
// };
// type addProductType = {
//     name: string;
//     description: string;
//     dailyIntake: number;
//     brandId: number;
//     categoryId: number;
//     amount: string;
//     potency: string;
//     status: "active" | "draft" | "out_of_stock";
//     stock: number;
//     price: number;
//     images: [...];
// }
