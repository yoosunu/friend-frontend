import { Grid, useToast } from "@chakra-ui/react";
import Item from "../Item";
import ItemSkeleton from "../skeleton/ItemSkeleton";
import { useMutation, useQuery } from "@tanstack/react-query";
import { addWish, getItems } from "../../api";
import { IItemList } from "../types";
import { useForm } from "react-hook-form";
import { useState } from "react";

export default function Home() {
  const { isLoading, data } = useQuery<IItemList[]>({
    queryKey: ["items"],
    queryFn: getItems,
  });
  return (
    <Grid
      py={20}
      mt={10}
      px={{
        base: 24,
        lg: 40,
      }}
      columnGap={32}
      rowGap={40}
      templateColumns={{
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
          is_liked={item.is_liked}
          // file={item.file}
        />
      ))}
    </Grid>
  );
}
