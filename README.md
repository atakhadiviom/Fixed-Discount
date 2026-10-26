# POS Fixed Discount

This Odoo module enhances the default behavior of the `pos_discount` module in the Point of Sale. The global "Discount" button prompts the cashier to choose between a **Percentage (%)** discount and a **Fixed Amount** discount.

## Features

- **Flexible Discount Options**: The global "Discount" button prompts the cashier to choose between **Percentage (%)** and **Fixed Amount**.
- **Fixed Amount Conversion**: When a fixed amount is entered, the module automatically calculates the equivalent percentage based on the order total without tax: `(Fixed Amount / Total Order Amount) * 100`.
- **Native Compatibility**: The final discount is applied via Odoo's native `apply_discount` function, ensuring receipt lines, tax groups, and accounting reports behave consistently.
- **Safety Checks**: Validates order total against zero or negative values, prevents fixed discounts exceeding the order total without tax, and clamps percentage discounts between 0% and 100%.

## Installation

1. Clone this repository into your Odoo custom addons directory.
2. Update the Odoo Apps list.
3. Install the `pos_fixed_discount` module.
4. Ensure the `pos_discount` module (standard Odoo) is also installed and configured in your POS settings.

## Technical Details

- **Module Name**: `pos_fixed_discount`
- **Dependencies**: `point_of_sale`, `pos_discount`
- **Frontend Framework**: Owl
- **Patching Strategy**: Uses the `patch` utility to override the `click` method of `DiscountButton` (`@pos_discount/overrides/components/discount_button/discount_button`).

## How it works

When the cashier clicks the "Discount" button:
1. An active order check ensures a valid order is in progress.
2. A selection popup prompts the cashier to choose **Percentage (%)** or **Fixed Amount**.
3. A number popup prompts for the discount value (defaults to configured `discount_pc` for percentage).
4. If **Percentage**: value is clamped between 0% and 100% and applied directly.
5. If **Fixed Amount**: validates order total without tax > 0 and amount <= total, computes `pc = (amount / total_without_tax) * 100`, and applies it via `apply_discount`.
