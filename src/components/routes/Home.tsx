import { Grid } from "@chakra-ui/react";
import Item from "../Item";
import ItemSkeleton from "../skeleton/ItemSkeleton";
import { useQuery } from "@tanstack/react-query";
import { getItems } from "../../api";
import { IItemList } from "../types";

export default function Home() {
  const { isLoading, data = [] } = useQuery<IItemList[]>({
    queryKey: ["items"],
    queryFn: getItems,
  });
  return (
    <Grid
      minWidth="0"
      width="100%"
      overflowX="hidden"
      py={20}
      mt={10}
      px={{
        base: 24,
        md: 8,
        lg: 10,
      }}
      columnGap={{ base: 4, md: 8, lg: 32 }}
      rowGap={{ base: 6, md: 10, lg: 40 }}
      templateColumns={{
        base: "1fr",
        sm: "1fr",
        md: "1fr 1fr",
        lg: "repeat(3, 1fr)",
      }}
    >
      {isLoading ? (
        <>
          <ItemSkeleton />
          <ItemSkeleton />
          <ItemSkeleton />
          <ItemSkeleton />
          <ItemSkeleton />
          <ItemSkeleton />
        </>
      ) : null}
      {data?.map((item) => (
        <Item
          key={item.id}
          id={item.id}
          imageUrl={item.photos[0]?.file}
          title={item.title}
          rating={item.rating}
          description={item.description}
          language={item.language}
          is_owner={item.is_owner}
          tips_payload={item.tips_payload}
          tips_highlight={item.tips_highlight}
          rules_payload={item.rules_payload}
          rules_highlight={item.rules_highlight}
          is_wished={item.is_wished}
          // file={item.file}
        />
      ))}
    </Grid>
  );
}
