import { Button } from "@workspace/ui/components/button";

const AddToCart = ({ id }: { id: number }) => {
    console.log("id", id);
  return (
    <div>
      <Button onClick={() => console.log("add to cart with id", id)}>
        Add to cart
      </Button>
    </div>
  );
};

export default AddToCart;
