import Link from "next/link";
import { Button } from "../ui/button";
import { dummyCategories } from "./dummy";

export const ProductCategories = () => {
  return (
    <div className="flex items-center gap-2">
      {dummyCategories.map((category) => (
        <Link href={`/categories/${category.slug}`} key={category.id}>
          <Button variant={"outline"} className="rounded-full">
            <span className="text-sm">{category.name}</span>
          </Button>
        </Link>
      ))}
    </div>
  );
};
