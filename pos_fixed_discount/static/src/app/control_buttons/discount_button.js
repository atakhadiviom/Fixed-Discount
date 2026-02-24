/** @odoo-module */

import { DiscountButton } from "@pos_discount/app/control_buttons/discount_button/discount_button";
import { patch } from "@web/core/utils/patch";
import { NumberPopup } from "@point_of_sale/app/utils/input_popups/number_popup";
import { ErrorPopup } from "@point_of_sale/app/errors/error_popup";

patch(DiscountButton.prototype, {
    /**
     * Override onClick to ask for a fixed amount instead of percentage.
     * Calculates the equivalent percentage and applies it via the native method.
     */
    async onClick() {
        const { confirmed, payload } = await this.popup.add(NumberPopup, {
            title: this.env._t("Discount Amount"),
            startingValue: 0,
            getPayload: (num) => parseFloat(num) || 0,
        });

        if (confirmed && payload > 0) {
            const order = this.pos.get_order();
            if (!order) {
                return;
            }

            // Get total without tax as requested
            const total = order.get_total_without_tax();
            
            // Safety check for division by zero
            if (total > 0) {
                // Calculate percentage: (Fixed Amount / Total Order Amount) * 100
                const pc = (payload / total) * 100;
                
                // Call native apply_discount with the calculated percentage
                await this.apply_discount(pc);
            } else {
                // If total is 0 or less, we can't apply a percentage-based fixed discount
                this.popup.add(ErrorPopup, {
                    title: this.env._t("Invalid Order Total"),
                    body: this.env._t("Cannot apply a discount on an order with a zero or negative total."),
                });
            }
        }
    }
});
