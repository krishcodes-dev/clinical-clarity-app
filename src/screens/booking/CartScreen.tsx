import React from "react";
import { Pressable, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BookStackParamList } from "@/app/types";
import { Screen } from "@/ui/Screen";
import { AppHeader } from "@/ui/AppHeader";
import { Icon } from "@/ui/Icon";
import { EmptyState } from "@/ui/EmptyState";
import { FastingBadge } from "@/ui/Badges";
import { PrimaryButton } from "@/ui/PrimaryButton";
import { useBookingStore } from "@/store/useBookingStore";
import { mockTests } from "@/features/booking/mocks";
import { formatINR } from "@/utils/currency";
import { colors } from "@/theme";

type Props = NativeStackScreenProps<BookStackParamList, "Cart">;

/** Cart with Active & Empty states folded in. */
export function CartScreen({ navigation }: Props) {
  const cart = useBookingStore((s) => s.cart);
  const removeFromCart = useBookingStore((s) => s.removeFromCart);
  const updateBookingDraft = useBookingStore((s) => s.updateBookingDraft);
  const total = cart.reduce((a, c) => a + c.price, 0);

  return (
    <Screen scroll={cart.length > 0} contentClassName="px-md pb-lg">
      <AppHeader title="Your Cart" />
      {cart.length === 0 ? (
        <EmptyState
          icon="shopping_cart"
          title="Your cart is empty"
          body="Add diagnostic tests or health packages to book them together in one visit."
          primaryLabel="Browse Tests"
          onPrimary={() => navigation.navigate("BookLanding")}
        />
      ) : (
        <>
          {cart.map((item) => (
            <View
              key={item.id}
              className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-md mb-sm"
            >
              <View className="flex-row items-start justify-between">
                <View className="flex-1 pr-sm">
                  <Text className="font-inter-semibold text-body-lg text-on-surface">
                    {item.name}
                  </Text>
                  {item.fastingHours ? (
                    <View className="mt-xs">
                      <FastingBadge hours={item.fastingHours} />
                    </View>
                  ) : null}
                </View>
                <Text className="font-inter-bold text-body-lg text-primary">{formatINR(item.price)}</Text>
              </View>
              <Pressable
                onPress={() => removeFromCart(item.id)}
                accessibilityRole="button"
                accessibilityLabel={`Remove ${item.name} from cart`}
                className="flex-row items-center gap-1 mt-sm min-h-[40px]"
              >
                <Icon name="delete" size={16} color={colors.error} />
                <Text className="font-inter-medium text-[12px] text-error">Remove</Text>
              </Pressable>
            </View>
          ))}

          {cart.some((c) => c.fastingHours) && (
            <View className="flex-row items-start gap-xs bg-surface-container-low rounded-xl p-sm mb-md">
              <Icon name="info" size={16} color={colors.onSurfaceVariant} />
              <Text className="flex-1 font-inter text-[12px] text-on-surface-variant">
                This booking contains tests requiring different appointment
                types. These may be scheduled separately.
              </Text>
            </View>
          )}

          <View className="flex-row items-center justify-between mb-md">
            <Text className="font-inter-semibold text-body-lg text-on-surface">Subtotal</Text>
            <Text className="font-inter-bold text-price-display text-primary">
              {formatINR(total)}
            </Text>
          </View>
          <PrimaryButton
            label="Proceed to Schedule"
            icon="event_available"
            onPress={() => {
              const first = mockTests.find((t) => t.id === cart[0].refId) ?? mockTests[0];
              updateBookingDraft({ test: first });
              navigation.navigate("CollectionMethod");
            }}
          />
        </>
      )}
    </Screen>
  );
}
