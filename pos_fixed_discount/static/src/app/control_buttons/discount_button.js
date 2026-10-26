/** @odoo-module */

import { _t } from "@web/core/l10n/translation";
import { DiscountButton } from "@pos_discount/overrides/components/discount_button/discount_button";
import { patch } from "@web/core/utils/patch";
import { NumberPopup } from "@point_of_sale/app/utils/input_popups/number_popup";
import { SelectionPopup } from "@point_of_sale/app/utils/input_popups/selection_popup";
import { ErrorPopup } from "@point_of_sale/app/errors/popups/error_popup";

patch(DiscountButton.prototype, {
    /**
     * Override click to ask for either a Percentage or a Fixed Amount.
     */
    async click() {
        const order = this.pos.get_order();
        if (!order) {
            return;
        }

        const { confirmed: typeConfirmed, payload: discountType } = await this.popup.add(SelectionPopup, {
            title: _t("Discount Type"),
            list: [
                { id: 1, label: _t("Percentage (%)"), item: "percentage", isSelected: true },
                { id: 2, label: _t("Fixed Amount"), item: "amount" },
            ],
        });

        if (!typeConfirmed) {
            return;
        }

        const isPercentage = discountType === "percentage";
        const { confirmed, payload } = await this.popup.add(NumberPopup, {
            title: isPercentage ? _t("Discount Percentage") : _t("Discount Amount"),
            startingValue: isPercentage ? (this.pos.config.discount_pc || 0) : 0,
            isInputSelected: true,
            getPayload: (num) => parseFloat(num) || 0,
        });

        if (confirmed && payload > 0) {
            if (isPercentage) {
                const val = Math.max(0, Math.min(100, payload));
                await this.apply_discount(val);
            } else {
                const total = order.get_total_without_tax();
                if (total <= 0) {
                    await this.popup.add(ErrorPopup, {
                        title: _t("Invalid Order Total"),
                        body: _t("Cannot apply a discount on an order with a zero or negative total."),
                    });
                    return;
                }

                if (payload > total) {
                    await this.popup.add(ErrorPopup, {
                        title: _t("Invalid Discount Amount"),
                        body: _t("The discount amount cannot exceed the order total without tax."),
                    });
                    return;
                }

                // Calculate percentage: (Fixed Amount / Total Order Amount) * 100
                const pc = (payload / total) * 100;
                await this.apply_discount(pc);
            }
        }
    },
});
