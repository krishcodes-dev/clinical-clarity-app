import React, { useMemo, useState } from "react";
import { View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BookStackParamList } from "@/app/types";
import { Screen } from "@/ui/Screen";
import { AppHeader } from "@/ui/AppHeader";
import { SearchBar } from "@/ui/SearchBar";
import { TestCard } from "@/features/booking/components/TestCard";
import { EmptyState } from "@/ui/EmptyState";
import { mockTests } from "@/features/booking/mocks";

type Props = NativeStackScreenProps<BookStackParamList, "SearchResults">;

/** Search results + shared "No Results" empty state (UX review §7.3). */
export function SearchResultsScreen({ navigation, route }: Props) {
  const [query, setQuery] = useState(route.params.query);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return mockTests.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.shortName.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <Screen scroll={results.length > 0} contentClassName="px-md pb-lg">
      <AppHeader title="Search Results" />
      <View className="mb-md">
        <SearchBar
          placeholder="Search tests, packages, markers…"
          value={query}
          onChangeText={setQuery}
        />
      </View>
      {results.length === 0 ? (
        <EmptyState
          icon="search_off"
          title="No results found"
          body={`We couldn't find anything matching "${query}". Try a marker name (e.g. HbA1c) or browse categories.`}
          primaryLabel="Browse Categories"
          onPrimary={() => navigation.navigate("CategoryExplorer", { kind: "organ" })}
        />
      ) : (
        results.map((t) => (
          <TestCard
            key={t.id}
            test={t}
            onPress={() => navigation.navigate("TestDetails", { testId: t.id })}
          />
        ))
      )}
    </Screen>
  );
}
