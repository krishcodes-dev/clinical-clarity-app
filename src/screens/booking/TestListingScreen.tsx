import React from "react";
import { Text } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BookStackParamList } from "@/app/types";
import { Screen } from "@/ui/Screen";
import { AppHeader } from "@/ui/AppHeader";
import { TestCard } from "@/features/booking/components/TestCard";
import { EmptyState } from "@/ui/EmptyState";
import { mockCategories, mockTests } from "@/features/booking/mocks";

type Props = NativeStackScreenProps<BookStackParamList, "TestListing">;

/** Test listing within a category (prototype: "Test Listing - Heart Health"). */
export function TestListingScreen({ navigation, route }: Props) {
  const category = mockCategories.find((c) => c.id === route.params.categoryId);
  const tests = mockTests.filter((t) => t.categoryIds.includes(route.params.categoryId));

  return (
    <Screen scroll={tests.length > 0} contentClassName="px-md pb-lg">
      <AppHeader title={category?.name ?? "Tests"} />
      {tests.length === 0 ? (
        <EmptyState
          icon="science"
          title="No tests listed yet"
          body="This category is being stocked. Try a related category or search by marker name."
          primaryLabel="Back to Categories"
          onPrimary={() => navigation.goBack()}
        />
      ) : (
        <>
          <Text className="font-inter text-body-sm text-on-surface-variant mb-md">
            {tests.length} test{tests.length > 1 ? "s" : ""} available
          </Text>
          {tests.map((t) => (
            <TestCard
              key={t.id}
              test={t}
              onPress={() => navigation.navigate("TestDetails", { testId: t.id })}
            />
          ))}
        </>
      )}
    </Screen>
  );
}
