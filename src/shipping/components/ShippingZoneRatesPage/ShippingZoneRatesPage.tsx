import { ChannelShippingData } from "@saleor/channels/utils";
import AppHeader from "@saleor/components/AppHeader";
import CardSpacer from "@saleor/components/CardSpacer";
import ChannelsAvailability from "@saleor/components/ChannelsAvailability";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import Container from "@saleor/components/Container";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import PageHeader from "@saleor/components/PageHeader";
import SaveButtonBar from "@saleor/components/SaveButtonBar";
import { ShippingErrorFragment } from "@saleor/fragments/types/ShippingErrorFragment";
import OrderValue from "@saleor/shipping/components/OrderValue";
import OrderWeight from "@saleor/shipping/components/OrderWeight";
import PricingCard from "@saleor/shipping/components/PricingCard";
import ShippingZoneInfo from "@saleor/shipping/components/ShippingZoneInfo";
import { createChannelsChangeHandler } from "@saleor/shipping/handlers";
import { ShippingZone_shippingZone_shippingMethods } from "@saleor/shipping/types/ShippingZone";
import { ShippingMethodTypeEnum } from "@saleor/types/globalTypes";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface FormData {
  name: string;
  noLimits: boolean;
  minValue: string;
  maxValue: string;
  price: string;
  type: ShippingMethodTypeEnum;
}

export interface ShippingZoneRatesPageProps {
  allChannelsCount?: number;
  shippingChannels: ChannelShippingData[];
  defaultCurrency: string;
  disabled: boolean;
  rate?: ShippingZone_shippingZone_shippingMethods;
  errors: ShippingErrorFragment[];
  saveButtonBarState: ConfirmButtonTransitionState;
  onBack: () => void;
  onDelete?: () => void;
  onSubmit: (data: FormData) => void;
  openChannelsModal: () => void;
  onChannelsChange: (data: ChannelShippingData[]) => void;
  variant: ShippingMethodTypeEnum;
}

export const ShippingZoneRatesPage: React.FC<ShippingZoneRatesPageProps> = ({
  allChannelsCount,
  shippingChannels,
  defaultCurrency,
  disabled,
  errors,
  onBack,
  onDelete,
  onSubmit,
  openChannelsModal,
  rate,
  saveButtonBarState,
  onChannelsChange,
  variant
}) => {
  const intl = useIntl();

  const initialForm = {
    maxValue: rate?.maximumOrderWeight?.value.toString() || "",
    minValue: rate?.minimumOrderWeight?.value.toString() || "",
    name: rate?.name || "",
    noLimits: false,
    price: rate?.price?.amount.toString() || "",
    type: rate?.type || null
  };

  return (
    <Form initial={initialForm} onSubmit={onSubmit}>
      {({ change, data, hasChanged, submit, triggerChange }) => {
        const handleChannelsChange = createChannelsChangeHandler(
          shippingChannels,
          onChannelsChange,
          triggerChange
        );

        return (
          <Container>
            <AppHeader onBack={onBack}>
              <FormattedMessage defaultMessage="Shipping" />
            </AppHeader>
            <PageHeader
              title={
                rate?.name ||
                (variant === ShippingMethodTypeEnum.PRICE
                  ? intl.formatMessage({
                      defaultMessage: "Price Rate Create",
                      description: "page title"
                    })
                  : intl.formatMessage({
                      defaultMessage: "Weight Rate Create",
                      description: "page title"
                    }))
              }
            />
            <Grid>
              <div>
                <ShippingZoneInfo
                  data={data}
                  disabled={disabled}
                  errors={errors}
                  onChange={change}
                />
                <CardSpacer />
                {variant === ShippingMethodTypeEnum.PRICE ? (
                  <OrderValue
                    channels={shippingChannels}
                    noLimits={data.noLimits}
                    disabled={disabled}
                    defaultCurrency={defaultCurrency}
                    onChange={change}
                    onChannelsChange={handleChannelsChange}
                  />
                ) : (
                  <OrderWeight
                    noLimits={data.noLimits}
                    disabled={disabled}
                    minValue={data.minValue}
                    maxValue={data.maxValue}
                    onChange={change}
                    errors={errors}
                  />
                )}
                <CardSpacer />
                <PricingCard
                  channels={shippingChannels}
                  onChange={handleChannelsChange}
                  disabled={disabled}
                  defaultCurrency={defaultCurrency}
                />
                <CardSpacer />
              </div>
              <div>
                <ChannelsAvailability
                  allChannelsCount={allChannelsCount}
                  selectedChannelsCount={shippingChannels?.length}
                  shippingChannels={shippingChannels}
                  openModal={openChannelsModal}
                />
              </div>
            </Grid>
            <SaveButtonBar
              disabled={disabled || !hasChanged}
              onCancel={onBack}
              onDelete={onDelete}
              onSave={submit}
              state={saveButtonBarState}
            />
          </Container>
        );
      }}
    </Form>
  );
};

export default ShippingZoneRatesPage;
